# fs-onchange

## Install

### local
```bash
npm i --save fs-onchange
```
### global
```bash
npm i -g fs-onchange
```

## Command Line
```bash
onchange file.ext npm run build

onchange 'path/**/*.js, path/**/*.scss' execute something

onchange '[file1, file2, file3]' execute something

```


## Node
```javascript

const watcher = require('fs-onchange');
const path = require('path');

const onChangeSass = (obj) => {
  console.log('onChangeSass ', obj);
}


const onChangeAppSccs = (obj) => {
  console.log('onChangeAppSccs ', obj);
}


const onChangeJS = (obj) => {
  console.log('onChangeJS ', obj);
}


const onChangeHTML = (obj) => {
  console.log('onChangeHTML ', obj);
}


const appScssWatcher = watcher.add(path.resolve(__dirname, 'sass/app/_app.scss'), {}, onChangeAppSccs);

watcher.add(path.resolve(__dirname, 'sass') + '/**/*.scss', { ignored: appScssWatcher.src }, onChangeSass);
watcher.add(path.resolve(__dirname, 'js') + '/**/*.js', {}, onChangeJS);
watcher.watch();


watcher.add([
  path.resolve(__dirname, 'html') + '/**/*.html',
  path.resolve(__dirname, 'html5') + '/**/*.html'
], {}, onChangeHTML);

```
