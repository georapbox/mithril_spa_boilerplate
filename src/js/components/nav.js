/**
 * Main navigation component.
 * @returns {object} The nav module.
 */
module.exports = (function (doc) {
    'use strict';

    var nav = {};

    nav.view = function () {
        return m('nav', [
            m('ul.nav', [
                m('li.nav__item', [
                    m('a[href="/dashboard"].nav__item__link.dashboard', { config: m.route }, 'Dashboard'),
                ]),
                m('li.nav__item', [
                    m('a[href="/about"].nav__item__link.about', { config: m.route }, 'About')
                ]),
                m('li.nav__item', [
                    m('a[href="/contact"].nav__item__link.contact', { config: m.route }, 'Contact')
                ])
            ])
        ]);
    };

    m.render(doc.getElementById('js_nav'), nav.view());
    return nav;
}(document));