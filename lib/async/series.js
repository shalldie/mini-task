import _ from './../tool';

/**
 * series 模块
 * 
 * @export
 * @param {any} tasks 
 * @param {any} callback
 */
export default function (tasks, callback) {
    let ifObj = _.type(tasks) == 'object'; // tasks 参数是否object类型
    let keyList = [];   // 键列表
    let funcList = [];  // function 列表
    let resList = [];   // 结果列表

    _.each(tasks, (key, func) => {
        ifObj && keyList.push(key); // 当返回类型是object的时候，键列表需要用到
        funcList.push(func);
    });

    try {
        (function invokeNext() {       // 递归，串行执行函数，依次将结果取出来

            if (!funcList.length) { // 当全部函数执行完毕，进行回调
                if (ifObj) {
                    let hash = {};
                    for (let i = 0, len = resList.length; i < len; i++) {
                        hash[keyList[i]] = resList[i];
                    }
                    callback(null, hash);
                } else {
                    callback(null, resList);
                }
                return;
            }

            let func = funcList.shift();
            func(function () {
                let args = _.makeArray(arguments);
                args = args.length > 1 ? args : args[0];
                resList.push(args);
                invokeNext();
            });
        })();
    }
    catch (err) {  // 捕获运行中同步代码的错误
        callback(err);
    }

}
