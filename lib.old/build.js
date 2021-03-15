'use strict';
const fs = require('fs-extra');
const argv = require('yargs').argv;
const date = require('date-and-time');
const path = require('path');
const ignoreFolders = require('./config/ignoreFolders');
const info = require('./../package.json');
const minify = require('@node-minify/core');
const babelMinify = require('@node-minify/babel-minify');
const {
  resolveApp,
  resolveBundleFiles,
  executeGitCommand
} = require('./scripts/utils');
const {
  ROOT_FOLDER,
  DIST_FOLDER,
  DIST_FOLDER_JS,
  DIST_FOLDER_LIB,
  DIST_FOLDER_LIB_PMCORE,
  SRC_FOLDER,
  LIB_NAME
} = require('./config/constants');

(async () => {
  var type = argv.type || 'prod';
  var install = (type === 'prod');
  var pathFromRep = path.resolve('node_modules/@vasilisko/perfect-mind-core-js-lib/');

  var distFolder = argv.dir || (install ? DIST_FOLDER_JS : DIST_FOLDER);
  var srcFolder = install ? path.join(pathFromRep, SRC_FOLDER) : SRC_FOLDER;
  var libName = LIB_NAME;

  console.info(`Сбор статики pmCoreJs`);
  console.info(`Стенд:   ${type}`);
  console.info(`Каталог: ${distFolder}`);

  // Удаляем каталог, если такой уже есть
  if (distFolder === DIST_FOLDER) {
    fs.removeSync(resolveApp(ROOT_FOLDER));
    fs.removeSync(resolveApp(DIST_FOLDER_JS));
    console.info(`Удаляем каталог ${ROOT_FOLDER}`);
    console.info(`Удаляем каталог ${DIST_FOLDER_JS}`);
  }

  console.info(`Сборка файлов:`);
  // Находим и копируем все директории
  const foldersInDir = await resolveBundleFiles(resolveApp(srcFolder), {nodir: false, nofile: false, depthLimit: 0});

  for (const dirPath of foldersInDir) {
    var temp = dirPath.split('\\'),
      name = temp[temp.length - 1];

    if (ignoreFolders.indexOf(name) === -1) {
      console.info('  -', name);
      fs.copySync(resolveApp(dirPath), resolveApp(distFolder, DIST_FOLDER_LIB_PMCORE, name));
    }
  }

  console.info('\n' + `Собираем библиотеку ${libName} `);
  // Получаем все входные файлы для babelMinify из src
  const entryJsFiles = await resolveBundleFiles(`${srcFolder}`, {
    fileMask: /\.js$/
  });

  var promise = minify({
    compressor: babelMinify,
    input: entryJsFiles,
    output: resolveApp(distFolder, DIST_FOLDER_LIB, libName),
    callback: function(err, min) {

    }
  });

  // Получаем текущую GIT-овую ветку
  const branch = await executeGitCommand('git rev-parse --abbrev-ref HEAD');
  console.info('Получаем текущую GIT-овую ветку: branch is ' + branch);

  // Запишем файл версионирования
  console.info(`Добавляем version.txt в статику`);
  fs.writeFileSync(
    path.resolve(`${distFolder}/${DIST_FOLDER_LIB_PMCORE}/version.txt`),
    `date            - ${date.format(new Date(), 'DD.MM.YYYY HH:mm:ss')}\n` +
    `description     - ${info.description}\n` +
    `author          - ${info.author.name}\n` +
    `email           - ${info.author.email}\n` +
    `stand           - ${type}\n` +
    `version/branch  - ${branch}\n` +
    `project version - ${info.version}`
  );

  console.info('Сборка завершена.');
})();
