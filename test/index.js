// let testArr = [
//     // 'callbacks',
//     // 'deferred',
//     // 'all',
//     // 'queue',
//     'series',
//     // 'parallel',
//     // 'parallelLimit',
//     // 'waterfall'
// ];

// /**
//  * test task
//  */
// let task = require('./../index');

// // callbacks

// function testCallbacks() {

//     console.log('------------------------callbacks');
//     let cb = task.callbacks();

//     cb.add(n => console.log(n));
//     cb.add(n => console.log(n + n));

//     cb.fire(1);


//     console.log('------------------------callbacks-memory');
//     cb = task.callbacks('memory');

//     cb.add(n => console.log(n));

//     cb.fire(1);

//     cb.add(n => console.log(n + n));


//     console.log('------------------------callbacks-stopOnFalse');
//     cb = task.callbacks('stopOnFalse');

//     cb.add(n => (console.log(n), false));

//     cb.add(n => console.log(n + n));

//     cb.fire(1);


//     console.log('------------------------callbacks-once');
//     cb = task.callbacks('once');

//     cb.add(n => (console.log(n), false));

//     cb.add(n => console.log(n + n));

//     cb.fire(1);
//     cb.fire(2);

//     console.log('------------------------callbacks-once-memory');
//     cb = task.callbacks('once memory');

//     cb.add(n => (console.log(n), false));

//     cb.add(n => console.log(n + n));

//     cb.fire(1);
//     cb.fire(2);

//     cb.add(n => console.log(n * 3));
// }

// ~testArr.indexOf('callbacks') && testCallbacks();

// /**
//  * deferred
//  */

// function testDeferred() {
//     console.log('------------ deferred');
//     let dfd = task.deferred();
//     console.log(dfd.state());
//     dfd.then((n, m) => console.log(n + m));
//     dfd.resolve(1, 2);
//     console.log(dfd.state());
//     dfd.then((n, m) => console.log(n * m));
//     dfd.catch(n => console.log(n));
//     dfd.resolve(2, 3);
//     console.log(dfd.state());
//     // dfd.reject('error');
// }

// ~testArr.indexOf('deferred') && testDeferred();

// /**
//  * all
//  */

// function testAll() {
//     console.log('-------------- all');
//     let d1 = task.deferred();
//     setTimeout(function () {
//         d1.resolve(Date.now());
//     }, 3000);

//     let d2 = task.deferred();
//     setTimeout(function () {
//         d2.resolve(Date.now());
//     }, 2000);

//     let d3 = task.deferred();
//     setTimeout(function () {
//         d3.resolve('err');
//     }, 1500);

//     task.all([d1.promise(), d2.promise(), d3.promise()]).then(function (arr) {
//         console.log(arr);
//         // console.log(arr[1] - arr[0]);
//     }).catch(function (err) {
//         console.log(err);
//     });
// }

// ~testArr.indexOf('all') && testAll();

// /**
//  * queue
//  */

// function testQueue() {
//     console.log('-------------------- queue');

//     let queue = task.queue().dequeue(2, 3);

//     // for (let i = 0; i < 10; i++) {
//     //     queue.delay(1000).will(() => console.log(new Date().getSeconds()));
//     // }

//     // queue.queue(function (next, num, num2) {
//     //     console.log(num, num2);
//     //     next(2, 4);
//     // });

//     // setTimeout(function () {
//     //     queue.queue(function (next, num, num2) {
//     //         console.log(num, num2);
//     //         next();
//     //     });
//     // }, 1000);

//     for (let i = 0; i < 10; i++) {
//         queue.will(() => console.log(new Date().getSeconds())).delay(1000);
//     }
// }

// ~testArr.indexOf('queue') && testQueue();

// /**
//  * series
//  */

// function testSeries() {
//     console.log('-----------------------series');
//     console.log(new Date().getSeconds());
//     task.series({
//         age: function (next) {
//             setTimeout(function () {
//                 next(null, 12);
//             }, 1000);
//         },
//         name: function (next) {
//             setTimeout(function () {
//                 next(null, 'tom', 'lily');
//             }, 2000);
//         }
//     }, function (err, result) {
//         console.log(new Date().getSeconds());
//         console.log(result);
//     });

//     // task.series([
//     //     function (next) {
//     //         setTimeout(function () {
//     //             next(12, 13);
//     //         }, 1000);
//     //     },
//     //     function (next) {
//     //         setTimeout(function () {
//     //             next('tom', 'hello');
//     //         }, 2000);
//     //     }
//     // ], function (err, result) {
//     //     console.log(new Date().getSeconds());
//     //     console.log(result);
//     // });
// }

// ~testArr.indexOf('series') && testSeries();

// function testParallelLimit() {
//     console.log(new Date().getSeconds());
//     task.parallelLimit([
//         function (next) {
//             setTimeout(function () {
//                 next(null, 1);
//             }, 1000);
//         },
//         function (next) {
//             setTimeout(function () {
//                 next(null, 2);
//             }, 1000);
//         },
//         function (next) {
//             setTimeout(function () {
//                 next(null, 3, 3);
//             }, 1000);
//         },
//         function (next) {
//             setTimeout(function () {
//                 next(null, 4);
//             }, 3000);
//         }
//     ], 4, function (err, result) {
//         console.log(new Date().getSeconds());
//         console.log(result);
//     });
// }

// ~testArr.indexOf('parallelLimit') && testParallelLimit();

// function testWaterFall() {
//     console.log(new Date().getSeconds());
//     task.waterfall([
//         function (next) {
//             setTimeout(function () {
//                 next(null, 1, 2);
//             }, 1000);
//         },
//         function (arg1, arg2, next) {
//             // throw Error('haha,error!');
//             setTimeout(function () {
//                 next('just error~', arg1 + arg2, 3, 4);
//             }, 1000);
//         },
//         function (arg1, arg2, arg3, next) {
//             setTimeout(function () {
//                 next('error', arg1 + arg2 + arg3, 4)
//             }, 1000);
//         }
//     ], function (err, result) {
//         console.log('time:' + new Date().getSeconds());
//         if (err) {
//             console.log('err:' + err)
//             return;
//         }
//         console.log(result);
//     });
// }

// ~testArr.indexOf('waterfall') && testWaterFall();

let arr = [
    './dir/callbacks',
    './dir/deferred',
    './dir/queue'
];

let index = 2;

require(arr[index]);