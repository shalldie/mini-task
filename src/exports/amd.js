module.exports = function (task) {
    if (typeof define === "function" && define.amd) {
        define("task", [], function () {
            return task;
        });
    }
}