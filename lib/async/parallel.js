let _ = require('./../tool');

let deferred = require('./../deferred');

let all = require('./../all');

let parallel = function (sender, callback) {
    let ifObj = _.type(sender) == 'object'; // 是object还是array

    let hash; // 当是 object 的时候使用该对象作为结果返回
    if (ifObj) {
        hash = {};
    }

    let dfdArr = [];  // 所有操作的 deferred 结果数组

    _.each(sender, (k, funcNext) => {  // 依次处理函数，存入proArr 
        let dfd = deferred();

        try {
            funcNext(function () {
                let args = _.makeArray(arguments);
                let err = args.shift(); // next第一个参数，表示错误
                if (err) {
                    dfd.reject(err);
                    return;
                }

                if (ifObj) {   // 当参数是object的时候，resolve不需要参数
                    hash[k] = args.length > 1 ? args : args[0];
                    dfd.resolve();
                } else {  // 当参数不是object的时候，resolve需要参数
                    dfd.resolve(...args);
                }

            });
        }
        catch (err) {
            dfd.reject(err);
            return false;
        }

        dfdArr.push(dfd);
    });

    all(dfdArr).then(arr => {
        if (ifObj) {
            callback(null, hash);
        } else {
            callback(null, arr);
        }
    }).catch(err => {
        callback(err);
    });

};

module.exports = parallel;