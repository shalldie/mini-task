var task = require('./src/task');

var callbacks = task.callbacks();

var fn = n => console.log(n+n);

callbacks.add(fn);

callbacks.fire(1);

callbacks.add(fn);

callbacks.fire(1);

// callbacks.disable();