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


// var cb = task.callbacks('once memory');

// cb.add(() => console.log(1));

// cb.add(() => console.log(2));

// cb.fire();

task.series({
    name: function () {

    },
    age: function () {

    }
})