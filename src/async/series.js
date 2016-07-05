var task = require('./../core');

task.series = function (sender, cb) {
    var ifArr = task.type(sender) === "array";

    var queueArr = [];  // 用于存放队列的数组

    var argsArr = [];      // 参数数组

    var queue = task.queue(); // 队列

    task.each(sender, function (k, func) {
        queueArr.push(func);
    });

    var func = function (next) {
        var args = task.makeArray(arguments);
        args.shift();  // 去除第一个next，以便获取参数
        if (args.length <= 1) {
            argsArr.push(args[0]);
        } else {
            argsArr.push(args);
        }
        next();
    };

    task.each(queueArr, function (i, item) {  // 队列方法，交叉放入队列
        queue.queue(item).queue(func);
    });


    queue.queue(function (next) {        // 所有操作正常完成
        if (ifArr) {                // 如果参数是数组
            cb(null, argsArr);
        } else {
            var obj = {}, i = 0;
            task.each(sender, function (k) {
                obj[k] = argsArr[i++];
            });
            cb(null, obj);
        }
        next();
    }).catch(function (err) {        // 某个操作出现异常
        cb(err);
    });

    queue.dequeue();

};

module.exports = task.series;