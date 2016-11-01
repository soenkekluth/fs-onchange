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

const commands = command.split('&&');


const shell = (command) => {
  return new Promise((resolve, reject) => {

    var out = '';
    exec(command, (error, stdout, stderr) => {
      if (error) {
        resolve(error);
        return;
      }
      // console.log(stdout);
      if (stderr) {
        out = stderr;
        // return;
      }

      out += stdout;

      resolve(out);
    });

  });
}

watcher.add(src, {}, () => {

  const p = commands.length > 1 ? Promise.all(commands.map(command => shell(command))) : shell(commands[0]);
  p.catch((e) => { /*console.error(e) */})
  p.then((e) => { console.log(e) });
})


watcher.start();
