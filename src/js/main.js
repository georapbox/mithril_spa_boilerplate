(function (win) {
    'use strict';

    win.m = require('./lib/mithril');

    win.app = window.app || {
        utils: {
            dom: require('./utils/dom'),
            objects: require('./utils/objects'),
            animator: require('./utils/animator')
        },
		components: {
			Modal: require('./components/modal')
		}
    };

    var router = require('./router');
    router.init({
        dashboard: require('./components/pages/dashboard'),
        userprofile: require('./components/pages/userprofile'),
        about: require('./components/pages/about'),
        contacts: require('./components/pages/contacts')
    });

	win.app.components.nav = require('./components/nav');
}(window));