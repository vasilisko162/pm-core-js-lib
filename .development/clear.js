'use strict';
const fs = require('fs-extra');
const {CLEAR_FOLDER} = require('./config/constants');

(async () => {
  fs.removeSync(CLEAR_FOLDER);
  console.info(`Каталог \`${CLEAR_FOLDER}\` удален.`);
})();
