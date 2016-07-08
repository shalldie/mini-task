var task = require("./core");
var callbacks = require("./callbacks");

task.deferred = function () {
    var tuples = [   // 用于存放一系列回调的 tuple 结构
        // 方法名 - 接口名称 - 回调列表 - 最终状态
        ['resolve', 'then', task.callbacks('once memory'), 'resolved'],
        ['reject', 'catch', task.callbacks('once memory'), 'rejected']
    ];

    var _state = 'pending';    // 当前状态

    var dfd = {                // 返回的延迟对象
        state: function () {
            return _state;
        },      // 状态
        promise: function () { // promise - 仅提供接口用于注册/订阅
            var self = this;
            var pro = {
                state: function () {
                    return _state;
                }
            };
            task.each(tuples, function (i, tuple) {
                pro[tuple[1]] = self[tuple[1]];
            });
            return pro;
        }
    };

    task.each(tuples, function (i, tuple) {
        dfd[tuple[0]] = function () {       // 触发
            if (_state != "pending") return;
            tuple[2].fire.apply(tuple[2], task.makeArray(arguments));
            _state = tuple[3];
            return this;
        };
        dfd[tuple[1]] = function (cb) {     // 绑定
            tuple[2].add(cb);
            return this;
        };
    });

    return dfd;
};

module.exports = task.deferred;