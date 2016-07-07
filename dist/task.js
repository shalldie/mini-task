(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var task = require('./core');

task.all = function (promises) {
    promises = promises || [];
    var len = promises.length,    // promise 个数
        paramArr = [],            // 每个reject的参数
        dfd = task.deferred(),    // 用于当前task控制的deferred
        pro = dfd.promise();      // 用于当前返回的promise

    if (len === 0) {   // 如果是个空数组，直接就返回了
        dfd.resolve();
        return pro;
    }

    function addThen() {   // 检测是否全部完成
        var args = task.makeArray(arguments);

        if (args.length <= 1) {             // 保存到数组，用户回调
            paramArr.push(args[0]);
        } else {
            paramArr.push(args);
        }

        if (paramArr.length >= len) {         // 如果所有promise都resolve完毕
            dfd.resolve.apply(dfd, paramArr);
        }
    }

    function addCatch() {
        var args = task.makeArray(arguments);
        dfd.reject.apply(dfd, args);
    }

    task.each(promises, function (index, promise) {
        promise.then(addThen).catch(addCatch);
    });

    return pro;
};

module.exports = task.all; 
},{"./core":8}],2:[function(require,module,exports){
module.exports = function () {
    require('./series');
    require('./parallel');
    require('./parallelLimit');
    require('./waterfall');
};
},{"./parallel":3,"./parallelLimit":4,"./series":5,"./waterfall":6}],3:[function(require,module,exports){
var task = require('./../core');

task.parallel = function (actions, callback) {

    var promises = actions.map(function (act) {
        var dfd = task.deferred();
        try {
            act(function () {
                dfd.resolve.apply(dfd, arguments);
            });
        } catch (err) {
            dfd.reject(err);
        }
        return dfd.promise();
    });

    task.all(promises).then(function () {
        var args = task.makeArray(arguments);
        callback(null, args);
    }).catch(function (err) {
        callback(err);
    });
};

module.exports = task.parallel;
},{"./../core":8}],4:[function(require,module,exports){
var task = require('./../core');

task.parallelLimit = function (actions, maxNum, callback) {
    var num = 0,  // 当前执行的数量
        nowIndex = 0, // 当前释放的队列的索引
        len = actions.length,
        argsArr = new Array(len),  // 用于存储返回值
        dfd = task.deferred(),     // 用于当前操作的deferred
        queues = [],
        disabled = false,
        disable = function () {
            disable = true;
        }

    function ifDone() {  // 检测是否完成
        return num == 0 && nowIndex >= len;
    }

    var control = function () {
        // 释放队列
        for (; nowIndex < len && num < maxNum; nowIndex++) {
            num++;
            queues[nowIndex].dequeue();
        }

        // 如果完成
        if (ifDone()) {
            dfd.resolve();
            disable();
            return;
        }
    };

    queues = actions.map(function (act, i) {
        var queue = task.queue();
        queue.queue(function (next) {  // 执行方法
            if (disabled) return;
            act(next);
        });
        queue.queue(function (next) {           // 处理数据
            if (disabled) {
                return;
            }
            var args = task.makeArray(arguments).slice(1);
            if (args.length <= 1) args = args[0];   // 如果只有一个参数，则直接插入，用换成数组
            argsArr[i] = args;
            num--; next();
        });
        queue.catch(function (err) {
            dfd.reject(err);
        });

        queue.queue(function (next) {            // 检测，后续处理
            control();     // 看看是完成了还是继续出列
            next();
        });
        return queue;
    });


    dfd.then(function () {
        callback.call(null, argsArr);
    });

    dfd.catch(function (err) {
        callback(err);
    });

    control();
};

module.exports = task.parallelLimit;
},{"./../core":8}],5:[function(require,module,exports){
var task = require('./../core');

task.series = function (sender, cb) {
    var ifArr = task.type(sender) === "array";

    var queueArr = [];  // 用于存放队列的数组

    var argsArr = [];      // 参数数组

    var queue = task.queue(); // 队列

    task.each(sender, function (k, func) {
        queueArr.push(func);
    });

    var func = function (next) {
        var args = task.makeArray(arguments);
        args.shift();  // 去除第一个next，以便获取参数
        if (args.length <= 1) {
            argsArr.push(args[0]);
        } else {
            argsArr.push(args);
        }
        next();
    };

    task.each(queueArr, function (i, item) {  // 队列方法，交叉放入队列
        queue.queue(item).queue(func);
    });


    queue.queue(function (next) {        // 所有操作正常完成
        if (ifArr) {                // 如果参数是数组
            cb(null, argsArr);
        } else {
            var obj = {}, i = 0;
            task.each(sender, function (k) {
                obj[k] = argsArr[i++];
            });
            cb(null, obj);
        }
        next();
    }).catch(function (err) {        // 某个操作出现异常
        cb(err);
    });

    queue.dequeue();

};

module.exports = task.series;
},{"./../core":8}],6:[function(require,module,exports){
var task = require('./../core');

task.waterfall = function (actions, callback) {
    var queue = task.queue(),
        dfd = task.deferred();
    task.each(actions, function () {
        queue.queue(this);
    });
    queue.queue(function (next) {  // 全部执行完毕
        var args = task.makeArray(arguments).slice(1);
        args.unshift(null);
        callback.apply(null, args);
        next();
    });

    queue.catch(function (err) {
        callback(err);
    });

    queue.dequeue();
};

module.exports = task.waterfall;
},{"./../core":8}],7:[function(require,module,exports){
var task = require('./core');
task.callbacks = function () {
    var list = [],
        _args = (arguments[0] || '').split(' '),           // 参数数组
        fireState = 0,                                     // 触发状态  0-未触发过 1-触发中  2-触发完毕
        stopOnFalse = ~_args.indexOf('stopOnFalse'),       // stopOnFalse - 如果返回false就停止
        once = ~_args.indexOf('once'),                     // once - 只执行一次，即执行完毕就清空
        memory = ~_args.indexOf('memory') ? [] : null;     // memory - 保持状态

    function add(cb) {
        if (memory && fireState == 2) {  //如果是memory模式，并且已经触发过
            cb.apply(null, memory);
        }

        if (disabled()) return this;      // 如果被disabled

        list.push(cb);
        return this;
    }

    function fire() {
        if (disabled()) return this; // 如果被禁用

        if (memory) {     // 如果是memory模式，保存参数
            memory = task.makeArray(arguments);
        }

        fireState = 1;
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i].apply(null, arguments) === false && stopOnFalse) {  // 如果false停止
                break;
            }
        }
        fireState = 2;

        if (once) disable();

        return this;
    }

    function disable() {    // 禁止
        list = undefined;
        return this;
    }

    function disabled() {  // 获取是否被禁止
        return !list;
    }

    return {
        add: add,
        fire: fire,
        disable: disable,
        disabled: disabled
    };
};


module.exports = task.callbacks;


},{"./core":8}],8:[function(require,module,exports){
var task = {
    ver:'1.0.0'
};

module.exports = task;
},{}],9:[function(require,module,exports){
var task = require("./core");
var callbacks = require("./callbacks");

task.deferred = function () {
    var tuples = [   // 用于存放一系列回调的 tuple 结构
        // 方法名 - 接口名称 - 回调列表 - 最终状态
        ['resolve', 'then', task.callbacks('once memory'), 'resolved'],
        ['reject', 'catch', task.callbacks('once memory'), 'rejected']
    ];

    var _state = 'pending';    // 当前状态

    var dfd = {                // 返回的延迟对象
        state: function () {
            return _state;
        },      // 状态
        promise: function () { // promise - 仅提供接口用于注册/订阅
            var self = this;
            var pro = {
                state: function () {
                    return _state;
                }
            };
            task.each(tuples, function (i, tuple) {
                pro[tuple[1]] = self[tuple[1]];
            });
            return pro;
        }
    };

    task.each(tuples, function (i, tuple) {
        dfd[tuple[0]] = function () {       // 触发
            if (_state != "pending") return;
            tuple[2].fire.apply(tuple[2], task.makeArray(arguments));
            _state = tuple[3];
            return this;
        };
        dfd[tuple[1]] = function (cb) {     // 绑定
            tuple[2].add(cb);
            return this;
        };
    });

    return dfd;
};

module.exports = task.deferred;
},{"./callbacks":7,"./core":8}],10:[function(require,module,exports){
var task = require('./../core');

module.exports = function () {
    if (typeof define === "function" && define.amd) {
        define("task", [], function () {
            return task;
        });
    }
}
},{"./../core":8}],11:[function(require,module,exports){
var amd = require('./amd');
var global = require('./global');

module.exports = function () {
    amd();
    global();
}
},{"./amd":10,"./global":12}],12:[function(require,module,exports){
var task = require("./../core");

module.exports = function () {
    if (typeof window !== 'undefined') {
        var _task = window.task;

        window.task = task;

        task.noConflict = function () {
            window.task = _task;
            return task;
        };
    }
}
},{"./../core":8}],13:[function(require,module,exports){
/*
* Array.prototype.indexOf
*/

Array.prototype.indexOf = Array.prototype.indexOf || function (item) {
    var index = -1;
    for (var i = 0, len = this.length; i < len; i++) {
        if (this[i] == item) {
            index = i;
            break;
        }
    }
    return index;
};

// public
/*
*  格式化 
*/
String.prototype.format = function () {
    var args = arguments;
    return this.replace(/\{(\d+?)\}/g, function (g0, g1) {
        return args[+g1];
    });
};

/*
* Array.prototype.forEach
*/
Array.prototype.forEach = Array.prototype.forEach || function (callback) {
    callback = callback || function () { };
    for (var i = 0, len = this.length; i < len; i++) {
        callback.call(this[i], this[i], i);
    }
};

/*
* Array.prototype.some
*/

Array.prototype.some = Array.prototype.some || function (callback) {
    callback = callback || function () { return true; };
    for (var i = 0, len = this.length; i < len; i++) {
        if (callback.call(this[i], this[i], i)) return true;
    }
    return false;
}

/*
* Array.prototype.map
*/
Array.prototype.map = Array.prototype.map || function (callback) {
    callback = callback || function () { };
    var arr = [];
    for (var i = 0, len = this.length; i < len; i++) {
        arr.push(callback(this[i], i));
    }
    return arr;
};

module.exports = {};
},{}],14:[function(require,module,exports){
var task = require('./core');

task.queue = function () {
    var list = [],                                         // 队列列表
        args = [],                                         // 当前参数
        fireState = 0,                                     // 触发状态  0-未触发过 1-触发中  2-触发完毕
        _disable = false,
        catchArr = task.callbacks('once memory');          // 错误的回调

    function disabled() {
        return _disable;
    }

    function disable() {
        _disable = true;
    }

    function next() {
        if (disabled()) return;  // 如果禁用了，返回 
        fireState = 1;
        if (!list.length) {  // 如果队列已经执行完毕，返回
            fireState = 2;
            return;
        }
        args = task.makeArray(arguments);
        args.unshift(next);
        list.shift()();          //取出第一项并执行
    }

    function queue(cb) {
        list.push(function () {
            try {
                cb.apply(null, args);
            } catch (err) {
                disable();
                catchArr.fire(err);
            }
        });
        if (fireState == 2) {  // 如果队列已经执行完毕，重新触发
            next();
        }
        return this;
    }

    function delay(num) {
        queue(function () {
            setTimeout(function () {
                next();
            }, num);
        });
        return this;
    }

    function will(cb) {
        queue(function () {
            cb();
            next();
        })
        return this;
    }

    function dequeue() {
        if (fireState) return;
        next.apply([], arguments);
        return this;
    }

    return {
        queue: queue,
        will: will,
        delay: delay,
        dequeue: dequeue,
        catch: function (cb) {
            catchArr.add(cb);
        },
        disable: disable,
        disabled: disabled
    };
};

module.exports = task.queue;
},{"./core":8}],15:[function(require,module,exports){
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

require('./all');

// 异步async模块
require('./async/async')();

// 适配 amd 模式， window 环境
require('./exports/exports')();

module.exports = task;
},{"./all":1,"./async/async":2,"./callbacks":7,"./core":8,"./deferred":9,"./exports/exports":11,"./extensions":13,"./queue":14,"./tool":16}],16:[function(require,module,exports){
var task = require("./core");

var tool = {
    type: function (sender) {
        // sender+'' 压缩之后，比'null' 长度要少...
        return sender === null ? (sender + '') : Object.prototype.toString.call(sender).toLowerCase().match(/\s(\S+?)\]/)[1];
    },
    each: function (sender, callback) {
        var i = 0,                      // 循环用变量
            len = sender.length,           // 长度
            arrayLike = this.arrayLike(sender); // 是否属于(类)数组

        if (arrayLike) {
            for (; i < len; i++) {
                callback.call(sender[i], i, sender[i]);
            }
        } else {
            for (i in sender) {
                callback.call(sender[i], i, sender[i]);
            }
        }
    },
    arrayLike: function (sender) {
        // duck typing ，检测是否属于数组
        return this.type(sender.length) == 'number' && this.type(sender.splice) == 'function';
    },
    makeArray: function (sender) {
        try {
            return [].slice.call(sender);
        }
        catch (ex) {
            var arr = [],
                i = 0,
                len = sender.length;
            for (; i < len; i++) {
                arr.push(sender[i]);
            }
            return arr;
        }
    }
};

for (var k in tool) {
    task[k] = tool[k];
}

module.exports = task.tool;
},{"./core":8}]},{},[15]);
