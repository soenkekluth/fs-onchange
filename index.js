const chokidar = require('chokidar');
const assign = require('object-assign');
const anymatch = require('anymatch');
const path = require('path');
const async = require('async');
// const crypto = require('crypto');
const unique = require('@arr/unique');
const arrify = require('arrify');
// const EventEmitter = require('events').EventEmitter;
//
// TODO cache files https://raw.githubusercontent.com/substack/watchify/master/index.js

const defaults = {
  ignored: [
    /node_modules/,
    /[\/\\]\./,
  ],
  useFsEvents: true,
  persistent: true,
};

// extends EventEmitter {

const watchers = [];

class WatchedItem {
  constructor(src, config, cb) {
    // this.id = crypto
    //   .createHash('md5')
    //   .update(src.toString())
    //   .digest('hex');
    this.src = unique(arrify(src));
    // console.log(this.id);

    this.config = config || {};
    this.cb = cb;
    this.matcher = this.config.ignored ? this.src.concat(unique(this.config.ignored).map(item => `!${item}`)) : this.src;
  }
}

class Watcher {
  constructor() {
    this.state = {
      config: defaults,
      watching: false,
      update: false,
    };
    this.watcher = null;
    this.onChange = this.onChange.bind(this);
  }

  add(src, config, cb) {
    const w = new WatchedItem(src, config, cb);
    if (typeof cb === 'function') {
      watchers.push(w);
      // console.log('add', w);
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

    if (!this.state.watching && watchers.length) {
      let sources = [];
      watchers.forEach((w) => {
        sources = sources.concat(w.src);
      });

      this.watcher = chokidar.watch(sources, this.state.config);
      this.watcher.on('change', this.onChange);
    }
    this.state.watching = true;
  }

  start() {
    this.watch();
  }

  stop() {
    if (this.state.watching) {
      if (this.watcher) {
        this.watcher.off('change', this.onChange);
        this.watcher.close();
        this.watcher = null;
      }
      this.state.watching = false;
    }
  }

  onChange(filePath, stats) {
    async.each(watchers, (w, callback) => {
      if (anymatch(w.matcher, filePath)) {
        const result = {
          src: w.src,
          config: w.config,
          matcher: w.matcher,
          filePath,
          stats,
        };
        w.cb(result);
      }
      callback();
    });
  }
}

module.exports = new Watcher();
