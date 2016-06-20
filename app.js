var task = require('./src/task');

var q = task.queue();

var k = 0;

// var q = Queue();

q.notify(function () {
    console.log('over...');
})

for (var i = 0; i < 5; i++) {
    // q.will(function () {
    //     console.log(new Date().getSeconds());
    // }).delay(1000);
    q.queue(function (next) {
        console.log(k++);
        setTimeout(function () {
            next();
        }, 1000);
    }).will(function () {
        console.log(k++);
    }).delay(1000);
}

q.dequeue();