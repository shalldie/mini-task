var task = require('./src/task');

// var dfd1 = task.deferred();

// var dfd2 = task.deferred();

// dfd1.resolve(1);

// dfd2.resolve(2, 3);

// task.all([dfd1, dfd2]).then(function () {
//     console.log([].slice.call(arguments));
// });

function log() {
    console.log(new Date().getSeconds());
}
log();
task.parallel([
    function (cb) {
        setTimeout(function () {
            cb(1);
        }, 1000);
    }, function (cb) {
        setTimeout(function () {
            cb(2, 3);
        }, 2000);
    }, function (cb) {
        throw Error("error...");
        setTimeout(function () {
            cb(2, 3);
        }, 2000);
    }, function (cb) {
        setTimeout(function () {
            cb(2, 3);
        }, 3000);
    }
], function (err, results) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(results);
    log();
});

