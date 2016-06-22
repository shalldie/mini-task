var task = require('./core');

require('./tool');

require('./callbacks');

require('./queue');



// require('./queue'); 

// 适配 amd 模式， window 环境
require('./exports/exports')();

module.exports = task;