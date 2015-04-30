(function (doc, app, dom, obj, pages) {
    'use strict';

    var transitionEvent = dom.whichTransitionEvent(),
        animate = transitionEvent ?
            app.utils.animator(pageIn, pageOut, true, false) :
            function (view) { return view; };

    /**
     * Animates page in view.
     * @param {object} el The page view.
     * @param {function} callback Function to be executed after transition ends.
     */
    function pageIn(el, callback) {
        callback = function () {
            var next = el.nextElementSibling;

            el.removeEventListener(transitionEvent, callback, false);
            if (next) {
                el.parentNode.removeChild(next);
            }
        };

        el.classList.add('page-in');
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
        callback = function () {
            var  next = el.nextElementSibling;

            el.removeEventListener(transitionEvent, callback, false);
            if (next) {
                el.parentNode.removeChild(next);
            }
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
        return {
            controller: function () {
                var defaults = {
                    name: m.route().replace(/\//g, '')
                };
                options = obj.extend({}, defaults, options);
                defaults = null;

                // Set an attribute to body, to use it for DOM manipulation and styling.
                doc.body.setAttribute('data-page-name', options.name);

                return oModule.controller ? new oModule.controller() : false;
            },
            view: oModule.view
        };
    }

    // Configure routing mode.
    m.route.mode = 'hash';

    // Define application's routes.
    m.route(doc.querySelector('m-view'), '/dashboard', {
        '/dashboard': router(animate(pages.dashboard), {
            name: 'dashboard'
        }),
        '/dashboard/:userName': router(animate(pages.dashboard), {
            name: 'dashboard'
        }),
        '/userprofile/:userName': router(animate(pages.userprofile), {
            name: 'userprofile'
        }),
        '/about': router(animate(pages.about), {
            name: 'about'
        }),
        '/contact': router(animate(pages.contact), {
            name: 'contact'
        })
    });
}(document, app, app.utils.dom, app.utils.objects, app.pages));












