var task = require('./src/task');

// var dfd = task.deferred();


// dfd.then(function () {
//     console.log(1);
// }).then(function () {
//     console.log(2);
// });

// console.log('ready');

// dfd.resolve();

// dfd.then(function () {
//     console.log(3);
// }).then(() => console.log(4));

// var pro = dfd.promise();

// pro.then(() => console.log(5))
//     .then(() => console.log(6));

// console.log(dfd.state(), pro.state());


// var cb = task.callbacks('once memory');

// cb.add(() => console.log(1));

// cb.add(() => console.log(2));

// cb.fire();

task.series({
    name: function (next) {
        setTimeout(function () {
            next('tom');
        }, 100);
    },
    age: function (next) {
        // throw Error('sth error');
        setTimeout(function () {
            next(12);
        }, 100);
    }
}, function (err, result) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(result);
});

task.series([
    function (next) {
        setTimeout(function () {
            next('tom');
        }, 100);
    },
    function (next) {
        // throw Error('sth error');
        setTimeout(function () {
            next(12);
        }, 100);
    }
], function (err, result) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(result);
})