const shell = require('shelljs');

console.info('Синхронизация библиотек');
console.info('1. jQuery');
shell.cp(
  '-R',
  'node_modules/jquery/dist/jquery.js',
  'example/js/',
);
shell.cp(
  '-R',
  'node_modules/jquery/dist/jquery.min.js',
  'example/js/',
);
shell.cp(
  '-R',
  'node_modules/jquery/dist/jquery.min.map',
  'example/js/',
);

//console.info('2. jQuery UI');
