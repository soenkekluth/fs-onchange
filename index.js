const chokidar = require('chokidar');
const assign = require('object-assign');
const anymatch = require('anymatch');
const path = require('path');
const async = require('async');
const unique = require('@arr/unique');
const arrify = require('arrify');
const chalk = require('chalk');

const log = console.log;


const defaults = {
  ignored: ['**/node_modules/**', /[\/\\]\./],
  // useFsEvents: true,
  persistent: true,
};

const watchers = [];

class WatchedItem {
  constructor(src, config, cb) {
    this.src = unique(arrify(src));
    this.config = config || {};
    this.cb = cb;
    this.matcher = this.config.ignored
      ? this.src.concat(unique(this.config.ignored).map(item => `!${item}`))
      : this.src;
  }
}

class Watcher {
  constructor(props) {
    this.props = Object.assign({}, props);
    this.state = {
      config: defaults,
      watching: false,
      update: false,
    };
    this.watcher = null;
    this.onChange = this.onChange.bind(this);
    this.start = this.watch.bind(this);
  }

  add(src, config, cb) {
    const w = new WatchedItem(src, config, cb);
    if (typeof cb === 'function') {
      watchers.push(w);
      if (this.state.watching) {
        this.watcher.add(src);
      }
    }
    return w;
  }

  remove(src) {
    this.watcher.unwatch(src);
  }

  watch(src, config, cb) {
    if (src) {
      this.add(src, config, cb);
    }

    if (!this.state.watching && watchers.length) {
      const sources = watchers.map(w => w.src);
      log(`${chalk.green('watching filesystem for changes in:')}\n${chalk.blue(sources.join('\n'))}`);
      this.watcher = chokidar.watch(sources, this.state.config);
      this.watcher.on('change', this.onChange);
    }
    this.state.watching = true;
  }

  stop() {
    if (this.state.watching) {
      if (this.watcher) {
        this.watcher.off('change', this.onChange);
        this.watcher.close();
        this.watcher = null;
        log(`${chalk.green('watching filesystem stopped')}`);
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
        log(`${chalk.green('file changed: ')} ${chalk.blue(path.relative(process.cwd(), filePath))}`);
      }
      callback();
    });
  }
}

module.exports = new Watcher();
