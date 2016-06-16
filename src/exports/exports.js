var amd = require('./amd');
var global = require('./global');

module.exports = function (task) {
    amd(task);
    global(task);
}