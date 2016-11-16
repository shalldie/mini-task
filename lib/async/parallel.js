let parallelLimit = require('./parallelLimit');

module.export = function (tasks, callback) {
    return parallelLimit(tasks, 0, callback);
};