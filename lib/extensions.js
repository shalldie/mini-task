/*
* Array.prototype.indexOf
*/

Array.prototype.indexOf = Array.prototype.indexOf || function (item) {
    var index = -1;
    for (var i = 0, len = this.length; i < len; i++) {
        if (this[i] == item) {
            index = i;
            break;
        }
    }
    return index;
};

// public
/*
*  格式化 
*/
String.prototype.format = function () {
    var args = arguments;
    return this.replace(/\{(\d+?)\}/g, function (g0, g1) {
        return args[+g1];
    });
};

/*
* Array.prototype.forEach
*/
Array.prototype.forEach = Array.prototype.forEach || function (callback) {
    callback = callback || function () { };
    for (var i = 0, len = this.length; i < len; i++) {
        callback.call(this[i], this[i], i);
    }
};

/*
* Array.prototype.some
*/

Array.prototype.some = Array.prototype.some || function (callback) {
    callback = callback || function () { return true; };
    for (var i = 0, len = this.length; i < len; i++) {
        if (callback.call(this[i], this[i], i)) return true;
    }
    return false;
}

/*
* Array.prototype.map
*/
Array.prototype.map = Array.prototype.map || function (callback) {
    callback = callback || function () { };
    var arr = [];
    for (var i = 0, len = this.length; i < len; i++) {
        arr.push(callback(this[i], i));
    }
    return arr;
};

module.exports = {};