# fs-onchange
Use glob patterns to watch files and folders to run a command when anything is added, changed or deleted. Edit

## Install

### local

```bash
npm i --save fs-onchange
yarn add fs-onchange
```

### global

```bash
npm i -g fs-onchange
yarn --global add fs-onchange
```

## Usage


fs-onchange installs 3 binaries:
```bash
fs-onchange
onchange
```

### Command Line
```bash
onchange file.ext npm run build
onchange 'path/**/*.js, path/**/*.scss' execute something
onchange '[file1, file2, file3]' execute something
```

### Node

```javascript

const watcher = require('fs-onchange');
const path = require('path');

const onChangeSass = (obj) => {
  console.log('onChangeSass ', obj);
};

const onChangeAppSccs = (obj) => {
  console.log('onChangeAppSccs ', obj);
};

const onChangeJS = (obj) => {
  console.log('onChangeJS ', obj);
};

const onChangeHTML = (obj) => {
  console.log('onChangeHTML ', obj);
};

const appScssWatcher = watcher.add(path.resolve(__dirname, 'sass/app/_app.scss'), {}, onChangeAppSccs);

watcher.add(`${path.resolve(__dirname, 'sass')}/**/*.scss`, { ignored: appScssWatcher.src }, onChangeSass);
watcher.add(`${path.resolve(__dirname, 'js')}/**/*.js`, {}, onChangeJS);
watcher.watch();

watcher.add([
  `${path.resolve(__dirname, 'html')}/**/*.html`,
  `${path.resolve(__dirname, 'html5')}/**/*.html`,
], {}, onChangeHTML);

```
