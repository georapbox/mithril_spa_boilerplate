module.exports = (function (doc, app, dom, obj, pages) {
    'use strict';

    var transitionEvent = dom.whichTransitionEvent(),
        animate = transitionEvent ?
            app.utils.animator(pageIn, pageOut, true, false) :
            function (myModule) {
                return myModule;
            },
        animationClass; // Holds the class responsible for animation. TODO: Maybe use publish/subscribe patter instead.

    /**
     * Animates page in view.
     * @param {object} el The page view.
     * @param {function} callback Function to be executed after transition ends.
     */
    function pageIn(el, callback) {
        /**
         * Overrides callback function of animator.
         */
        callback = function () {
            var next = el.nextElementSibling;

            el.removeEventListener(transitionEvent, callback, false);
            if (next) {
                el.parentNode.removeChild(next);
            }
        };

        el.classList.add('page-in');
        animationClass && el.classList.add(animationClass);
        setTimeout(function () {
            el.classList.remove('page-in');
        }, 0);
        el.addEventListener(transitionEvent, callback, false);
    }

    /**
     * Animates page out of view.
     * @param {object} el The page view.
     * @param {function} callback Function to be executed after transition ends.
     */
    function pageOut(el, callback) {
        /**
         * Overrides callback function of animator.
         */
        callback = function () {
            el.removeEventListener(transitionEvent, callback, false);
        };

        el.classList.remove('page-in');
        setTimeout(function () {
            el.classList.add('page-out');
        });
        el.addEventListener(transitionEvent, callback, false);
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
            animClass: 'no-anim'
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

    return {
        init: function () {
            // Configure routing mode.
            m.route.mode = 'hash';

            // Define application's routes.
            m.route(doc.querySelector('m-view'), '/dashboard', {
                '/dashboard': router(pages.dashboard, {
                    name: 'dashboard',
                    animClass: 'slide-ttb'
                }),
                '/dashboard/:userName': router(pages.dashboard, {
                    name: 'dashboard',
                    animClass: 'slide-ttb'
                }),
                '/userprofile/:userName': router(pages.userprofile, {
                    name: 'userprofile',
                    animClass: 'scale'
                }),
                '/about': router(pages.about, {
                    name: 'about',
                    animClass: 'slide-rtl'
                }),
                '/contact': router(pages.contact, {
                    name: 'contact',
                    animClass: 'slide-rtl'
                })
            });
        }
    };
}(document, app, app.utils.dom, app.utils.objects, app.pages));