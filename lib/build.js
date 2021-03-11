'use strict';
const fs = require('fs-extra');
const argv = require('yargs').argv;
const date = require('date-and-time');
const path = require('path');
const ignoreFolders = require('./config/ignoreFolders');
const info = require('./../package.json');
const {ROOT_FOLDER, DIST_FOLDER, DIST_FOLDER_JS, DIST_FOLDER_LIB, MAIN_FOLDER, LIB_NAME} = require('./config/constants');
const {resolveApp, resolveBundleFiles, executeGitCommand} = require('./scripts/utils');
const minify = require('@node-minify/core');
const babelMinify = require('@node-minify/babel-minify');

(async () => {
  var install = argv.install;
  var type = argv.type || 'prod';
  var distFolder = argv.dir || (install ? DIST_FOLDER_JS : DIST_FOLDER);

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

  console.info('\n' + `Собираем библиотеку ${LIB_NAME} `);


  // Получаем текущую GIT-овую ветку
  const branch = await executeGitCommand('git rev-parse --abbrev-ref HEAD');
  console.info('Получаем текущую GIT-овую ветку: branch is ' + branch);

  // Запишем файл версионирования
  console.info(`Добавляем version.txt в статику`);
  fs.writeFileSync(
    path.resolve(`${distFolder}/${DIST_FOLDER_LIB}/version.txt`),
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
