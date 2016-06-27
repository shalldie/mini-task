// 核心
var task = require('./core');

// 低版本浏览器扩展
require('./extensions');

// 工具模块
require('./tool');

// 基础回调模块
require('./callbacks');

// 基础异步模块
require('./queue');

require('./deferred');


// 异步async模块
require('./async/async')();

// 适配 amd 模式， window 环境
require('./exports/exports')();

module.exports = task;