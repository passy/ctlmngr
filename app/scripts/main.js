'use strict';


require('style!css!bootstrap-flatly/flatly.css');

require('style!css!../styles/main.css');
require('style!css!../styles/_layout.css');
require('style!css!../styles/_animation.css');
require('style!css!../styles/_spinner.css');
require('style!css!../styles/_icons.css');

require(['lodash', 'underscore.string'], function (_, _s) {
    _.string = _s;
});

require(['q'], function (Q) {
    // While debugging ...
    Q.longStackSupport = true;
});

require(['./bootstrap'], function (bootstrap) {
    bootstrap(document.querySelector('.js-cm-app'));
});
