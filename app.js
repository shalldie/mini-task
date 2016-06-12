var task = require('./dist/task');

var cb = task.callbacks('queue');

cb.add(function (next) {
    console.log(arguments);
    setTimeout(function () {
        next(12, 'tom');
    },1000)
});

cb.add(function (next) {
    console.log(arguments);
    next();
});

cb.fire('tom', 12);