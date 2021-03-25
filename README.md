## 项目开始

yarn start

## electron 的开发环境

npm install electron-is-dev --save-dev

## concurrently 将两个项目合并到一个指令上执行

npm install concurrently --save-dev

```
"dev": "concurrently \"electron .\" \"npm start\""
```

## wait-on 监听某个项目或某个指令执行完再执行下一个项目

npm install wait-on --save-dev

```
"dev": "concurrently \"wait-on http://localhost:3000 && electron .\" \"npm start\""
```

## cross-env 控制 react 环境变量 使每次启动 react 时候不重新打开浏览器窗口

npm install cross-env --save-dev

```
cross-env BROWSER=none
```

## fontawesome svg 图标库

npm i --save @fortawesome/fontawesome-svg-core
npm i --save @fortawesome/free-solid-svg-icons
npm i --save @fortawesome/react-fontawesome
yarn add @fortawesome/free-brands-svg-icons

## classnames

yarn add classnames

## node-sass 添加 css 预处理

yarn add node-sass

## easyMDE 提交 markdown 编辑器

yarn add react-simplemde-editor

## uuid 将 ID 变为唯一识别码

yarn add uuid

## react 页面调用 node 模块时候为什么要加 window

因为 react 项目是通过 webpack 打包的，webpack 对 import 和 require 文件引入做了特殊处理，所以当使用 require 时候本质被打包成了特殊的 module 模块，该模块没用包含 node 的核心模块，所以需要使用 window 来通过全局环境来引入 node 模块

## electron-store

yarn add electron-store
使用 electron-store 来持久化数据

## qiniu

npm install qiniu
远程存储的 SDK

## electron-builder
~ https://github.com/electron-userland/electron-builder
~ https://electron.org.cn/builder/index.html
<!-- ~ https://segmentfault.com/a/1190000016695922?utm_source=tag-newest -->
使用 electron-builder 来打包
在 scripts 添加 打包脚本

```
"pack": "electron-builder --dir",
"dist": "electron-builder"
```

通过在 package.json 文件 内添加 build 配置

```
"appId": "sdcard",
"productName": "对比图下载",
"files": [
  "build/**/*",
  "node_modules/**/*",
  "package.json",
  "main/**/*",
  "utils/**/*",
  "main.js"
],
"extraResources": {
  "from": "./static/",
  "to": "static"
},
"extends": null
```

## 打包出错问题
如果有打包出错可能是 electron 安装有问题，或者electron-builder安装有问题，
如果是 electron-builder 则根据官网建议使用 yarn add electron-builder --dev 来安装
如果是electron 可以将 node_modules 重新其他的依赖重新安装，然后再最后安装electron 依赖
或者参考这个issue: https://github.com/electron/electron/issues/8466#issuecomment-571425574