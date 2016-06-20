var task = require('./core');

task.tool = require('./tool');

task.callbacks = require('./callbacks');

task.queue = require('./queue');



// require('./queue'); 

// 适配 amd 模式， window 环境
require('./exports/exports')(task);

module.exports = task;