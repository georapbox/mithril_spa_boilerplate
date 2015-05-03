(function (win) {
    'use strict';

    win.m = require('./lib/mithril');

    win.app = window.app || {
        utils: {
            dom: require('./utils/dom'),
            objects: require('./utils/objects'),
            animator: require('./utils/animator')
        }
    };

    var router = require('./router'),
        nav = require('./components/nav');

    router.init({
        dashboard: require('./components/pages/dashboard'),
        userprofile: require('./components/pages/userprofile'),
        about: require('./components/pages/about'),
        contact: require('./components/pages/contact')
    });
}(window));