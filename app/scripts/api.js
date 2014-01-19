define(function (require) {
    'use strict';

    var Q = require('q');
    var READY_STATE_DONE = 4;

    var Client = function (baseUrl) {
        this.baseUrl = baseUrl;
    };

    Client.prototype.xhr = function (options) {
        var deferred = Q.defer();
        var xhr = new XMLHttpRequest();

        xhr.open(options.method, options.url, true);

        Object.keys(options.headers || {}).forEach(function (key) {
            xhr.setRequestHeader(key, options.headers[key]);
        });

        xhr.onreadystatechange = function (e) {
            if (xhr.readyState !== READY_STATE_DONE) {
                return;
            }

            if ([200, 304].indexOf(xhr.status) === -1) {
                var err = new Error('Server responded with status ' + xhr.status);
                err.status = xhr.status;
                err.xhr = xhr;

                deferred.reject(err);
            } else {
                deferred.resolve(e.target.result);
            }
        };

        xhr.send(options.data);

        return deferred.promise;
    };

    Client.prototype.request = function (url, method) {
        return this.xhr({
            url: this.baseUrl + url,
            method: method || 'GET'
        });
    };

    Client.prototype.getSession = function () {
        return this.request('/');
    };

    return Client;
});
