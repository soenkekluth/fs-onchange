#!/usr/bin/env node

const watcher = require('./');
const exec = require('child_process').exec;

const argv = require('minimist')(process.argv.slice(2));
var src = argv._[0];
if (src && src.indexOf(',') > -1) {
  src = src.split(' ').join('');
  src = src.split('[').join('');
  src = src.split(']').join('');
  src = src.split(',');
}

if (!src) {
  console.error('src and command');
  return;
}

const command = argv._.slice(1).join(' ');

if (!command) {
  console.error('src and command');
  return;
}


const shell = (command) => {
  if (!command) {
    return;
  }
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log(stdout);
    if (stderr) {
      console.log(stderr);
    }
  });

}

watcher.add(src, {}, () => {
  shell(command);
})


watcher.start();
