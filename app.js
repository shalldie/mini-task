var task = require('./src/task');

// var dfd1 = task.deferred();

// var dfd2 = task.deferred();

// dfd1.resolve(1);

// dfd2.resolve(2, 3);

// task.all([dfd1, dfd2]).then(function () {
//     console.log([].slice.call(arguments));
// });


// task.waterfall([
//     function (cb) {
//         setTimeout(function () {
//             cb(1);
//         }, 10);
//     }, function (cb, n) {
//         setTimeout(function () {
//             cb(n + 1);
//         }, 10);
//     }, function (cb, n) {
//         setTimeout(function () {
//             cb(n + 1);
//         }, 10);
//     }, function (cb, n) {
//         setTimeout(function () {
//             cb(n + 1);
//         }, 10);
//     }
// ], function (err, result) {
//     if (err) {
//         console.log(err);
//         return;
//     }
//     console.log(result);
//     log();
// });

function log() {
    console.log(new Date().getSeconds());
}

task.parallelLimit([
    function (cb) {
        var n = 1;
        setTimeout(function () {
            console.log(n + "完了...")
            log();
            cb(n);
        }, 1000);
    },
    function (cb) {
        var n = 2;
        setTimeout(function () {
            console.log(n + "完了...")
            log();
            cb(n);
        }, 2000);
    },
    function (cb) {
        var n = 3;
        setTimeout(function () {
            console.log(n + "完了...")
            log();
            cb(n);
        }, 3000);
    },
    function (cb) {
        var n = 4;
        setTimeout(function () {
            console.log(n + "完了...")
            log();
            cb(n);
        }, 1000);
    },
    function (cb) {
        var n = 5;
        setTimeout(function () {
            console.log(n + "完了...")
            log();
            cb(n);
        }, 1000);
    }
], 2, function (err, result) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(result);
});