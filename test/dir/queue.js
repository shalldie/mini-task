const task = require('../../index');

let q = task.queue().dequeue();

q.will(() => {
    console.log('start');
});

for (let i = 1; i <= 100; i++) {
    q.queue(function (next, sum) {
        sum = sum || 0;
        next(i + sum);
    }).delay(10);
}
q.queue(function (next, sum) {
    console.log(sum);
    next();
});

q.will(() => {
    console.log('over');
})

