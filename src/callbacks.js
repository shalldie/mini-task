var callbacks = function () {
    var list = [];

    function add(cb) {
        list.push(cb);
    }

    function fire() {
        for (var i = 0, len = list.length; i < len; i++) {
            list[i].apply(null, arguments);
        }
    }

    return {
        add: add,
        fire: fire
    }
};


module.exports = callbacks;

