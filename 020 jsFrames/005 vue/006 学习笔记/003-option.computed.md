# 计算属性如何知道哪个属性对应哪个状态

## 1. 问题的详细描述
当我在使用Vue的计算属性的时候，我一直很好奇计算属性本身是如何知道它依赖那些响应式属性的？例如当```vm.a```发生变化的时候，```computedValA```会触发值更新而```computedValB```不会。其实这是依赖于Vue的动态依赖收集机制。
```js
var vm = new Vue({
  data: { 
      a: 1,
      b: 2,
      c: 3,
      d: 4
    },
  computed: {
      computedValA: function() {
          return this.a + this.b;
      },
      computedValB: function() {
          return this.c + this.d;
      }
  }
})
```
## 2. 动态依赖收集概要
首先Vue的计算属性会依赖一个或多个响应式属性，这些响应式属性可以是Vue实例的data或者props。

当计算属性首次被计算的时候，计算属性对应的```function```将被执行，执行这个方法的过程中计算属性所依赖的响应式属性将被求值（也就是调用响应式属性的getter）。例如上面那个例子，在计算```computedValA```时，```data.a```和```data.b```的getter会被调用。

getter方法调用的过程中Vue会记录下“```this.a```的变化会触发```computedValA```变化”这件事，类似地“```this.b```的变化会触发```computedValA```变化”这个依赖关系也会记录在下来。具体记录的位置在下面来讨论。同时Vue也会记录“```computedValA```依赖```data.a```和```data.b```”这件事，因为当```computedValA```发生变化的时候，Vue需要删除原来的依赖关系，建立新的依赖关系。在依赖建立以后，计算属性就知道自己需要跟踪那些响应式属性。

这一系列的绑定关系是在计算属性被计算的时候建立的，所以这个过程叫做动态依赖收集。

## 3. 源码解毒
想要了解动态依赖收集的详细过程，我们需要了解一下几个Vue核心的概念。
- 响应式属性的构建
- dep对象
- watcher对象

### 3.1 响应式属性的构建

一、响应式属性的初始化在state.js中。通过initData()方法把data转换为响应式。
```js
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  // 重点在这里，通过initData()方法把data转换为响应式
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch) initWatch(vm, opts.watch)
}
```

二、进入```initData```方法，核心代码在最后一行，通过observe这个helper方法把data转换为响应式。我们继续进入observe
```js
function initData (vm: Component) {
  let data = vm.$options.data
  // 如果data是方法类型，则执行该方法
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  if (!isPlainObject(data)) {
    data = {}
  }
  // 将data代理到_data
  const keys = Object.keys(data)
  const props = vm.$options.props
  let i = keys.length
  while (i--) {
    if (props && hasOwn(props, keys[i])) {
      
    } else if (!isReserved(keys[i])) {
      proxy(vm, `_data`, keys[i])
    }
  }
  // 这里是重点，通过observe这个helper方法把data转换为响应式
  observe(data, true /* asRootData */)
}
```

三、进入```observe```方法。

这个方法会检查value对象上有没有```__ob__```属性，如果有这个属性则表示当前的value已经是响应式属性，直接返回```__ob__```。如果没有则通过```new Observer(value)```创建ob对象。Vue的响应式的具体实现都在```Observer```中。

这个```Observer```从名字看应该是一个订阅发布模式，让我们继续进入```Observer```。
```js
export function observe (value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value)) {
    return
  }
  let ob: Observer | void
  // 如果__ob__已经存在，则直接返回。
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  }
  // 如果没有则创建一个Observe
  else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
```

四、Observer

Observer为每一个响应式属性添加一个Dep对象，Dep的主要功能是记录有哪些watcher订阅了当前value的变化事件。有关Dep和watcher会在后面的篇幅中介绍。然后Observe根据value的类型，递归式的value转化为响应式属性。

如果如果value是数组，则调用observeArray将每一个item转化为响应式属性。如果value是一个对象，则将对象的每一个key转换为响应式属性。

可以看到在walk方法里，walk调用defineReactive把每一个key转换为响应式属性。下面我们将进入defineReactive方法。
```js
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that has this object as root $data

  // 这里的value是一个需要改造成响应式的值
  constructor (value: any) {
    this.value = value
    // Dep的主要功能是记录有哪些watcher订阅了当前value的变化事件
    this.dep = new Dep()
    this.vmCount = 0
    // 为响应式属性添加__ob__
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      const augment = hasProto
        ? protoAugment
        : copyAugment
      augment(value, arrayMethods, arrayKeys)
      // 如果value是数组，则调用observeArray将每一个item转化为响应式属性
      this.observeArray(value)
    } else {
      // 如果value是一个对象，则将对象的每一个key转换为响应式属性  
      this.walk(value)
    }
  }
  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      // 重点在这里，defineReactive负责把普通的属性转化
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}
```

五、defineReactive方法

这个方法是Vue响应式属性的核心，也是比较难理解的地方。首先我们看到方法的第一行```const dep = new Dep()```，这个Dep的主要功能是记录有哪些watcher订阅了当前value的变化事件。

接下来通过```Object.getOwnPropertyDescriptor```方法获取key的getter和setter，用于后面对属性进行拦截。

可以看到这个方法又对子属性递归调用了observe方法，这说明vue通过递归的方式把vm.data的每一个属性转换成了响应式属性。

最后通过```Object.defineProperty```方法对key的getter和setter进行了拦截。

先看getter，get方法会调用```dep.depend()```把当前dep对象添加到当前watcher中（dep和watcher在以后的篇幅中讨论）。这里先讲一下这个方法的作用，```dep.depend()```会将当前的watch添加到dep对象中。如果该响应式属性发生值更行，dep将通知所有的watcher进行一次更新。

我们再看setter，会代理属性值得更新。在更行完成之后setter会在新的值上重新调用observe方法建立依赖关系。最后dep调用```notify()```方法通知所有的watcher进行一次值更新。

```js
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: Function
) {
  // 这个Dep的主要功能是记录有哪些watcher订阅了当前value的变化事件。
  const dep = new Dep()
  // 通过```Object.getOwnPropertyDescriptor```方法获取key的getter和setter，用于后面对属性进行拦截。
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  // 可以看到这个方法又对子属性递归调用了observe方法，这说明vue通过递归的方式把vm.data的每一个属性转换成了响应式属性。
  let childOb = observe(val)
  // 通过```Object.defineProperty```方法对key的getter和setter进行了拦截。
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    // get方法会调用```dep.depend()```把当前dep对象添加到当前watcher中（dep和watcher在以后的篇幅中讨论）。这里先讲一下这个方法的作用，```dep.depend()```会将当前的watch添加到dep对象中。如果该响应式属性发生值更行，dep将通知所有的watcher进行一次更新。
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
        }
        if (Array.isArray(value)) {
          dependArray(value)
        }
      }
      return value
    },
    // 会代理属性值得更新。在更行完成之后setter会在新的值上重新调用observe方法建立依赖关系。最后dep调用```notify()```方法通知所有的watcher进行一次值更新。
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = observe(newVal)
      dep.notify()
    }
  })
}
```

六、至此Vue完成了响应式属性的转换。