let task = require('../../dist/task');

let dfd = task.deferred();

for (let i = 0; i < 10; i++) {
    dfd.then(n => console.log(n * i));
}

setTimeout(function () {
    dfd.resolve(10);
    dfd.then(() => {
        console.log('over');
    })
}, 1000);