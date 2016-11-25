(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("task", [], factory);
	else if(typeof exports === 'object')
		exports["task"] = factory();
	else
		root["task"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _core = __webpack_require__(1);

	var _core2 = _interopRequireDefault(_core);

	var _tool = __webpack_require__(2);

	var _tool2 = _interopRequireDefault(_tool);

	var _callbacks = __webpack_require__(3);

	var _callbacks2 = _interopRequireDefault(_callbacks);

	var _deferred = __webpack_require__(4);

	var _deferred2 = _interopRequireDefault(_deferred);

	var _all = __webpack_require__(5);

	var _all2 = _interopRequireDefault(_all);

	var _queue = __webpack_require__(6);

	var _queue2 = _interopRequireDefault(_queue);

	var _async = __webpack_require__(7);

	var _async2 = _interopRequireDefault(_async);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * queue
	 */


	/**
	 * deferred
	 */


	/**
	 * 工具模块
	 */
	_tool2.default.extend(_core2.default, {
	  tool: _tool2.default,
	  callbacks: _callbacks2.default,
	  deferred: _deferred2.default,
	  all: _all2.default,
	  queue: _queue2.default
	}, _async2.default);

	// export { task };  // 有很多坑，，很多问题，我解决不了。
	// 在浏览器跟node环境，始终有一个挂在 task.task 下，谁来救救我

	/**
	 * 加载异步 async 模块
	 */


	/**
	 * all
	 */


	/**
	 * 基础回调模块
	 */
	/**
	 * core
	 */
	module.exports = _core2.default;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    ver: '0.0.5'
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * 工具模块
	 */
	exports.default = {
	    type: function type(sender) {
	        // sender+'' 压缩之后，比'null' 长度要少...
	        return sender === null ? sender + '' : Object.prototype.toString.call(sender).toLowerCase().match(/\s(\S+?)\]/)[1];
	    },
	    each: function each(sender, callback) {
	        var i = 0,
	            // 循环用变量
	        len = sender.length,
	            // 长度
	        arrayLike = this.arrayLike(sender),
	            // 是否属于(类)数组
	        result = void 0; // 回调的结果

	        if (arrayLike) {
	            for (; i < len; i++) {
	                result = callback.call(sender[i], i, sender[i]);
	                // true 的时候continue 省略
	                if (result === false) break;
	            }
	        } else {
	            for (i in sender) {
	                result = callback.call(sender[i], i, sender[i]);
	                // true 的时候continue 省略
	                if (result === false) break;
	            }
	        }
	    },
	    arrayLike: function arrayLike(sender) {
	        // duck typing ，检测是否属于数组
	        return this.type(sender.length) == 'number' && this.type(sender.splice) == 'function';
	    },
	    makeArray: function makeArray(sender) {
	        try {
	            return [].slice.call(sender);
	        } catch (ex) {
	            var arr = [],
	                i = 0,
	                len = sender.length;
	            for (; i < len; i++) {
	                arr.push(sender[i]);
	            }
	            return arr;
	        }
	    },
	    extend: function extend() {
	        var args = this.makeArray(arguments);
	        var base = args.shift();
	        for (var i = 0, len = args.length; i < len; i++) {
	            this.each(args[i], function (k, v) {
	                base[k] = v;
	            });
	        }
	        return base;
	    }
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function () {
	    var list = [],
	        _args = (arguments[0] || '').split(' '),
	        // 参数数组
	    fireState = 0,
	        // 触发状态  0-未触发过 1-触发中  2-触发完毕
	    stopOnFalse = ~_args.indexOf('stopOnFalse'),
	        // stopOnFalse - 如果返回false就停止
	    once = ~_args.indexOf('once'),
	        // once - 只执行一次，即执行完毕就清空
	    memory = ~_args.indexOf('memory') ? [] : null,
	        // memory - 保持状态
	    fireArgs = []; // fire 参数

	    /**
	     * 添加回调函数
	     * 
	     * @param {any} cb
	     * @returns callbacks
	     */
	    function add(cb) {
	        if (memory && fireState == 2) {
	            // 如果是memory模式，并且已经触发过
	            cb.apply(null, fireArgs);
	        }

	        if (disabled()) return this; // 如果被disabled

	        list.push(cb);
	        return this;
	    }

	    /**
	     * 触发
	     * 
	     * @param {any} 任意参数
	     * @returns callbacks
	     */
	    function fire() {
	        if (disabled()) return this; // 如果被禁用

	        fireArgs = _tool2.default.makeArray(arguments); // 保存 fire 参数

	        fireState = 1; // 触发中 

	        _tool2.default.each(list, function (index, cb) {
	            // 依次触发回调
	            if (cb.apply(null, fireArgs) === false && stopOnFalse) {
	                // stopOnFalse 模式下，遇到false会停止触发
	                return false;
	            }
	        });

	        fireState = 2; // 触发结束

	        if (once) disable(); // 一次性列表

	        return this;
	    }

	    function disable() {
	        // 禁止
	        list = undefined;
	        return this;
	    }

	    function disabled() {
	        // 获取是否被禁止
	        return !list;
	    }

	    return {
	        add: add,
	        fire: fire,
	        disable: disable,
	        disabled: disabled
	    };
	};

	var _tool = __webpack_require__(2);

	var _tool2 = _interopRequireDefault(_tool);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function () {
	    var tuples = [// 用于存放一系列回调的 tuple 结构
	    // 方法名 - 接口名称 - 回调列表 - 最终状态
	    ['resolve', 'then', (0, _callbacks2.default)('once memory'), 'resolved'], ['reject', 'catch', (0, _callbacks2.default)('once memory'), 'rejected']];

	    var _state = 'pending'; // 当前状态

	    var dfd = { // 返回的延迟对象
	        state: function state() {
	            return _state;
	        }, // 状态
	        promise: function promise() {
	            // promise - 仅提供接口用于注册/订阅
	            var self = this;
	            var pro = {
	                state: self.state
	            };
	            _tool2.default.each(tuples, function (i, tuple) {
	                // 订阅接口
	                pro[tuple[1]] = self[tuple[1]];
	            });
	            return pro;
	        }
	    };

	    _tool2.default.each(tuples, function (i, tuple) {
	        dfd[tuple[0]] = function () {
	            // 触发
	            if (_state != "pending") return this;
	            tuple[2].fire.apply(tuple[2], _tool2.default.makeArray(arguments));
	            _state = tuple[3];
	            return this;
	        };
	        dfd[tuple[1]] = function (cb) {
	            // 绑定
	            tuple[2].add(cb);
	            return this;
	        };
	    });

	    return dfd;
	};

	var _tool = __webpack_require__(2);

	var _tool2 = _interopRequireDefault(_tool);

	var _callbacks = __webpack_require__(3);

	var _callbacks2 = _interopRequireDefault(_callbacks);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (promises) {
	    promises = _tool2.default.makeArray(promises);
	    var len = promises.length,
	        // promise 个数
	    resNum = 0,
	        // resolve 的数量
	    argsArr = new Array(len),
	        // 每个reject的参数
	    dfd = (0, _deferred2.default)(),
	        // 用于当前task控制的deferred
	    pro = dfd.promise(); // 用于当前返回的promise

	    if (len === 0) {
	        // 如果是个空数组，直接就返回了
	        dfd.resolve();
	        return pro;
	    }

	    function addThen() {
	        // 检测是否全部完成
	        resNum++;
	        var args = _tool2.default.makeArray(arguments);
	        var index = args.shift(); // 当前参数在promises中的索引

	        if (args.length <= 1) {
	            // 保存到数组，用户回调
	            argsArr[index] = args[0];
	        } else {
	            argsArr[index] = args;
	        }

	        if (resNum >= len) {
	            // 如果所有promise都resolve完毕
	            dfd.resolve(argsArr);
	        }
	    }

	    function addCatch() {
	        // 如果某个promise发生了reject 
	        var args = _tool2.default.makeArray(arguments);
	        dfd.reject.apply(dfd, _toConsumableArray(args));
	    }

	    _tool2.default.each(promises, function (index, promise) {
	        promise.then(function () {
	            addThen.apply(undefined, [index].concat(Array.prototype.slice.call(arguments)));
	        }).catch(addCatch);
	    });

	    return pro;
	};

	var _deferred = __webpack_require__(4);

	var _deferred2 = _interopRequireDefault(_deferred);

	var _tool = __webpack_require__(2);

	var _tool2 = _interopRequireDefault(_tool);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function () {
	    var list = [],
	        // 回调列表
	    _disable = false,
	        // 是否禁用
	    state = 0,
	        // 当前状态  0-未触发过 1-触发中  2-触发完毕
	    args = [],
	        // 最后一次触发时候的参数
	    catchArr = (0, _callbacks2.default)('once memory'); // 错误的回调对象

	    /**
	     * 禁用队列
	     */
	    function disable() {
	        _disable = true;
	    }

	    /**
	     * 是否禁用
	     * 
	     * @returns {boolean}
	     */
	    function disabled() {
	        return _disable;
	    }

	    /**
	     * 获取运行状态
	     * 
	     * @returns {number}
	     */
	    function getState() {
	        return state;
	    }

	    /**
	     * 入列
	     * 
	     * @param {any} cb 插入队列的函数
	     * returns {queue}
	     */
	    function queue(cb) {
	        list.push(cb);

	        if (list.length == 1 && state == 2) {
	            // 如果之前已经执行完毕，再次添加队列会自动执行，memory模式
	            next.apply(undefined, _toConsumableArray(args));
	        }

	        return this;
	    }

	    /**
	     * 出列
	     * 
	     * returns {queue}
	     */
	    function dequeue() {
	        if (disabled()) {
	            return this;
	        }

	        args = _tool2.default.makeArray(arguments);
	        next.apply(undefined, _toConsumableArray(args));
	        return this;
	    }

	    /**
	     * 出列回调
	     * 
	     * @returns
	     */
	    function next() {
	        state = 1; // 执行中

	        if (disabled()) {
	            // 如果不可用 
	            return this;
	        }

	        args = _tool2.default.makeArray(arguments); // 处理参数

	        if (!list.length) {
	            // 出列完全
	            state = 2;
	            return this;
	        }

	        var nextArgs = [next].concat(_toConsumableArray(args));

	        var cb = list.shift(); // 执行回调
	        try {
	            _tool2.default.type(cb) == 'function' && cb.apply(undefined, _toConsumableArray(nextArgs));
	        } catch (err) {
	            disable();
	            catchArr.fire(err);
	        }
	    }

	    /**
	     * 便捷方法，自动调用next
	     * 
	     * @param {any} cb
	     * 
	     * returns {queue}
	     */
	    function will(cb) {
	        return this.queue(function (next) {
	            cb();
	            next();
	        });
	    }

	    /**
	     * 延时队列
	     * 
	     * @param {any} milliseconds 延时的时间
	     * @returns
	     */
	    function delay(milliseconds) {
	        return this.queue(function (next) {
	            setTimeout(next, milliseconds);
	        });
	    }

	    /**
	     * 添加错误处理函数
	     * 
	     * @param {any} queue
	     */
	    function catchFunc(callback) {
	        catchArr.add(callback);
	        return this;
	    }

	    return {
	        disable: disable,
	        disabled: disabled,
	        queue: queue,
	        dequeue: dequeue,
	        getState: getState,
	        will: will,
	        delay: delay,
	        catch: catchFunc
	    };
	};

	var _tool = __webpack_require__(2);

	var _tool2 = _interopRequireDefault(_tool);

	var _callbacks = __webpack_require__(3);

	var _callbacks2 = _interopRequireDefault(_callbacks);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	/**
	 * queue 模块
	 * 
	 * @export
	 * @returns queue
	 */

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _series = __webpack_require__(8);

	var _series2 = _interopRequireDefault(_series);

	var _parallel = __webpack_require__(9);

	var _parallel2 = _interopRequireDefault(_parallel);

	var _parallelLimit = __webpack_require__(10);

	var _parallelLimit2 = _interopRequireDefault(_parallelLimit);

	var _waterfall = __webpack_require__(11);

	var _waterfall2 = _interopRequireDefault(_waterfall);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	    series: _series2.default,
	    parallel: _parallel2.default,
	    parallelLimit: _parallelLimit2.default,
	    waterfall: _waterfall2.default
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (tasks, callback) {
	    var ifObj = _tool2.default.type(tasks) == 'object'; // tasks 参数是否object类型
	    var keyList = []; // 键列表
	    var funcList = []; // function 列表
	    var resList = []; // 结果列表

	    _tool2.default.each(tasks, function (key, func) {
	        ifObj && keyList.push(key); // 当返回类型是object的时候，键列表需要用到
	        funcList.push(func);
	    });

	    try {
	        (function invokeNext() {
	            // 递归，串行执行函数，依次将结果取出来

	            if (!funcList.length) {
	                // 当全部函数执行完毕，进行回调
	                if (ifObj) {
	                    var hash = {};
	                    for (var i = 0, len = resList.length; i < len; i++) {
	                        hash[keyList[i]] = resList[i];
	                    }
	                    callback(null, hash);
	                } else {
	                    callback(null, resList);
	                }
	                return;
	            }

	            var func = funcList.shift();
	            func(function () {
	                var args = _tool2.default.makeArray(arguments);
	                args = args.length > 1 ? args : args[0];
	                resList.push(args);
	                invokeNext();
	            });
	        })();
	    } catch (err) {
	        // 捕获运行中同步代码的错误
	        callback(err);
	    }
	};

	var _tool = __webpack_require__(2);

	var _tool2 = _interopRequireDefault(_tool);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (tasks, callback) {
	  return (0, _parallelLimit2.default)(tasks, 0, callback);
	};

	var _parallelLimit = __webpack_require__(10);

	var _parallelLimit2 = _interopRequireDefault(_parallelLimit);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (tasks, limit, callback) {
	    if (limit > 10000 || !limit) {
	        // 默认最大并非量是1w
	        limit = 10000;
	    }

	    var ifObj = _tool2.default.type(tasks) == 'object'; // 是object还是array
	    var aliveNum = 0; // 当前异步执行的数量
	    var keyList = []; // 键的列表
	    var funcList = []; // 异步函数的列表
	    var dfdList = []; // 所有操作的 deferred 列表
	    var _disabled = false; // 是否禁用

	    _tool2.default.each(tasks, function (k, func) {
	        // 键值对分离
	        ifObj && keyList.push(k); // 在参数是object的时候，需要用到键
	        funcList.push(func);
	    });

	    /**
	     * 禁用当前并行操作
	     */
	    function disable() {
	        _disabled = true;
	    }

	    /**
	     * 获取当前并行操作是否被禁用
	     * 
	     * @returns boolean
	     */
	    function disabled() {
	        return _disabled;
	    }

	    /**
	     * 限量执行队列
	     */
	    function invokeLimit() {
	        while (!disabled() && aliveNum < limit) {
	            // 当并发量未达到上限，向队列中添加下一个异步操作
	            invokeNext();
	        }
	    }

	    invokeLimit();

	    /**
	     * 添加新的异步操作
	     */
	    function invokeNext() {
	        if (!funcList.length) {
	            // 如果已经全部出列完毕，停止
	            invokeCallback();
	            return;
	        }

	        aliveNum++;

	        var dfd = (0, _deferred2.default)();

	        var func = funcList.shift();

	        try {
	            func(function () {
	                // 该次异步操作完毕的时候
	                var args = _tool2.default.makeArray(arguments);
	                var err = args.shift();
	                if (err) {
	                    invokeCallback();
	                    return;
	                }

	                args = args.length > 1 ? args : args[0];
	                dfd.resolve(args);

	                aliveNum--;
	                invokeLimit();
	            });
	        } catch (err) {
	            dfd.reject(err);
	            invokeCallback();
	            return;
	        }

	        dfdList.push(dfd);
	    }

	    /**
	     * 在全部操作完毕的时候，执行回调
	     */
	    function invokeCallback() {
	        disable();
	        (0, _all2.default)(dfdList).then(function (arr) {
	            if (ifObj) {
	                var hash = {};
	                for (var i = 0, len = arr.length; i < len; i++) {
	                    hash[keyList[i]] = arr[i];
	                }
	                callback(null, hash);
	            } else {
	                callback(null, arr);
	            }
	        }).catch(function (err) {
	            callback(err);
	        });
	    }
	};

	var _tool = __webpack_require__(2);

	var _tool2 = _interopRequireDefault(_tool);

	var _deferred = __webpack_require__(4);

	var _deferred2 = _interopRequireDefault(_deferred);

	var _all = __webpack_require__(5);

	var _all2 = _interopRequireDefault(_all);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (tasks, callback) {

	    var args = []; // 最后一次的参数
	    var _disabled = false; // 是否禁用

	    function disable() {
	        _disabled = true;
	    }

	    function disabled() {
	        return _disabled;
	    }

	    (function invokeNext() {
	        // 递归依次取出函数执行
	        if (disabled()) {
	            return;
	        }
	        if (!tasks.length) {
	            args = args.length > 1 ? args : args[0];
	            callback(null, args);
	            disable();
	            return;
	        }
	        var func = tasks.shift();

	        try {
	            func.apply(undefined, _toConsumableArray(args).concat([next]));
	        } catch (err) {
	            disable();
	            callback(err);
	            return;
	        }

	        function next() {
	            args = _tool2.default.makeArray(arguments);
	            var err = args.shift();
	            if (err) {
	                callback(err);
	                disable();
	                return;
	            }
	            invokeNext(); //  递归进行下一次调用
	        }
	    })();
	};

	var _tool = __webpack_require__(2);

	var _tool2 = _interopRequireDefault(_tool);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	/**
	 * waterfall 模块
	 * 
	 * @export
	 * @param {any} tasks
	 * @param {any} callback
	 */

/***/ }
/******/ ])
});
;