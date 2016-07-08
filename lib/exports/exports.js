var amd = require('./amd');
var global = require('./global');

module.exports = function () {
    amd();
    global();
}