var task = require('./core');

task.queue = function () {
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
        next.apply([], arguments);
        return this;
    }

    function notify(cb) {
        callbacks.add(cb);
        return this;
    }

    return {
        queue: queue,
        will: will,
        delay: delay,
        dequeue: dequeue,
        notify: notify
    };
};

module.exports = task.queue;