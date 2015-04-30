/**
 * Contact page.
 * @returns {object} The contact module.
 */
app.pages.contact = (function () {
    'use strict';

    var contact = {
        view: function () {
            return m('div.m-page.m-page--3', [
                m('h2', 'Contact us')
            ]);
        }
    };

    return contact;
}());