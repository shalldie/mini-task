var task = require('./core');
task.callbacks = function (options) {
    var list = [],
        argsArr = (options || '').split(' '),
        once = ~argsArr.indexOf('once'),         // 只执行一次，即执行完毕就清空
        memory = ~argsArr.indexOf('memory');     // 保持状态，

    function add(cb) {
        list.push(cb);
        return this;
    }

    function fire() {
        for (var i = 0, len = list.length; i < len; i++) {
            list[i].apply(null, arguments);
        }
        return this;
    }

    return {
        add: add,
        fire: fire
    }
};


module.exports = task.callbacks;

