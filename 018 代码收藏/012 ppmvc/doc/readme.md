# PPMVC 说明文档

## 1. 外部依赖
```ppmvc``` 依赖于```Jquery```和```underscore```。在加载```ppmvc```前，请确保外部依赖已经加载完成。

## 2. Demo
Demo在examples文件夹下

## 3. 各模块说明
- Events 事件注册于分发
- Model 业务数据模型
- View 视图
- ActionTypes Model的字典
- Store 全局业务数据模型容器

### 3.1 Events

Events模块用于事件的注册和分发，既可以是全局性的事件也可以是某个组件独享的事件。

**on** 

```function (name, callback, [context])```

事件注册，```context```为事件触发时的上下文环境

 ```js
target.on('eventName', function() {}, this);
```

**off** 

```function ([name], [callback], [context])```

取消事件注册，如果```name```为```null```则取消所有事件，如果```callback```为```null```则取消所有改类型的事件，如果```context```为```null```则取消所有改```callback```的事件。

**trigger**

```function (name)```

触发事件，改方法最多可以传3个参数

```js
target.trigger("eventType", arg1, arg2, arg3);
```

### 3.2 Model
Model是管理业务数据的容器，可以在Model实例中提供模型数据转换，过滤，类型判断等功能。```Model```集成了```Events```模块，所以```Model```可以注册事件。

业务代码通过继承```Model```来事件具体的业务模型。
```js
var model = ppmvc.Model.extend({
    // 默认数据
    defaults: function () {
        return {
            userId: null,
            userName: "nobody"
        };
    },
    // 在模型初始化的过程中调用，调用的时机在Model数据填充前
    preinitialize: function() {
        console.log('model preinitialize is called', this);
    },
    // 在模型初始化的过程中调用，调用的时机在Model数据填充后
    initialize: function() {
        console.log('model initialize is called', this);
    },
    // 自定义Getter
    getUserId: function() {
        var userId = this.getAttr('userId');
        console.log('model getUserId is called', userId);
        return userid;
    },
    // 自定义Setter
    setUserName: function(name) {
        console.log('model setUserName is called');
        this.setAttr('userName', name);
    }
});
```

### 3.3 View
```View``` 是视图管理器，主要用于完成Dom的渲染、以及Dom事件绑定。

```View``` 在初始化的过程中会完成以下一个步骤。
- 执行```preinitialize```回调
- 构建容器更节点，您可以通过```tagName```设置根节点的Dom类型。
- 绑定事件，事件全部通过事件代理的机制绑定在更节点上
- 执行```initialize```回调

***View不会自动调用render方法，您需要手动调用render已完成模板的渲染***

### 3.3.1 View中的接口

**tagName** 

```String ``` 

根节点类型

**className** 

```String ```

根节点class属性

**id** 

```String ```

根节点id属性

**preinitialize**

```function() ```

在View初始化的过程中调用，调用的时机在构造根节点和时间绑定之前

**initialize**

```function() ```

在View初始化的过程中调用，调用的时机在构造根节点和时间绑定之后

**render**

```function() ```

用于模板渲染，请根据项目需求覆盖这个方法。

**afterRender**

```function(rootEl) ```

模板渲染完成后执行这个方法。

**remove**

```function() ```

删除模板（包括根节点），并且删除绑定的事件。

**clean**

```function() ```

删除根节点下的所有子节点，但是不删除事件。

**events**

```Object ```

用于事件绑定，格式为```{"events selector": "callback"} ```

### 3.3.2 View的继承实例
```js
var view = ppmvc.View.extend({
    id: 'id',
    tagName: 'div',
    className: 'input-module',
    template: tpl,
    preinitialize: function() {
        console.log('View preinitialize is called', this);
    },
    initialize: function() {
        console.log('View initialize is called', this);
    },
    events: {
        'click .setNameBtn': 'setName'
    },
    setName: function(event) {
        event.preventDefault();
        console.log('click setName is called', event);
        var newValue =  this.$el.find('#setName')[0].value;
        this.model.setUserName(newValue);
        this.$el.find('.value').html(newValue);
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});
```

## 3.4 ActionTypes

```ActionTypes``` 用于管理```type```和```Model```的映射关系。例如通过输入一个```type```返回特定的```Model```。```ActionTypes```已全局对象的形式挂载在```ppmvc```对象上。

**set**

```function(types) ```

清空当前所有的Model映射关系，并通过types批量加载Model映射关系。

```js
var userInfoModel = {
        name: 'userInfoModel',
        model: userInfoM
    }

ppmvc.ActionTypes.set(ActionTypes);
```

**add**

```function(name, model) ```

增加type和Model的映射关系

**get**

```function(name) ```

获取name所映射的Model

## 3.4 Store

全局业务数据模型容器，用于构建以及获取全局Model。该对象以全局对象的形式改在到```ppmvc```对象上。

**load**

```function(type, cb, options) ```

静动态创建model对象 并放入models模型里

**getModel**

```function(name) ```

获取具体模型对象