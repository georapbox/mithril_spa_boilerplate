/**
 * Main navigation component.
 * @returns {object} The nav module.
 */
module.exports = (function (doc) {
    'use strict';

    var nav = {};

    nav.view = function () {
        return m('ul.nav.nav-tabs', [
            m('li.dashboard', [
                m('a[href="/dashboard"]', { config: m.route }, 'Dashboard'),
            ]),
            m('li.about', [
                m('a[href="/about"]', { config: m.route }, 'About')
            ]),
            m('li.contact', [
                m('a[href="/contacts"]', { config: m.route }, 'Contacts')
            ])
        ]);
    };


    return  {
		render: function () {
			m.render(doc.getElementById('js_nav'), nav.view());
		}
	};
}(document));
