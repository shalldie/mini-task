var task = require('./core');

task.queue = function () {
    var obj = {},         // 当前实例，用于链式调用
        list = [],
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
        return obj;
    }

    function delay(num) {
        queue(function () {
            setTimeout(function () {
                next();
            }, num);
        });
        return obj;
    }

    function will(cb) {
        queue(function () {
            cb();
            next();
        })
        return obj;
    }

    function dequeue() {
        next.apply([], arguments);
        return obj;
    }

    function notify(cb) {
        callbacks.add(cb);
        return obj;
    }

    obj.queue = queue;
    obj.will = will;
    obj.delay = delay;
    obj.dequeue = dequeue;
    obj.notify = notify;
    return obj;
};

module.exports = task.queue;