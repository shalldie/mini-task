/**
 * 工具模块
 */
export default {
    /**
     * 获取参数类型
     * 
     * @param {any} sender
     * @returns
     */
    type: function (sender) {
        // sender+'' 压缩之后，比'null' 长度要少...
        return sender === null ? (sender + '') : Object.prototype.toString.call(sender).toLowerCase().match(/\s(\S+?)\]/)[1];
    },
    /**
     * 遍历(伪)数组，或对象
     * 
     * @param {any} sender
     * @param {any} callback
     */
    each: function (sender, callback) {
        let i = 0,                      // 循环用变量
            len = sender.length,           // 长度
            arrayLike = this.arrayLike(sender), // 是否属于(类)数组
            result;        // 回调的结果

        if (arrayLike) {
            for (; i < len; i++) {
                result = callback.call(sender[i], i, sender[i]);
                // true 的时候continue 省略
                if (result === false) break;
            }
        } else {
            for (i in sender) {
                result = callback.call(sender[i], i, sender[i]);
                // true 的时候continue 省略
                if (result === false) break;
            }
        }
    },
    /**
     * 检测是否属于(伪)数组
     * 
     * @param {any} sender
     * @returns {string}
     */
    arrayLike: function (sender) {
        // duck typing ，检测是否属于数组
        return this.type(sender.length) == 'number' && this.type(sender.splice) == 'function';
    },
    /**
     * 将一个(伪)数组转换成一个数组
     * 
     * @param {any} sender
     * @returns {Array}
     */
    makeArray: function (sender) {
        try {
            return [].slice.call(sender);
        }
        catch (ex) {
            let arr = [],
                i = 0,
                len = sender.length;
            for (; i < len; i++) {
                arr.push(sender[i]);
            }
            return arr;
        }
    },
    /**
     * 浅拷贝
     * 
     * @returns first args
     */
    extend: function () {
        let args = this.makeArray(arguments);
        let base = args.shift();
        for (let i = 0, len = args.length; i < len; i++) {
            this.each(args[i], (k, v) => {
                base[k] = v;
            });
        }
        return base;
    }
};