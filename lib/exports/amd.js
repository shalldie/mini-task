var task = require('./../core');

module.exports = function () {
    if (typeof define === "function" && define.amd) {
        define("task", [], function () {
            return task;
        });
    }
}