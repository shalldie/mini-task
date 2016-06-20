(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var callbacks = function () {
    var list = [];

    function add(cb) {
        list.push(cb);
    }

    function fire() {
        for (var i = 0, len = list.length; i < len; i++) {
            list[i].apply(null, arguments);
        }
    }

    return {
        add: add,
        fire: fire
    }
};


module.exports = callbacks;


},{}],2:[function(require,module,exports){
var task = {
    ver:'1.0.0'
};

module.exports = task;
},{}],3:[function(require,module,exports){
module.exports = function (task) {
    if (typeof define === "function" && define.amd) {
        define("task", [], function () {
            return task;
        });
    }
}
},{}],4:[function(require,module,exports){
var amd = require('./amd');
var global = require('./global');

module.exports = function (task) {
    amd(task);
    global(task);
}
},{"./amd":3,"./global":5}],5:[function(require,module,exports){
module.exports = function (task) {
    if (typeof window !== 'undefined') {
        var _task = window.task;

        window.task = task;

        task.noConflict = function () {
            window.task = _task;
            return task;
        };
    }
}
},{}],6:[function(require,module,exports){
var queue = function () {
    var list = [],
        args = [],
        nowIndex = -1,
        callbacks = require('./callbacks')();

    function next() {
        nowIndex++;
        if (nowIndex >= list.length) {
            callbacks.fire();
            return;
        }

        args = [].slice.call(arguments);
        list[nowIndex]();
    }

    function queue(cb) {
        list.push(function () {
            args.unshift(next);
            cb.apply(null, args);
        });
    }

    function dequeue() {
        next.apply([], arguments);
    }

    function notify(cb) {
        callbacks.add(cb);
    }

    return {
        queue: queue,
        dequeue: dequeue,
        notify: notify
    }
};

module.exports = queue;
},{"./callbacks":1}],7:[function(require,module,exports){
var task = require('./core');

task.tool = require('./tool');

task.callbacks = require('./callbacks');

task.queue = require('./queue');



// require('./queue'); 

// 适配 amd 模式， window 环境
require('./exports/exports')(task);

module.exports = task;
},{"./callbacks":1,"./core":2,"./exports/exports":4,"./queue":6,"./tool":8}],8:[function(require,module,exports){
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
    }
};

module.exports = tool;
},{}]},{},[7]);
