(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function () {
    require('./series');
};
},{"./series":2}],2:[function(require,module,exports){
var task = require('./../core');

task.series = function (sender, cb) {
    var ifArr = task.type(sender) === "array";
    
    var queueArr=[];  // 用于存放队列的数组

    var argsArr=[];      // 参数数组

    var queue=task.queue(); // 队列

    task.each(sender,function(k,func){
        queueArr.push(func);
    });

    var func=function(next){
        var args=task.makeArray(arguments);
        args.shift();  // 去除第一个next，以便获取参数
        if(args.length<=1){
            argsArr.push(args[0]);
        }else{
            argsArr.push(args);
        }
        next();
    };

    task.each(queueArr,function(i,item){  // 队列方法，交叉放入队列
        queue.queue(item).queue(func);
    });


    queue.queue(function(next){        // 所有操作正常完成
        if(ifArr){                // 如果参数是数组
            cb(null,argsArr);
        }else{
            var obj={},i=0;
            task.each(sender,function(k){
                obj[k]=argsArr[i++];
            });
            cb(null,obj);
        }
        next();
    }).catch(function(err){        // 某个操作出现异常
        cb(err);
    });

    queue.dequeue();

};

module.exports = task.series;
},{"./../core":4}],3:[function(require,module,exports){
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


},{"./core":4}],4:[function(require,module,exports){
var task = {
    ver:'1.0.0'
};

module.exports = task;
},{}],5:[function(require,module,exports){
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
},{"./callbacks":3,"./core":4}],6:[function(require,module,exports){
var task = require('./../core');

module.exports = function () {
    if (typeof define === "function" && define.amd) {
        define("task", [], function () {
            return task;
        });
    }
}
},{"./../core":4}],7:[function(require,module,exports){
var amd = require('./amd');
var global = require('./global');

module.exports = function () {
    amd();
    global();
}
},{"./amd":6,"./global":8}],8:[function(require,module,exports){
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
},{"./../core":4}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
var task = require('./core');

task.queue = function () {
    var list = [],                                         // 队列列表
        args = [],                                         // 当前参数
        fireState = 0,                                     // 触发状态  0-未触发过 1-触发中  2-触发完毕
        _disable = false,
        catchErr = task.callbacks('once memory');          // 错误的回调

    function disabled(){
        return _disable;
    }

    function disable(){
        _disable=true;
    }

    function next() {
        if(disabled()) return;  // 如果禁用了，返回 
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
                disabled();
                catchErr.fire(err);
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
        catch:function(cb){
            catchErr.add(cb);
        },
        disable:disable,
        disabled:disabled
    };
};

module.exports = task.queue;
},{"./core":4}],11:[function(require,module,exports){
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
},{"./async/async":1,"./callbacks":3,"./core":4,"./deferred":5,"./exports/exports":7,"./extensions":9,"./queue":10,"./tool":12}],12:[function(require,module,exports){
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
},{"./core":4}]},{},[11]);
