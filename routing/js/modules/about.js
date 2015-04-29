/**
 * About page.
 * @returns {object} The about module.
 */
app.pages.about = (function () {
    'use strict';

    var about = {
        controller: function () {
            this.onunload = function () {
                console.log('Unload about page');
            };
        },
        view: function () {
            return m('div.m-page.m-page--2.slide-rtl', [
                m('h2', 'About page')
            ]);
        }
    };

    return about;
}());