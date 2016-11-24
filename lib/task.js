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
 * 加载异步 async 模块
 */
require('./async/async');

// 适配 node 环境， amd 模式， window 环境

/* eslint-disable */
if (typeof exports == 'object') {  // node 环境
    module.exports = task;
}
else if (typeof define == 'function' && define.amd) { // amd 模式
    define(task);
}
else {  // 浏览器环境
    let _task = window.task;
    window.task = task;

    task.noConflict = function () {
        window.task = _task;
        return task;
    };
}
/* eslint-enable */