var fs = require('fs');

var types = require('./types'),
a = require('allong.es');
a.applyFirst = a.applyfirst; // TODO hopefully this will be patched soon

exports.stat = fs.existsSync;
exports.mkdir = fs.mkdir;
exports.read = fs.readFileSync;
exports.log = console.log;
exports.error = console.error;
exports.map = function(f, a) { return a.map(f); };
exports.extend = a.variadic(function(t, os) {
    os.forEach(function(o) {
        for (var key in o) {
            if (o.hasOwnProperty(key)) t[key] = o[key];
        }
    });
});

exports.extend(exports, a);

// overwrite allong.es's compose
exports.compose = a.variadic(function(fns) {
    return fns.reduce(function(fnFst, fnSnd) {
        return a.variadic(function(args) {
            return fnFst(fnSnd.apply(this, args));
        });
    });
});

// overwrite allong.es's maybe
exports.maybe = function(fn) {
    return a.variadic(function(args) {
        try {
            return new types.Just(fn.apply(this, args));
        }
        catch (e) {
            return new types.None(e);
        }
    });
};

exports.endResponse = function(statusCode, response) {
    response.writeHead(statusCode);
    response.end();
};

exports.two = a.applyFirst(exports.endResponse, 200);
exports.four = a.applyFirst(exports.endResponse, 400);
exports.five = a.applyFirst(exports.endResponse, 500);
