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
                m('h2', {
                    config: about.vm.clickMe
                }, m.trust('About page <span style="font-size:14px;">(click me)</span>')),
                m('p', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora voluptatem, sint necessitatibus beatae, perspiciatis deserunt praesentium iusto, distinctio corrupti, laborum cupiditate ut. Veritatis eos iure eveniet, nisi, mollitia pariatur unde?'),
                m('a[href="/contact"]', { config: m.route }, 'Contact us')
            ]);
        }
    };

    about.vm = {
        clickMe: function (element, isInitialized, context, vdom) {
            function log() {
                console.log('element:', element);
                console.log('isInitialized:', isInitialized);
                console.log('context:', context);
                console.log('vdom:', vdom);
            }

            !isInitialized && element.addEventListener('click', log, false);

            context.onunload = function () {
                console.log('Removing event listener from ' + element.nodeName);
                element.removeEventListener('click', log, false);
            };
        }
    };

    return about;
}());