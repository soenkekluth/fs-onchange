const path = require('path');
const watcher = require('../');

const onChange = (obj) => {
  console.log('onChange ', obj.src);
}

const onChangeFolder = (obj) => {
  console.log('onChangeFolder ', obj.src);
}


const onChangeFile = (obj) => {
  console.log('onChangeFile ', obj.src);
}


const onChangeJS = (obj) => {
  console.log('onChangeJS ', obj.src);
}


watcher.add(path.resolve(__dirname , 'sass'), {}, onChangeFolder);
watcher.add(path.resolve(__dirname , 'sass') + '/**/*.scss', {}, onChange);
watcher.add(path.resolve(__dirname , 'sass/app/_app.scss'), {}, onChangeFile);
watcher.add(path.resolve(__dirname , 'js') + '/**/*.js', {}, onChangeJS);
watcher.watch();

