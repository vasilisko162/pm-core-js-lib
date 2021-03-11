#!/usr/bin/env node

const info = require('./../package.json');

console.info(`date            - ${date.format(new Date(), 'DD.MM.YYYY HH:mm:ss')}`);
console.info(`description     - ${info.description}`);
console.info(`author          - ${info.author.name}`);
console.info(`email           - ${info.author.email}`);
console.info(`stand           - ${type}`);
console.info(`version/branch  - ${branch}`);
console.info(`project version - ${info.version}`);
