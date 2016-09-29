const path = require('path');
const watcher = require('../');

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


const appWatcher = watcher.add(path.resolve(__dirname, 'sass/app/_app.scss'), {}, onChangeAppSccs);
watcher.add(path.resolve(__dirname, 'sass') + '/**/*.scss', { ignored: appWatcher.src }, onChangeSass);
watcher.add(path.resolve(__dirname, 'js') + '/**/*.js', {}, onChangeJS);
watcher.watch();



watcher.add(path.resolve(__dirname, 'html') + '/**/*.html', {}, onChangeHTML);
