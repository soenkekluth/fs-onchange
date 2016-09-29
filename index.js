const chokidar = require('chokidar');
const assign = require('object-assign');
const anymatch = require('anymatch');
const path = require('path');
const async = require('async');
// const EventEmitter = require('events').EventEmitter;
//
//TODO cache files https://raw.githubusercontent.com/substack/watchify/master/index.js

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
    this.src = (typeof src === 'string') ? [src] : src;
    this.config = assign({}, {ignored:[]}, config);
    this.cb = cb;
    this.matcher = this.src.concat(this.config.ignored.map(item => '!'+item));
  }
}

class Watcher {

  constructor() {

    this.state = {
      src: [],
      config: defaults,
      watching: false
    };

    this.onChange = this.onChange.bind(this);
  }

  add(src, config, cb) {
    const w = new WatchedItem(src, config, cb);
    if (typeof cb === 'function') {
      watchers.push(w);
      this.state.src.push(src);
      // this.state.config = assign({}, this.state.config, config);

      if (this.state.watching) {
        this.watcher.add(src);
      }
    }
    return w;
  }

  remove() {}

  watch(src, config, cb) {
    if (src) {
      this.add(src, config, cb);
    }
    this.start();
  }

  start() {
    if (!this.state.src.length) {
      return;
    }
    if (!this.watcher || !this.state.watching) {
      this.watcher = chokidar.watch(this.state.src, this.state.config);
      this.watcher.on('change', this.onChange);
    }
    this.state.watching = true;
  }

  stop() {
    if (this.watcher) {
      this.watcher.off('change', this.onChange);
      this.watcher.close();
      this.state.watching = false;
    }
  }

  onChange(filePath, stats) {

    //TODO check for ignored
    async.each(watchers, (w, callback) => {
      if (anymatch(w.matcher, filePath)) {
        w.cb(w);
      }
      callback();
    });
  }
}

module.exports = new Watcher();
