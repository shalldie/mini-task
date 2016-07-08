var task = require("./../core");

module.exports = function () {
    if (typeof window !== 'undefined') {
        var _task = window.task;

        window.task = task;

        task.noConflict = function () {
            window.task = _task;
            return task;
        };
    }
}