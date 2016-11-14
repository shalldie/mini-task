/**
 * core
 */
var task = require('./core');


/**
 * 工具模块
 */
task.tool = require('./tool');

/**
 * 基础回调模块
 */
task.callbacks = require('./callbacks');

/**
 * deferred
 */
task.deferred = require('./deferred');

/**
 * all
 */
task.all = require('./all');

// // 低版本浏览器扩展
// require('./extensions');



// // 基础异步模块
// require('./queue');

// require('./deferred');

// require('./all');

// // 异步async模块
// require('./async/async')();

// // 适配 amd 模式， window 环境
// require('./exports/exports')();

module.exports = task;