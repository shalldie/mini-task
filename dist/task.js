(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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


},{"./core":2}],2:[function(require,module,exports){
var task = {
    ver:'1.0.0'
};

module.exports = task;
},{}],3:[function(require,module,exports){
var task = require("./core");
var callbacks = require("./callbacks");

task.deferred = function () {
    var tuples = [   // 用于存放一系列回调的 tuple 结构
        // 方法名 - 接口名称 - 回调列表 - 最终状态
        ['resolve', 'then', task.callbacks('once memory'), 'resolved'],
        ['reject', 'catch', task.callbacks('once memory'), 'rejected']
    ];

    var dfd = {                // 返回的延迟对象
        state: 'pending',      // 状态
        promise: function () { // promise - 仅提供接口用于注册/订阅
            var self = this;
            var pro = {
                state: function () {
                    return self.state;
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
            tuple[2].fire.apply(tuple[2], task.makeArray(arguments));
            this.state = tuple[3];
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
},{"./callbacks":1,"./core":2}],4:[function(require,module,exports){
var task = require('./../core');

module.exports = function () {
    if (typeof define === "function" && define.amd) {
        define("task", [], function () {
            return task;
        });
    }
}
},{"./../core":2}],5:[function(require,module,exports){
var amd = require('./amd');
var global = require('./global');

module.exports = function () {
    amd();
    global();
}
},{"./amd":4,"./global":6}],6:[function(require,module,exports){
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
},{"./../core":2}],7:[function(require,module,exports){
var task = require('./core');

task.queue = function () {
    var list = [],                                         // 队列列表
        args = [],                                         // 当前参数
        fireState = 0;                                     // 触发状态  0-未触发过 1-触发中  2-触发完毕

    function next() {
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
            cb.apply(null, args);
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
        dequeue: dequeue
    };
};

module.exports = task.queue;
},{"./core":2}],8:[function(require,module,exports){
var task = require('./core');

require('./tool');

require('./callbacks');

require('./queue');

require('./deferred');



// require('./queue'); 

// 适配 amd 模式， window 环境
require('./exports/exports')();

module.exports = task;
},{"./callbacks":1,"./core":2,"./deferred":3,"./exports/exports":5,"./queue":7,"./tool":9}],9:[function(require,module,exports){
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
},{"./core":2}]},{},[8]);
