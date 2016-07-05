var task = require('./src/task');

// var dfd1 = task.deferred();

// var dfd2 = task.deferred();

// dfd1.resolve(1);

// dfd2.resolve(2, 3);

// task.all([dfd1, dfd2]).then(function () {
//     console.log([].slice.call(arguments));
// });

function log() {
    console.log(+new Date);
}

log();
task.waterfall([
    function (cb) {
        setTimeout(function () {
            cb(1);
        }, 10);
    }, function (cb, n) {
        setTimeout(function () {
            cb(n + 1);
        }, 10);
    }, function (cb, n) {
        setTimeout(function () {
            cb(n + 1);
        }, 10);
    }, function (cb, n) {
        setTimeout(function () {
            cb(n + 1);
        }, 10);
    }
], function (err, result) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(result);
    log();
});
