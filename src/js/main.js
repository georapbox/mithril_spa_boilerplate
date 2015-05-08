(function (win, doc) {
    'use strict';

    win.m = require('./lib/mithril');
    win.app = win.app || {};

	var attachFastClick = require('./lib/fastclick');
	attachFastClick(doc.body);

    var router = require('./router');
    router.init({
        dashboard: require('./components/pages/dashboard'),
        userprofile: require('./components/pages/userprofile'),
        about: require('./components/pages/about'),
        contacts: require('./components/pages/contacts')
    });

	var nav = require('./components/nav');
	nav.render();
}(window, document));