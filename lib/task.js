/**
 * core
 */
import task from './core';

/**
 * 工具模块
 */
import tool from './tool';

/**
 * 基础回调模块
 */
import callbacks from './callbacks';

/**
 * deferred
 */
import deferred from './deferred';

/**
 * all
 */
import all from './all';

/**
 * queue
 */
import queue from './queue';

/**
 * 加载异步 async 模块
 */
import async from './async/async';

tool.extend(task, {
    tool,
    callbacks,
    deferred,
    all,
    queue
}, async);

// export { task };  // 有很多坑，，很多问题，我解决不了。
// 在浏览器跟node环境，始终有一个挂在 task.task 下，谁来救救我

module.exports = task;