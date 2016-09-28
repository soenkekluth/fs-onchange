// var EventEmitter = require('events').EventEmitter;
const chokidar = require('chokidar');
const assign = require('object-assign');
// const fs = require('fs');
const path = require('path');


const defaults = {
  ignored: [
    /node_modules/,
    /[\/\\]\./
  ],
  useFsEvents: true,
  persistent: true
};

// extends EventEmitter {

const callbackMap = {};


class Watcher {

  constructor() {
    // super();

    this.state = {
      src: [],
      config: defaults,
      watching: false
    };
  }

  add(src, config, cb) {
    const ext = path.extname(src);
    let dirname = src.split('*')[0];

    if (dirname) {
      dirname = path.resolve(dirname);
    }

    if (typeof cb === 'function') {

      if (!callbackMap[ext]) {
        callbackMap[ext] = [];
      }

      callbackMap[ext].push(cb);
    }

    this.state.src.push(src);
    this.state.config = assign({}, this.state.config, config);
  }


  remove() {}

  watch() {
    this.start();
  }

  start() {
    if (!this.watcher) {
      this.watcher = chokidar.watch(this.state.src, this.state.config);
      this.watcher.on('change', this.onChange.bind(this));
    } else if (!this.state.watching) {

    }
    this.state.watching = true;
  }


  stop() {
    if (this.watcher) {
      this.watcher.close();
      this.state.watching = false;
    }
  }


  onChange(filePath, stats) {
    const ext = path.extname(filePath);
    const callbacks = callbackMap[ext];
    if (callbacks && callbacks.length) {
      let i = -1;
      while (++i < callbacks.length) {
        callbacks[i]({ ext: ext, path: filePath });
      }
    }
  }
}


module.exports = new Watcher();
