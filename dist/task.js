/******/ (function(modules) { // webpackBootstrap
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

	var task = __webpack_require__(1);

	module.exports = task;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * core
	 */
	var task = __webpack_require__(2);

	/**
	 * 工具模块
	 */
	task.tool = __webpack_require__(3);

	/**
	 * 基础回调模块
	 */
	task.callbacks = __webpack_require__(4);

	/**
	 * deferred
	 */
	task.deferred = __webpack_require__(5);

	/**
	 * all
	 */
	task.all = __webpack_require__(6);

	/**
	 * queue
	 */
	task.queue = __webpack_require__(7);

	/**
	 * 异步async模块
	 */
	__webpack_require__(8);

	// // 适配 amd 模式， window 环境
	__webpack_require__(14)();

	module.exports = task;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	var task = {
	    ver: '1.0.0'
	};

	module.exports = task;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * 工具模块
	 */
	var tool = {
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
	    }
	};

	module.exports = tool;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(3);

	/**
	 * 基础回调模块
	 * 
	 * @returns callbacks
	 */
	var callbacks = function callbacks() {
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

	        fireArgs = _.makeArray(arguments); // 保存 fire 参数

	        fireState = 1; // 触发中 

	        _.each(list, function (index, cb) {
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

	module.exports = callbacks;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(3);
	var callbacks = __webpack_require__(4);

	var deferred = function deferred() {
	    var tuples = [// 用于存放一系列回调的 tuple 结构
	    // 方法名 - 接口名称 - 回调列表 - 最终状态
	    ['resolve', 'then', callbacks('once memory'), 'resolved'], ['reject', 'catch', callbacks('once memory'), 'rejected']];

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
	            _.each(tuples, function (i, tuple) {
	                // 订阅接口
	                pro[tuple[1]] = self[tuple[1]];
	            });
	            return pro;
	        }
	    };

	    _.each(tuples, function (i, tuple) {
	        dfd[tuple[0]] = function () {
	            // 触发
	            if (_state != "pending") return this;
	            tuple[2].fire.apply(tuple[2], _.makeArray(arguments));
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

	module.exports = deferred;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var task = __webpack_require__(2);
	var _ = __webpack_require__(3);

	var all = function all(promises) {
	    promises = _.makeArray(promises);
	    var len = promises.length,
	        // promise 个数
	    argsArr = [],
	        // 每个reject的参数
	    dfd = task.deferred(),
	        // 用于当前task控制的deferred
	    pro = dfd.promise(); // 用于当前返回的promise

	    if (len === 0) {
	        // 如果是个空数组，直接就返回了
	        dfd.resolve();
	        return pro;
	    }

	    function addThen() {
	        // 检测是否全部完成
	        var args = _.makeArray(arguments);

	        if (args.length <= 1) {
	            // 保存到数组，用户回调
	            argsArr.push(args[0]);
	        } else {
	            argsArr.push(args);
	        }

	        if (argsArr.length >= len) {
	            // 如果所有promise都resolve完毕
	            dfd.resolve(argsArr);
	        }
	    }

	    function addCatch() {
	        // 如果某个promise发生了reject 
	        var args = _.makeArray(arguments);
	        dfd.reject.apply(dfd, _toConsumableArray(args));
	    }

	    _.each(promises, function (index, promise) {
	        promise.then(addThen).catch(addCatch);
	    });

	    return pro;
	};

	module.exports = all;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var _ = __webpack_require__(3);
	var callbacks = __webpack_require__(4);

	var queue = function queue() {
	    var list = [],
	        // 回调列表
	    _disable = false,
	        // 是否禁用
	    state = 0,
	        // 当前状态  0-未触发过 1-触发中  2-触发完毕
	    args = [],
	        // 最后一次触发时候的参数
	    catchArr = callbacks('once memory'); // 错误的回调对象

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

	        args = _.makeArray(arguments);
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

	        if (!list.length) {
	            // 出列完全
	            state = 2;
	            return this;
	        }

	        args = _.makeArray(arguments); // 处理参数

	        var nextArgs = [next].concat(_toConsumableArray(args));

	        var cb = list.shift(); // 执行回调
	        try {
	            _.type(cb) == 'function' && cb.apply(undefined, _toConsumableArray(nextArgs));
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

	    return {
	        disable: disable,
	        disabled: disabled,
	        queue: queue,
	        dequeue: dequeue,
	        getState: getState,
	        will: will,
	        delay: delay
	    };
	};

	module.exports = queue;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var task = __webpack_require__(2);

	task.series = __webpack_require__(9);

	task.parallel = __webpack_require__(10);

	task.parallelLimit = __webpack_require__(12);

	task.waterfall = __webpack_require__(13);

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(3);

	var series = function series(tasks, callback) {
	    var ifObj = _.type(tasks) == 'object'; // tasks 参数是否object类型
	    var keyList = []; // 键列表
	    var funcList = []; // function 列表
	    var resList = []; // 结果列表

	    _.each(tasks, function (key, func) {
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
	                var args = _.makeArray(arguments);
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

	module.exports = series;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {'use strict';

	var parallelLimit = __webpack_require__(12);

	module.export = function (tasks, callback) {
	    return parallelLimit(tasks, 0, callback);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)(module)))

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(3);

	var deferred = __webpack_require__(5);

	var all = __webpack_require__(6);

	var parallelLimit = function parallelLimit(tasks, limit, callback) {
	    if (limit > 10000 || !limit) {
	        // 默认最大并非量是1w
	        limit = 10000;
	    }

	    var ifObj = _.type(tasks) == 'object'; // 是object还是array
	    var aliveNum = 0; // 当前异步执行的数量
	    var keyList = []; // 键的列表
	    var funcList = []; // 异步函数的列表
	    var dfdList = []; // 所有操作的 deferred 列表
	    var _disabled = false; // 是否禁用

	    _.each(tasks, function (k, func) {
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

	        var dfd = deferred();

	        var func = funcList.shift();

	        try {
	            func(function () {
	                // 该次异步操作完毕的时候
	                var args = _.makeArray(arguments);
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
	        all(dfdList).then(function (arr) {
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

	module.exports = parallelLimit;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var _ = __webpack_require__(3);

	var waterfall = function waterfall(tasks, callback) {

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
	            args = _.makeArray(arguments);
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

	module.exports = waterfall;

	// waterfall([
	//     function (callback) {
	//         callback(null, 'one', 'two');
	//     },
	//     function (arg1, arg2, callback) {
	//         // arg1 now equals 'one' and arg2 now equals 'two'
	//         callback(null, 'three');
	//     },
	//     function (arg1, callback) {
	//         // arg1 now equals 'three'
	//         callback(null, 'done');
	//     }
	// ], function (err, result) {
	//     // result now equals 'done'
	//     console.log(result);
	// });

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var amd = __webpack_require__(15);
	var global = __webpack_require__(16);

	module.exports = function () {
	    amd();
	    global();
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	var task = __webpack_require__(2);

	module.exports = function () {
	    /* eslint-disable */
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return task;
	        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    }
	    /* eslint-enable */
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var task = __webpack_require__(2);

	module.exports = function () {
	    if (typeof window !== 'undefined') {
	        var _task = window.task;

	        window.task = task;

	        task.noConflict = function () {
	            window.task = _task;
	            return task;
	        };
	    }
	};

/***/ }
/******/ ]);