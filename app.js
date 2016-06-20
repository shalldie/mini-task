var task = require('./src/task');

var q = task.queue();

// var q = Queue();

q.notify(function () {
    console.log('over...');
})

for (var i = 0; i < 10; i++) {
    q.queue(function (next) {
        console.log(new Date().getSeconds());

        setTimeout(function () {
            next();
        }, 1000);
    });
}

q.dequeue();