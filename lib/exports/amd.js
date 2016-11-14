let task = require('./../core');

module.exports = function () {
    /* eslint-disable */
    if (typeof define === "function" && define.amd) {
        define("task", [], function () {
            return task;
        });
    }
    /* eslint-enable */
}