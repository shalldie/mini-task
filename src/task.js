var task = require('./core');

task.callbacks = require('./callbacks');



// require('./queue'); 

// 适配 amd 模式， window 环境
require('./exports/exports')(task);

module.exports = task;