let _ = require('./../tool');

let deferred = require('./../deferred');

let all = require('./../all');

let parallelLimit = function (tasks, limit, callback) {
    if (limit > 10000 || !limit) {  // 默认最大并非量是1w
        limit = 10000;
    }

    let ifObj = _.type(tasks) == 'object'; // 是object还是array
    let aliveNum = 0;  // 当前异步执行的数量
    let keyList = [];  // 键的列表
    let funcList = []; // 异步函数的列表
    let dfdList = [];  // 所有操作的 deferred 列表
    let _disabled = false; // 是否禁用

    _.each(tasks, (k, func) => {   // 键值对分离
        ifObj && keyList.push(k);  // 在参数是object的时候，需要用到键
        funcList.push(func);
    });

    /**
     * 禁用当前并行操作
     */
    function disable() {
        _disabled = true;
    }

    /**
     * 获取当前并行操作是否被禁用
     * 
     * @returns boolean
     */
    function disabled() {
        return _disabled;
    }

    /**
     * 限量执行队列
     */
    function invokeLimit() {
        while (!disabled() && aliveNum < limit) { // 当并发量未达到上限，向队列中添加下一个异步操作
            invokeNext();
        }
    }

    invokeLimit();

    /**
     * 添加新的异步操作
     */
    function invokeNext() {
        if (!funcList.length) {  // 如果已经全部出列完毕，停止
            invokeCallback();
            return;
        }

        aliveNum++;

        let dfd = deferred();

        let func = funcList.shift();

        try {
            func(function () {  // 该次异步操作完毕的时候
                let args = _.makeArray(arguments);
                let err = args.shift();
                if (err) {
                    invokeCallback();
                    return;
                }

                args = args.length > 1 ? args : args[0];
                dfd.resolve(args);

                aliveNum--;
                invokeLimit();
            });
        }
        catch (err) {
            dfd.reject(err);
            invokeCallback();
            return;
        }

        dfdList.push(dfd);
    }

    /**
     * 在全部操作完毕的时候，执行回调
     */
    function invokeCallback() {
        disable();
        all(dfdList)
            .then(function (arr) {
                if (ifObj) {
                    let hash = {};
                    for (let i = 0, len = arr.length; i < len; i++) {
                        hash[keyList[i]] = arr[i];
                    }
                    callback(null, hash);
                } else {
                    callback(null, arr);
                }
            }).catch(function (err) {
                callback(err);
            });
    }

};

module.exports = parallelLimit;