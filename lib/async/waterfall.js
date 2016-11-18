let _ = require('./../tool');

let waterfall = function (tasks, callback) {

    let args = [];  // 最后一次的参数
    let _disabled = false; // 是否禁用

    function disable() {
        _disabled = true;
    }

    function disabled() {
        return _disabled;
    }

    (function invokeNext() {  // 递归依次取出函数执行
        if (disabled()) {
            return;
        }
        if (!tasks.length) {
            args = args.length > 1 ? args : args[0];
            callback(null, args);
            disable();
            return;
        }
        let func = tasks.shift();

        try {
            func(...args, next);

        }
        catch (err) {
            disable();
            callback(err);
            return;
        }

        function next() {
            args = _.makeArray(arguments);
            let err = args.shift();
            if (err) {
                callback(err);
                disable();
                return;
            }
            invokeNext();  //  递归进行下一次调用
        }
    })();

}

module.exports = waterfall;

// waterfall([
//     function (callback) {
//         callback(null, 'one', 'two');
//     },
//     function (arg1, arg2, callback) {
//         // arg1 now equals 'one' and arg2 now equals 'two'
//         callback(null, 'three');
//     },
//     function (arg1, callback) {
//         // arg1 now equals 'three'
//         callback(null, 'done');
//     }
// ], function (err, result) {
//     // result now equals 'done'
//     console.log(result);
// });