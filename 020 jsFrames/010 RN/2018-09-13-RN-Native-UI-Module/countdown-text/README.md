
# react-native-countdown-text

## Getting started

`$ npm install react-native-countdown-text --save`

### Mostly automatic installation

`$ react-native link react-native-countdown-text`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-countdown-text` and add `RNCountdownText.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNCountdownText.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNCountdownTextPackage;` to the imports at the top of the file
  - Add `new RNCountdownTextPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-countdown-text'
  	project(':react-native-countdown-text').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-countdown-text/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-countdown-text')
  	```

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNCountdownText.sln` in `node_modules/react-native-countdown-text/windows/RNCountdownText.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Countdown.Text.RNCountdownText;` to the usings at the top of the file
  - Add `new RNCountdownTextPackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import RNCountdownText from 'react-native-countdown-text';

// TODO: What to do with the module?
RNCountdownText;
```

### 第一步：使用测定版本的RN SDK
- 从react-native的npm包中复制SDK到项目根路径下
- 添加Android开发依赖
	- com.android.tools.build:gradle:3.1.4
	- url "$rootDir/sdk"
	- implementation 'com.facebook.react:react-native:0.52.0'

### 第二步：添加Java Class
- View
- Manager
- Packager

### 第三步：js文件

### 第四步：使用这个模块
按照readme在app中添加依赖，注册模块
