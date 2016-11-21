let _ = require('./tool');
let callbacks = require('./callbacks');

let queue = function () {
    let list = [],                   // 回调列表
        _disable = false,            // 是否禁用
        state = 0,                   // 当前状态  0-未触发过 1-触发中  2-触发完毕
        args = [],                   // 最后一次触发时候的参数
        catchArr = callbacks('once memory');      // 错误的回调对象

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

        if (list.length == 1 && state == 2) { // 如果之前已经执行完毕，再次添加队列会自动执行，memory模式
            next(...args);
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
        next(...args);
        return this;
    }

    /**
     * 出列回调
     * 
     * @returns
     */
    function next() {
        state = 1; // 执行中

        if (disabled()) {  // 如果不可用 
            return this;
        }

        args = _.makeArray(arguments); // 处理参数

        if (!list.length) { // 出列完全
            state = 2;
            return this;
        }


        let nextArgs = [next, ...args];

        let cb = list.shift();  // 执行回调
        try {
            _.type(cb) == 'function' && cb(...nextArgs);
        }
        catch (err) {
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
        return this.queue(next => {
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
        return this.queue(next => {
            setTimeout(next, milliseconds);
        });
    }

    return {
        disable,
        disabled,
        queue,
        dequeue,
        getState,
        will,
        delay
    };

};

module.exports = queue;
