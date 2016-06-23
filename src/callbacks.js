var task = require('./core');
task.callbacks = function (options) {
    var list = [],
        _args = (options || '').split(' '),    // 参数数组
        fireState:0,                            // 触发状态  0-未触发过 1-触发中  2-触发完毕
        stopOnFalse=~_args.indexOf('stopOnFalse'), // 如果返回false就停止
        once = ~_args.indexOf('once'),         // 只执行一次，即执行完毕就清空
        memory = ~_args.indexOf('memory');     // 保持状态

    function add(cb) {
        if(!list) return this;

        if(fireState==2&&memory){   // 如果触发完毕，且是memory状态

        }

        list.push(cb);
        return this;
    }

    function fire() {
        if(!list) return this;

        fireState=1;
        memory=[].slice.call(arguments);
        for (var i = 0, len = list.length; i < len; i++) {
            if(list[i].apply(null, arguments)===false&&stopOnFalse){  // 如果false停止
                break;
            }
        }
        fireState=2;
        return this;
    }

    function disable(){
        list=undefined;
    }

    return {
        add: add,
        fire: fire
    }
};


module.exports = task.callbacks;

