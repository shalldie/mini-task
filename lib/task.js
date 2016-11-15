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

/**
 * queue
 */
task.queue = require('./queue');

/**
 * 异步async模块
 */
require('./async/async');

// // 适配 amd 模式， window 环境
require('./exports/exports')();

module.exports = task;