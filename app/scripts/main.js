'use strict';

require('bootstrap-flatly/flatly.css');

require('../styles/main.css');
require('../styles/_layout.css');
require('../styles/_animation.css');
require('../styles/_spinner.css');
require('../styles/_icons.css');

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
