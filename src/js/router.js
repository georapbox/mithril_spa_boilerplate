/**
 * Router module
 * Provides routing to application enhanced with animations and
 * a router wrapper giving us the ability for custom acrtion when route changes.
 */
module.exports = (function (doc) {
    'use strict';

    var animator = require('./utils/animator'),
		dom = require('./utils/dom'),
		obj = require('./utils/objects');

    var enableAnimations = true,
		animationEvent = dom.whichAnimationEvent(),
        animate = animationEvent && enableAnimations ?
            animator(pageIn, pageOut, true, false) :
            function (myModule) {
                return myModule;
            },
        animationClass; // Holds the class responsible for animation.

    /**
     * Animates page in view.
     * @param {object} el The page view.
     * @param {function} callback Function to be executed after transition ends.
     */
    function pageIn(el, callback) {
        // Override callback function of animator.
        callback = function () {
            var next = el.nextElementSibling;

            doc.body.classList.remove('no-actions');
            el.removeEventListener(animationEvent, callback, false);
            if (next) {
                el.parentNode.removeChild(next);
                next = null;
            }
        };

        animationClass && el.classList.add(animationClass);
        doc.body.classList.add('no-actions');
        el.addEventListener(animationEvent, callback, false);
    }

    /**
     * Animates page out of view.
     * @param {object} el The page view.
     * @param {function} callback Function to be executed after transition ends.
     */
    function pageOut(el, callback) {
        // Override callback function of animator.
        callback = function () {
            el.removeEventListener(animationEvent, callback, false);
        };

        el.classList.add('page-out');
        el.addEventListener(animationEvent, callback, false);
    }

    /**
     * Simple Router wrapper, to handle generic tasks, when route changes.
     * @param {object} oModule The module to be provided for the specific route.
     * @param {object} [options] Default options to be provided for each route. Can be overriden by user.
     * @returns {object}
     */
    function router(oModule, options) {
        var defaults = {
            name: '',
            animClass: ''
        };
        options = obj.extend({}, defaults, options);
        defaults = null;

        return {
            controller: function () {
                animationClass = options.animClass;

                // Set a default name for each route, if one is not provided.
                options.name = options.name || m.route().replace(/\//g, '');

                // Set an attribute to body, to use it for DOM manipulation and styling.
                doc.body.setAttribute('data-page-name', options.name);

                // Return the module's controller if available, else undefined.
                return oModule.controller ? new oModule.controller() : undefined;
            },
            view: animate(oModule).view
        };
    }

    // Configure routing mode.
    m.route.mode = 'hash';

    return {
        /**
         * Initialize application's router.
         * @param {object} pages
         */
        init: function (pages) {
            // Define application's routes.
            m.route(doc.querySelector('m-view'), '/dashboard', {
                '/dashboard': router(pages.dashboard, {
                    name: 'dashboard',
                    animClass: 'pt-slide-ttb'
                }),
                '/dashboard/:userName': router(pages.dashboard, {
                    name: 'dashboard',
                    animClass: 'pt-slide-ttb'
                }),
                '/userprofile/:userName': router(pages.userprofile, {
                    name: 'userprofile',
                    animClass: 'pt-slide-rtl'
                }),
                '/about': router(pages.about, {
                    name: 'about',
                    animClass: 'pt-slide-rtl'
                }),
                '/contacts': router(pages.contacts, {
                    name: 'contacts',
                    animClass: 'pt-slide-rtl'
                })
            });
        }
    };
}(document));
