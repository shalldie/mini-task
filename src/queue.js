var queue = function () {
    var callbacks = [],
        args = [],
        nowIndex = -1,
        notify = function () { };

    function next() {
        nowIndex++;
        if (nowIndex >= callbacks.length) {
            notify();
            return;
        }

        args = [].slice.call(arguments);
        callbacks[nowIndex]();
    }

    function add(cb) {
        callbacks.push(function () {
            args.unshift(next);
            cb.apply(null, args);
        });
    }

    function fire() {
        next.apply([], arguments);
    }

    return {
        add: add,
        fire: fire,
        notify: function () {
            notify = arguments[0] || function () { };
        }
    }
};

module.exports = queue;