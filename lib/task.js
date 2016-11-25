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

/**
 * 适配 node,amd,global
 */

// export default task;  // 这样有很多问题啊，，我解决不了

// a lot of problems may appear while using webpack to browsify es6 module

module.exports = task;