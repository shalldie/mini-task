var gutil = require('gulp-util');
var through = require('through2');

var PLUGIN_NAME = 'gulp-wrap';

module.exports = function (prepend, after) {
    return through.obj(function (file, enc, cb) {

        // 如果文件为空，不做任何操作，转入下一个操作，即下一个 .pipe()
        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        // 插件不支持对 Stream 对直接操作，跑出异常
        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }

        var bufferHeader = new Buffer(prepend);
        var bufferFooter = new Buffer(after);

        file.contents = Buffer.concat([bufferHeader, file.contents, bufferFooter]);

        // 下面这两句基本是标配啦，可以参考下 through2 的API
        this.push(file);
        cb();
    });
};