let task = require('../../dist/task');

let cb = task.callbacks('once memory');

cb.add(name => {
    console.log(`name 是:${name}`);
});

cb.add(name => {
    console.log(`name2 是:${name}`);
});

cb.fire('tom');

cb.fire('lily');


cb.add(name => {
    console.log(`name3 是:${name}`);
});