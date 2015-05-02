/**
 * About page.
 * @returns {object} The about module.
 */
module.exports = (function () {
    'use strict';

    var about = {
        controller: function () {
            this.onunload = function () {
                console.log('Unload about page');
            };
        },
        view: function () {
            return m('div.m-page.m-page--2', [
                m('h2', 'About page')
            ]);
        }
    };

    return about;
}());