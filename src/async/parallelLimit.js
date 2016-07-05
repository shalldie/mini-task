var task = require('./../core');

task.parallelLimit = function (actions, maxNum, callback) {
    var num = 0,  // 当前执行的数量
        nowIndex = 0, // 当前释放的队列
        len = actions.length,
        argsArr = new Array(len),  // 用于存储返回值
        dfd = task.deferred(),     // 用于当前操作的deferred
        queues = [],
        xxx;

    function ifDone() {  // 检测是否完成
        return num == 0 && nowIndex >= len;
    }

    var control = function () {
        // 释放队列
        for (; nowIndex < len && max - num > 0; nowIndex++) {
            num++;
            queues[nowIndex].dequeue();
        }

        // 如果完成
        if (ifDone()) {
            dfd.resolve();
        }
    };

    queues = actions.map(function (act, i) {
        var queue = task.queue();
        queue.queue(act);                       // 执行方法
        queue.queue(function (next) {           // 处理数据
            var args = task.makeArray(arguments).slice(1);
            if (args.length <= 1) args = args[0];   // 如果只有一个参数，则直接插入，用换成数组
            argsArr[i] = args;
            num--; next();
        });
        queue.catch(function (err) {
            dfd.reject(err);
        });

        queue.queue(function (next) {            // 检测，后续处理

            next();
        });
        return queue;
    });


    dfd.then(function () {
        argsArr.unshift(null);
        callback.apply(null, argsArr);
    });

    dfd.catch(function (err) {
        callback(err);
    });

};

module.exports = task.parallelLimit;