'use strict';
const fs = require('fs-extra');
const {ROOT_FOLDER} = require('./config/constants');

(async () => {
  fs.removeSync(ROOT_FOLDER);
  console.info(`Каталог \`${ROOT_FOLDER}\` удален.`);
})();
