(function (doc) {
    'use strict';

    var nav = {
        view: function () {
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
        }
    };

    m.render(doc.getElementById('js_nav'), nav.view());
}(document));