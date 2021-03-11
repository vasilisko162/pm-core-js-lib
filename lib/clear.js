'use strict';
const fs = require('fs-extra');
const {ROOT_FOLDER, DIST_FOLDER_JS} = require('./config/constants');

(async () => {
  fs.removeSync(ROOT_FOLDER);
  fs.removeSync(DIST_FOLDER_JS);
  console.info(`Каталог \`${ROOT_FOLDER}\` удален.`);
  console.info(`Каталог \`${DIST_FOLDER_JS}\` удален.`);

})();
