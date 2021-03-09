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

## cross-env 控制react环境变量 使每次启动react时候不重新打开浏览器窗口
npm install cross-env --save-dev
```
cross-env BROWSER=none
```

## fontawesome svg图标库
npm i --save @fortawesome/fontawesome-svg-core
npm i --save @fortawesome/free-solid-svg-icons
npm i --save @fortawesome/react-fontawesome
yarn add @fortawesome/free-brands-svg-icons 

## classnames
yarn add classnames

## node-sass 添加 css 预处理
yarn add node-sass
