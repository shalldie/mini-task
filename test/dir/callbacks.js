let task = require('../../dist/task');

let cb = task.callbacks();

cb.add(name => {
    console.log(`name 是:${name}`);
});

