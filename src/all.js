var task = require('./core');

task.all = function (promises) {
    promises = promises || [];
    var len = promises.length,    // promise 个数
        paramArr = [],            // 每个reject的参数
        dfd = task.deferred(),    // 用于当前task控制的deferred
        pro = dfd.promise();      // 用于当前返回的promise

    if (len === 0) {   // 如果是个空数组，直接就返回了
        dfd.resolve();
        return pro;
    }

    function addThen() {   // 检测是否全部完成
        var args = task.makeArray(arguments);

        if (args.length <= 1) {             // 保存到数组，用户回调
            paramArr.push(args[0]);
        } else {
            paramArr.push(args);
        }

        if (paramArr.length >= len) {         // 如果所有promise都resolve完毕
            dfd.resolve.apply(dfd, paramArr);
        }
    }

    function addCatch() {
        var args = task.makeArray(arguments);
        dfd.reject.apply(dfd, args);
    }

    task.each(promises, function (index, promise) {
        promise.then(addThen).catch(addCatch);
    });

    return pro;
};

module.exports = task.all; 