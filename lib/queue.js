let _ = require('./tool');
let callbacks = require('./callbacks');

let xqueue = function () {
    var list = [],                                         // 队列列表
        args = [],                                         // 当前参数
        fireState = 0,                                     // 触发状态  0-未触发过 1-触发中  2-触发完毕
        _disable = false,
        catchArr = callbacks('once memory');          // 错误的回调

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
        args = _.makeArray(arguments);
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

module.exports = queue;

let queue = function () {
    let list = [],                   // 回调列表
        _disable = false,            // 是否禁用
        state = 0,                   // 当前状态

        catchArr = callbacks('once memory');      // 错误的回调对象
};