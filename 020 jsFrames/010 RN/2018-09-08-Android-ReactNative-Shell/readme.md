## 构建一个用户调试RN页面的Android壳app

### 第一步：使用Android Studio构建一个空的app
怎么`Empty Activty`

---

### 第二步：构建Application（非必须）
自定义`Application`可以用来保存全局数据

在`AndroidManifest.xml`中配置`Application`

---

### 第三步：配置React Native Android binaries
这些文件可以在React Native的npm包中找到。我们可以把它复制到app项目更目录中（可能有其它更好的方式来引用这个lib）。

在项目的`build.gradle`中配置这个依赖
```js
// Top-level build file where you can add configuration options common to all sub-projects/modules.

buildscript {
    
    repositories {
        google()
        jcenter()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:3.1.4'
    }
}

allprojects {
    repositories {
        google()
        jcenter()
        // 配置lib的路径，可以使用网络上的maven库
        maven {
            url "$rootDir/android"
        }
    }
}
```

在module的`build.gradle`中配置这个依赖

```js
dependencies {
    // 配置依赖
    implementation 'com.facebook.react:react-native:+'
}
```

---

### 第四步：禁用一些32位库

#### 配置项目的gradle.properties
```js
// 添加这一行
Android.useDeprecatedNdk=true
```

#### 模块的build.gradle
```js
ndk {
    abiFilters "armeabi-v7a", "x86"
}
packagingOptions {
    exclude "lib-main/libgnustl_shared.so"
}
```

---

### 第五步：打开网络访问权限
```xml
<uses-permission android:name="android.permission.INTERNET"/>
```

--- 

### 第六步：http通信权限（模拟器调试）
```xml
android:usesCleartextTraffic="true"
```

### 第七步：注册dev menu设置页面
```xml
<activity
    android:name="com.facebook.react.devsupport.DevSettingsActivity"
    >
</activity>
```