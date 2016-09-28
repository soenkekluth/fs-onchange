const path = require('path');
const watcher = require('../');

const onChange = (obj) => {
  console.log('onChange ', obj.ext);
}


watcher.add(path.resolve(__dirname , 'sass') + '/**/*.scss', {}, onChange);
watcher.add(path.resolve(__dirname , 'js') + '/**/*.js', {}, onChange);
watcher.watch();

