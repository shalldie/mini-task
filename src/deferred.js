var task = require("./core");

task.deferred = function () {
    var thenCallbacks = require('./callbacks')(),
        failCallbacks = require('./callbacks')();


    function then() {
        thenCallbacks.add(arguments[0]);
    }

    function resolve() {
        thenCallbacks.fire.apply(callbacks, arguments);
    }

    function fail() {
        failCallbacks.add(arguments[0]);
    }

    function reject() {
        failCallbacks.fire.apply(callbacks, arguments);
    }

    return {
        then: then,
        resolve: resolve,
        reject: reject,
        catch: fail,
        promise: function () {
            return {
                then: then,
                catch: fail
            }
        }
    }
};

module.exports = task.deferred;