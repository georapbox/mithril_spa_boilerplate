/**
 * About page.
 * @returns {object} The about module.
 */
module.exports = (function () {
    'use strict';

	var Modal = require('../../components/modal'),
		aboutModal = new Modal();

    var about = {};

	about.controller = function () {
		this.onunload = function () {
			aboutModal.hide();
		};
	};

	about.view = function () {
		return m('div.m-page', [
			m('h2', {
				config: about.vm.clickMe
			}, m.trust('About page <span style="font-size:14px;">(click me)</span>')),

			m('p', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora voluptatem, sint necessitatibus beatae, perspiciatis deserunt praesentium iusto, distinctio corrupti, laborum cupiditate ut. Veritatis eos iure eveniet, nisi, mollitia pariatur unde?'),

			m('p', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora voluptatem, sint necessitatibus beatae, perspiciatis deserunt praesentium iusto, distinctio corrupti, laborum cupiditate ut. Veritatis eos iure eveniet, nisi, mollitia pariatur unde?'),

			m('p', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora voluptatem, sint necessitatibus beatae, perspiciatis deserunt praesentium iusto, distinctio corrupti, laborum cupiditate ut. Veritatis eos iure eveniet, nisi, mollitia pariatur unde?'),

			m('p', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora voluptatem, sint necessitatibus beatae, perspiciatis deserunt praesentium iusto, distinctio corrupti, laborum cupiditate ut. Veritatis eos iure eveniet, nisi, mollitia pariatur unde?'),

			m('a.btn.btn-primary', {
				onclick: aboutModal.show.bind(aboutModal)
			}, 'Show modal'),

			aboutModal.view({
				header: function () {
					return m('h4.modal-title', 'Lorem ipsum');
				},
				body: function () {
					return m('p', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora voluptatem, sint necessitatibus beatae, perspiciatis deserunt praesentium iusto, distinctio corrupti, laborum cupiditate ut. Veritatis eos iure eveniet, nisi, mollitia pariatur unde?');
				},
				footer: function () {
					return m('a.btn.btn-default', {
						onclick: aboutModal.hide.bind(aboutModal)
					}, 'Close');
				}
			})
		]);
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
