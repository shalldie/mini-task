import _ from './../tool';

/**
 * waterfall 模块
 * 
 * @export
 * @param {any} tasks
 * @param {any} callback
 */
export default function (tasks, callback) {

    let args = [];  // 最后一次的参数
    let _disabled = false; // 是否禁用

    /**
     * 禁用
     */
    function disable() {
        _disabled = true;
    }

    /**
     * 是否禁用
     * 
     * @returns
     */
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
