(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var callbacks = function () {

    var list = [],        // 回调数组
        fireIndex = -1,   // 当前正在回调的索引
        args = arguments, //参数


        /*
        * 'default' - 默认类型，自动依次触发
        * 'queue' - 需要手动回调 next
        */
        fireType = args[0] || 'default',     // 触发类型

        statu = 0;        // 状态   0- 等待，初始值   1- 触发阶段  2- 完成




    function add(cb) {      // 注册
        var item;
        switch (fireType) {
            case 'default':
                item = function (next) {
                    cb.apply(null, [].slice.call(arguments, 1));
                    next();
                };
                break;
            case 'queue':
                item = cb;
                break;
        }

        item && list.push(item);
    }

    var params = [];

    function fire() {       // 触发
        if (statu || !list.length) return;

        statu = 1;
        fireIndex = 0;

        params = [].slice.apply(arguments);
        dequeue();

    }

    function dequeue() {   // 出列
        var item = list[fireIndex++],
            args = [].slice.call(arguments);

        if (statu == 'default') {
            args = params.slice();
        }

        if (!item) return;
        args.unshift(dequeue);
        item.apply(null, args);
    }

    return {
        add: add,
        fire: fire
    };
};


module.exports = callbacks;


},{}],2:[function(require,module,exports){
var task = {};

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
var task = require('./core');

task.callbacks = require('./callbacks');



// require('./queue'); 

// 适配 amd 模式， window 环境
require('./exports/exports')(task);

module.exports = task;
},{"./callbacks":1,"./core":2,"./exports/exports":4}]},{},[6]);
