var queue = function () {
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
    }

    function dequeue() {
        next.apply([], arguments);
    }

    function notify(cb) {
        callbacks.add(cb);
    }

    return {
        queue: queue,
        dequeue: dequeue,
        notify: notify
    }
};

module.exports = queue;