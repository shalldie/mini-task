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
	 * 基础回调模块
	 */
	task.callbacks = __webpack_require__(3);

	// // 低版本浏览器扩展
	// require('./extensions');

	// // 工具模块
	// require('./tool');

	// // 基础回调模块
	// require('./callbacks');

	// // 基础异步模块
	// require('./queue');

	// require('./deferred');

	// require('./all');

	// // 异步async模块
	// require('./async/async')();

	// // 适配 amd 模式， window 环境
	// require('./exports/exports')();

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
	    memory = ~_args.indexOf('memory') ? [] : null; // memory - 保持状态

	    function add(cb) {
	        if (memory && fireState == 2) {
	            //如果是memory模式，并且已经触发过
	            cb.apply(null, memory);
	        }

	        if (disabled()) return this; // 如果被disabled

	        list.push(cb);
	        return this;
	    }

	    function fire() {
	        if (disabled()) return this; // 如果被禁用

	        if (memory) {
	            // 如果是memory模式，保存参数
	            memory = this.makeArray(arguments);
	        }

	        fireState = 1;
	        for (var i = 0, len = list.length; i < len; i++) {
	            if (list[i].apply(null, arguments) === false && stopOnFalse) {
	                // 如果false停止
	                break;
	            }
	        }
	        fireState = 2;

	        if (once) disable();

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

/***/ }
/******/ ]);