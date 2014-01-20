define(function (require) {
    'use strict';

    var Q = require('q');
    var Config = require('json!config.json');
    var _ = require('lodash');

    var READY_STATE_DONE = 4;
    var client;

    var Client = function (baseUrl) {
        this.baseUrl = baseUrl;
    };

    Client.getDefaultInstance = function () {
        if (!client) {
            client = new Client(Config.API_BASE);
        }

        return client;
    };

    Client.prototype.xhr = function (options) {
        var deferred = Q.defer();
        var xhr = new XMLHttpRequest();
        var params = '';

        xhr.withCredentials = !!options.withCredentials;

        if (options.params) {
            // Very simplistic, but should work for our limited use cases.
            params = '?' + Object.keys(options.params || {}).map(function (key) {
                return _.string.underscored(key) + '=' +
                    encodeURIComponent(options.params[key]);
            }).join('&');
        }

        xhr.open(options.method, options.url + params, true);

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
                deferred.resolve(e.target);
            }
        };

        xhr.send(options.data);

        return deferred.promise;
    };

    Client.prototype.request = function (url, method, options) {
        return this.xhr(_.extend({
            url: this.baseUrl + url,
            method: method || 'GET',
            withCredentials: true
        }, options)).then(function (xhr) {
            try {
                return JSON.parse(xhr.response);
            } catch (e) {
                console.warn('Unexpected non-JSON response: ', xhr.response);
                return xhr.response;
            }
        });
    };

    Client.prototype.login = function () {
        document.location.href = this.baseUrl + '/login?next=' +
            encodeURIComponent(document.location.href);
    };

    Client.prototype.logout = function () {
        return this.request('/logout', 'POST');
    };

    Client.prototype.getSession = function () {
        return this.request('/');
    };

    Client.prototype.getCTLs = function (params) {
        return this.request('/1.1/beta/timelines/custom/list.json', 'GET', {
            params: params
        });
    };

    return Client;
});
