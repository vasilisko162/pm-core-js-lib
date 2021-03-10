'use strict';

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const klawSync = require('klaw-sync');
const _ = require('lodash');
const {execSync} = require('child_process');

/**
 * Получить полный путь до папки проекта
 * @type {string}
 */
const appDirectory = fs.realpathSync(process.cwd());

/**
 * Получить полный путь до указанного файла в директории проекта
 * @param args
 * @returns {string}
 */
const resolveApp = (...args) => path.resolve(appDirectory, ...args);

/**
 * Прочитать первую строчку файла
 * @param filePath
 * @returns {Promise<unknown>}
 */
const readFirstLine = filePath => {
  return new Promise((resolve, reject) => {
    const rs = fs.createReadStream(filePath, {encoding: 'utf8'});
    let acc = '';
    let pos = 0;
    let index;
    rs.on('data', function(chunk) {
        index = chunk.indexOf('\n');
        acc += chunk;
        index !== -1 ? rs.close() : (pos += chunk.length);
      })
      .on('close', function() {
        resolve(acc.slice(0, pos + index));
      })
      .on('error', function(err) {
        reject(err);
      });
  });
};

/**
 * Найти все файлы которые подходят под условия
 * @param staticFolder
 * @param options
 * @returns {Promise<[]>}
 */
const resolveBundleFiles = async (staticFolder, options = {}) => {
  let fileList = klawSync(resolveApp(staticFolder), {
    nodir: options.nodir,
    nofile: options.nofile,
    depthLimit: options.depthLimit,
    traverseAll: true,
    filter: ({ path: filePath }) => {
      let result = true;
      if (options.fileMask) {
        result = result && filePath.match(options.fileMask);
      }
      return result;
    }
  }).map(item => item.path);

  // Проверяем по первой строчке в файле
  if (options.firstLine) {
    let result = [];
    for (const filePath of fileList) {
      const firstLine = await readFirstLine(filePath);

      if (_.isRegExp(options.firstLine)) {
        if (firstLine.match(options.firstLine)) {
          result.push(filePath);
        }
      } else {
        if (firstLine.startsWith(options.firstLine)) {
          result.push(filePath);
        }
      }
    }
    fileList = result;
  }
  return fileList;
};

/**
 * Получить объект из строки query-параметров
 * @param queryParamsString
 * @returns {*}
 */
const decodeQueryParamsString = queryParamsString => {
  return _.chain(queryParamsString)
    .replace('?', '')
    .split('&')
    .map(_.partial(_.split, _, '=', 2))
    .fromPairs()
    .value();
};

/**
 * Перевести объект в строку query-параметров для get-запросов
 * @param obj
 * @param keepEmpty - сохранять элементы со значеием null и undefined
 * @returns {string}
 */
const objectToQueryString = (obj, keepEmpty = false) => {
  const results = [];
  _.forOwn(obj, (value, key) => {
    if (!keepEmpty && (value === null || value === undefined)) {
      return;
    }
    if (Array.isArray(value)) {
      _.forOwn(value, iValue => {
        results.push(`${key}[]=${encodeURIComponent(iValue)}`);
      });
    } else {
      results.push(`${key}=${encodeURIComponent(value)}`);
    }
  });
  return results.join('&');
};

/**
 * Сгенерить чексумму содержимого строки
 * @param str
 * @param algorithm
 * @param encoding
 * @returns {string}
 */
const generateChecksum = (str, algorithm, encoding) => {
  return crypto
    .createHash(algorithm || 'sha1')
    .update(str, 'utf8')
    .digest(encoding || 'hex');
};

/**
 * Выполнить команду в git
 * @param command
 */
const executeGitCommand = (command) => {
  return execSync(command)
    .toString('utf8')
    .replace(/[\n\r\s]+$/, '');
};

module.exports = {
  resolveApp,
  resolveBundleFiles,
  decodeQueryParamsString,
  objectToQueryString,
  generateChecksum,
  executeGitCommand
};
