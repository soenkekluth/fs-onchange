#!/usr/bin/env node

const watcher = require('./');
const { exec } = require('child_process');

const argv = require('minimist')(process.argv.slice(2));

let src = argv._[0];
if (src && src.indexOf(',') > -1) {
  src = src.split(' ').join('');
  src = src.split('[').join('');
  src = src.split(']').join('');
  src = src.split(',');
}

const command = argv._.slice(1).join(' ');

if (!src || !command) {
  throw new Error('src and command');
}

const commands = command.split('&&');


const shell = cmd => new Promise((resolve, reject) => {
  let out = '';
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      resolve(error);
      return;
    }

    if (stderr) {
      out = stderr;
    }
    resolve(out + stdout);
  });
});

watcher.add(src, {}, () => {
  const p = commands.length > 1 ? Promise.all(commands.map(cmd => shell(cmd))) : shell(commands[0]);
  p.catch((e) => { /* console.error(e) */ });
  p.then((e) => { console.log(e); });
});


watcher.start();
