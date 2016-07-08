var task = require('./../core');

task.parallel = function (actions, callback) {

    var promises = actions.map(function (act) {
        var dfd = task.deferred();
        try {
            act(function () {
                dfd.resolve.apply(dfd, arguments);
            });
        } catch (err) {
            dfd.reject(err);
        }
        return dfd.promise();
    });

    task.all(promises).then(function () {
        var args = task.makeArray(arguments);
        callback(null, args);
    }).catch(function (err) {
        callback(err);
    });
};

module.exports = task.parallel;