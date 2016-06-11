var task = require('./dist/task.min');

var cb = task.callbacks('queue');

cb.add(function (next) {
    console.log(new Date().getSeconds());
    setTimeout(function () {
        next(1, 2, 3);
    }, 1000);
});

cb.add(function (next) {
    console.log(new Date().getSeconds());
    console.log(arguments);
    next();
});

cb.fire();