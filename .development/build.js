'use strict';
const fs = require('fs-extra');
const argv = require('yargs').argv;
const date = require('date-and-time');
const path = require('path');
const ignoreFolders = require('./config/ignoreFolders');
const info = require('./../package.json');
const {ROOT_FOLDER, DIST_FOLDER, DIST_FOLDER_LIB, MAIN_FOLDER, LIB_NAME} = require('./config/constants');
const {resolveApp, resolveBundleFiles, executeGitCommand} = require('./scripts/utils');
const minify = require('@node-minify/core');
const babelMinify = require('@node-minify/babel-minify');

(async () => {
  var type = argv.type || 'prod';
  var distFolder = argv.dir || DIST_FOLDER;

  console.info(`Сбор статики`);
  console.info(`Стенд:   ${type}`);
  console.info(`Каталог: ${distFolder}` + '\n');

  // Удаляем каталог, если такой уже есть
  if (distFolder === DIST_FOLDER) {
    fs.removeSync(resolveApp(ROOT_FOLDER));
    console.info(`1. Удаляем каталог ${ROOT_FOLDER}`);
  }

  // Получаем текущую GIT-овую ветку
  const branch = await executeGitCommand('git rev-parse --abbrev-ref HEAD');
  console.info('Получаем текущую GIT-овую ветку: branch is ' + branch);

  console.info(`Сборка файлов:`);
  // Находим и копируем все директории
  const foldersInDir = await resolveBundleFiles(MAIN_FOLDER, {nodir: false, nofile: false, depthLimit: 0});

  for (const dirPath of foldersInDir) {
    var temp = dirPath.split('\\'),
      name = temp[temp.length - 1];

    if (ignoreFolders.indexOf(name) === -1) {
      console.info('  -', name);
      fs.copySync(resolveApp(dirPath), resolveApp(distFolder, DIST_FOLDER_LIB, name));
    }
  }

  // Получаем все входные файлы для babelMinify из src
  const entryJsFiles = await resolveBundleFiles(`${MAIN_FOLDER}`, {
    fileMask: /\.js$/
  });

  var promise = minify({
    compressor: babelMinify,
    input: entryJsFiles,
    output: resolveApp(distFolder, LIB_NAME),
    callback: function(err, min) {

    }
  });

  // Запишем файл версионирования
  console.info(` `);
  console.info(`Добавляем version.txt в статику`);
  fs.writeFileSync(
    path.resolve(`${distFolder}/${DIST_FOLDER_LIB}/version.txt`),
    `date            - ${date.format(new Date(), 'DD.MM.YYYY HH:mm:ss')}\n` +
    `stand           - ${type}\n` +
    `version/branch  - ${branch}\n` +
    `project version - ${info.version}\n` +
    `description     - ${info.description}\n` +
    `author          - ${info.author}\n` +
    `email           - vasilisko@gmail.com`
  );

  console.info('\nСборка завершена.\n');
})();
