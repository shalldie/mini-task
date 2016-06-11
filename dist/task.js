;(function(){
var task = {};


if (typeof module != "undefined" && module.exports) {
    module.exports = task;
}
else {
    window["task"] = task;
}
task.callbacks = function () {

    var list = [],        // 回调数组
        fireIndex = -1,   // 当前正在回调的索引
        args = arguments, //参数


        /*
        * 'default' - 默认类型，自动依次触发
        * 'queue' - 需要手动回调 next
        */
        fireType = args[0] || 'default',     // 触发类型

        statu = 0;        // 状态   0- 等待，初始值   1- 触发阶段  2- 完成




    function add(cb) {      // 注册
        var item;
        switch (fireType) {
            case 'default':
                item = function (next) {
                    cb.apply(null, args);
                    next();
                };
                break;
            case 'queue':
                item = cb;
                break;
        }

        item && list.push(item);
    }

    function fire() {       // 触发
        if (statu || !list.length) return;

        statu = 1;
        fireIndex = 0;

        dequeue();

    }

    function dequeue() {   // 出列
        var item = list[fireIndex++],
            args = [].slice.call(arguments);

        if (!item) return;
        args.unshift(dequeue);
        item.apply(null, args);
    }

    return {
        add: add,
        fire: fire
    };
};

var utils = {
    getType: function (sender) {
        return sender === null ? (sender + '') : Object.prototype.toString.call(sender).toLowerCase().match(/\s(\S+?)\]/)[1];
    },
    each: function (sender, callback) {
        var i = 0,                      // 循环用变量
            len = sender.length,           // 长度
            arrayLike = this.arrayLike(sender); // 是否属于(类)数组

        if (arrayLike) {
            for (; i < len; i++) {
                callback.call(sender[i], i, sender[i]);
            }
        } else {
            for (i in sender) {
                callback.call(sender[i], i, sender[i]);
            }
        }
    },
    arrayLike: function (sender) {
        // duck typing ，检测是否属于数组
        return typeof sender.length == 'number' && typeof sender.splice == 'function';
    }
};
})();