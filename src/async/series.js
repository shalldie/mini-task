var task = require('./../core');

task.series = function (sender, cb) {
    var ifArr = task.type(sender) === "array";
    
    var queueArr=[];  // 用于存放队列的数组

    var argsArr=[];      // 参数数组

    var queue=task.queue(); // 队列

    task.each(sender,function(k,func){
        queueArr.push(func);
    });

    var func=function(next){
        var args=task.makeArray(arguments);
        args.shift();  // 去除第一个next，以便获取参数
        if(args.length<=1){
            argsArr.push(args[0]);
        }else{
            argsArr.push(args);
        }
        next();
    };

    for(var i=0,len=queueArr.length;i<len;i++){    // 队列方法，交叉放入队列
        queue.queue(queueArr[i]);
        queue.queue(func);
    }
    


    // var result = ifObj ? {} : [];
    // task.each(sender, function (k, func) {
    //     try {
    //         ifObj ? (result[k] = func()) : (result.push(func()));
    //     }
    //     catch (ex) {
    //         cb(ex, result);
    //         return false;
    //     }
    // });
};

module.exports = task.series;