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

