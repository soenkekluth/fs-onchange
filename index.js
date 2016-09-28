// var EventEmitter = require('events').EventEmitter;
const chokidar = require('chokidar');
const assign = require('object-assign');
const anymatch = require('anymatch');
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

const watchers = [];

class WatchedItem {
  constructor(src, config, cb) {
    this.src = src;
    this.config = config;
    this.cb = cb;
  }
}

class Watcher {

  constructor() {

    this.state = {
      src: [],
      config: defaults,
      watching: false
    };
  }

  add(src, config, cb) {

    if (typeof cb === 'function') {
      watchers.push(new WatchedItem(src, config, cb));
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
    //TODO check for ignored
    let i = -1;
    while (++i < watchers.length) {
      var w = watchers[i];
      if (anymatch(w.src, filePath)) {
        w.cb(w);
      }
    }
  }
}

module.exports = new Watcher();
