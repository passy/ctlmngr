define(function (require) {
    'use strict';
    var Q = require('q');

    var CTL_RE = /^https?:\/\/twitter.com\/[^\/]+\/timelines\/(\d+)$/i;

    return {
        resolveURL: function (url) {
            var deferred = Q.defer();

            var matches = url.match(CTL_RE);
            var id = (matches || [])[1];

            if (!id) {
                deferred.reject(new TypeError(
                    'Given URL is not a valid CTL: ' + url));
            } else {
                deferred.resolve(id);
            }

            return deferred.promise;
        }
    };
});
