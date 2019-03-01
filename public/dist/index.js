var required_in_node = typeof window === 'undefined';
if (required_in_node) {
    eval('var XMLHttpRequest= require("xmlhttprequest").XMLHttpRequest');
    var Promise = eval('require("bluebird")');
}
function makeXhr(method, endpoint, payload, additional_headers) {
    return new Promise(function (resolve, reject) {
        _makeXhr(method, endpoint, payload, function (err, resp) {
            return err ? reject(err) : resolve(resp);
        }, additional_headers);
    });
}
function _makeXhr(method, endpoint, payload, callback, additional_headers) {
    if (typeof payload === 'function') {
        callback = payload;
        payload = undefined;
    }
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var resp = xhr.responseText;
        try {
            resp = JSON.parse(resp);
        }
        catch (e) {
            console.info('Response type is not JSON.');
        }
        callback(null, { response: resp, xhr: xhr });
    };
    xhr.onerror = function (err) {
        return callback(err, null);
    };
    xhr.open(method, endpoint, true);
    if (additional_headers) {
        for (var header in additional_headers) {
            xhr.setRequestHeader(header, additional_headers[header]);
            if (header.toLowerCase() === 'content-type' && additional_headers[header].toLowerCase() === 'application/json') {
                payload = JSON.stringify(payload);
            }
        }
    }
    xhr.send(payload);
}
var Http = /** @class */ (function () {
    function Http() {
    }
    Http.prototype.setArgs = function (opts) {
        this.method = opts.method;
        this.endpoint = opts.endpoint;
        this.payload = opts.payload || null;
        this.additional_headers = opts.additional_headers || [];
    };
    Http.prototype.request = function (options) {
        this.setArgs(options);
        return makeXhr(this.method, this.endpoint, this.payload, this.additional_headers);
    };
    Http.prototype.get = function (options) {
        options.method = 'GET';
        return this.request(options);
    };
    Http.prototype.post = function (options) {
        options.method = 'POST';
        return this.request(options);
    };
    Http.prototype.put = function (options) {
        options.method = 'PUT';
        return this.request(options);
    };
    Http.prototype.options = function (options) {
        options.method = 'OPTIONS';
        return this.request(options);
    };
    Http.prototype["delete"] = function (options) {
        options.method = 'DELETE';
        return this.request(options);
    };
    Http.prototype.head = function (options) {
        options.method = 'HEAD';
        return this.request(options);
    };
    Http.prototype.connect = function (options) {
        options.method = 'CONNECT';
        return this.request(options);
    };
    Http.prototype.patch = function (options) {
        options.method = 'PATCH';
        return this.request(options);
    };
    return Http;
}());
if (required_in_node) {
    eval('module.exports = Http');
}