var task = require('./../core');

task.waterfall = function (actions, callback) {
    var queue = task.queue(),
        dfd = task.deferred();
    task.each(actions, function () {
        queue.queue(this);
    });
    queue.queue(function (next) {  // 全部执行完毕
        var args = task.makeArray(arguments).slice(1);
        args.unshift(null);
        callback.apply(null, args);
        next();
    });

    queue.catch(function (err) {
        callback(err);
    });

    queue.dequeue();
};

module.exports = task.waterfall;