(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (win, doc) {
    'use strict';

    win.m = require('./lib/mithril');
    win.app = win.app || {};

    var attachFastClick = require('./lib/fastclick');
    attachFastClick(doc.body);

    var router = require('./router');
    router.init({
        dashboard: require('./components/pages/dashboard'),
        userprofile: require('./components/pages/userprofile'),
        about: require('./components/pages/about'),
        contacts: require('./components/pages/contacts')
    });

    var nav = require('./components/nav');
    nav.render();
}(window, document));

},{"./components/nav":3,"./components/pages/about":4,"./components/pages/contacts":5,"./components/pages/dashboard":6,"./components/pages/userprofile":7,"./lib/fastclick":8,"./lib/mithril":9,"./router":11}],2:[function(require,module,exports){
/**
 * Mithril-Bootstrap-Modal
 * A Mithril implementation of a Bootstrap 3 modal dialog.
 * @version 0.0.1
 * @homepage https://github.com/georapbox/Mithril-Bootstrap-Modal
 * @author George Raptis (https://github.com/georapbox)
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 George Raptis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(function (name, context, definition) {
    'use strict';

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = definition();
    } else if (typeof define === 'function' && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
}('Modal', this, function () {
    'use strict';

    /**
     * Creates a modal instance.
     * @constructor
     */
    function Modal() {
        var that = this;
        var modalConfig = function (element, isInitialized, context) {
            if (!isInitialized) {
                setTimeout(function () {
                    element.classList.add('fadein');
                }, 50);

                var handleKey = function (e) {
                    if (e.keyCode === 27) {
                        m.startComputation();
                        that.hide();
                        m.endComputation();
                    }
                };

                var handleClickOutside =  function (e) {
                    if (e.target.classList.contains('modal')) {
                        m.startComputation();
                        that.hide();
                        m.endComputation();
                    }
                };

                document.body.addEventListener('keyup', handleKey, false);
                element.addEventListener('click', handleClickOutside, false);

                context.onunload = function () {
                    element.removeEventListener('click', handleClickOutside, false);
                    document.body.removeEventListener('keyup', handleKey, false);
                };
            }
        };

        // Getter / Setter for modal's visibility status.
        this.visible = m.prop(false);

        // The modal's view.
        this.view = function (opts) {
            return this.visible() ?
                m('.modal', {config: modalConfig}, [
                    m('.modal-dialog', [
                        m('.modal-content', [
                            opts.header ? m('.modal-header', [
                                m('a.close', {onclick: this.hide.bind(this)}, m.trust('&times;')), opts.header()
                            ]) : '',
                            opts.body ? m('.modal-body', opts.body()) : '',
                            opts.footer ? m('.modal-footer', opts.footer()) : ''
                        ])
                    ])
                ]) : '';
        };
    }

    var proto = Modal.prototype;

    proto.show = function () {
        this.visible = m.prop(true);
        document.body.classList.add('modal-open');
    };

    proto.hide = function () {
        this.visible = m.prop(false);
        document.body.classList.remove('modal-open');
    };

    proto.isVisible = function () {
        return this.visible();
    };

    return Modal;
}));

},{}],3:[function(require,module,exports){
/**
 * Main navigation component.
 * @returns {object} The nav module.
 */
module.exports = (function (doc) {
    'use strict';

    var nav = {};

    nav.view = function () {
        return m('ul.nav.nav-tabs', [
            m('li.dashboard', [
                m('a[href="/dashboard"]', {config: m.route}, 'Dashboard')
            ]),
            m('li.about', [
                m('a[href="/about"]', {config: m.route}, 'About')
            ]),
            m('li.contact', [
                m('a[href="/contacts"]', {config: m.route}, 'Contacts')
            ])
        ]);
    };

    return {
        render: function () {
            m.render(doc.getElementById('js_nav'), nav.view());
        }
    };
}(document));

},{}],4:[function(require,module,exports){
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

},{"../../components/modal":2}],5:[function(require,module,exports){
/**
 * Contact page.
 * @returns {object} The contact module.
 */
module.exports = (function () {
    'use strict';

    var PubSub = require('../../lib/pubsub'),
        ps = new PubSub();

    var Modal = require('../../components/modal'),
        newContactModal = new Modal();

    // Hardcoded contacts data
    var contactsData = [{
        username: 'johndoe',
        name: 'John Doe',
        email: 'johndoe@hotmail.com'
    }, {
        username: 'georapbox',
        name: 'George Raptis',
        email: 'georapbox@gmail.com'
    }, {
        username: 'marylou',
        name: 'Mary Lou',
        email: 'mlou@yahoo.com'
    }, {
        username: 'tduncan',
        name: 'Tim Duncan',
        email: 'tduncan@gmail.com'
    }];

    /**
     * ViewModel helper factory.
     * @param {object} signature
     * @returns {function}
     */
    var viewModelMap = function (signature) {
        var map = {};
        return function (key) {
            if (!map[key]) {
                map[key] = {};
                for (var prop in signature) {
                    if (signature.hasOwnProperty(prop)) {
                        map[key][prop] = m.prop(signature[prop]());
                    }
                }
            }
            return map[key];
        };
    };

    // Contact model
    var Contact = function (data) {
        data = data || {};
        this.id = m.prop(data.id);
        this.name = m.prop(data.name);
        this.email = m.prop(data.email);
    };

    Contact.list = function () {
        /*return m.request({
			method: 'GET',
			url: '../data/users.json'
		});*/

        m.startComputation();

        var deferred = m.deferred();

        setTimeout(function () {
            deferred.resolve(contactsData);
            m.endComputation();
        }, 0);

        return deferred.promise;
    };

    Contact.save = function (data) {
        /*return m.request({
			method: 'POST',
			url: '../data/users.json',
			data: data
		});*/

        var deferred = m.deferred();

        setTimeout(function () {
            var newContact = {
                id: contactsData.length + 1,
                name: data.name(),
                email: data.email()
            };

            contactsData.push(newContact);
            deferred.resolve(newContact);
        }, 0);

        return deferred.promise;
    };

    // ContactForm component
    var ContactForm = {
        controller: function (args) {
            this.contact = m.prop(args.contact || new Contact());
        },
        view: function (ctrl, args) {
            var contact = ctrl.contact();

            var inputConfig = function (element, isInitialized) {
                if (!isInitialized) {
                    element.focus();
                }
            };

            return m('form', [
                m('.form-group', [
                    m('label', 'Name'),
                    m('input.form-control', {
                        type: 'text',
                        placeholder: 'eg: George Raptis',
                        oninput: m.withAttr('value', contact.name),
                        value: contact.name() || '',
                        config: inputConfig
                    })
                ]),

                m('.form-group', [
                    m('label', 'Email'),
                    m('input.form-control', {
                        type: 'email',
                        placeholder: 'eg: georapbox@gmail.com',
                        oninput: m.withAttr('value', contact.email),
                        value: contact.email() || ''
                    })
                ]),

                m('button[type=button].btn.btn-primary', {
                    onclick: args.onsave.bind(this, contact)
                }, 'Save')
            ]);
        }
    };

    // ContactList component
    var ContactsList = {
        controller: function () {
            ps.on('UPDATE_CONTACT', function () {
                console.info('UPDATED');
            });

            this.contactsVM = viewModelMap({
                isEditing: m.prop(false)
            });
        },
        view: function (ctrl, args) {
            var fadesIn = function (element, isInitialized) {
                if (!isInitialized) {
                    element.style.opacity = 0;
                    setTimeout(function () {
                        element.style.opacity = 1;
                    }, 50);
                }
            };

            return m('.table-responsive', [
                m('table.table.table-bordered', [
                    m('thead', [
                        m('tr', [
                            m('th', '#'),
                            m('th', 'Name'),
                            m('th', 'Email'),
                            m('th', '')
                        ])
                    ]),
                    m('tbody', [
                        args.contacts().map(function (contact, idx) {
                            var vm = ctrl.contactsVM(contact.email);
                            return m('tr.contact-item', {key: contact.email, config: fadesIn}, [
                                m('th', ++idx),
                                m('td', [
                                    vm.isEditing() ?
                                        m('input.form-control', {
                                            value: contact.name
                                        }) :
                                        contact.name
                                ]),

                                m('td', [
                                    vm.isEditing() ?
                                        m('input.form-control', {
                                            oninput: function (e) {
                                                return m.withAttr('value', function (e) {
                                                    console.log(e.target);
                                                });
                                            },
                                            value: contact.email
                                        }) :
                                        contact.email
                                ]),

                                m('td', {style: 'text-align:center;'}, [
                                    vm.isEditing() ?
                                    m('a[href="javascript:void(0);"]', {
                                        onclick: function () {
                                            vm.isEditing(!vm.isEditing());
                                        }
                                    }, 'Save') :
                                    m('a[href="javascript:void(0);"]', {
                                        onclick: function () {
                                            vm.isEditing(!vm.isEditing());
                                        }
                                    }, 'Edit')
                                ])
                            ]);
                        })
                    ])
                ])
            ]);
        }
    };

    // ContactsWidget component
    // Centralized module, responsible for interfacing with the model layer
    var ContactsWidget = {};

    ContactsWidget.controller = function update () {
        this.contacts = Contact.list();

        this.save = function (contact) {
            Contact.
                save(contact).
                then(update.bind(this)).
                then(newContactModal.hide());

            ps.trigger('UPDATE_CONTACT');
        }.bind(this);

        this.onunload = function () {
            console.log('ContactsWidget unloaded --> Unsubscribe form events');
            ps.off('UPDATE_CONTACT');
        };
    };

    ContactsWidget.view = function (ctrl) {
        return m('div.m-page', [
            m('h2', 'Contacts'),

            m('p.pull-right', [
                m('a.btn.btn-primary', {
                    onclick: newContactModal.show.bind(newContactModal)
                }, 'Add new contact')
            ]),

            m('.clear'),

            newContactModal.view({
                header: function () {
                    return m('h4.modal-title', 'New contact');
                },
                body: function () {
                    return m.component(ContactForm, {
                        onsave: ctrl.save
                    });
                }
            }),

            m.component(ContactsList, {
                contacts: ctrl.contacts
            })
        ]);
    };

    return ContactsWidget;
}());

},{"../../components/modal":2,"../../lib/pubsub":10}],6:[function(require,module,exports){
/**
 * Dashboard page.
 * @returns {object} The dashboard module.
 */
module.exports = (function () {
    'use strict';

    var User = function (data) {
        this.id = m.prop(data.id);
        this.name = m.prop(data.name);
        this.username = m.prop(data.username);
    };

    User.list = function () {
        return m.request({
            method: 'GET',
            url: '../data/users.json',
            type: User
        });
    };

    User.listEven = function () {
        return m.request({
            method: 'GET',
            url: '../data/users.json',
            type: User
        }).then(function (list) {
            return list.filter(function (user) {
                return user.id() % 2 === 0;
            });
        });
    };

    var dashboard = {};

    dashboard.controller = function () {
        this.id = m.route.param('userName');
        this.error = m.prop('ERROR');
        this.users = User.list().then(function (users) {
            dashboard.vm.init(users);
        }, this.error);
    };

    dashboard.vm = {
        init: function (users) {
            dashboard.vm.users = users;
        }
    };

    dashboard.view = function (controller) {
        return m('div.m-page', [
            m('ul', [
                dashboard.vm.users.map(function (usr, idx) {
                    return m('li', {key: usr.id}, [
                        m('a[href="/dashboard/' + usr.username() + '"]', {config: m.route}, usr.name())
                    ]);
                })
            ]),
            m('h2', controller.id ? ('Hello ' + controller.id) : 'This is the dashboard.'),
            m('p', {style: controller.id ? 'display:block' : 'display:none'}, [
                m('a[href="/userprofile/' + controller.id + '"]', {config: m.route}, 'Read more')
            ])
        ]);
    };

    return dashboard;
}());

},{}],7:[function(require,module,exports){
/**
 * User Profile page.
 * @returns {object} The userprofile module.
 */
module.exports = (function () {
    'use strict';

    var User = function (data) {
        this.id = m.prop(data.id);
        this.name = m.prop(data.name);
        this.username = m.prop(data.username);
        this.email = m.prop(data.email);
    };

    User.get = function () {
        return m.request({
            method: 'GET',
            url: '../data/users.json',
            type: User
        }).then(function (list) {
            return list.filter(function (user) {
                return user.username() === m.route.param('userName');
            });
        });
    };

    var userprofile = {};

    userprofile.controller = function () {
        this.id = m.route.param('userName');
        this.error = m.prop('ERROR');
        this.user = User.get().then(function (user) {
            userprofile.vm.init(user);
        }, this.error);
    };

    userprofile.vm = {
        init: function (user) {
            userprofile.vm.user = user;
        }
    };

    userprofile.view = function (controller) {
        return m('div.m-page', [
            userprofile.vm.user.map(function (usr, idx) {
                return m('div', [
                    m('h2', usr.name()),
                    m('p', 'Username: ' + usr.username()),
                    m('p', 'Email: ' + usr.email()),
                    m('a[href="javascript:m.route(\'/dashboard\')"]', 'Back to Dashboard')
                ]);
            })
        ]);
    };

    return userprofile;
}());

},{}],8:[function(require,module,exports){
;(function () {
	'use strict';

	/**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */

	/*jslint browser:true, node:true*/
	/*global define, Event, Node*/


	/**
	 * Instantiate fast-clicking listeners on the specified layer.
	 *
	 * @constructor
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	function FastClick(layer, options) {
		var oldOnClick;

		options = options || {};

		/**
		 * Whether a click is currently being tracked.
		 *
		 * @type boolean
		 */
		this.trackingClick = false;


		/**
		 * Timestamp for when click tracking started.
		 *
		 * @type number
		 */
		this.trackingClickStart = 0;


		/**
		 * The element being tracked for a click.
		 *
		 * @type EventTarget
		 */
		this.targetElement = null;


		/**
		 * X-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartX = 0;


		/**
		 * Y-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartY = 0;


		/**
		 * ID of the last touch, retrieved from Touch.identifier.
		 *
		 * @type number
		 */
		this.lastTouchIdentifier = 0;


		/**
		 * Touchmove boundary, beyond which a click will be cancelled.
		 *
		 * @type number
		 */
		this.touchBoundary = options.touchBoundary || 10;


		/**
		 * The FastClick layer.
		 *
		 * @type Element
		 */
		this.layer = layer;

		/**
		 * The minimum time between tap(touchstart and touchend) events
		 *
		 * @type number
		 */
		this.tapDelay = options.tapDelay || 200;

		/**
		 * The maximum time for a tap
		 *
		 * @type number
		 */
		this.tapTimeout = options.tapTimeout || 700;

		if (FastClick.notNeeded(layer)) {
			return;
		}

		// Some old versions of Android don't have Function.prototype.bind
		function bind(method, context) {
			return function() { return method.apply(context, arguments); };
		}


		var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
		var context = this;
		for (var i = 0, l = methods.length; i < l; i++) {
			context[methods[i]] = bind(context[methods[i]], context);
		}

		// Set up event handlers as required
		if (deviceIsAndroid) {
			layer.addEventListener('mouseover', this.onMouse, true);
			layer.addEventListener('mousedown', this.onMouse, true);
			layer.addEventListener('mouseup', this.onMouse, true);
		}

		layer.addEventListener('click', this.onClick, true);
		layer.addEventListener('touchstart', this.onTouchStart, false);
		layer.addEventListener('touchmove', this.onTouchMove, false);
		layer.addEventListener('touchend', this.onTouchEnd, false);
		layer.addEventListener('touchcancel', this.onTouchCancel, false);

		// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
		// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
		// layer when they are cancelled.
		if (!Event.prototype.stopImmediatePropagation) {
			layer.removeEventListener = function(type, callback, capture) {
				var rmv = Node.prototype.removeEventListener;
				if (type === 'click') {
					rmv.call(layer, type, callback.hijacked || callback, capture);
				} else {
					rmv.call(layer, type, callback, capture);
				}
			};

			layer.addEventListener = function(type, callback, capture) {
				var adv = Node.prototype.addEventListener;
				if (type === 'click') {
					adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
						if (!event.propagationStopped) {
							callback(event);
						}
					}), capture);
				} else {
					adv.call(layer, type, callback, capture);
				}
			};
		}

		// If a handler is already declared in the element's onclick attribute, it will be fired before
		// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
		// adding it as listener.
		if (typeof layer.onclick === 'function') {

			// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
			// - the old one won't work if passed to addEventListener directly.
			oldOnClick = layer.onclick;
			layer.addEventListener('click', function(event) {
				oldOnClick(event);
			}, false);
			layer.onclick = null;
		}
	}

	/**
	* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
	*
	* @type boolean
	*/
	var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

	/**
	 * Android requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


	/**
	 * iOS requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


	/**
	 * iOS 4 requires an exception for select elements.
	 *
	 * @type boolean
	 */
	var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


	/**
	 * iOS 6.0-7.* requires the target element to be manually derived
	 *
	 * @type boolean
	 */
	var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

	/**
	 * BlackBerry requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

	/**
	 * Determine whether a given element requires a native click.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element needs a native click
	 */
	FastClick.prototype.needsClick = function(target) {
		switch (target.nodeName.toLowerCase()) {

		// Don't send a synthetic click to disabled inputs (issue #62)
		case 'button':
		case 'select':
		case 'textarea':
			if (target.disabled) {
				return true;
			}

			break;
		case 'input':

			// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
			if ((deviceIsIOS && target.type === 'file') || target.disabled) {
				return true;
			}

			break;
		case 'label':
		case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
		case 'video':
			return true;
		}

		return (/\bneedsclick\b/).test(target.className);
	};


	/**
	 * Determine whether a given element requires a call to focus to simulate click into element.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
	 */
	FastClick.prototype.needsFocus = function(target) {
		switch (target.nodeName.toLowerCase()) {
		case 'textarea':
			return true;
		case 'select':
			return !deviceIsAndroid;
		case 'input':
			switch (target.type) {
			case 'button':
			case 'checkbox':
			case 'file':
			case 'image':
			case 'radio':
			case 'submit':
				return false;
			}

			// No point in attempting to focus disabled inputs
			return !target.disabled && !target.readOnly;
		default:
			return (/\bneedsfocus\b/).test(target.className);
		}
	};


	/**
	 * Send a click event to the specified element.
	 *
	 * @param {EventTarget|Element} targetElement
	 * @param {Event} event
	 */
	FastClick.prototype.sendClick = function(targetElement, event) {
		var clickEvent, touch;

		// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
		if (document.activeElement && document.activeElement !== targetElement) {
			document.activeElement.blur();
		}

		touch = event.changedTouches[0];

		// Synthesise a click event, with an extra attribute so it can be tracked
		clickEvent = document.createEvent('MouseEvents');
		clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		clickEvent.forwardedTouchEvent = true;
		targetElement.dispatchEvent(clickEvent);
	};

	FastClick.prototype.determineEventType = function(targetElement) {

		//Issue #159: Android Chrome Select Box does not open with a synthetic click event
		if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
			return 'mousedown';
		}

		return 'click';
	};


	/**
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.focus = function(targetElement) {
		var length;

		// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
		if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
			length = targetElement.value.length;
			targetElement.setSelectionRange(length, length);
		} else {
			targetElement.focus();
		}
	};


	/**
	 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
	 *
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.updateScrollParent = function(targetElement) {
		var scrollParent, parentElement;

		scrollParent = targetElement.fastClickScrollParent;

		// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
		// target element was moved to another parent.
		if (!scrollParent || !scrollParent.contains(targetElement)) {
			parentElement = targetElement;
			do {
				if (parentElement.scrollHeight > parentElement.offsetHeight) {
					scrollParent = parentElement;
					targetElement.fastClickScrollParent = parentElement;
					break;
				}

				parentElement = parentElement.parentElement;
			} while (parentElement);
		}

		// Always update the scroll top tracker if possible.
		if (scrollParent) {
			scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
		}
	};


	/**
	 * @param {EventTarget} targetElement
	 * @returns {Element|EventTarget}
	 */
	FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

		// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
		if (eventTarget.nodeType === Node.TEXT_NODE) {
			return eventTarget.parentNode;
		}

		return eventTarget;
	};


	/**
	 * On touch start, record the position and scroll offset.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchStart = function(event) {
		var targetElement, touch, selection;

		// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
		if (event.targetTouches.length > 1) {
			return true;
		}

		targetElement = this.getTargetElementFromEventTarget(event.target);
		touch = event.targetTouches[0];

		if (deviceIsIOS) {

			// Only trusted events will deselect text on iOS (issue #49)
			selection = window.getSelection();
			if (selection.rangeCount && !selection.isCollapsed) {
				return true;
			}

			if (!deviceIsIOS4) {

				// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
				// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
				// with the same identifier as the touch event that previously triggered the click that triggered the alert.
				// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
				// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
				// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
				// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
				// random integers, it's safe to to continue if the identifier is 0 here.
				if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
					event.preventDefault();
					return false;
				}

				this.lastTouchIdentifier = touch.identifier;

				// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
				// 1) the user does a fling scroll on the scrollable layer
				// 2) the user stops the fling scroll with another tap
				// then the event.target of the last 'touchend' event will be the element that was under the user's finger
				// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
				// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
				this.updateScrollParent(targetElement);
			}
		}

		this.trackingClick = true;
		this.trackingClickStart = event.timeStamp;
		this.targetElement = targetElement;

		this.touchStartX = touch.pageX;
		this.touchStartY = touch.pageY;

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			event.preventDefault();
		}

		return true;
	};


	/**
	 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.touchHasMoved = function(event) {
		var touch = event.changedTouches[0], boundary = this.touchBoundary;

		if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
			return true;
		}

		return false;
	};


	/**
	 * Update the last position.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchMove = function(event) {
		if (!this.trackingClick) {
			return true;
		}

		// If the touch has moved, cancel the click tracking
		if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
			this.trackingClick = false;
			this.targetElement = null;
		}

		return true;
	};


	/**
	 * Attempt to find the labelled control for the given label element.
	 *
	 * @param {EventTarget|HTMLLabelElement} labelElement
	 * @returns {Element|null}
	 */
	FastClick.prototype.findControl = function(labelElement) {

		// Fast path for newer browsers supporting the HTML5 control attribute
		if (labelElement.control !== undefined) {
			return labelElement.control;
		}

		// All browsers under test that support touch events also support the HTML5 htmlFor attribute
		if (labelElement.htmlFor) {
			return document.getElementById(labelElement.htmlFor);
		}

		// If no for attribute exists, attempt to retrieve the first labellable descendant element
		// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
		return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
	};


	/**
	 * On touch end, determine whether to send a click event at once.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchEnd = function(event) {
		var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

		if (!this.trackingClick) {
			return true;
		}

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			this.cancelNextClick = true;
			return true;
		}

		if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
			return true;
		}

		// Reset to prevent wrong click cancel on input (issue #156).
		this.cancelNextClick = false;

		this.lastClickTime = event.timeStamp;

		trackingClickStart = this.trackingClickStart;
		this.trackingClick = false;
		this.trackingClickStart = 0;

		// On some iOS devices, the targetElement supplied with the event is invalid if the layer
		// is performing a transition or scroll, and has to be re-detected manually. Note that
		// for this to function correctly, it must be called *after* the event target is checked!
		// See issue #57; also filed as rdar://13048589 .
		if (deviceIsIOSWithBadTarget) {
			touch = event.changedTouches[0];

			// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
			targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
			targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
		}

		targetTagName = targetElement.tagName.toLowerCase();
		if (targetTagName === 'label') {
			forElement = this.findControl(targetElement);
			if (forElement) {
				this.focus(targetElement);
				if (deviceIsAndroid) {
					return false;
				}

				targetElement = forElement;
			}
		} else if (this.needsFocus(targetElement)) {

			// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
			// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
			if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
				this.targetElement = null;
				return false;
			}

			this.focus(targetElement);
			this.sendClick(targetElement, event);

			// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
			// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
			if (!deviceIsIOS || targetTagName !== 'select') {
				this.targetElement = null;
				event.preventDefault();
			}

			return false;
		}

		if (deviceIsIOS && !deviceIsIOS4) {

			// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
			// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
			scrollParent = targetElement.fastClickScrollParent;
			if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
				return true;
			}
		}

		// Prevent the actual click from going though - unless the target node is marked as requiring
		// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
		if (!this.needsClick(targetElement)) {
			event.preventDefault();
			this.sendClick(targetElement, event);
		}

		return false;
	};


	/**
	 * On touch cancel, stop tracking the click.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.onTouchCancel = function() {
		this.trackingClick = false;
		this.targetElement = null;
	};


	/**
	 * Determine mouse events which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onMouse = function(event) {

		// If a target element was never set (because a touch event was never fired) allow the event
		if (!this.targetElement) {
			return true;
		}

		if (event.forwardedTouchEvent) {
			return true;
		}

		// Programmatically generated events targeting a specific element should be permitted
		if (!event.cancelable) {
			return true;
		}

		// Derive and check the target element to see whether the mouse event needs to be permitted;
		// unless explicitly enabled, prevent non-touch click events from triggering actions,
		// to prevent ghost/doubleclicks.
		if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

			// Prevent any user-added listeners declared on FastClick element from being fired.
			if (event.stopImmediatePropagation) {
				event.stopImmediatePropagation();
			} else {

				// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
				event.propagationStopped = true;
			}

			// Cancel the event
			event.stopPropagation();
			event.preventDefault();

			return false;
		}

		// If the mouse event is permitted, return true for the action to go through.
		return true;
	};


	/**
	 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
	 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
	 * an actual click which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onClick = function(event) {
		var permitted;

		// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
		if (this.trackingClick) {
			this.targetElement = null;
			this.trackingClick = false;
			return true;
		}

		// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
		if (event.target.type === 'submit' && event.detail === 0) {
			return true;
		}

		permitted = this.onMouse(event);

		// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
		if (!permitted) {
			this.targetElement = null;
		}

		// If clicks are permitted, return true for the action to go through.
		return permitted;
	};


	/**
	 * Remove all FastClick's event listeners.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.destroy = function() {
		var layer = this.layer;

		if (deviceIsAndroid) {
			layer.removeEventListener('mouseover', this.onMouse, true);
			layer.removeEventListener('mousedown', this.onMouse, true);
			layer.removeEventListener('mouseup', this.onMouse, true);
		}

		layer.removeEventListener('click', this.onClick, true);
		layer.removeEventListener('touchstart', this.onTouchStart, false);
		layer.removeEventListener('touchmove', this.onTouchMove, false);
		layer.removeEventListener('touchend', this.onTouchEnd, false);
		layer.removeEventListener('touchcancel', this.onTouchCancel, false);
	};


	/**
	 * Check whether FastClick is needed.
	 *
	 * @param {Element} layer The layer to listen on
	 */
	FastClick.notNeeded = function(layer) {
		var metaViewport;
		var chromeVersion;
		var blackberryVersion;
		var firefoxVersion;

		// Devices that don't support touch don't need FastClick
		if (typeof window.ontouchstart === 'undefined') {
			return true;
		}

		// Chrome version - zero for other browsers
		chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (chromeVersion) {

			if (deviceIsAndroid) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// Chrome 32 and above with width=device-width or less don't need FastClick
					if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}

			// Chrome desktop doesn't need FastClick (issue #15)
			} else {
				return true;
			}
		}

		if (deviceIsBlackBerry10) {
			blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

			// BlackBerry 10.3+ does not require Fastclick library.
			// https://github.com/ftlabs/fastclick/issues/251
			if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// user-scalable=no eliminates click delay.
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// width=device-width (or less than device-width) eliminates click delay.
					if (document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}
			}
		}

		// IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
		if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		// Firefox version - zero for other browsers
		firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (firefoxVersion >= 27) {
			// Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

			metaViewport = document.querySelector('meta[name=viewport]');
			if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
				return true;
			}
		}

		// IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
		// http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
		if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		return false;
	};


	/**
	 * Factory method for creating a FastClick object
	 *
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	FastClick.attach = function(layer, options) {
		return new FastClick(layer, options);
	};


	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

		// AMD. Register as an anonymous module.
		define(function() {
			return FastClick;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = FastClick.attach;
		module.exports.FastClick = FastClick;
	} else {
		window.FastClick = FastClick;
	}
}());
},{}],9:[function(require,module,exports){
var m = (function app(window, undefined) {
	var OBJECT = "[object Object]",
		ARRAY = "[object Array]",
		STRING = "[object String]",
		FUNCTION = "function";

	var type = {}.toString;
	var parser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g;
	var attrParser = /\[(.+?)(?:=("|'|)(.*?)\2)?\]/;
	var voidElements = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/;
	var noop = function() {};

	// caching commonly used variables
	var $document,
		$location,
		$requestAnimationFrame,
		$cancelAnimationFrame;

	// self invoking function needed because of the way mocks work
	function initialize(window){
		$document = window.document;
		$location = window.location;
		$cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;
		$requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;
	}

	initialize(window);


	/**
	 * @typedef {String} Tag
	 * A string that looks like -> div.classname#id[param=one][param2=two]
	 * Which describes a DOM node
	 */

	/**
	 *
	 * @param {Tag} The DOM node tag
	 * @param {Object=[]} optional key-value pairs to be mapped to DOM attrs
	 * @param {...mNode=[]} Zero or more Mithril child nodes. Can be an array, or splat (optional)
	 *
	 */
	function m() {
		var args = [].slice.call(arguments),
			hasAttrs = args[1] != null && type.call(args[1]) === OBJECT && !("tag" in args[1] || "view" in args[1]) && !("subtree" in args[1]),
			attrs = hasAttrs ? args[1] : {},
			classAttrName = "class" in attrs ? "class" : "className",
			cell = {tag: "div", attrs: {}},
			match,
			classes = [];

		if (type.call(args[0]) != STRING) {
			throw new Error("selector in m(selector, attrs, children) should be a string");
		}

		while (match = parser.exec(args[0])) {
			if (match[1] === "" && match[2]) cell.tag = match[2];
			else if (match[1] === "#") cell.attrs.id = match[2];
			else if (match[1] === ".") classes.push(match[2]);
			else if (match[3][0] === "[") {
				var pair = attrParser.exec(match[3]);
				cell.attrs[pair[1]] = pair[3] || (pair[2] ? "" :true);
			}
		}

		var children = hasAttrs ? args.slice(2) : args.slice(1);
		if (children.length === 1 && type.call(children[0]) === ARRAY) {
			cell.children = children[0];
		} else {
			cell.children = children;
		}

		for (var attrName in attrs) {
			if (attrs.hasOwnProperty(attrName)) {
				if (attrName === classAttrName && attrs[attrName] != null && attrs[attrName] !== "") {
					classes.push(attrs[attrName]);
					cell.attrs[attrName] = ""; //create key in correct iteration order
				} else {
					cell.attrs[attrName] = attrs[attrName];
				}
			}
		}
		if (classes.length > 0) cell.attrs[classAttrName] = classes.join(" ");

		return cell;
	}

	function build(parentElement, parentTag, parentCache, parentIndex, data, cached, shouldReattach, index, editable, namespace, configs) {
		//`build` is a recursive function that manages creation/diffing/removal of DOM elements based on comparison between `data` and `cached`
		//the diff algorithm can be summarized as this:
		//1 - compare `data` and `cached`
		//2 - if they are different, copy `data` to `cached` and update the DOM based on what the difference is
		//3 - recursively apply this algorithm for every array and for the children of every virtual element

		//the `cached` data structure is essentially the same as the previous redraw's `data` data structure, with a few additions:
		//- `cached` always has a property called `nodes`, which is a list of DOM elements that correspond to the data represented by the respective virtual element
		//- in order to support attaching `nodes` as a property of `cached`, `cached` is *always* a non-primitive object, i.e. if the data was a string, then cached is a String instance. If data was `null` or `undefined`, cached is `new String("")`
		//- `cached also has a `configContext` property, which is the state storage object exposed by config(element, isInitialized, context)
		//- when `cached` is an Object, it represents a virtual element; when it's an Array, it represents a list of elements; when it's a String, Number or Boolean, it represents a text node

		//`parentElement` is a DOM element used for W3C DOM API calls
		//`parentTag` is only used for handling a corner case for textarea values
		//`parentCache` is used to remove nodes in some multi-node cases
		//`parentIndex` and `index` are used to figure out the offset of nodes. They're artifacts from before arrays started being flattened and are likely refactorable
		//`data` and `cached` are, respectively, the new and old nodes being diffed
		//`shouldReattach` is a flag indicating whether a parent node was recreated (if so, and if this node is reused, then this node must reattach itself to the new parent)
		//`editable` is a flag that indicates whether an ancestor is contenteditable
		//`namespace` indicates the closest HTML namespace as it cascades down from an ancestor
		//`configs` is a list of config functions to run after the topmost `build` call finishes running

		//there's logic that relies on the assumption that null and undefined data are equivalent to empty strings
		//- this prevents lifecycle surprises from procedural helpers that mix implicit and explicit return statements (e.g. function foo() {if (cond) return m("div")}
		//- it simplifies diffing code
		//data.toString() might throw or return null if data is the return value of Console.log in Firefox (behavior depends on version)
		try {if (data == null || data.toString() == null) data = "";} catch (e) {data = "";}
		if (data.subtree === "retain") return cached;
		var cachedType = type.call(cached), dataType = type.call(data);
		if (cached == null || cachedType !== dataType) {
			if (cached != null) {
				if (parentCache && parentCache.nodes) {
					var offset = index - parentIndex;
					var end = offset + (dataType === ARRAY ? data : cached.nodes).length;
					clear(parentCache.nodes.slice(offset, end), parentCache.slice(offset, end));
				}
				else if (cached.nodes) clear(cached.nodes, cached);
			}
			cached = new data.constructor;
			if (cached.tag) cached = {}; //if constructor creates a virtual dom element, use a blank object as the base cached node instead of copying the virtual el (#277)
			cached.nodes = [];
		}

		if (dataType === ARRAY) {
			//recursively flatten array
			for (var i = 0, len = data.length; i < len; i++) {
				if (type.call(data[i]) === ARRAY) {
					data = data.concat.apply([], data);
					i--; //check current index again and flatten until there are no more nested arrays at that index
					len = data.length;
				}
			}

			var nodes = [], intact = cached.length === data.length, subArrayCount = 0;

			//keys algorithm: sort elements without recreating them if keys are present
			//1) create a map of all existing keys, and mark all for deletion
			//2) add new keys to map and mark them for addition
			//3) if key exists in new list, change action from deletion to a move
			//4) for each key, handle its corresponding action as marked in previous steps
			var DELETION = 1, INSERTION = 2 , MOVE = 3;
			var existing = {}, shouldMaintainIdentities = false;
			for (var i = 0; i < cached.length; i++) {
				if (cached[i] && cached[i].attrs && cached[i].attrs.key != null) {
					shouldMaintainIdentities = true;
					existing[cached[i].attrs.key] = {action: DELETION, index: i};
				}
			}

			var guid = 0
			for (var i = 0, len = data.length; i < len; i++) {
				if (data[i] && data[i].attrs && data[i].attrs.key != null) {
					for (var j = 0, len = data.length; j < len; j++) {
						if (data[j] && data[j].attrs && data[j].attrs.key == null) {
							data[j].attrs.key = "__mithril__" + guid++;
						}
					}
					break;
				}
			}

			if (shouldMaintainIdentities) {
				var keysDiffer = false;
				if (data.length != cached.length) keysDiffer = true
				else for (var i = 0, cachedCell, dataCell; cachedCell = cached[i], dataCell = data[i]; i++) {
					if (cachedCell.attrs && dataCell.attrs && cachedCell.attrs.key != dataCell.attrs.key) {
						keysDiffer = true;
						break
					}
				}

				if (keysDiffer) {
					for (var i = 0, len = data.length; i < len; i++) {
						if (data[i] && data[i].attrs) {
							if (data[i].attrs.key != null) {
								var key = data[i].attrs.key;
								if (!existing[key]) {
									existing[key] = {action: INSERTION, index: i};
								} else {
									existing[key] = {
										action: MOVE,
										index: i,
										from: existing[key].index,
										element: cached.nodes[existing[key].index] || $document.createElement("div")
									};
								}
							}
						}
					}
					var actions = [];
					for (var prop in existing) actions.push(existing[prop]);
					var changes = actions.sort(sortChanges);
					var newCached = new Array(cached.length);
					newCached.nodes = cached.nodes.slice();

					for (var i = 0, change; change = changes[i]; i++) {
						if (change.action === DELETION) {
							clear(cached[change.index].nodes, cached[change.index]);
							newCached.splice(change.index, 1);
						}
						if (change.action === INSERTION) {
							var dummy = $document.createElement("div");
							dummy.key = data[change.index].attrs.key;
							parentElement.insertBefore(dummy, parentElement.childNodes[change.index] || null);
							newCached.splice(change.index, 0, {attrs: {key: data[change.index].attrs.key}, nodes: [dummy]});
							newCached.nodes[change.index] = dummy;
						}

						if (change.action === MOVE) {
							if (parentElement.childNodes[change.index] !== change.element && change.element !== null) {
								parentElement.insertBefore(change.element, parentElement.childNodes[change.index] || null)
							}
							newCached[change.index] = cached[change.from];
							newCached.nodes[change.index] = change.element
						}
					}
					cached = newCached;
				}
			}
			//end key algorithm

			for (var i = 0, cacheCount = 0, len = data.length; i < len; i++) {
				//diff each item in the array
				var item = build(parentElement, parentTag, cached, index, data[i], cached[cacheCount], shouldReattach, index + subArrayCount || subArrayCount, editable, namespace, configs);
				if (item === undefined) continue;
				if (!item.nodes.intact) intact = false;
				if (item.$trusted) {
					//fix offset of next element if item was a trusted string w/ more than one html element
					//the first clause in the regexp matches elements
					//the second clause (after the pipe) matches text nodes
					subArrayCount += (item.match(/<[^\/]|\>\s*[^<]/g) || [0]).length;
				}
				else subArrayCount += type.call(item) === ARRAY ? item.length : 1;
				cached[cacheCount++] = item
			}
			if (!intact) {
				//diff the array itself

				//update the list of DOM nodes by collecting the nodes from each item
				for (var i = 0, len = data.length; i < len; i++) {
					if (cached[i] != null) nodes.push.apply(nodes, cached[i].nodes)
				}
				//remove items from the end of the array if the new array is shorter than the old one
				//if errors ever happen here, the issue is most likely a bug in the construction of the `cached` data structure somewhere earlier in the program
				for (var i = 0, node; node = cached.nodes[i]; i++) {
					if (node.parentNode != null && nodes.indexOf(node) < 0) clear([node], [cached[i]])
				}
				if (data.length < cached.length) cached.length = data.length;
				cached.nodes = nodes
			}
		}
		else if (data != null && dataType === OBJECT) {
			var views = [],
				controllers = [];

			while (data.view) {
				var view = data.view.$original || data.view;
				var controllerIndex = m.redraw.strategy() == "diff" && cached.views ? cached.views.indexOf(view) : -1;
				var controller = controllerIndex > -1 ? cached.controllers[controllerIndex] : new (data.controller || noop);
				var key = data && data.attrs && data.attrs.key;
				data = pendingRequests == 0 || (cached && cached.controllers && cached.controllers.indexOf(controller) > -1) ? data.view(controller) : {tag: "placeholder"};
				if (data.subtree === "retain") return cached;
				if (key) {
					if (!data.attrs) data.attrs = {};
					data.attrs.key = key
				}
				if (controller.onunload) unloaders.push({controller: controller, handler: controller.onunload});
				views.push(view);
				controllers.push(controller);
			}
			if (!data.tag && controllers.length) throw new Error("Component template must return a virtual element, not an array, string, etc.")
			if (!data.attrs) data.attrs = {};
			if (!cached.attrs) cached.attrs = {};

			var dataAttrKeys = Object.keys(data.attrs);
			var hasKeys = dataAttrKeys.length > ("key" in data.attrs ? 1 : 0);
			//if an element is different enough from the one in cache, recreate it
			if (data.tag != cached.tag || dataAttrKeys.sort().join() != Object.keys(cached.attrs).sort().join() || data.attrs.id != cached.attrs.id || data.attrs.key != cached.attrs.key || (m.redraw.strategy() == "all" && (!cached.configContext || cached.configContext.retain !== true)) || (m.redraw.strategy() == "diff" && cached.configContext && cached.configContext.retain === false)) {
				if (cached.nodes.length) clear(cached.nodes);
				if (cached.configContext && typeof cached.configContext.onunload === FUNCTION) cached.configContext.onunload()
				if (cached.controllers) {
					for (var i = 0, controller; controller = cached.controllers[i]; i++) {
						if (typeof controller.onunload === FUNCTION) controller.onunload({preventDefault: noop})
					}
				}
			}
			if (type.call(data.tag) != STRING) return;

			var node, isNew = cached.nodes.length === 0;
			if (data.attrs.xmlns) namespace = data.attrs.xmlns;
			else if (data.tag === "svg") namespace = "http://www.w3.org/2000/svg";
			else if (data.tag === "math") namespace = "http://www.w3.org/1998/Math/MathML";

			if (isNew) {
				if (data.attrs.is) node = namespace === undefined ? $document.createElement(data.tag, data.attrs.is) : $document.createElementNS(namespace, data.tag, data.attrs.is);
				else node = namespace === undefined ? $document.createElement(data.tag) : $document.createElementNS(namespace, data.tag);
				cached = {
					tag: data.tag,
					//set attributes first, then create children
					attrs: hasKeys ? setAttributes(node, data.tag, data.attrs, {}, namespace) : data.attrs,
					children: data.children != null && data.children.length > 0 ?
						build(node, data.tag, undefined, undefined, data.children, cached.children, true, 0, data.attrs.contenteditable ? node : editable, namespace, configs) :
						data.children,
					nodes: [node]
				};
				if (controllers.length) {
					cached.views = views
					cached.controllers = controllers
					for (var i = 0, controller; controller = controllers[i]; i++) {
						if (controller.onunload && controller.onunload.$old) controller.onunload = controller.onunload.$old
						if (pendingRequests && controller.onunload) {
							var onunload = controller.onunload
							controller.onunload = noop
							controller.onunload.$old = onunload
						}
					}
				}

				if (cached.children && !cached.children.nodes) cached.children.nodes = [];
				//edge case: setting value on <select> doesn't work before children exist, so set it again after children have been created
				if (data.tag === "select" && "value" in data.attrs) setAttributes(node, data.tag, {value: data.attrs.value}, {}, namespace);
				parentElement.insertBefore(node, parentElement.childNodes[index] || null)
			}
			else {
				node = cached.nodes[0];
				if (hasKeys) setAttributes(node, data.tag, data.attrs, cached.attrs, namespace);
				cached.children = build(node, data.tag, undefined, undefined, data.children, cached.children, false, 0, data.attrs.contenteditable ? node : editable, namespace, configs);
				cached.nodes.intact = true;
				if (controllers.length) {
					cached.views = views
					cached.controllers = controllers
				}
				if (shouldReattach === true && node != null) parentElement.insertBefore(node, parentElement.childNodes[index] || null)
			}
			//schedule configs to be called. They are called after `build` finishes running
			if (typeof data.attrs["config"] === FUNCTION) {
				var context = cached.configContext = cached.configContext || {};

				// bind
				var callback = function(data, args) {
					return function() {
						return data.attrs["config"].apply(data, args)
					}
				};
				configs.push(callback(data, [node, !isNew, context, cached]))
			}
		}
		else if (typeof data != FUNCTION) {
			//handle text nodes
			var nodes;
			if (cached.nodes.length === 0) {
				if (data.$trusted) {
					nodes = injectHTML(parentElement, index, data)
				}
				else {
					nodes = [$document.createTextNode(data)];
					if (!parentElement.nodeName.match(voidElements)) parentElement.insertBefore(nodes[0], parentElement.childNodes[index] || null)
				}
				cached = "string number boolean".indexOf(typeof data) > -1 ? new data.constructor(data) : data;
				cached.nodes = nodes
			}
			else if (cached.valueOf() !== data.valueOf() || shouldReattach === true) {
				nodes = cached.nodes;
				if (!editable || editable !== $document.activeElement) {
					if (data.$trusted) {
						clear(nodes, cached);
						nodes = injectHTML(parentElement, index, data)
					}
					else {
						//corner case: replacing the nodeValue of a text node that is a child of a textarea/contenteditable doesn't work
						//we need to update the value property of the parent textarea or the innerHTML of the contenteditable element instead
						if (parentTag === "textarea") parentElement.value = data;
						else if (editable) editable.innerHTML = data;
						else {
							if (nodes[0].nodeType === 1 || nodes.length > 1) { //was a trusted string
								clear(cached.nodes, cached);
								nodes = [$document.createTextNode(data)]
							}
							parentElement.insertBefore(nodes[0], parentElement.childNodes[index] || null);
							nodes[0].nodeValue = data
						}
					}
				}
				cached = new data.constructor(data);
				cached.nodes = nodes
			}
			else cached.nodes.intact = true
		}

		return cached
	}

	function sortChanges(a, b) {
		return a.action - b.action || a.index - b.index;
	}

	function setAttributes(node, tag, dataAttrs, cachedAttrs, namespace) {
		for (var attrName in dataAttrs) {
			var dataAttr = dataAttrs[attrName];
			var cachedAttr = cachedAttrs[attrName];
			if (!(attrName in cachedAttrs) || (cachedAttr !== dataAttr)) {
				cachedAttrs[attrName] = dataAttr;
				try {
					//`config` isn't a real attributes, so ignore it
					if (attrName === "config" || attrName == "key") continue;
					//hook event handlers to the auto-redrawing system
					else if (typeof dataAttr === FUNCTION && attrName.indexOf("on") === 0) {
						node[attrName] = autoredraw(dataAttr, node)
					}
					//handle `style: {...}`
					else if (attrName === "style" && dataAttr != null && type.call(dataAttr) === OBJECT) {
						for (var rule in dataAttr) {
							if (cachedAttr == null || cachedAttr[rule] !== dataAttr[rule]) node.style[rule] = dataAttr[rule]
						}
						for (var rule in cachedAttr) {
							if (!(rule in dataAttr)) node.style[rule] = ""
						}
					}
					//handle SVG
					else if (namespace != null) {
						if (attrName === "href") node.setAttributeNS("http://www.w3.org/1999/xlink", "href", dataAttr);
						else if (attrName === "className") node.setAttribute("class", dataAttr);
						else node.setAttribute(attrName, dataAttr)
					}
					//handle cases that are properties (but ignore cases where we should use setAttribute instead)
					//- list and form are typically used as strings, but are DOM element references in js
					//- when using CSS selectors (e.g. `m("[style='']")`), style is used as a string, but it's an object in js
					else if (attrName in node && !(attrName === "list" || attrName === "style" || attrName === "form" || attrName === "type" || attrName === "width" || attrName === "height")) {
						//#348 don't set the value if not needed otherwise cursor placement breaks in Chrome
						if (tag !== "input" || node[attrName] !== dataAttr) node[attrName] = dataAttr
					}
					else node.setAttribute(attrName, dataAttr)
				}
				catch (e) {
					//swallow IE's invalid argument errors to mimic HTML's fallback-to-doing-nothing-on-invalid-attributes behavior
					if (e.message.indexOf("Invalid argument") < 0) throw e
				}
			}
			//#348 dataAttr may not be a string, so use loose comparison (double equal) instead of strict (triple equal)
			else if (attrName === "value" && tag === "input" && node.value != dataAttr) {
				node.value = dataAttr
			}
		}
		return cachedAttrs;
	}

	function clear(nodes, cached) {
		for (var i = nodes.length - 1; i > -1; i--) {
			if (nodes[i] && nodes[i].parentNode) {
				try {nodes[i].parentNode.removeChild(nodes[i])}
				catch (e) {} //ignore if this fails due to order of events (see http://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node)
				cached = [].concat(cached);
				if (cached[i]) unload(cached[i])
			}
		}
		if (nodes.length != 0) nodes.length = 0;
	}

	function unload(cached) {
		if (cached.configContext && typeof cached.configContext.onunload === FUNCTION) {
			cached.configContext.onunload();
			cached.configContext.onunload = null
		}
		if (cached.controllers) {
			for (var i = 0, controller; controller = cached.controllers[i]; i++) {
				if (typeof controller.onunload === FUNCTION) controller.onunload({preventDefault: noop});
			}
		}
		if (cached.children) {
			if (type.call(cached.children) === ARRAY) {
				for (var i = 0, child; child = cached.children[i]; i++) unload(child)
			} else if (cached.children.tag) {
				unload(cached.children);
			}
		}
	}

	function injectHTML(parentElement, index, data) {
		var nextSibling = parentElement.childNodes[index];
		if (nextSibling) {
			var isElement = nextSibling.nodeType != 1;
			var placeholder = $document.createElement("span");
			if (isElement) {
				parentElement.insertBefore(placeholder, nextSibling || null);
				placeholder.insertAdjacentHTML("beforebegin", data);
				parentElement.removeChild(placeholder)
			} else {
				nextSibling.insertAdjacentHTML("beforebegin", data);
			}
		} else {
			parentElement.insertAdjacentHTML("beforeend", data);
		}

		var nodes = [];

		while (parentElement.childNodes[index] !== nextSibling) {
			nodes.push(parentElement.childNodes[index]);
			index++
		}
		return nodes;
	}

	function autoredraw(callback, object) {
		return function(e) {
			e = e || event;
			m.redraw.strategy("diff");
			m.startComputation();
			try {return callback.call(object, e)}
			finally {
				endFirstComputation()
			}
		}
	}

	var html;
	var documentNode = {
		appendChild: function(node) {
			if (html === undefined) html = $document.createElement("html");
			if ($document.documentElement && $document.documentElement !== node) {
				$document.replaceChild(node, $document.documentElement)
			}
			else $document.appendChild(node);
			this.childNodes = $document.childNodes
		},
		insertBefore: function(node) {
			this.appendChild(node)
		},
		childNodes: []
	};

	var nodeCache = [],
		cellCache = {};

	m.render = function(root, cell, forceRecreation) {
		var configs = [];
		if (!root) throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.");
		var id = getCellCacheKey(root);
		var isDocumentRoot = root === $document;
		var node = isDocumentRoot || root === $document.documentElement ? documentNode : root;
		if (isDocumentRoot && cell.tag != "html") cell = {tag: "html", attrs: {}, children: cell};
		if (cellCache[id] === undefined) clear(node.childNodes);
		if (forceRecreation === true) reset(root);
		cellCache[id] = build(node, null, undefined, undefined, cell, cellCache[id], false, 0, null, undefined, configs);
		for (var i = 0, len = configs.length; i < len; i++) configs[i]()
	};

	function getCellCacheKey(element) {
		var index = nodeCache.indexOf(element);
		return index < 0 ? nodeCache.push(element) - 1 : index
	}

	m.trust = function(value) {
		value = new String(value);
		value.$trusted = true;
		return value
	};

	function gettersetter(store) {
		var prop = function() {
			if (arguments.length) store = arguments[0];
			return store
		};

		prop.toJSON = function() {
			return store
		};

		return prop
	}

	m.prop = function (store) {
		//note: using non-strict equality check here because we're checking if store is null OR undefined
		if (((store != null && type.call(store) === OBJECT) || typeof store === FUNCTION) && typeof store.then === FUNCTION) {
			return propify(store)
		}

		return gettersetter(store)
	};

	var roots = [],
		components = [],
		controllers = [],
		lastRedrawId = null,
		lastRedrawCallTime = 0,
		computePreRedrawHook = null,
		computePostRedrawHook = null,
		prevented = false,
		topComponent,
		unloaders = [];

	var FRAME_BUDGET = 16; //60 frames per second = 1 call per 16 ms

	function parameterize(component, args) {
		var controller = function() {
			return (component.controller || noop).apply(this, args) || this
		}
		var view = function(ctrl) {
			if (arguments.length > 1) args = args.concat([].slice.call(arguments, 1))
			return component.view.apply(component, args ? [ctrl].concat(args) : [ctrl])
		}
		view.$original = component.view
		var output = {controller: controller, view: view}
		if (args[0] && args[0].key != null) output.attrs = {key: args[0].key}
		return output
	}

	m.component = function(component) {
		return parameterize(component, [].slice.call(arguments, 1))
	}

	m.mount = m.module = function(root, component) {
		if (!root) throw new Error("Please ensure the DOM element exists before rendering a template into it.");
		var index = roots.indexOf(root);
		if (index < 0) index = roots.length;

		var isPrevented = false;
		var event = {preventDefault: function() {
			isPrevented = true;
			computePreRedrawHook = computePostRedrawHook = null;
		}};
		for (var i = 0, unloader; unloader = unloaders[i]; i++) {
			unloader.handler.call(unloader.controller, event)
			unloader.controller.onunload = null
		}
		if (isPrevented) {
			for (var i = 0, unloader; unloader = unloaders[i]; i++) unloader.controller.onunload = unloader.handler
		}
		else unloaders = []

		if (controllers[index] && typeof controllers[index].onunload === FUNCTION) {
			controllers[index].onunload(event)
		}

		if (!isPrevented) {
			m.redraw.strategy("all");
			m.startComputation();
			roots[index] = root;
			if (arguments.length > 2) component = subcomponent(component, [].slice.call(arguments, 2))
			var currentComponent = topComponent = component = component || {controller: function() {}};
			var constructor = component.controller || noop
			var controller = new constructor;
			//controllers may call m.mount recursively (via m.route redirects, for example)
			//this conditional ensures only the last recursive m.mount call is applied
			if (currentComponent === topComponent) {
				controllers[index] = controller;
				components[index] = component
			}
			endFirstComputation();
			return controllers[index]
		}
	};

	var redrawing = false;

	m.redraw = function (force) {
		if (redrawing) return
		redrawing = true
		//lastRedrawId is a positive number if a second redraw is requested before the next animation frame
		//lastRedrawID is null if it's the first redraw and not an event handler
		if (lastRedrawId && force !== true) {
			//when setTimeout: only reschedule redraw if time between now and previous redraw is bigger than a frame, otherwise keep currently scheduled timeout
			//when rAF: always reschedule redraw
			if ($requestAnimationFrame === window.requestAnimationFrame || new Date - lastRedrawCallTime > FRAME_BUDGET) {
				if (lastRedrawId > 0) $cancelAnimationFrame(lastRedrawId);
				lastRedrawId = $requestAnimationFrame(redraw, FRAME_BUDGET)
			}
		} else {
			redraw();
			lastRedrawId = $requestAnimationFrame(function () {
				lastRedrawId = null;
			}, FRAME_BUDGET);
		}

		redrawing = false;
	};

	m.redraw.strategy = m.prop();

	function redraw() {
		if (computePreRedrawHook) {
			computePreRedrawHook()
			computePreRedrawHook = null
		}
		for (var i = 0, root; root = roots[i]; i++) {
			if (controllers[i]) {
				var args = components[i].controller && components[i].controller.$$args ? [controllers[i]].concat(components[i].controller.$$args) : [controllers[i]]
				m.render(root, components[i].view ? components[i].view(controllers[i], args) : "")
			}
		}
		//after rendering within a routed context, we need to scroll back to the top, and fetch the document title for history.pushState
		if (computePostRedrawHook) {
			computePostRedrawHook();
			computePostRedrawHook = null
		}
		lastRedrawId = null;
		lastRedrawCallTime = new Date;
		m.redraw.strategy("diff")
	}

	var pendingRequests = 0;
	m.startComputation = function() {pendingRequests++};

	m.endComputation = function() {
		pendingRequests = Math.max(pendingRequests - 1, 0);
		if (pendingRequests === 0) m.redraw()
	};

	var endFirstComputation = function() {
		if (m.redraw.strategy() == "none") {
			pendingRequests--
			m.redraw.strategy("diff")
		}
		else m.endComputation();
	}

	m.withAttr = function(prop, withAttrCallback) {
		return function(e) {
			e = e || event;
			var currentTarget = e.currentTarget || this;
			withAttrCallback(prop in currentTarget ? currentTarget[prop] : currentTarget.getAttribute(prop))
		}
	};

	//routing
	var modes = {pathname: "", hash: "#", search: "?"};
	var redirect = noop,
		routeParams,
		currentRoute,
		isDefaultRoute = false;

	m.route = function() {
		//m.route()
		if (arguments.length === 0) return currentRoute;
		//m.route(el, defaultRoute, routes)
		else if (arguments.length === 3 && type.call(arguments[1]) === STRING) {
			var root = arguments[0], defaultRoute = arguments[1], router = arguments[2];
			redirect = function(source) {
				var path = currentRoute = normalizeRoute(source);
				if (!routeByValue(root, router, path)) {
					if (isDefaultRoute) throw new Error("Ensure the default route matches one of the routes defined in m.route")
					isDefaultRoute = true
					m.route(defaultRoute, true)
					isDefaultRoute = false
				}
			};
			var listener = m.route.mode === "hash" ? "onhashchange" : "onpopstate";
			window[listener] = function() {
				var path = $location[m.route.mode]
				if (m.route.mode === "pathname") path += $location.search
				if (currentRoute != normalizeRoute(path)) {
					redirect(path)
				}
			};
			computePreRedrawHook = setScroll;
			window[listener]()
		}
		//config: m.route
		else if (arguments[0].addEventListener || arguments[0].attachEvent) {
			var element = arguments[0];
			var isInitialized = arguments[1];
			var context = arguments[2];
			var vdom = arguments[3];
			element.href = (m.route.mode !== 'pathname' ? $location.pathname : '') + modes[m.route.mode] + vdom.attrs.href;
			if (element.addEventListener) {
				element.removeEventListener("click", routeUnobtrusive);
				element.addEventListener("click", routeUnobtrusive)
			}
			else {
				element.detachEvent("onclick", routeUnobtrusive);
				element.attachEvent("onclick", routeUnobtrusive)
			}
		}
		//m.route(route, params, shouldReplaceHistoryEntry)
		else if (type.call(arguments[0]) === STRING) {
			var oldRoute = currentRoute;
			currentRoute = arguments[0];
			var args = arguments[1] || {}
			var queryIndex = currentRoute.indexOf("?")
			var params = queryIndex > -1 ? parseQueryString(currentRoute.slice(queryIndex + 1)) : {}
			for (var i in args) params[i] = args[i]
			var querystring = buildQueryString(params)
			var currentPath = queryIndex > -1 ? currentRoute.slice(0, queryIndex) : currentRoute
			if (querystring) currentRoute = currentPath + (currentPath.indexOf("?") === -1 ? "?" : "&") + querystring;

			var shouldReplaceHistoryEntry = (arguments.length === 3 ? arguments[2] : arguments[1]) === true || oldRoute === arguments[0];

			if (window.history.pushState) {
				computePreRedrawHook = setScroll
				computePostRedrawHook = function() {
					window.history[shouldReplaceHistoryEntry ? "replaceState" : "pushState"](null, $document.title, modes[m.route.mode] + currentRoute);
				};
				redirect(modes[m.route.mode] + currentRoute)
			}
			else {
				$location[m.route.mode] = currentRoute
				redirect(modes[m.route.mode] + currentRoute)
			}
		}
	};

	m.route.param = function(key) {
		if (!routeParams) throw new Error("You must call m.route(element, defaultRoute, routes) before calling m.route.param()")
		return routeParams[key]
	};

	m.route.mode = "search";

	function normalizeRoute(route) {
		return route.slice(modes[m.route.mode].length)
	}

	function routeByValue(root, router, path) {
		routeParams = {};

		var queryStart = path.indexOf("?");
		if (queryStart !== -1) {
			routeParams = parseQueryString(path.substr(queryStart + 1, path.length));
			path = path.substr(0, queryStart)
		}

		// Get all routes and check if there's
		// an exact match for the current path
		var keys = Object.keys(router);
		var index = keys.indexOf(path);
		if(index !== -1){
			m.mount(root, router[keys [index]]);
			return true;
		}

		for (var route in router) {
			if (route === path) {
				m.mount(root, router[route]);
				return true
			}

			var matcher = new RegExp("^" + route.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$");

			if (matcher.test(path)) {
				path.replace(matcher, function() {
					var keys = route.match(/:[^\/]+/g) || [];
					var values = [].slice.call(arguments, 1, -2);
					for (var i = 0, len = keys.length; i < len; i++) routeParams[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i])
					m.mount(root, router[route])
				});
				return true
			}
		}
	}

	function routeUnobtrusive(e) {
		e = e || event;
		if (e.ctrlKey || e.metaKey || e.which === 2) return;
		if (e.preventDefault) e.preventDefault();
		else e.returnValue = false;
		var currentTarget = e.currentTarget || e.srcElement;
		var args = m.route.mode === "pathname" && currentTarget.search ? parseQueryString(currentTarget.search.slice(1)) : {};
		while (currentTarget && currentTarget.nodeName.toUpperCase() != "A") currentTarget = currentTarget.parentNode
		m.route(currentTarget[m.route.mode].slice(modes[m.route.mode].length), args)
	}

	function setScroll() {
		if (m.route.mode != "hash" && $location.hash) $location.hash = $location.hash;
		else window.scrollTo(0, 0)
	}

	function buildQueryString(object, prefix) {
		var duplicates = {}
		var str = []
		for (var prop in object) {
			var key = prefix ? prefix + "[" + prop + "]" : prop
			var value = object[prop]
			var valueType = type.call(value)
			var pair = (value === null) ? encodeURIComponent(key) :
				valueType === OBJECT ? buildQueryString(value, key) :
				valueType === ARRAY ? value.reduce(function(memo, item) {
					if (!duplicates[key]) duplicates[key] = {}
					if (!duplicates[key][item]) {
						duplicates[key][item] = true
						return memo.concat(encodeURIComponent(key) + "=" + encodeURIComponent(item))
					}
					return memo
				}, []).join("&") :
				encodeURIComponent(key) + "=" + encodeURIComponent(value)
			if (value !== undefined) str.push(pair)
		}
		return str.join("&")
	}

	function parseQueryString(str) {
		if (str.charAt(0) === "?") str = str.substring(1);

		var pairs = str.split("&"), params = {};
		for (var i = 0, len = pairs.length; i < len; i++) {
			var pair = pairs[i].split("=");
			var key = decodeURIComponent(pair[0])
			var value = pair.length == 2 ? decodeURIComponent(pair[1]) : null
			if (params[key] != null) {
				if (type.call(params[key]) !== ARRAY) params[key] = [params[key]]
				params[key].push(value)
			} else {
				params[key] = value;
			}
		}
		return params;
	}

	m.route.buildQueryString = buildQueryString;
	m.route.parseQueryString = parseQueryString;

	function reset(root) {
		var cacheKey = getCellCacheKey(root);
		clear(root.childNodes, cellCache[cacheKey]);
		cellCache[cacheKey] = undefined
	}

	m.deferred = function () {
		var deferred = new Deferred();
		deferred.promise = propify(deferred.promise);
		return deferred
	};

	function propify(promise, initialValue) {
		var prop = m.prop(initialValue);
		promise.then(prop);
		prop.then = function(resolve, reject) {
			return propify(promise.then(resolve, reject), initialValue)
		};
		return prop;
	}

	//Promiz.mithril.js | Zolmeister | MIT
	//a modified version of Promiz.js, which does not conform to Promises/A+ for two reasons:
	//1) `then` callbacks are called synchronously (because setTimeout is too slow, and the setImmediate polyfill is too big
	//2) throwing subclasses of Error cause the error to be bubbled up instead of triggering rejection (because the spec does not account for the important use case of default browser error handling, i.e. message w/ line number)
	function Deferred(successCallback, failureCallback) {
		var RESOLVING = 1, REJECTING = 2, RESOLVED = 3, REJECTED = 4;
		var self = this, state = 0, promiseValue = 0, next = [];

		self["promise"] = {};

		self["resolve"] = function(value) {
			if (!state) {
				promiseValue = value;
				state = RESOLVING;

				fire();
			}
			return this;
		};

		self["reject"] = function(value) {
			if (!state) {
				promiseValue = value;
				state = REJECTING;

				fire();
			}
			return this;
		};

		self.promise["then"] = function(successCallback, failureCallback) {
			var deferred = new Deferred(successCallback, failureCallback);
			if (state === RESOLVED) {
				deferred.resolve(promiseValue)
			}
			else if (state === REJECTED) {
				deferred.reject(promiseValue)
			}
			else {
				next.push(deferred)
			}
			return deferred.promise
		};

		function finish(type) {
			state = type || REJECTED;
			next.map(function(deferred) {
				state === RESOLVED && deferred.resolve(promiseValue) || deferred.reject(promiseValue);
			});
		}

		function thennable(then, successCallback, failureCallback, notThennableCallback) {
			if (((promiseValue != null && type.call(promiseValue) === OBJECT) || typeof promiseValue === FUNCTION) && typeof then === FUNCTION) {
				try {
					// count protects against abuse calls from spec checker
					var count = 0;
					then.call(promiseValue, function(value) {
						if (count++) return;
						promiseValue = value;
						successCallback();
					}, function (value) {
						if (count++) return;
						promiseValue = value;
						failureCallback();
					})
				} catch (e) {
					m.deferred.onerror(e);
					promiseValue = e;
					failureCallback();
				}
			} else {
				notThennableCallback();
			}
		}

		function fire() {
			// check if it's a thenable
			var then;

			try {
				then = promiseValue && promiseValue.then
			} catch (e) {
				m.deferred.onerror(e);
				promiseValue = e;
				state = REJECTING;
				return fire()
			}

			thennable(then, function() {
				state = RESOLVING;
				fire()
			}, function() {
				state = REJECTING;
				fire()
			}, function() {
				try {
					if (state === RESOLVING && typeof successCallback === FUNCTION) {
						promiseValue = successCallback(promiseValue);
					} else if (state === REJECTING && typeof failureCallback === "function") {
						promiseValue = failureCallback(promiseValue);
						state = RESOLVING;
					}
				} catch (e) {
					m.deferred.onerror(e);
					promiseValue = e;
					return finish();
				}

				if (promiseValue === self) {
					promiseValue = TypeError();
					finish();
				} else {
					thennable(then, function () {
						finish(RESOLVED);
					}, finish, function () {
						finish(state === RESOLVING && RESOLVED);
					});
				}
			})
		}
	}
	m.deferred.onerror = function(e) {
		if (type.call(e) === "[object Error]" && !e.constructor.toString().match(/ Error/)) throw e;
	};

	m.sync = function(args) {
		var method = "resolve";
		function synchronizer(pos, resolved) {
			return function(value) {
				results[pos] = value;
				if (!resolved) method = "reject";
				if (--outstanding === 0) {
					deferred.promise(results);
					deferred[method](results)
				}
				return value
			}
		}

		var deferred = m.deferred();
		var outstanding = args.length;
		var results = new Array(outstanding);
		if (args.length > 0) {
			for (var i = 0; i < args.length; i++) {
				args[i].then(synchronizer(i, true), synchronizer(i, false))
			}
		}
		else deferred.resolve([]);

		return deferred.promise
	};

	function identity(value) {
		return value;
	}

	function ajax(options) {
		if (options.dataType && options.dataType.toLowerCase() === "jsonp") {
			var callbackKey = "mithril_callback_" + new Date().getTime() + "_" + (Math.round(Math.random() * 1e16)).toString(36);
			var script = $document.createElement("script");

			window[callbackKey] = function(resp) {
				script.parentNode.removeChild(script);
				options.onload({
					type: "load",
					target: {
						responseText: resp
					}
				});
				window[callbackKey] = undefined
			};

			script.onerror = function(e) {
				script.parentNode.removeChild(script);

				options.onerror({
					type: "error",
					target: {
						status: 500,
						responseText: JSON.stringify({error: "Error making jsonp request"})
					}
				});
				window[callbackKey] = undefined;

				return false
			};

			script.onload = function(e) {
				return false
			};

			script.src = options.url
				+ (options.url.indexOf("?") > 0 ? "&" : "?")
				+ (options.callbackKey ? options.callbackKey : "callback")
				+ "=" + callbackKey
				+ "&" + buildQueryString(options.data || {});
			$document.body.appendChild(script)
		} else {
			var xhr = new window.XMLHttpRequest;
			xhr.open(options.method, options.url, true, options.user, options.password);
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					if (xhr.status >= 200 && xhr.status < 300) options.onload({type: "load", target: xhr});
					else options.onerror({type: "error", target: xhr})
				}
			};
			if (options.serialize === JSON.stringify && options.data && options.method !== "GET") {
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
			}
			if (options.deserialize === JSON.parse) {
				xhr.setRequestHeader("Accept", "application/json, text/*");
			}
			if (typeof options.config === FUNCTION) {
				var maybeXhr = options.config(xhr, options);
				if (maybeXhr != null) xhr = maybeXhr
			}

			var data = options.method === "GET" || !options.data ? "" : options.data
			if (data && (type.call(data) != STRING && data.constructor != window.FormData)) {
				throw "Request data should be either be a string or FormData. Check the `serialize` option in `m.request`";
			}
			xhr.send(data);
			return xhr;
		}
	}

	function bindData(xhrOptions, data, serialize) {
		if (xhrOptions.method === "GET" && xhrOptions.dataType != "jsonp") {
			var prefix = xhrOptions.url.indexOf("?") < 0 ? "?" : "&";
			var querystring = buildQueryString(data);
			xhrOptions.url = xhrOptions.url + (querystring ? prefix + querystring : "");
		}
		else xhrOptions.data = serialize(data);
		return xhrOptions;
	}

	function parameterizeUrl(url, data) {
		var tokens = url.match(/:[a-z]\w+/gi);
		if (tokens && data) {
			for (var i = 0; i < tokens.length; i++) {
				var key = tokens[i].slice(1);
				url = url.replace(tokens[i], data[key]);
				delete data[key];
			}
		}
		return url;
	}

	m.request = function(xhrOptions) {
		if (xhrOptions.background !== true) m.startComputation();
		var deferred = new Deferred();
		var isJSONP = xhrOptions.dataType && xhrOptions.dataType.toLowerCase() === "jsonp";
		var serialize = xhrOptions.serialize = isJSONP ? identity : xhrOptions.serialize || JSON.stringify;
		var deserialize = xhrOptions.deserialize = isJSONP ? identity : xhrOptions.deserialize || JSON.parse;
		var extract = isJSONP ? function(jsonp) {return jsonp.responseText} : xhrOptions.extract || function(xhr) {
			return xhr.responseText.length === 0 && deserialize === JSON.parse ? null : xhr.responseText
		};
		xhrOptions.method = (xhrOptions.method || 'GET').toUpperCase();
		xhrOptions.url = parameterizeUrl(xhrOptions.url, xhrOptions.data);
		xhrOptions = bindData(xhrOptions, xhrOptions.data, serialize);
		xhrOptions.onload = xhrOptions.onerror = function(e) {
			try {
				e = e || event;
				var unwrap = (e.type === "load" ? xhrOptions.unwrapSuccess : xhrOptions.unwrapError) || identity;
				var response = unwrap(deserialize(extract(e.target, xhrOptions)), e.target);
				if (e.type === "load") {
					if (type.call(response) === ARRAY && xhrOptions.type) {
						for (var i = 0; i < response.length; i++) response[i] = new xhrOptions.type(response[i])
					}
					else if (xhrOptions.type) response = new xhrOptions.type(response)
				}
				deferred[e.type === "load" ? "resolve" : "reject"](response)
			}
			catch (e) {
				m.deferred.onerror(e);
				deferred.reject(e)
			}
			if (xhrOptions.background !== true) m.endComputation()
		};
		ajax(xhrOptions);
		deferred.promise = propify(deferred.promise, xhrOptions.initialValue);
		return deferred.promise
	};

	//testing API
	m.deps = function(mock) {
		initialize(window = mock || window);
		return window;
	};

	//for internal testing only, do not use `m.deps.factory`
	m.deps.factory = app;

	return m;
})(typeof window != "undefined" ? window : {});

if (typeof module != "undefined" && module !== null && module.exports) module.exports = m;
else if (typeof define === "function" && define.amd) define(function() {return m});

},{}],10:[function(require,module,exports){
/**
 * PubSub.js - Javascript implementation of the Publish/Subscribe pattern.
 * @version 0.0.6
 * @homepage https://github.com/georapbox/PubSub
 * @author George Raptis (https://github.com/georapbox)
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 George Raptis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(function (name, context, definition) {
    'use strict';

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = definition();
    } else if (typeof define === 'function' && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
}('PubSub', this, function () {
    'use strict';

    var PubSub = function () {
        this.topics = {};    // Storage for topics that can be broadcast or listened to.
        this.subUid = -1;    // A topic identifier.
    },
    proto = PubSub.prototype;

    /**
	 * Alias a method while keeping the context correct,
	 * to allow for overwriting of target method.
	 *
     * @param {String} fn The name of the target method.
	 * @return {Function} The aliased method.
	 */
    function alias(fn) {
        return function closure () {
            return this[fn].apply(this, arguments);
        };
    }

    /**
     * Subscribe to events of interest with a specific topic name and a
     * callback function, to be executed when the topic/event is observed.
     *
     * @param topic {String} The topic name.
     * @param callback {Function} Callback function to execute on event.
	 * @param once {Boolean} Checks if event will be triggered only one time (optional).
     * @return number token
     */
    proto.subscribe = function (topic, callback, once) {
        var token = (this.subUid += 1),
            obj = {};

        if (!this.topics[topic]) {
            this.topics[topic] = [];
        }

        obj.token = token;
        obj.callback = callback;
        obj.once = !!once;

        this.topics[topic].push(obj);

        return token;
    };

    /**
	 * Subscribe to events of interest setting a flag
	 * indicating the event will be published only one time.
	 *
	 * @param topic {String} The topic name.
     * @param callback {Function} Callback function to execute on event.
	 */
    proto.subscribeOnce = function (topic, callback) {
        this.subscribe(topic, callback, true);
    };

    /**
     * Publish or broadcast events of interest with a specific
     * topic name and arguments such as the data to pass along.
     *
     * @param topic {String} The topic name.
     * @param args {Object || Array} The data to be passed.
     * @return bool false if topic does not exist.
     * @return bool true if topic exists and event is published.
     */
    proto.publish = function (topic, args) {
        var that = this,
            subscribers,
            len;

        if (!this.topics[topic]) {
            return false;
        }

        setTimeout(function () {
            subscribers = that.topics[topic];
            len = subscribers ? subscribers.length : 0;

            while (len) {
                len -= 1;
                subscribers[len].callback(topic, args);

                // Unsubscribe from event based on tokenized reference,
                // if subscriber's property once is set to true.
                if (subscribers[len].once === true) {
                    that.unsubscribe(subscribers[len].token);
                }
            }
        }, 0);

        return true;
    };

    /**
     * Unsubscribe from a specific topic, based on  the topic name,
     * or based on a tokenized reference to the subscription.
     *
     * @param t {String || Object} Topic name or subscription referenece.
     * @return bool false if argument passed does not match a subscribed event.
     */
    proto.unsubscribe = function (t) {
        var prop,
            len,
            tf = false;

        for (prop in this.topics) {
            if (this.topics.hasOwnProperty(prop)) {
                if (this.topics[prop]) {
                    len = this.topics[prop].length;

                    while (len) {
                        len -= 1;

                        // If t is a tokenized reference to the subscription.
                        // Removes one subscription from the array.
                        if (this.topics[prop][len].token === t) {
                            this.topics[prop].splice(len, 1);
                            return t;
                        }

                        // If t is the event type.
                        // Removes all the subscriptions that match the event type.
                        if (prop === t) {
                            this.topics[prop].splice(len, 1);
                            tf = true;
                        }
                    }

                    if (tf === true) {
                        return t;
                    }
                }
            }
        }

        return false;
    };

    /**
	 * Promises/A+ implementation.
	 */
    proto.aPlus = function () {
        var State,
            Aplus = {};

        State = {
            PENDING: 0,
            FULFILLED: 1,
            REJECTED: 2
        };

        // Set default state.
        Aplus.state = State.PENDING;

        /**
		 * Changes the state of a promise.
		 * @param {Number} state The state of the promise.
		 * @param {String|Number|Object} value The value (or reason) we get when the state changes.
		 */
        Aplus.changeState = function (state, value) {
            // Catch changing to same state (perhaps trying to change the value).
            if (this.state === state) {
                throw new Error('Can\'t transition to same state: ' + state);
            }

            // Trying to change out of fulfilled or rejected state.
            if (this.state === State.FULFILLED || this.state === State.REJECTED) {
                throw new Error('Can\'t transition from current state: ' + state);
            }

            // If second argument isn't given at all (Passing undefined is allowed).
            if (state === State.FULFILLED && arguments.length < 2) {
                throw new Error('Transition to fulfilled must have a non null value');
            }

            // If a null reason is passed in.
            // NOTE: Use double equality instead of tripple to check for both null and undefined.
            if (state === State.REJECTED && value == null) { // jshint ignore:line
                throw new Error('Transition to rejected must have a non null reason');
            }

            this.state = state; // Change state.
            this.value = value; // Change the value.
            this.resolve();     // Resolve the promise.

            return this.state;
        };

        /**
		 * Fulfills a promise.
		 * @param {String|Number|Object} value
		 */
        Aplus.fulfill = function (value) {
            this.changeState(State.FULFILLED, value);
        };

        /**
		 * Rejects a promise.
		 * @param {Object} reason
		 */
        Aplus.reject = function (reason) {
            this.changeState(State.REJECTED, reason);
        };

        /**
		 *
		 * @param {Function} onFulfilled The callback function to execute if promise is fulfilled.
		 * @param {Function} onRejected The callback function to execute if promise is rejected.
		 * @returns {Object} promise Return the promise object to allow chaining.
		 */
        Aplus.then = function (onFulfilled, onRejected) {
            // Initialize array to store the
            // functions to execute later on.
            this.cache = this.cache || [];

            var promise = Object.create(Aplus),
                that = this;

            this.async(function () {
                that.cache.push({
                    fulfill: typeof onFulfilled === 'function' && onFulfilled,
                    reject: typeof onRejected === 'function' && onRejected,
                    promise: promise
                });

                that.resolve();
            }, 5);

            return promise;
        };

        /**
		 * Resolves the promise.
		 * @returns {Boolean} Returns false if state is pending.
		 */
        Aplus.resolve = function () {
            // First check if pending...
            if (this.state === State.PENDING) {
                return false;
            }

            var obj,
                fn;

            // for each 'then'.
            while (this.cache && this.cache.length) {
                obj = this.cache.shift();

                // Get the appropriate function based on state.
                fn = this.state === State.FULFILLED ? obj.fulfill : obj.reject;

                if (typeof fn !== 'function') {
                    obj.promise.changeState(this.state, this.value);
                } else {
                    // Fulfill promise with value or reject with error.
                    try {
                        var value = fn(this.value);

                        // Deal with the promise returned.
                        if (value && typeof value.then === 'function') {
                            value.then(function (value) {
                                obj.promise.changeState(State.FULFILLED, value);
                            }, function (reason) {
                                obj.promise.changeState(State.REJECTED, reason);
                            });
                            // Deal with other value returned.
                        } else {
                            obj.promise.changeState(State.FULFILLED, value);
                        }
                    } catch (error) {
                        obj.promise.changeState(State.REJECTED, error);
                    }
                }
            }
        };

        /**
		 * Executes a function asynchronously.
		 * @param {Function} func the callback function to execute.
		 */
        Aplus.async = function (func, delay) {
            delay = typeof delay === 'undefined' ? 5 : delay;
            setTimeout(func, delay);
        };

        return Object.create(Aplus);
    };

    /**
     * Alias for public methods.
     * subscribe     -> on
     * subscribeOnce -> once
     * publish       -> trigger
     * unsubscribe   -> off
     * aPlus         -> when
     */
    proto.on = alias('subscribe');
    proto.once = alias('subscribeOnce');
    proto.trigger = alias('publish');
    proto.off = alias('unsubscribe');
    proto.when = alias('aPlus');

    return PubSub;
}));

},{}],11:[function(require,module,exports){
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

},{"./utils/animator":12,"./utils/dom":13,"./utils/objects":14}],12:[function(require,module,exports){
module.exports = (function () {
    'use strict';

    var animating = false; // Flag to indicate when animation is in progress.

    /**
     * Define an animator consisting of optional incoming and outgoing animations.
     * @param {function} incoming
     * @param {function} outgoing
     * @param {boolean} alwaysAnimate False unless specified as true: false means an incoming animation will only trigger if an outgoing animation is also in progress.
     * @param {boolean} dontClone Forcing dontClone to true means the outward animation will use the original element rather than a clone. This could improve performance by recycling elements, but can lead to trouble: clones have the advantage of being stripped of all event listeners.
     * @returns {function} animator
     */
    var animator = function (incoming, outgoing, alwaysAnimate, dontClone) {
        // The resulting animator can be applied to any number of components
        return function animate(x, y, z) {
            var config,
                parent,
                next;

            if (x.nodeType) { // When used as a config function
                return animationConfig(x, y, z);
            } else if (x.attrs) { // When passed a virtual DOM node (the output of m)
                return bindConfigTo(x);
            } else if (x.view) { // When applied to a Mithril module / component
                return {
                    controller: x.controller || noop,
                    view: function animatedView (ctrl) {
                        return bindConfigTo(x.view(ctrl));
                    }
                };
            }

            function bindConfigTo(node) {
                config = node.attrs.config;
                node.attrs.config = animationConfig;
                return node;
            }

            function animationConfig(el, init, context) {
                var output,
                    onunload;

                if (config) {
                    output = config(el, init, context);
                    // If the root element already has a config,
                    // it may also have an onunload which we should take care to preserve.
                    onunload = context.onunload;
                }

                if (!init) {
                    if (incoming && alwaysAnimate || animating) {
                        incoming(el, noop, context);
                    }

                    context.onunload = outgoing ? onunload ? function onunloadWrapper() {
                        teardown();
                        onunload();
                    } : teardown : onunload;

                    parent = el.parentElement;
                    next = el.nextSibling;
                }

                return output;

                function teardown() {
                    var insertion = dontClone ? el : el.cloneNode(true),
                        reference = null;

                    if (next && parent && next.parentNode === parent) {
                        reference = next;
                    }

                    animating = true;

                    setTimeout(function resetAnimationFlag () {
                        animating = false;
                    }, 0);

                    parent.insertBefore(insertion, reference);
                    outgoing(insertion, function destroy () {
                        if (parent.contains(insertion)) {
                            parent.removeChild(insertion);
                        }
                    }, context);
                }
            }
        };
    };

    function noop() {
        console.log('3');
    }
    return animator;
}());

},{}],13:[function(require,module,exports){
/**
 * DOM utilities.
 */
module.exports = (function (doc) {
    'use strict';

    /**
	 * Detects the supported property name for the "transitionend" event. (transition)
	 * @returns {string} The supported property name.
	 */
    function whichTransitionEvent() {
        var key,
            el = doc.createElement('div'),
            transitions = {
                'transition': 'transitionend',
                'OTransition': 'oTransitionEnd',
                'MozTransition': 'transitionend',
                'WebkitTransition': 'webkitTransitionEnd'
            };

        for (key in transitions) {
            if (transitions.hasOwnProperty(key)) {
                if (el.style[key] !== undefined) {
                    el = null;
                    return transitions[key];
                }
            }
        }
    }

    /**
	 * Detects the supported property name for the "animationend" event. (keyframes)
	 * @returns {string} The supported property name.
	 */
    function whichAnimationEvent() {
        var key,
            el = doc.createElement('div'),
            animations = {
                'animation': 'animationend',
                'OAnimation': 'oAnimationEnd',
                'MozAnimation': 'animationend',
                'WebkitAnimation': 'webkitAnimationEnd'
            };

        for (key in animations) {
            if (animations.hasOwnProperty(key)) {
                if (el.style[key] !== undefined) {
                    el = null;
                    return animations[key];
                }
            }
        }
    }

    /**
	 * Detects if a device is touch enabled.
	 */
    function isTouchDevice() {
        var ua = navigator.userAgent;
        return 'ontouchstart' in doc.documentElement ||
            ua.indexOf('iPad') !== -1 ||
            ua.indexOf('iPhone') !== -1;
    }

    return {
        whichTransitionEvent: whichTransitionEvent,
        whichAnimationEvent: whichAnimationEvent,
        isTouchDevice: isTouchDevice
    };
}(document));

},{}],14:[function(require,module,exports){
/**
 * Objects utilities.
 */
module.exports = (function () {
    'use strict';

    /**
     * Merges (deep copy) the contents of two or more objects together into the first object.
     * @param {Object} target The object to extend. It will receive the new properties.
     * @param {Object} object1 An object containing additional properties to merge in.
     * @param {Object} objectN Additional objects containing properties to merge in.
     * @use extend({}, obj1, objN)
    */
    function extend() {
        for (var i = 1, l = arguments.length; i < l; i++) {
            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    if (arguments[i][key] && arguments[i][key].constructor && arguments[i][key].constructor === Object) {
                        arguments[0][key] = arguments[0][key] || {};
                        extend(arguments[0][key], arguments[i][key]);
                    } else {
                        arguments[0][key] = arguments[i][key];
                    }
                }
            }
        }
        return arguments[0];
    }

    return {
        extend: extend
    };
}());

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyIsInNyYy9qcy9jb21wb25lbnRzL21vZGFsLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvbmF2LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvcGFnZXMvYWJvdXQuanMiLCJzcmMvanMvY29tcG9uZW50cy9wYWdlcy9jb250YWN0cy5qcyIsInNyYy9qcy9jb21wb25lbnRzL3BhZ2VzL2Rhc2hib2FyZC5qcyIsInNyYy9qcy9jb21wb25lbnRzL3BhZ2VzL3VzZXJwcm9maWxlLmpzIiwic3JjL2pzL2xpYi9mYXN0Y2xpY2suanMiLCJzcmMvanMvbGliL21pdGhyaWwuanMiLCJzcmMvanMvbGliL3B1YnN1Yi5qcyIsInNyYy9qcy9yb3V0ZXIuanMiLCJzcmMvanMvdXRpbHMvYW5pbWF0b3IuanMiLCJzcmMvanMvdXRpbHMvZG9tLmpzIiwic3JjL2pzL3V0aWxzL29iamVjdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3gwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcHRDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uICh3aW4sIGRvYykge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHdpbi5tID0gcmVxdWlyZSgnLi9saWIvbWl0aHJpbCcpO1xyXG4gICAgd2luLmFwcCA9IHdpbi5hcHAgfHwge307XHJcblxyXG4gICAgdmFyIGF0dGFjaEZhc3RDbGljayA9IHJlcXVpcmUoJy4vbGliL2Zhc3RjbGljaycpO1xyXG4gICAgYXR0YWNoRmFzdENsaWNrKGRvYy5ib2R5KTtcclxuXHJcbiAgICB2YXIgcm91dGVyID0gcmVxdWlyZSgnLi9yb3V0ZXInKTtcclxuICAgIHJvdXRlci5pbml0KHtcclxuICAgICAgICBkYXNoYm9hcmQ6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9wYWdlcy9kYXNoYm9hcmQnKSxcclxuICAgICAgICB1c2VycHJvZmlsZTogcmVxdWlyZSgnLi9jb21wb25lbnRzL3BhZ2VzL3VzZXJwcm9maWxlJyksXHJcbiAgICAgICAgYWJvdXQ6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9wYWdlcy9hYm91dCcpLFxyXG4gICAgICAgIGNvbnRhY3RzOiByZXF1aXJlKCcuL2NvbXBvbmVudHMvcGFnZXMvY29udGFjdHMnKVxyXG4gICAgfSk7XHJcblxyXG4gICAgdmFyIG5hdiA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9uYXYnKTtcclxuICAgIG5hdi5yZW5kZXIoKTtcclxufSh3aW5kb3csIGRvY3VtZW50KSk7XHJcbiIsIi8qKlxyXG4gKiBNaXRocmlsLUJvb3RzdHJhcC1Nb2RhbFxyXG4gKiBBIE1pdGhyaWwgaW1wbGVtZW50YXRpb24gb2YgYSBCb290c3RyYXAgMyBtb2RhbCBkaWFsb2cuXHJcbiAqIEB2ZXJzaW9uIDAuMC4xXHJcbiAqIEBob21lcGFnZSBodHRwczovL2dpdGh1Yi5jb20vZ2VvcmFwYm94L01pdGhyaWwtQm9vdHN0cmFwLU1vZGFsXHJcbiAqIEBhdXRob3IgR2VvcmdlIFJhcHRpcyAoaHR0cHM6Ly9naXRodWIuY29tL2dlb3JhcGJveClcclxuICpcclxuICogVGhlIE1JVCBMaWNlbnNlIChNSVQpXHJcbiAqXHJcbiAqIENvcHlyaWdodCAoYykgMjAxNSBHZW9yZ2UgUmFwdGlzXHJcbiAqXHJcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxyXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXHJcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcclxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXHJcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XHJcbiAqXHJcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxyXG4gKiBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxyXG4gKlxyXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxyXG4gKiBTT0ZUV0FSRS5cclxuICovXHJcbihmdW5jdGlvbiAobmFtZSwgY29udGV4dCwgZGVmaW5pdGlvbikge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcclxuICAgICAgICBkZWZpbmUoZGVmaW5pdGlvbik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnRleHRbbmFtZV0gPSBkZWZpbml0aW9uKCk7XHJcbiAgICB9XHJcbn0oJ01vZGFsJywgdGhpcywgZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIG1vZGFsIGluc3RhbmNlLlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIE1vZGFsKCkge1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICB2YXIgbW9kYWxDb25maWcgPSBmdW5jdGlvbiAoZWxlbWVudCwgaXNJbml0aWFsaXplZCwgY29udGV4dCkge1xyXG4gICAgICAgICAgICBpZiAoIWlzSW5pdGlhbGl6ZWQpIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZmFkZWluJyk7XHJcbiAgICAgICAgICAgICAgICB9LCA1MCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGhhbmRsZUtleSA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMjcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbS5zdGFydENvbXB1dGF0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtLmVuZENvbXB1dGF0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaGFuZGxlQ2xpY2tPdXRzaWRlID0gIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbW9kYWwnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtLnN0YXJ0Q29tcHV0YXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG0uZW5kQ29tcHV0YXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVLZXksIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVDbGlja091dHNpZGUsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm9udW5sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVDbGlja091dHNpZGUsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlS2V5LCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gR2V0dGVyIC8gU2V0dGVyIGZvciBtb2RhbCdzIHZpc2liaWxpdHkgc3RhdHVzLlxyXG4gICAgICAgIHRoaXMudmlzaWJsZSA9IG0ucHJvcChmYWxzZSk7XHJcblxyXG4gICAgICAgIC8vIFRoZSBtb2RhbCdzIHZpZXcuXHJcbiAgICAgICAgdGhpcy52aWV3ID0gZnVuY3Rpb24gKG9wdHMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaWJsZSgpID9cclxuICAgICAgICAgICAgICAgIG0oJy5tb2RhbCcsIHtjb25maWc6IG1vZGFsQ29uZmlnfSwgW1xyXG4gICAgICAgICAgICAgICAgICAgIG0oJy5tb2RhbC1kaWFsb2cnLCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG0oJy5tb2RhbC1jb250ZW50JywgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5oZWFkZXIgPyBtKCcubW9kYWwtaGVhZGVyJywgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oJ2EuY2xvc2UnLCB7b25jbGljazogdGhpcy5oaWRlLmJpbmQodGhpcyl9LCBtLnRydXN0KCcmdGltZXM7JykpLCBvcHRzLmhlYWRlcigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKSA6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5ib2R5ID8gbSgnLm1vZGFsLWJvZHknLCBvcHRzLmJvZHkoKSkgOiAnJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuZm9vdGVyID8gbSgnLm1vZGFsLWZvb3RlcicsIG9wdHMuZm9vdGVyKCkpIDogJydcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSlcclxuICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgXSkgOiAnJztcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBwcm90byA9IE1vZGFsLnByb3RvdHlwZTtcclxuXHJcbiAgICBwcm90by5zaG93ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMudmlzaWJsZSA9IG0ucHJvcCh0cnVlKTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ21vZGFsLW9wZW4nKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJvdG8uaGlkZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnZpc2libGUgPSBtLnByb3AoZmFsc2UpO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtb3BlbicpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcm90by5pc1Zpc2libGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmlzaWJsZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gTW9kYWw7XHJcbn0pKTtcclxuIiwiLyoqXHJcbiAqIE1haW4gbmF2aWdhdGlvbiBjb21wb25lbnQuXHJcbiAqIEByZXR1cm5zIHtvYmplY3R9IFRoZSBuYXYgbW9kdWxlLlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGRvYykge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBuYXYgPSB7fTtcclxuXHJcbiAgICBuYXYudmlldyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gbSgndWwubmF2Lm5hdi10YWJzJywgW1xyXG4gICAgICAgICAgICBtKCdsaS5kYXNoYm9hcmQnLCBbXHJcbiAgICAgICAgICAgICAgICBtKCdhW2hyZWY9XCIvZGFzaGJvYXJkXCJdJywge2NvbmZpZzogbS5yb3V0ZX0sICdEYXNoYm9hcmQnKVxyXG4gICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgbSgnbGkuYWJvdXQnLCBbXHJcbiAgICAgICAgICAgICAgICBtKCdhW2hyZWY9XCIvYWJvdXRcIl0nLCB7Y29uZmlnOiBtLnJvdXRlfSwgJ0Fib3V0JylcclxuICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgIG0oJ2xpLmNvbnRhY3QnLCBbXHJcbiAgICAgICAgICAgICAgICBtKCdhW2hyZWY9XCIvY29udGFjdHNcIl0nLCB7Y29uZmlnOiBtLnJvdXRlfSwgJ0NvbnRhY3RzJylcclxuICAgICAgICAgICAgXSlcclxuICAgICAgICBdKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbS5yZW5kZXIoZG9jLmdldEVsZW1lbnRCeUlkKCdqc19uYXYnKSwgbmF2LnZpZXcoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufShkb2N1bWVudCkpO1xyXG4iLCIvKipcclxuICogQWJvdXQgcGFnZS5cclxuICogQHJldHVybnMge29iamVjdH0gVGhlIGFib3V0IG1vZHVsZS5cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgTW9kYWwgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL21vZGFsJyksXHJcbiAgICAgICAgYWJvdXRNb2RhbCA9IG5ldyBNb2RhbCgpO1xyXG5cclxuICAgIHZhciBhYm91dCA9IHt9O1xyXG5cclxuICAgIGFib3V0LmNvbnRyb2xsZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5vbnVubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYWJvdXRNb2RhbC5oaWRlKCk7XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcblxyXG4gICAgYWJvdXQudmlldyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gbSgnZGl2Lm0tcGFnZScsIFtcclxuICAgICAgICAgICAgbSgnaDInLCB7XHJcbiAgICAgICAgICAgICAgICBjb25maWc6IGFib3V0LnZtLmNsaWNrTWVcclxuICAgICAgICAgICAgfSwgbS50cnVzdCgnQWJvdXQgcGFnZSA8c3BhbiBzdHlsZT1cImZvbnQtc2l6ZToxNHB4O1wiPihjbGljayBtZSk8L3NwYW4+JykpLFxyXG5cclxuICAgICAgICAgICAgbSgncCcsICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gVGVtcG9yYSB2b2x1cHRhdGVtLCBzaW50IG5lY2Vzc2l0YXRpYnVzIGJlYXRhZSwgcGVyc3BpY2lhdGlzIGRlc2VydW50IHByYWVzZW50aXVtIGl1c3RvLCBkaXN0aW5jdGlvIGNvcnJ1cHRpLCBsYWJvcnVtIGN1cGlkaXRhdGUgdXQuIFZlcml0YXRpcyBlb3MgaXVyZSBldmVuaWV0LCBuaXNpLCBtb2xsaXRpYSBwYXJpYXR1ciB1bmRlPycpLFxyXG5cclxuICAgICAgICAgICAgbSgncCcsICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gVGVtcG9yYSB2b2x1cHRhdGVtLCBzaW50IG5lY2Vzc2l0YXRpYnVzIGJlYXRhZSwgcGVyc3BpY2lhdGlzIGRlc2VydW50IHByYWVzZW50aXVtIGl1c3RvLCBkaXN0aW5jdGlvIGNvcnJ1cHRpLCBsYWJvcnVtIGN1cGlkaXRhdGUgdXQuIFZlcml0YXRpcyBlb3MgaXVyZSBldmVuaWV0LCBuaXNpLCBtb2xsaXRpYSBwYXJpYXR1ciB1bmRlPycpLFxyXG5cclxuICAgICAgICAgICAgbSgncCcsICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gVGVtcG9yYSB2b2x1cHRhdGVtLCBzaW50IG5lY2Vzc2l0YXRpYnVzIGJlYXRhZSwgcGVyc3BpY2lhdGlzIGRlc2VydW50IHByYWVzZW50aXVtIGl1c3RvLCBkaXN0aW5jdGlvIGNvcnJ1cHRpLCBsYWJvcnVtIGN1cGlkaXRhdGUgdXQuIFZlcml0YXRpcyBlb3MgaXVyZSBldmVuaWV0LCBuaXNpLCBtb2xsaXRpYSBwYXJpYXR1ciB1bmRlPycpLFxyXG5cclxuICAgICAgICAgICAgbSgncCcsICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gVGVtcG9yYSB2b2x1cHRhdGVtLCBzaW50IG5lY2Vzc2l0YXRpYnVzIGJlYXRhZSwgcGVyc3BpY2lhdGlzIGRlc2VydW50IHByYWVzZW50aXVtIGl1c3RvLCBkaXN0aW5jdGlvIGNvcnJ1cHRpLCBsYWJvcnVtIGN1cGlkaXRhdGUgdXQuIFZlcml0YXRpcyBlb3MgaXVyZSBldmVuaWV0LCBuaXNpLCBtb2xsaXRpYSBwYXJpYXR1ciB1bmRlPycpLFxyXG5cclxuICAgICAgICAgICAgbSgnYS5idG4uYnRuLXByaW1hcnknLCB7XHJcbiAgICAgICAgICAgICAgICBvbmNsaWNrOiBhYm91dE1vZGFsLnNob3cuYmluZChhYm91dE1vZGFsKVxyXG4gICAgICAgICAgICB9LCAnU2hvdyBtb2RhbCcpLFxyXG5cclxuICAgICAgICAgICAgYWJvdXRNb2RhbC52aWV3KHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtKCdoNC5tb2RhbC10aXRsZScsICdMb3JlbSBpcHN1bScpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGJvZHk6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbSgncCcsICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gVGVtcG9yYSB2b2x1cHRhdGVtLCBzaW50IG5lY2Vzc2l0YXRpYnVzIGJlYXRhZSwgcGVyc3BpY2lhdGlzIGRlc2VydW50IHByYWVzZW50aXVtIGl1c3RvLCBkaXN0aW5jdGlvIGNvcnJ1cHRpLCBsYWJvcnVtIGN1cGlkaXRhdGUgdXQuIFZlcml0YXRpcyBlb3MgaXVyZSBldmVuaWV0LCBuaXNpLCBtb2xsaXRpYSBwYXJpYXR1ciB1bmRlPycpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZvb3RlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtKCdhLmJ0bi5idG4tZGVmYXVsdCcsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25jbGljazogYWJvdXRNb2RhbC5oaWRlLmJpbmQoYWJvdXRNb2RhbClcclxuICAgICAgICAgICAgICAgICAgICB9LCAnQ2xvc2UnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdKTtcclxuICAgIH07XHJcblxyXG4gICAgYWJvdXQudm0gPSB7XHJcbiAgICAgICAgY2xpY2tNZTogZnVuY3Rpb24gKGVsZW1lbnQsIGlzSW5pdGlhbGl6ZWQsIGNvbnRleHQsIHZkb20pIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gbG9nKCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2VsZW1lbnQ6JywgZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaXNJbml0aWFsaXplZDonLCBpc0luaXRpYWxpemVkKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjb250ZXh0OicsIGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3Zkb206JywgdmRvbSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICFpc0luaXRpYWxpemVkICYmIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBsb2csIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQub251bmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUmVtb3ZpbmcgZXZlbnQgbGlzdGVuZXIgZnJvbSAnICsgZWxlbWVudC5ub2RlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbG9nLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gYWJvdXQ7XHJcbn0oKSk7XHJcbiIsIi8qKlxyXG4gKiBDb250YWN0IHBhZ2UuXHJcbiAqIEByZXR1cm5zIHtvYmplY3R9IFRoZSBjb250YWN0IG1vZHVsZS5cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgUHViU3ViID0gcmVxdWlyZSgnLi4vLi4vbGliL3B1YnN1YicpLFxyXG4gICAgICAgIHBzID0gbmV3IFB1YlN1YigpO1xyXG5cclxuICAgIHZhciBNb2RhbCA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvbW9kYWwnKSxcclxuICAgICAgICBuZXdDb250YWN0TW9kYWwgPSBuZXcgTW9kYWwoKTtcclxuXHJcbiAgICAvLyBIYXJkY29kZWQgY29udGFjdHMgZGF0YVxyXG4gICAgdmFyIGNvbnRhY3RzRGF0YSA9IFt7XHJcbiAgICAgICAgdXNlcm5hbWU6ICdqb2huZG9lJyxcclxuICAgICAgICBuYW1lOiAnSm9obiBEb2UnLFxyXG4gICAgICAgIGVtYWlsOiAnam9obmRvZUBob3RtYWlsLmNvbSdcclxuICAgIH0sIHtcclxuICAgICAgICB1c2VybmFtZTogJ2dlb3JhcGJveCcsXHJcbiAgICAgICAgbmFtZTogJ0dlb3JnZSBSYXB0aXMnLFxyXG4gICAgICAgIGVtYWlsOiAnZ2VvcmFwYm94QGdtYWlsLmNvbSdcclxuICAgIH0sIHtcclxuICAgICAgICB1c2VybmFtZTogJ21hcnlsb3UnLFxyXG4gICAgICAgIG5hbWU6ICdNYXJ5IExvdScsXHJcbiAgICAgICAgZW1haWw6ICdtbG91QHlhaG9vLmNvbSdcclxuICAgIH0sIHtcclxuICAgICAgICB1c2VybmFtZTogJ3RkdW5jYW4nLFxyXG4gICAgICAgIG5hbWU6ICdUaW0gRHVuY2FuJyxcclxuICAgICAgICBlbWFpbDogJ3RkdW5jYW5AZ21haWwuY29tJ1xyXG4gICAgfV07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBWaWV3TW9kZWwgaGVscGVyIGZhY3RvcnkuXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gc2lnbmF0dXJlXHJcbiAgICAgKiBAcmV0dXJucyB7ZnVuY3Rpb259XHJcbiAgICAgKi9cclxuICAgIHZhciB2aWV3TW9kZWxNYXAgPSBmdW5jdGlvbiAoc2lnbmF0dXJlKSB7XHJcbiAgICAgICAgdmFyIG1hcCA9IHt9O1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIGlmICghbWFwW2tleV0pIHtcclxuICAgICAgICAgICAgICAgIG1hcFtrZXldID0ge307XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIHNpZ25hdHVyZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzaWduYXR1cmUuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwW2tleV1bcHJvcF0gPSBtLnByb3Aoc2lnbmF0dXJlW3Byb3BdKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbWFwW2tleV07XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gQ29udGFjdCBtb2RlbFxyXG4gICAgdmFyIENvbnRhY3QgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgIGRhdGEgPSBkYXRhIHx8IHt9O1xyXG4gICAgICAgIHRoaXMuaWQgPSBtLnByb3AoZGF0YS5pZCk7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbS5wcm9wKGRhdGEubmFtZSk7XHJcbiAgICAgICAgdGhpcy5lbWFpbCA9IG0ucHJvcChkYXRhLmVtYWlsKTtcclxuICAgIH07XHJcblxyXG4gICAgQ29udGFjdC5saXN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8qcmV0dXJuIG0ucmVxdWVzdCh7XHJcblx0XHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHRcdHVybDogJy4uL2RhdGEvdXNlcnMuanNvbidcclxuXHRcdH0pOyovXHJcblxyXG4gICAgICAgIG0uc3RhcnRDb21wdXRhdGlvbigpO1xyXG5cclxuICAgICAgICB2YXIgZGVmZXJyZWQgPSBtLmRlZmVycmVkKCk7XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGNvbnRhY3RzRGF0YSk7XHJcbiAgICAgICAgICAgIG0uZW5kQ29tcHV0YXRpb24oKTtcclxuICAgICAgICB9LCAwKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIENvbnRhY3Quc2F2ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgLypyZXR1cm4gbS5yZXF1ZXN0KHtcclxuXHRcdFx0bWV0aG9kOiAnUE9TVCcsXHJcblx0XHRcdHVybDogJy4uL2RhdGEvdXNlcnMuanNvbicsXHJcblx0XHRcdGRhdGE6IGRhdGFcclxuXHRcdH0pOyovXHJcblxyXG4gICAgICAgIHZhciBkZWZlcnJlZCA9IG0uZGVmZXJyZWQoKTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBuZXdDb250YWN0ID0ge1xyXG4gICAgICAgICAgICAgICAgaWQ6IGNvbnRhY3RzRGF0YS5sZW5ndGggKyAxLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogZGF0YS5uYW1lKCksXHJcbiAgICAgICAgICAgICAgICBlbWFpbDogZGF0YS5lbWFpbCgpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBjb250YWN0c0RhdGEucHVzaChuZXdDb250YWN0KTtcclxuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShuZXdDb250YWN0KTtcclxuICAgICAgICB9LCAwKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIENvbnRhY3RGb3JtIGNvbXBvbmVudFxyXG4gICAgdmFyIENvbnRhY3RGb3JtID0ge1xyXG4gICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uIChhcmdzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGFjdCA9IG0ucHJvcChhcmdzLmNvbnRhY3QgfHwgbmV3IENvbnRhY3QoKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICB2aWV3OiBmdW5jdGlvbiAoY3RybCwgYXJncykge1xyXG4gICAgICAgICAgICB2YXIgY29udGFjdCA9IGN0cmwuY29udGFjdCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlucHV0Q29uZmlnID0gZnVuY3Rpb24gKGVsZW1lbnQsIGlzSW5pdGlhbGl6ZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmICghaXNJbml0aWFsaXplZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBtKCdmb3JtJywgW1xyXG4gICAgICAgICAgICAgICAgbSgnLmZvcm0tZ3JvdXAnLCBbXHJcbiAgICAgICAgICAgICAgICAgICAgbSgnbGFiZWwnLCAnTmFtZScpLFxyXG4gICAgICAgICAgICAgICAgICAgIG0oJ2lucHV0LmZvcm0tY29udHJvbCcsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogJ2VnOiBHZW9yZ2UgUmFwdGlzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25pbnB1dDogbS53aXRoQXR0cigndmFsdWUnLCBjb250YWN0Lm5hbWUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogY29udGFjdC5uYW1lKCkgfHwgJycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogaW5wdXRDb25maWdcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgXSksXHJcblxyXG4gICAgICAgICAgICAgICAgbSgnLmZvcm0tZ3JvdXAnLCBbXHJcbiAgICAgICAgICAgICAgICAgICAgbSgnbGFiZWwnLCAnRW1haWwnKSxcclxuICAgICAgICAgICAgICAgICAgICBtKCdpbnB1dC5mb3JtLWNvbnRyb2wnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbWFpbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAnZWc6IGdlb3JhcGJveEBnbWFpbC5jb20nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbmlucHV0OiBtLndpdGhBdHRyKCd2YWx1ZScsIGNvbnRhY3QuZW1haWwpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogY29udGFjdC5lbWFpbCgpIHx8ICcnXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIF0pLFxyXG5cclxuICAgICAgICAgICAgICAgIG0oJ2J1dHRvblt0eXBlPWJ1dHRvbl0uYnRuLmJ0bi1wcmltYXJ5Jywge1xyXG4gICAgICAgICAgICAgICAgICAgIG9uY2xpY2s6IGFyZ3Mub25zYXZlLmJpbmQodGhpcywgY29udGFjdClcclxuICAgICAgICAgICAgICAgIH0sICdTYXZlJylcclxuICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBDb250YWN0TGlzdCBjb21wb25lbnRcclxuICAgIHZhciBDb250YWN0c0xpc3QgPSB7XHJcbiAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBwcy5vbignVVBEQVRFX0NPTlRBQ1QnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmluZm8oJ1VQREFURUQnKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbnRhY3RzVk0gPSB2aWV3TW9kZWxNYXAoe1xyXG4gICAgICAgICAgICAgICAgaXNFZGl0aW5nOiBtLnByb3AoZmFsc2UpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdmlldzogZnVuY3Rpb24gKGN0cmwsIGFyZ3MpIHtcclxuICAgICAgICAgICAgdmFyIGZhZGVzSW4gPSBmdW5jdGlvbiAoZWxlbWVudCwgaXNJbml0aWFsaXplZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpc0luaXRpYWxpemVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMTtcclxuICAgICAgICAgICAgICAgICAgICB9LCA1MCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbSgnLnRhYmxlLXJlc3BvbnNpdmUnLCBbXHJcbiAgICAgICAgICAgICAgICBtKCd0YWJsZS50YWJsZS50YWJsZS1ib3JkZXJlZCcsIFtcclxuICAgICAgICAgICAgICAgICAgICBtKCd0aGVhZCcsIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbSgndHInLCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKCd0aCcsICcjJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKCd0aCcsICdOYW1lJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKCd0aCcsICdFbWFpbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbSgndGgnLCAnJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSlcclxuICAgICAgICAgICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgICAgICAgICBtKCd0Ym9keScsIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJncy5jb250YWN0cygpLm1hcChmdW5jdGlvbiAoY29udGFjdCwgaWR4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdm0gPSBjdHJsLmNvbnRhY3RzVk0oY29udGFjdC5lbWFpbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbSgndHIuY29udGFjdC1pdGVtJywge2tleTogY29udGFjdC5lbWFpbCwgY29uZmlnOiBmYWRlc0lufSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oJ3RoJywgKytpZHgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oJ3RkJywgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5pc0VkaXRpbmcoKSA/XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKCdpbnB1dC5mb3JtLWNvbnRyb2wnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGNvbnRhY3QubmFtZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkgOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFjdC5uYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSksXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oJ3RkJywgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5pc0VkaXRpbmcoKSA/XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKCdpbnB1dC5mb3JtLWNvbnRyb2wnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25pbnB1dDogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG0ud2l0aEF0dHIoJ3ZhbHVlJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUudGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogY29udGFjdC5lbWFpbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkgOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFjdC5lbWFpbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pLFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKCd0ZCcsIHtzdHlsZTogJ3RleHQtYWxpZ246Y2VudGVyOyd9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmlzRWRpdGluZygpID9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbSgnYVtocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApO1wiXScsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5pc0VkaXRpbmcoIXZtLmlzRWRpdGluZygpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgJ1NhdmUnKSA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oJ2FbaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKTtcIl0nLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uaXNFZGl0aW5nKCF2bS5pc0VkaXRpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sICdFZGl0JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgXSlcclxuICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgIF0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gQ29udGFjdHNXaWRnZXQgY29tcG9uZW50XHJcbiAgICAvLyBDZW50cmFsaXplZCBtb2R1bGUsIHJlc3BvbnNpYmxlIGZvciBpbnRlcmZhY2luZyB3aXRoIHRoZSBtb2RlbCBsYXllclxyXG4gICAgdmFyIENvbnRhY3RzV2lkZ2V0ID0ge307XHJcblxyXG4gICAgQ29udGFjdHNXaWRnZXQuY29udHJvbGxlciA9IGZ1bmN0aW9uIHVwZGF0ZSAoKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWN0cyA9IENvbnRhY3QubGlzdCgpO1xyXG5cclxuICAgICAgICB0aGlzLnNhdmUgPSBmdW5jdGlvbiAoY29udGFjdCkge1xyXG4gICAgICAgICAgICBDb250YWN0LlxyXG4gICAgICAgICAgICAgICAgc2F2ZShjb250YWN0KS5cclxuICAgICAgICAgICAgICAgIHRoZW4odXBkYXRlLmJpbmQodGhpcykpLlxyXG4gICAgICAgICAgICAgICAgdGhlbihuZXdDb250YWN0TW9kYWwuaGlkZSgpKTtcclxuXHJcbiAgICAgICAgICAgIHBzLnRyaWdnZXIoJ1VQREFURV9DT05UQUNUJyk7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLm9udW5sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQ29udGFjdHNXaWRnZXQgdW5sb2FkZWQgLS0+IFVuc3Vic2NyaWJlIGZvcm0gZXZlbnRzJyk7XHJcbiAgICAgICAgICAgIHBzLm9mZignVVBEQVRFX0NPTlRBQ1QnKTtcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuXHJcbiAgICBDb250YWN0c1dpZGdldC52aWV3ID0gZnVuY3Rpb24gKGN0cmwpIHtcclxuICAgICAgICByZXR1cm4gbSgnZGl2Lm0tcGFnZScsIFtcclxuICAgICAgICAgICAgbSgnaDInLCAnQ29udGFjdHMnKSxcclxuXHJcbiAgICAgICAgICAgIG0oJ3AucHVsbC1yaWdodCcsIFtcclxuICAgICAgICAgICAgICAgIG0oJ2EuYnRuLmJ0bi1wcmltYXJ5Jywge1xyXG4gICAgICAgICAgICAgICAgICAgIG9uY2xpY2s6IG5ld0NvbnRhY3RNb2RhbC5zaG93LmJpbmQobmV3Q29udGFjdE1vZGFsKVxyXG4gICAgICAgICAgICAgICAgfSwgJ0FkZCBuZXcgY29udGFjdCcpXHJcbiAgICAgICAgICAgIF0pLFxyXG5cclxuICAgICAgICAgICAgbSgnLmNsZWFyJyksXHJcblxyXG4gICAgICAgICAgICBuZXdDb250YWN0TW9kYWwudmlldyh7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbSgnaDQubW9kYWwtdGl0bGUnLCAnTmV3IGNvbnRhY3QnKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBib2R5OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG0uY29tcG9uZW50KENvbnRhY3RGb3JtLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uc2F2ZTogY3RybC5zYXZlXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLFxyXG5cclxuICAgICAgICAgICAgbS5jb21wb25lbnQoQ29udGFjdHNMaXN0LCB7XHJcbiAgICAgICAgICAgICAgICBjb250YWN0czogY3RybC5jb250YWN0c1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIF0pO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gQ29udGFjdHNXaWRnZXQ7XHJcbn0oKSk7XHJcbiIsIi8qKlxyXG4gKiBEYXNoYm9hcmQgcGFnZS5cclxuICogQHJldHVybnMge29iamVjdH0gVGhlIGRhc2hib2FyZCBtb2R1bGUuXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIFVzZXIgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBtLnByb3AoZGF0YS5pZCk7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbS5wcm9wKGRhdGEubmFtZSk7XHJcbiAgICAgICAgdGhpcy51c2VybmFtZSA9IG0ucHJvcChkYXRhLnVzZXJuYW1lKTtcclxuICAgIH07XHJcblxyXG4gICAgVXNlci5saXN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBtLnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6ICcuLi9kYXRhL3VzZXJzLmpzb24nLFxyXG4gICAgICAgICAgICB0eXBlOiBVc2VyXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIFVzZXIubGlzdEV2ZW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG0ucmVxdWVzdCh7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgIHVybDogJy4uL2RhdGEvdXNlcnMuanNvbicsXHJcbiAgICAgICAgICAgIHR5cGU6IFVzZXJcclxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChsaXN0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsaXN0LmZpbHRlcihmdW5jdGlvbiAodXNlcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVzZXIuaWQoKSAlIDIgPT09IDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgZGFzaGJvYXJkID0ge307XHJcblxyXG4gICAgZGFzaGJvYXJkLmNvbnRyb2xsZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IG0ucm91dGUucGFyYW0oJ3VzZXJOYW1lJyk7XHJcbiAgICAgICAgdGhpcy5lcnJvciA9IG0ucHJvcCgnRVJST1InKTtcclxuICAgICAgICB0aGlzLnVzZXJzID0gVXNlci5saXN0KCkudGhlbihmdW5jdGlvbiAodXNlcnMpIHtcclxuICAgICAgICAgICAgZGFzaGJvYXJkLnZtLmluaXQodXNlcnMpO1xyXG4gICAgICAgIH0sIHRoaXMuZXJyb3IpO1xyXG4gICAgfTtcclxuXHJcbiAgICBkYXNoYm9hcmQudm0gPSB7XHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKHVzZXJzKSB7XHJcbiAgICAgICAgICAgIGRhc2hib2FyZC52bS51c2VycyA9IHVzZXJzO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZGFzaGJvYXJkLnZpZXcgPSBmdW5jdGlvbiAoY29udHJvbGxlcikge1xyXG4gICAgICAgIHJldHVybiBtKCdkaXYubS1wYWdlJywgW1xyXG4gICAgICAgICAgICBtKCd1bCcsIFtcclxuICAgICAgICAgICAgICAgIGRhc2hib2FyZC52bS51c2Vycy5tYXAoZnVuY3Rpb24gKHVzciwgaWR4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG0oJ2xpJywge2tleTogdXNyLmlkfSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtKCdhW2hyZWY9XCIvZGFzaGJvYXJkLycgKyB1c3IudXNlcm5hbWUoKSArICdcIl0nLCB7Y29uZmlnOiBtLnJvdXRlfSwgdXNyLm5hbWUoKSlcclxuICAgICAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIF0pLFxyXG4gICAgICAgICAgICBtKCdoMicsIGNvbnRyb2xsZXIuaWQgPyAoJ0hlbGxvICcgKyBjb250cm9sbGVyLmlkKSA6ICdUaGlzIGlzIHRoZSBkYXNoYm9hcmQuJyksXHJcbiAgICAgICAgICAgIG0oJ3AnLCB7c3R5bGU6IGNvbnRyb2xsZXIuaWQgPyAnZGlzcGxheTpibG9jaycgOiAnZGlzcGxheTpub25lJ30sIFtcclxuICAgICAgICAgICAgICAgIG0oJ2FbaHJlZj1cIi91c2VycHJvZmlsZS8nICsgY29udHJvbGxlci5pZCArICdcIl0nLCB7Y29uZmlnOiBtLnJvdXRlfSwgJ1JlYWQgbW9yZScpXHJcbiAgICAgICAgICAgIF0pXHJcbiAgICAgICAgXSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBkYXNoYm9hcmQ7XHJcbn0oKSk7XHJcbiIsIi8qKlxyXG4gKiBVc2VyIFByb2ZpbGUgcGFnZS5cclxuICogQHJldHVybnMge29iamVjdH0gVGhlIHVzZXJwcm9maWxlIG1vZHVsZS5cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgVXNlciA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IG0ucHJvcChkYXRhLmlkKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSBtLnByb3AoZGF0YS5uYW1lKTtcclxuICAgICAgICB0aGlzLnVzZXJuYW1lID0gbS5wcm9wKGRhdGEudXNlcm5hbWUpO1xyXG4gICAgICAgIHRoaXMuZW1haWwgPSBtLnByb3AoZGF0YS5lbWFpbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIFVzZXIuZ2V0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBtLnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICB1cmw6ICcuLi9kYXRhL3VzZXJzLmpzb24nLFxyXG4gICAgICAgICAgICB0eXBlOiBVc2VyXHJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAobGlzdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbGlzdC5maWx0ZXIoZnVuY3Rpb24gKHVzZXIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB1c2VyLnVzZXJuYW1lKCkgPT09IG0ucm91dGUucGFyYW0oJ3VzZXJOYW1lJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgdXNlcnByb2ZpbGUgPSB7fTtcclxuXHJcbiAgICB1c2VycHJvZmlsZS5jb250cm9sbGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBtLnJvdXRlLnBhcmFtKCd1c2VyTmFtZScpO1xyXG4gICAgICAgIHRoaXMuZXJyb3IgPSBtLnByb3AoJ0VSUk9SJyk7XHJcbiAgICAgICAgdGhpcy51c2VyID0gVXNlci5nZXQoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XHJcbiAgICAgICAgICAgIHVzZXJwcm9maWxlLnZtLmluaXQodXNlcik7XHJcbiAgICAgICAgfSwgdGhpcy5lcnJvcik7XHJcbiAgICB9O1xyXG5cclxuICAgIHVzZXJwcm9maWxlLnZtID0ge1xyXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uICh1c2VyKSB7XHJcbiAgICAgICAgICAgIHVzZXJwcm9maWxlLnZtLnVzZXIgPSB1c2VyO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgdXNlcnByb2ZpbGUudmlldyA9IGZ1bmN0aW9uIChjb250cm9sbGVyKSB7XHJcbiAgICAgICAgcmV0dXJuIG0oJ2Rpdi5tLXBhZ2UnLCBbXHJcbiAgICAgICAgICAgIHVzZXJwcm9maWxlLnZtLnVzZXIubWFwKGZ1bmN0aW9uICh1c3IsIGlkeCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG0oJ2RpdicsIFtcclxuICAgICAgICAgICAgICAgICAgICBtKCdoMicsIHVzci5uYW1lKCkpLFxyXG4gICAgICAgICAgICAgICAgICAgIG0oJ3AnLCAnVXNlcm5hbWU6ICcgKyB1c3IudXNlcm5hbWUoKSksXHJcbiAgICAgICAgICAgICAgICAgICAgbSgncCcsICdFbWFpbDogJyArIHVzci5lbWFpbCgpKSxcclxuICAgICAgICAgICAgICAgICAgICBtKCdhW2hyZWY9XCJqYXZhc2NyaXB0Om0ucm91dGUoXFwnL2Rhc2hib2FyZFxcJylcIl0nLCAnQmFjayB0byBEYXNoYm9hcmQnKVxyXG4gICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgXSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiB1c2VycHJvZmlsZTtcclxufSgpKTtcclxuIiwiOyhmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHQvKipcclxuXHQgKiBAcHJlc2VydmUgRmFzdENsaWNrOiBwb2x5ZmlsbCB0byByZW1vdmUgY2xpY2sgZGVsYXlzIG9uIGJyb3dzZXJzIHdpdGggdG91Y2ggVUlzLlxyXG5cdCAqXHJcblx0ICogQGNvZGluZ3N0YW5kYXJkIGZ0bGFicy1qc3YyXHJcblx0ICogQGNvcHlyaWdodCBUaGUgRmluYW5jaWFsIFRpbWVzIExpbWl0ZWQgW0FsbCBSaWdodHMgUmVzZXJ2ZWRdXHJcblx0ICogQGxpY2Vuc2UgTUlUIExpY2Vuc2UgKHNlZSBMSUNFTlNFLnR4dClcclxuXHQgKi9cclxuXHJcblx0Lypqc2xpbnQgYnJvd3Nlcjp0cnVlLCBub2RlOnRydWUqL1xyXG5cdC8qZ2xvYmFsIGRlZmluZSwgRXZlbnQsIE5vZGUqL1xyXG5cclxuXHJcblx0LyoqXHJcblx0ICogSW5zdGFudGlhdGUgZmFzdC1jbGlja2luZyBsaXN0ZW5lcnMgb24gdGhlIHNwZWNpZmllZCBsYXllci5cclxuXHQgKlxyXG5cdCAqIEBjb25zdHJ1Y3RvclxyXG5cdCAqIEBwYXJhbSB7RWxlbWVudH0gbGF5ZXIgVGhlIGxheWVyIHRvIGxpc3RlbiBvblxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIG9wdGlvbnMgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHRzXHJcblx0ICovXHJcblx0ZnVuY3Rpb24gRmFzdENsaWNrKGxheWVyLCBvcHRpb25zKSB7XHJcblx0XHR2YXIgb2xkT25DbGljaztcclxuXHJcblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFdoZXRoZXIgYSBjbGljayBpcyBjdXJyZW50bHkgYmVpbmcgdHJhY2tlZC5cclxuXHRcdCAqXHJcblx0XHQgKiBAdHlwZSBib29sZWFuXHJcblx0XHQgKi9cclxuXHRcdHRoaXMudHJhY2tpbmdDbGljayA9IGZhbHNlO1xyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFRpbWVzdGFtcCBmb3Igd2hlbiBjbGljayB0cmFja2luZyBzdGFydGVkLlxyXG5cdFx0ICpcclxuXHRcdCAqIEB0eXBlIG51bWJlclxyXG5cdFx0ICovXHJcblx0XHR0aGlzLnRyYWNraW5nQ2xpY2tTdGFydCA9IDA7XHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogVGhlIGVsZW1lbnQgYmVpbmcgdHJhY2tlZCBmb3IgYSBjbGljay5cclxuXHRcdCAqXHJcblx0XHQgKiBAdHlwZSBFdmVudFRhcmdldFxyXG5cdFx0ICovXHJcblx0XHR0aGlzLnRhcmdldEVsZW1lbnQgPSBudWxsO1xyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFgtY29vcmRpbmF0ZSBvZiB0b3VjaCBzdGFydCBldmVudC5cclxuXHRcdCAqXHJcblx0XHQgKiBAdHlwZSBudW1iZXJcclxuXHRcdCAqL1xyXG5cdFx0dGhpcy50b3VjaFN0YXJ0WCA9IDA7XHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogWS1jb29yZGluYXRlIG9mIHRvdWNoIHN0YXJ0IGV2ZW50LlxyXG5cdFx0ICpcclxuXHRcdCAqIEB0eXBlIG51bWJlclxyXG5cdFx0ICovXHJcblx0XHR0aGlzLnRvdWNoU3RhcnRZID0gMDtcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBJRCBvZiB0aGUgbGFzdCB0b3VjaCwgcmV0cmlldmVkIGZyb20gVG91Y2guaWRlbnRpZmllci5cclxuXHRcdCAqXHJcblx0XHQgKiBAdHlwZSBudW1iZXJcclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5sYXN0VG91Y2hJZGVudGlmaWVyID0gMDtcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBUb3VjaG1vdmUgYm91bmRhcnksIGJleW9uZCB3aGljaCBhIGNsaWNrIHdpbGwgYmUgY2FuY2VsbGVkLlxyXG5cdFx0ICpcclxuXHRcdCAqIEB0eXBlIG51bWJlclxyXG5cdFx0ICovXHJcblx0XHR0aGlzLnRvdWNoQm91bmRhcnkgPSBvcHRpb25zLnRvdWNoQm91bmRhcnkgfHwgMTA7XHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogVGhlIEZhc3RDbGljayBsYXllci5cclxuXHRcdCAqXHJcblx0XHQgKiBAdHlwZSBFbGVtZW50XHJcblx0XHQgKi9cclxuXHRcdHRoaXMubGF5ZXIgPSBsYXllcjtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFRoZSBtaW5pbXVtIHRpbWUgYmV0d2VlbiB0YXAodG91Y2hzdGFydCBhbmQgdG91Y2hlbmQpIGV2ZW50c1xyXG5cdFx0ICpcclxuXHRcdCAqIEB0eXBlIG51bWJlclxyXG5cdFx0ICovXHJcblx0XHR0aGlzLnRhcERlbGF5ID0gb3B0aW9ucy50YXBEZWxheSB8fCAyMDA7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBUaGUgbWF4aW11bSB0aW1lIGZvciBhIHRhcFxyXG5cdFx0ICpcclxuXHRcdCAqIEB0eXBlIG51bWJlclxyXG5cdFx0ICovXHJcblx0XHR0aGlzLnRhcFRpbWVvdXQgPSBvcHRpb25zLnRhcFRpbWVvdXQgfHwgNzAwO1xyXG5cclxuXHRcdGlmIChGYXN0Q2xpY2subm90TmVlZGVkKGxheWVyKSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU29tZSBvbGQgdmVyc2lvbnMgb2YgQW5kcm9pZCBkb24ndCBoYXZlIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kXHJcblx0XHRmdW5jdGlvbiBiaW5kKG1ldGhvZCwgY29udGV4dCkge1xyXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7IHJldHVybiBtZXRob2QuYXBwbHkoY29udGV4dCwgYXJndW1lbnRzKTsgfTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0dmFyIG1ldGhvZHMgPSBbJ29uTW91c2UnLCAnb25DbGljaycsICdvblRvdWNoU3RhcnQnLCAnb25Ub3VjaE1vdmUnLCAnb25Ub3VjaEVuZCcsICdvblRvdWNoQ2FuY2VsJ107XHJcblx0XHR2YXIgY29udGV4dCA9IHRoaXM7XHJcblx0XHRmb3IgKHZhciBpID0gMCwgbCA9IG1ldGhvZHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcblx0XHRcdGNvbnRleHRbbWV0aG9kc1tpXV0gPSBiaW5kKGNvbnRleHRbbWV0aG9kc1tpXV0sIGNvbnRleHQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNldCB1cCBldmVudCBoYW5kbGVycyBhcyByZXF1aXJlZFxyXG5cdFx0aWYgKGRldmljZUlzQW5kcm9pZCkge1xyXG5cdFx0XHRsYXllci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCB0aGlzLm9uTW91c2UsIHRydWUpO1xyXG5cdFx0XHRsYXllci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm9uTW91c2UsIHRydWUpO1xyXG5cdFx0XHRsYXllci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5vbk1vdXNlLCB0cnVlKTtcclxuXHRcdH1cclxuXHJcblx0XHRsYXllci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25DbGljaywgdHJ1ZSk7XHJcblx0XHRsYXllci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5vblRvdWNoU3RhcnQsIGZhbHNlKTtcclxuXHRcdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMub25Ub3VjaE1vdmUsIGZhbHNlKTtcclxuXHRcdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5vblRvdWNoRW5kLCBmYWxzZSk7XHJcblx0XHRsYXllci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMub25Ub3VjaENhbmNlbCwgZmFsc2UpO1xyXG5cclxuXHRcdC8vIEhhY2sgaXMgcmVxdWlyZWQgZm9yIGJyb3dzZXJzIHRoYXQgZG9uJ3Qgc3VwcG9ydCBFdmVudCNzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24gKGUuZy4gQW5kcm9pZCAyKVxyXG5cdFx0Ly8gd2hpY2ggaXMgaG93IEZhc3RDbGljayBub3JtYWxseSBzdG9wcyBjbGljayBldmVudHMgYnViYmxpbmcgdG8gY2FsbGJhY2tzIHJlZ2lzdGVyZWQgb24gdGhlIEZhc3RDbGlja1xyXG5cdFx0Ly8gbGF5ZXIgd2hlbiB0aGV5IGFyZSBjYW5jZWxsZWQuXHJcblx0XHRpZiAoIUV2ZW50LnByb3RvdHlwZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24pIHtcclxuXHRcdFx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGNhbGxiYWNrLCBjYXB0dXJlKSB7XHJcblx0XHRcdFx0dmFyIHJtdiA9IE5vZGUucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXI7XHJcblx0XHRcdFx0aWYgKHR5cGUgPT09ICdjbGljaycpIHtcclxuXHRcdFx0XHRcdHJtdi5jYWxsKGxheWVyLCB0eXBlLCBjYWxsYmFjay5oaWphY2tlZCB8fCBjYWxsYmFjaywgY2FwdHVyZSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJtdi5jYWxsKGxheWVyLCB0eXBlLCBjYWxsYmFjaywgY2FwdHVyZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGNhbGxiYWNrLCBjYXB0dXJlKSB7XHJcblx0XHRcdFx0dmFyIGFkdiA9IE5vZGUucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXI7XHJcblx0XHRcdFx0aWYgKHR5cGUgPT09ICdjbGljaycpIHtcclxuXHRcdFx0XHRcdGFkdi5jYWxsKGxheWVyLCB0eXBlLCBjYWxsYmFjay5oaWphY2tlZCB8fCAoY2FsbGJhY2suaGlqYWNrZWQgPSBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIWV2ZW50LnByb3BhZ2F0aW9uU3RvcHBlZCkge1xyXG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrKGV2ZW50KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSksIGNhcHR1cmUpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRhZHYuY2FsbChsYXllciwgdHlwZSwgY2FsbGJhY2ssIGNhcHR1cmUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBJZiBhIGhhbmRsZXIgaXMgYWxyZWFkeSBkZWNsYXJlZCBpbiB0aGUgZWxlbWVudCdzIG9uY2xpY2sgYXR0cmlidXRlLCBpdCB3aWxsIGJlIGZpcmVkIGJlZm9yZVxyXG5cdFx0Ly8gRmFzdENsaWNrJ3Mgb25DbGljayBoYW5kbGVyLiBGaXggdGhpcyBieSBwdWxsaW5nIG91dCB0aGUgdXNlci1kZWZpbmVkIGhhbmRsZXIgZnVuY3Rpb24gYW5kXHJcblx0XHQvLyBhZGRpbmcgaXQgYXMgbGlzdGVuZXIuXHJcblx0XHRpZiAodHlwZW9mIGxheWVyLm9uY2xpY2sgPT09ICdmdW5jdGlvbicpIHtcclxuXHJcblx0XHRcdC8vIEFuZHJvaWQgYnJvd3NlciBvbiBhdCBsZWFzdCAzLjIgcmVxdWlyZXMgYSBuZXcgcmVmZXJlbmNlIHRvIHRoZSBmdW5jdGlvbiBpbiBsYXllci5vbmNsaWNrXHJcblx0XHRcdC8vIC0gdGhlIG9sZCBvbmUgd29uJ3Qgd29yayBpZiBwYXNzZWQgdG8gYWRkRXZlbnRMaXN0ZW5lciBkaXJlY3RseS5cclxuXHRcdFx0b2xkT25DbGljayA9IGxheWVyLm9uY2xpY2s7XHJcblx0XHRcdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdFx0XHRvbGRPbkNsaWNrKGV2ZW50KTtcclxuXHRcdFx0fSwgZmFsc2UpO1xyXG5cdFx0XHRsYXllci5vbmNsaWNrID0gbnVsbDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCogV2luZG93cyBQaG9uZSA4LjEgZmFrZXMgdXNlciBhZ2VudCBzdHJpbmcgdG8gbG9vayBsaWtlIEFuZHJvaWQgYW5kIGlQaG9uZS5cclxuXHQqXHJcblx0KiBAdHlwZSBib29sZWFuXHJcblx0Ki9cclxuXHR2YXIgZGV2aWNlSXNXaW5kb3dzUGhvbmUgPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJXaW5kb3dzIFBob25lXCIpID49IDA7XHJcblxyXG5cdC8qKlxyXG5cdCAqIEFuZHJvaWQgcmVxdWlyZXMgZXhjZXB0aW9ucy5cclxuXHQgKlxyXG5cdCAqIEB0eXBlIGJvb2xlYW5cclxuXHQgKi9cclxuXHR2YXIgZGV2aWNlSXNBbmRyb2lkID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdBbmRyb2lkJykgPiAwICYmICFkZXZpY2VJc1dpbmRvd3NQaG9uZTtcclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIGlPUyByZXF1aXJlcyBleGNlcHRpb25zLlxyXG5cdCAqXHJcblx0ICogQHR5cGUgYm9vbGVhblxyXG5cdCAqL1xyXG5cdHZhciBkZXZpY2VJc0lPUyA9IC9pUChhZHxob25lfG9kKS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiAhZGV2aWNlSXNXaW5kb3dzUGhvbmU7XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBpT1MgNCByZXF1aXJlcyBhbiBleGNlcHRpb24gZm9yIHNlbGVjdCBlbGVtZW50cy5cclxuXHQgKlxyXG5cdCAqIEB0eXBlIGJvb2xlYW5cclxuXHQgKi9cclxuXHR2YXIgZGV2aWNlSXNJT1M0ID0gZGV2aWNlSXNJT1MgJiYgKC9PUyA0X1xcZChfXFxkKT8vKS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xyXG5cclxuXHJcblx0LyoqXHJcblx0ICogaU9TIDYuMC03LiogcmVxdWlyZXMgdGhlIHRhcmdldCBlbGVtZW50IHRvIGJlIG1hbnVhbGx5IGRlcml2ZWRcclxuXHQgKlxyXG5cdCAqIEB0eXBlIGJvb2xlYW5cclxuXHQgKi9cclxuXHR2YXIgZGV2aWNlSXNJT1NXaXRoQmFkVGFyZ2V0ID0gZGV2aWNlSXNJT1MgJiYgKC9PUyBbNi03XV9cXGQvKS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xyXG5cclxuXHQvKipcclxuXHQgKiBCbGFja0JlcnJ5IHJlcXVpcmVzIGV4Y2VwdGlvbnMuXHJcblx0ICpcclxuXHQgKiBAdHlwZSBib29sZWFuXHJcblx0ICovXHJcblx0dmFyIGRldmljZUlzQmxhY2tCZXJyeTEwID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdCQjEwJykgPiAwO1xyXG5cclxuXHQvKipcclxuXHQgKiBEZXRlcm1pbmUgd2hldGhlciBhIGdpdmVuIGVsZW1lbnQgcmVxdWlyZXMgYSBuYXRpdmUgY2xpY2suXHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fEVsZW1lbnR9IHRhcmdldCBUYXJnZXQgRE9NIGVsZW1lbnRcclxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIHRoZSBlbGVtZW50IG5lZWRzIGEgbmF0aXZlIGNsaWNrXHJcblx0ICovXHJcblx0RmFzdENsaWNrLnByb3RvdHlwZS5uZWVkc0NsaWNrID0gZnVuY3Rpb24odGFyZ2V0KSB7XHJcblx0XHRzd2l0Y2ggKHRhcmdldC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKSB7XHJcblxyXG5cdFx0Ly8gRG9uJ3Qgc2VuZCBhIHN5bnRoZXRpYyBjbGljayB0byBkaXNhYmxlZCBpbnB1dHMgKGlzc3VlICM2MilcclxuXHRcdGNhc2UgJ2J1dHRvbic6XHJcblx0XHRjYXNlICdzZWxlY3QnOlxyXG5cdFx0Y2FzZSAndGV4dGFyZWEnOlxyXG5cdFx0XHRpZiAodGFyZ2V0LmRpc2FibGVkKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAnaW5wdXQnOlxyXG5cclxuXHRcdFx0Ly8gRmlsZSBpbnB1dHMgbmVlZCByZWFsIGNsaWNrcyBvbiBpT1MgNiBkdWUgdG8gYSBicm93c2VyIGJ1ZyAoaXNzdWUgIzY4KVxyXG5cdFx0XHRpZiAoKGRldmljZUlzSU9TICYmIHRhcmdldC50eXBlID09PSAnZmlsZScpIHx8IHRhcmdldC5kaXNhYmxlZCkge1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRicmVhaztcclxuXHRcdGNhc2UgJ2xhYmVsJzpcclxuXHRcdGNhc2UgJ2lmcmFtZSc6IC8vIGlPUzggaG9tZXNjcmVlbiBhcHBzIGNhbiBwcmV2ZW50IGV2ZW50cyBidWJibGluZyBpbnRvIGZyYW1lc1xyXG5cdFx0Y2FzZSAndmlkZW8nOlxyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKC9cXGJuZWVkc2NsaWNrXFxiLykudGVzdCh0YXJnZXQuY2xhc3NOYW1lKTtcclxuXHR9O1xyXG5cclxuXHJcblx0LyoqXHJcblx0ICogRGV0ZXJtaW5lIHdoZXRoZXIgYSBnaXZlbiBlbGVtZW50IHJlcXVpcmVzIGEgY2FsbCB0byBmb2N1cyB0byBzaW11bGF0ZSBjbGljayBpbnRvIGVsZW1lbnQuXHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fEVsZW1lbnR9IHRhcmdldCBUYXJnZXQgRE9NIGVsZW1lbnRcclxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIHRoZSBlbGVtZW50IHJlcXVpcmVzIGEgY2FsbCB0byBmb2N1cyB0byBzaW11bGF0ZSBuYXRpdmUgY2xpY2suXHJcblx0ICovXHJcblx0RmFzdENsaWNrLnByb3RvdHlwZS5uZWVkc0ZvY3VzID0gZnVuY3Rpb24odGFyZ2V0KSB7XHJcblx0XHRzd2l0Y2ggKHRhcmdldC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKSB7XHJcblx0XHRjYXNlICd0ZXh0YXJlYSc6XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0Y2FzZSAnc2VsZWN0JzpcclxuXHRcdFx0cmV0dXJuICFkZXZpY2VJc0FuZHJvaWQ7XHJcblx0XHRjYXNlICdpbnB1dCc6XHJcblx0XHRcdHN3aXRjaCAodGFyZ2V0LnR5cGUpIHtcclxuXHRcdFx0Y2FzZSAnYnV0dG9uJzpcclxuXHRcdFx0Y2FzZSAnY2hlY2tib3gnOlxyXG5cdFx0XHRjYXNlICdmaWxlJzpcclxuXHRcdFx0Y2FzZSAnaW1hZ2UnOlxyXG5cdFx0XHRjYXNlICdyYWRpbyc6XHJcblx0XHRcdGNhc2UgJ3N1Ym1pdCc6XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBObyBwb2ludCBpbiBhdHRlbXB0aW5nIHRvIGZvY3VzIGRpc2FibGVkIGlucHV0c1xyXG5cdFx0XHRyZXR1cm4gIXRhcmdldC5kaXNhYmxlZCAmJiAhdGFyZ2V0LnJlYWRPbmx5O1xyXG5cdFx0ZGVmYXVsdDpcclxuXHRcdFx0cmV0dXJuICgvXFxibmVlZHNmb2N1c1xcYi8pLnRlc3QodGFyZ2V0LmNsYXNzTmFtZSk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIFNlbmQgYSBjbGljayBldmVudCB0byB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fEVsZW1lbnR9IHRhcmdldEVsZW1lbnRcclxuXHQgKiBAcGFyYW0ge0V2ZW50fSBldmVudFxyXG5cdCAqL1xyXG5cdEZhc3RDbGljay5wcm90b3R5cGUuc2VuZENsaWNrID0gZnVuY3Rpb24odGFyZ2V0RWxlbWVudCwgZXZlbnQpIHtcclxuXHRcdHZhciBjbGlja0V2ZW50LCB0b3VjaDtcclxuXHJcblx0XHQvLyBPbiBzb21lIEFuZHJvaWQgZGV2aWNlcyBhY3RpdmVFbGVtZW50IG5lZWRzIHRvIGJlIGJsdXJyZWQgb3RoZXJ3aXNlIHRoZSBzeW50aGV0aWMgY2xpY2sgd2lsbCBoYXZlIG5vIGVmZmVjdCAoIzI0KVxyXG5cdFx0aWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gdGFyZ2V0RWxlbWVudCkge1xyXG5cdFx0XHRkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcclxuXHRcdH1cclxuXHJcblx0XHR0b3VjaCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdO1xyXG5cclxuXHRcdC8vIFN5bnRoZXNpc2UgYSBjbGljayBldmVudCwgd2l0aCBhbiBleHRyYSBhdHRyaWJ1dGUgc28gaXQgY2FuIGJlIHRyYWNrZWRcclxuXHRcdGNsaWNrRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnTW91c2VFdmVudHMnKTtcclxuXHRcdGNsaWNrRXZlbnQuaW5pdE1vdXNlRXZlbnQodGhpcy5kZXRlcm1pbmVFdmVudFR5cGUodGFyZ2V0RWxlbWVudCksIHRydWUsIHRydWUsIHdpbmRvdywgMSwgdG91Y2guc2NyZWVuWCwgdG91Y2guc2NyZWVuWSwgdG91Y2guY2xpZW50WCwgdG91Y2guY2xpZW50WSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIDAsIG51bGwpO1xyXG5cdFx0Y2xpY2tFdmVudC5mb3J3YXJkZWRUb3VjaEV2ZW50ID0gdHJ1ZTtcclxuXHRcdHRhcmdldEVsZW1lbnQuZGlzcGF0Y2hFdmVudChjbGlja0V2ZW50KTtcclxuXHR9O1xyXG5cclxuXHRGYXN0Q2xpY2sucHJvdG90eXBlLmRldGVybWluZUV2ZW50VHlwZSA9IGZ1bmN0aW9uKHRhcmdldEVsZW1lbnQpIHtcclxuXHJcblx0XHQvL0lzc3VlICMxNTk6IEFuZHJvaWQgQ2hyb21lIFNlbGVjdCBCb3ggZG9lcyBub3Qgb3BlbiB3aXRoIGEgc3ludGhldGljIGNsaWNrIGV2ZW50XHJcblx0XHRpZiAoZGV2aWNlSXNBbmRyb2lkICYmIHRhcmdldEVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc2VsZWN0Jykge1xyXG5cdFx0XHRyZXR1cm4gJ21vdXNlZG93bic7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuICdjbGljayc7XHJcblx0fTtcclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBwYXJhbSB7RXZlbnRUYXJnZXR8RWxlbWVudH0gdGFyZ2V0RWxlbWVudFxyXG5cdCAqL1xyXG5cdEZhc3RDbGljay5wcm90b3R5cGUuZm9jdXMgPSBmdW5jdGlvbih0YXJnZXRFbGVtZW50KSB7XHJcblx0XHR2YXIgbGVuZ3RoO1xyXG5cclxuXHRcdC8vIElzc3VlICMxNjA6IG9uIGlPUyA3LCBzb21lIGlucHV0IGVsZW1lbnRzIChlLmcuIGRhdGUgZGF0ZXRpbWUgbW9udGgpIHRocm93IGEgdmFndWUgVHlwZUVycm9yIG9uIHNldFNlbGVjdGlvblJhbmdlLiBUaGVzZSBlbGVtZW50cyBkb24ndCBoYXZlIGFuIGludGVnZXIgdmFsdWUgZm9yIHRoZSBzZWxlY3Rpb25TdGFydCBhbmQgc2VsZWN0aW9uRW5kIHByb3BlcnRpZXMsIGJ1dCB1bmZvcnR1bmF0ZWx5IHRoYXQgY2FuJ3QgYmUgdXNlZCBmb3IgZGV0ZWN0aW9uIGJlY2F1c2UgYWNjZXNzaW5nIHRoZSBwcm9wZXJ0aWVzIGFsc28gdGhyb3dzIGEgVHlwZUVycm9yLiBKdXN0IGNoZWNrIHRoZSB0eXBlIGluc3RlYWQuIEZpbGVkIGFzIEFwcGxlIGJ1ZyAjMTUxMjI3MjQuXHJcblx0XHRpZiAoZGV2aWNlSXNJT1MgJiYgdGFyZ2V0RWxlbWVudC5zZXRTZWxlY3Rpb25SYW5nZSAmJiB0YXJnZXRFbGVtZW50LnR5cGUuaW5kZXhPZignZGF0ZScpICE9PSAwICYmIHRhcmdldEVsZW1lbnQudHlwZSAhPT0gJ3RpbWUnICYmIHRhcmdldEVsZW1lbnQudHlwZSAhPT0gJ21vbnRoJykge1xyXG5cdFx0XHRsZW5ndGggPSB0YXJnZXRFbGVtZW50LnZhbHVlLmxlbmd0aDtcclxuXHRcdFx0dGFyZ2V0RWxlbWVudC5zZXRTZWxlY3Rpb25SYW5nZShsZW5ndGgsIGxlbmd0aCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0YXJnZXRFbGVtZW50LmZvY3VzKCk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIENoZWNrIHdoZXRoZXIgdGhlIGdpdmVuIHRhcmdldCBlbGVtZW50IGlzIGEgY2hpbGQgb2YgYSBzY3JvbGxhYmxlIGxheWVyIGFuZCBpZiBzbywgc2V0IGEgZmxhZyBvbiBpdC5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB7RXZlbnRUYXJnZXR8RWxlbWVudH0gdGFyZ2V0RWxlbWVudFxyXG5cdCAqL1xyXG5cdEZhc3RDbGljay5wcm90b3R5cGUudXBkYXRlU2Nyb2xsUGFyZW50ID0gZnVuY3Rpb24odGFyZ2V0RWxlbWVudCkge1xyXG5cdFx0dmFyIHNjcm9sbFBhcmVudCwgcGFyZW50RWxlbWVudDtcclxuXHJcblx0XHRzY3JvbGxQYXJlbnQgPSB0YXJnZXRFbGVtZW50LmZhc3RDbGlja1Njcm9sbFBhcmVudDtcclxuXHJcblx0XHQvLyBBdHRlbXB0IHRvIGRpc2NvdmVyIHdoZXRoZXIgdGhlIHRhcmdldCBlbGVtZW50IGlzIGNvbnRhaW5lZCB3aXRoaW4gYSBzY3JvbGxhYmxlIGxheWVyLiBSZS1jaGVjayBpZiB0aGVcclxuXHRcdC8vIHRhcmdldCBlbGVtZW50IHdhcyBtb3ZlZCB0byBhbm90aGVyIHBhcmVudC5cclxuXHRcdGlmICghc2Nyb2xsUGFyZW50IHx8ICFzY3JvbGxQYXJlbnQuY29udGFpbnModGFyZ2V0RWxlbWVudCkpIHtcclxuXHRcdFx0cGFyZW50RWxlbWVudCA9IHRhcmdldEVsZW1lbnQ7XHJcblx0XHRcdGRvIHtcclxuXHRcdFx0XHRpZiAocGFyZW50RWxlbWVudC5zY3JvbGxIZWlnaHQgPiBwYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodCkge1xyXG5cdFx0XHRcdFx0c2Nyb2xsUGFyZW50ID0gcGFyZW50RWxlbWVudDtcclxuXHRcdFx0XHRcdHRhcmdldEVsZW1lbnQuZmFzdENsaWNrU2Nyb2xsUGFyZW50ID0gcGFyZW50RWxlbWVudDtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cGFyZW50RWxlbWVudCA9IHBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuXHRcdFx0fSB3aGlsZSAocGFyZW50RWxlbWVudCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQWx3YXlzIHVwZGF0ZSB0aGUgc2Nyb2xsIHRvcCB0cmFja2VyIGlmIHBvc3NpYmxlLlxyXG5cdFx0aWYgKHNjcm9sbFBhcmVudCkge1xyXG5cdFx0XHRzY3JvbGxQYXJlbnQuZmFzdENsaWNrTGFzdFNjcm9sbFRvcCA9IHNjcm9sbFBhcmVudC5zY3JvbGxUb3A7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBwYXJhbSB7RXZlbnRUYXJnZXR9IHRhcmdldEVsZW1lbnRcclxuXHQgKiBAcmV0dXJucyB7RWxlbWVudHxFdmVudFRhcmdldH1cclxuXHQgKi9cclxuXHRGYXN0Q2xpY2sucHJvdG90eXBlLmdldFRhcmdldEVsZW1lbnRGcm9tRXZlbnRUYXJnZXQgPSBmdW5jdGlvbihldmVudFRhcmdldCkge1xyXG5cclxuXHRcdC8vIE9uIHNvbWUgb2xkZXIgYnJvd3NlcnMgKG5vdGFibHkgU2FmYXJpIG9uIGlPUyA0LjEgLSBzZWUgaXNzdWUgIzU2KSB0aGUgZXZlbnQgdGFyZ2V0IG1heSBiZSBhIHRleHQgbm9kZS5cclxuXHRcdGlmIChldmVudFRhcmdldC5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcclxuXHRcdFx0cmV0dXJuIGV2ZW50VGFyZ2V0LnBhcmVudE5vZGU7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGV2ZW50VGFyZ2V0O1xyXG5cdH07XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBPbiB0b3VjaCBzdGFydCwgcmVjb3JkIHRoZSBwb3NpdGlvbiBhbmQgc2Nyb2xsIG9mZnNldC5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XHJcblx0ICogQHJldHVybnMge2Jvb2xlYW59XHJcblx0ICovXHJcblx0RmFzdENsaWNrLnByb3RvdHlwZS5vblRvdWNoU3RhcnQgPSBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0dmFyIHRhcmdldEVsZW1lbnQsIHRvdWNoLCBzZWxlY3Rpb247XHJcblxyXG5cdFx0Ly8gSWdub3JlIG11bHRpcGxlIHRvdWNoZXMsIG90aGVyd2lzZSBwaW5jaC10by16b29tIGlzIHByZXZlbnRlZCBpZiBib3RoIGZpbmdlcnMgYXJlIG9uIHRoZSBGYXN0Q2xpY2sgZWxlbWVudCAoaXNzdWUgIzExMSkuXHJcblx0XHRpZiAoZXZlbnQudGFyZ2V0VG91Y2hlcy5sZW5ndGggPiAxKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRhcmdldEVsZW1lbnQgPSB0aGlzLmdldFRhcmdldEVsZW1lbnRGcm9tRXZlbnRUYXJnZXQoZXZlbnQudGFyZ2V0KTtcclxuXHRcdHRvdWNoID0gZXZlbnQudGFyZ2V0VG91Y2hlc1swXTtcclxuXHJcblx0XHRpZiAoZGV2aWNlSXNJT1MpIHtcclxuXHJcblx0XHRcdC8vIE9ubHkgdHJ1c3RlZCBldmVudHMgd2lsbCBkZXNlbGVjdCB0ZXh0IG9uIGlPUyAoaXNzdWUgIzQ5KVxyXG5cdFx0XHRzZWxlY3Rpb24gPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XHJcblx0XHRcdGlmIChzZWxlY3Rpb24ucmFuZ2VDb3VudCAmJiAhc2VsZWN0aW9uLmlzQ29sbGFwc2VkKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICghZGV2aWNlSXNJT1M0KSB7XHJcblxyXG5cdFx0XHRcdC8vIFdlaXJkIHRoaW5ncyBoYXBwZW4gb24gaU9TIHdoZW4gYW4gYWxlcnQgb3IgY29uZmlybSBkaWFsb2cgaXMgb3BlbmVkIGZyb20gYSBjbGljayBldmVudCBjYWxsYmFjayAoaXNzdWUgIzIzKTpcclxuXHRcdFx0XHQvLyB3aGVuIHRoZSB1c2VyIG5leHQgdGFwcyBhbnl3aGVyZSBlbHNlIG9uIHRoZSBwYWdlLCBuZXcgdG91Y2hzdGFydCBhbmQgdG91Y2hlbmQgZXZlbnRzIGFyZSBkaXNwYXRjaGVkXHJcblx0XHRcdFx0Ly8gd2l0aCB0aGUgc2FtZSBpZGVudGlmaWVyIGFzIHRoZSB0b3VjaCBldmVudCB0aGF0IHByZXZpb3VzbHkgdHJpZ2dlcmVkIHRoZSBjbGljayB0aGF0IHRyaWdnZXJlZCB0aGUgYWxlcnQuXHJcblx0XHRcdFx0Ly8gU2FkbHksIHRoZXJlIGlzIGFuIGlzc3VlIG9uIGlPUyA0IHRoYXQgY2F1c2VzIHNvbWUgbm9ybWFsIHRvdWNoIGV2ZW50cyB0byBoYXZlIHRoZSBzYW1lIGlkZW50aWZpZXIgYXMgYW5cclxuXHRcdFx0XHQvLyBpbW1lZGlhdGVseSBwcmVjZWVkaW5nIHRvdWNoIGV2ZW50IChpc3N1ZSAjNTIpLCBzbyB0aGlzIGZpeCBpcyB1bmF2YWlsYWJsZSBvbiB0aGF0IHBsYXRmb3JtLlxyXG5cdFx0XHRcdC8vIElzc3VlIDEyMDogdG91Y2guaWRlbnRpZmllciBpcyAwIHdoZW4gQ2hyb21lIGRldiB0b29scyAnRW11bGF0ZSB0b3VjaCBldmVudHMnIGlzIHNldCB3aXRoIGFuIGlPUyBkZXZpY2UgVUEgc3RyaW5nLFxyXG5cdFx0XHRcdC8vIHdoaWNoIGNhdXNlcyBhbGwgdG91Y2ggZXZlbnRzIHRvIGJlIGlnbm9yZWQuIEFzIHRoaXMgYmxvY2sgb25seSBhcHBsaWVzIHRvIGlPUywgYW5kIGlPUyBpZGVudGlmaWVycyBhcmUgYWx3YXlzIGxvbmcsXHJcblx0XHRcdFx0Ly8gcmFuZG9tIGludGVnZXJzLCBpdCdzIHNhZmUgdG8gdG8gY29udGludWUgaWYgdGhlIGlkZW50aWZpZXIgaXMgMCBoZXJlLlxyXG5cdFx0XHRcdGlmICh0b3VjaC5pZGVudGlmaWVyICYmIHRvdWNoLmlkZW50aWZpZXIgPT09IHRoaXMubGFzdFRvdWNoSWRlbnRpZmllcikge1xyXG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRoaXMubGFzdFRvdWNoSWRlbnRpZmllciA9IHRvdWNoLmlkZW50aWZpZXI7XHJcblxyXG5cdFx0XHRcdC8vIElmIHRoZSB0YXJnZXQgZWxlbWVudCBpcyBhIGNoaWxkIG9mIGEgc2Nyb2xsYWJsZSBsYXllciAodXNpbmcgLXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNoKSBhbmQ6XHJcblx0XHRcdFx0Ly8gMSkgdGhlIHVzZXIgZG9lcyBhIGZsaW5nIHNjcm9sbCBvbiB0aGUgc2Nyb2xsYWJsZSBsYXllclxyXG5cdFx0XHRcdC8vIDIpIHRoZSB1c2VyIHN0b3BzIHRoZSBmbGluZyBzY3JvbGwgd2l0aCBhbm90aGVyIHRhcFxyXG5cdFx0XHRcdC8vIHRoZW4gdGhlIGV2ZW50LnRhcmdldCBvZiB0aGUgbGFzdCAndG91Y2hlbmQnIGV2ZW50IHdpbGwgYmUgdGhlIGVsZW1lbnQgdGhhdCB3YXMgdW5kZXIgdGhlIHVzZXIncyBmaW5nZXJcclxuXHRcdFx0XHQvLyB3aGVuIHRoZSBmbGluZyBzY3JvbGwgd2FzIHN0YXJ0ZWQsIGNhdXNpbmcgRmFzdENsaWNrIHRvIHNlbmQgYSBjbGljayBldmVudCB0byB0aGF0IGxheWVyIC0gdW5sZXNzIGEgY2hlY2tcclxuXHRcdFx0XHQvLyBpcyBtYWRlIHRvIGVuc3VyZSB0aGF0IGEgcGFyZW50IGxheWVyIHdhcyBub3Qgc2Nyb2xsZWQgYmVmb3JlIHNlbmRpbmcgYSBzeW50aGV0aWMgY2xpY2sgKGlzc3VlICM0MikuXHJcblx0XHRcdFx0dGhpcy51cGRhdGVTY3JvbGxQYXJlbnQodGFyZ2V0RWxlbWVudCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnRyYWNraW5nQ2xpY2sgPSB0cnVlO1xyXG5cdFx0dGhpcy50cmFja2luZ0NsaWNrU3RhcnQgPSBldmVudC50aW1lU3RhbXA7XHJcblx0XHR0aGlzLnRhcmdldEVsZW1lbnQgPSB0YXJnZXRFbGVtZW50O1xyXG5cclxuXHRcdHRoaXMudG91Y2hTdGFydFggPSB0b3VjaC5wYWdlWDtcclxuXHRcdHRoaXMudG91Y2hTdGFydFkgPSB0b3VjaC5wYWdlWTtcclxuXHJcblx0XHQvLyBQcmV2ZW50IHBoYW50b20gY2xpY2tzIG9uIGZhc3QgZG91YmxlLXRhcCAoaXNzdWUgIzM2KVxyXG5cdFx0aWYgKChldmVudC50aW1lU3RhbXAgLSB0aGlzLmxhc3RDbGlja1RpbWUpIDwgdGhpcy50YXBEZWxheSkge1xyXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH07XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBCYXNlZCBvbiBhIHRvdWNobW92ZSBldmVudCBvYmplY3QsIGNoZWNrIHdoZXRoZXIgdGhlIHRvdWNoIGhhcyBtb3ZlZCBwYXN0IGEgYm91bmRhcnkgc2luY2UgaXQgc3RhcnRlZC5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XHJcblx0ICogQHJldHVybnMge2Jvb2xlYW59XHJcblx0ICovXHJcblx0RmFzdENsaWNrLnByb3RvdHlwZS50b3VjaEhhc01vdmVkID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdHZhciB0b3VjaCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLCBib3VuZGFyeSA9IHRoaXMudG91Y2hCb3VuZGFyeTtcclxuXHJcblx0XHRpZiAoTWF0aC5hYnModG91Y2gucGFnZVggLSB0aGlzLnRvdWNoU3RhcnRYKSA+IGJvdW5kYXJ5IHx8IE1hdGguYWJzKHRvdWNoLnBhZ2VZIC0gdGhpcy50b3VjaFN0YXJ0WSkgPiBib3VuZGFyeSkge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fTtcclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIFVwZGF0ZSB0aGUgbGFzdCBwb3NpdGlvbi5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XHJcblx0ICogQHJldHVybnMge2Jvb2xlYW59XHJcblx0ICovXHJcblx0RmFzdENsaWNrLnByb3RvdHlwZS5vblRvdWNoTW92ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRpZiAoIXRoaXMudHJhY2tpbmdDbGljaykge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBJZiB0aGUgdG91Y2ggaGFzIG1vdmVkLCBjYW5jZWwgdGhlIGNsaWNrIHRyYWNraW5nXHJcblx0XHRpZiAodGhpcy50YXJnZXRFbGVtZW50ICE9PSB0aGlzLmdldFRhcmdldEVsZW1lbnRGcm9tRXZlbnRUYXJnZXQoZXZlbnQudGFyZ2V0KSB8fCB0aGlzLnRvdWNoSGFzTW92ZWQoZXZlbnQpKSB7XHJcblx0XHRcdHRoaXMudHJhY2tpbmdDbGljayA9IGZhbHNlO1xyXG5cdFx0XHR0aGlzLnRhcmdldEVsZW1lbnQgPSBudWxsO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH07XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBBdHRlbXB0IHRvIGZpbmQgdGhlIGxhYmVsbGVkIGNvbnRyb2wgZm9yIHRoZSBnaXZlbiBsYWJlbCBlbGVtZW50LlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtFdmVudFRhcmdldHxIVE1MTGFiZWxFbGVtZW50fSBsYWJlbEVsZW1lbnRcclxuXHQgKiBAcmV0dXJucyB7RWxlbWVudHxudWxsfVxyXG5cdCAqL1xyXG5cdEZhc3RDbGljay5wcm90b3R5cGUuZmluZENvbnRyb2wgPSBmdW5jdGlvbihsYWJlbEVsZW1lbnQpIHtcclxuXHJcblx0XHQvLyBGYXN0IHBhdGggZm9yIG5ld2VyIGJyb3dzZXJzIHN1cHBvcnRpbmcgdGhlIEhUTUw1IGNvbnRyb2wgYXR0cmlidXRlXHJcblx0XHRpZiAobGFiZWxFbGVtZW50LmNvbnRyb2wgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRyZXR1cm4gbGFiZWxFbGVtZW50LmNvbnRyb2w7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQWxsIGJyb3dzZXJzIHVuZGVyIHRlc3QgdGhhdCBzdXBwb3J0IHRvdWNoIGV2ZW50cyBhbHNvIHN1cHBvcnQgdGhlIEhUTUw1IGh0bWxGb3IgYXR0cmlidXRlXHJcblx0XHRpZiAobGFiZWxFbGVtZW50Lmh0bWxGb3IpIHtcclxuXHRcdFx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGxhYmVsRWxlbWVudC5odG1sRm9yKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBJZiBubyBmb3IgYXR0cmlidXRlIGV4aXN0cywgYXR0ZW1wdCB0byByZXRyaWV2ZSB0aGUgZmlyc3QgbGFiZWxsYWJsZSBkZXNjZW5kYW50IGVsZW1lbnRcclxuXHRcdC8vIHRoZSBsaXN0IG9mIHdoaWNoIGlzIGRlZmluZWQgaGVyZTogaHR0cDovL3d3dy53My5vcmcvVFIvaHRtbDUvZm9ybXMuaHRtbCNjYXRlZ29yeS1sYWJlbFxyXG5cdFx0cmV0dXJuIGxhYmVsRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdidXR0b24sIGlucHV0Om5vdChbdHlwZT1oaWRkZW5dKSwga2V5Z2VuLCBtZXRlciwgb3V0cHV0LCBwcm9ncmVzcywgc2VsZWN0LCB0ZXh0YXJlYScpO1xyXG5cdH07XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBPbiB0b3VjaCBlbmQsIGRldGVybWluZSB3aGV0aGVyIHRvIHNlbmQgYSBjbGljayBldmVudCBhdCBvbmNlLlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtFdmVudH0gZXZlbnRcclxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuXHQgKi9cclxuXHRGYXN0Q2xpY2sucHJvdG90eXBlLm9uVG91Y2hFbmQgPSBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0dmFyIGZvckVsZW1lbnQsIHRyYWNraW5nQ2xpY2tTdGFydCwgdGFyZ2V0VGFnTmFtZSwgc2Nyb2xsUGFyZW50LCB0b3VjaCwgdGFyZ2V0RWxlbWVudCA9IHRoaXMudGFyZ2V0RWxlbWVudDtcclxuXHJcblx0XHRpZiAoIXRoaXMudHJhY2tpbmdDbGljaykge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBQcmV2ZW50IHBoYW50b20gY2xpY2tzIG9uIGZhc3QgZG91YmxlLXRhcCAoaXNzdWUgIzM2KVxyXG5cdFx0aWYgKChldmVudC50aW1lU3RhbXAgLSB0aGlzLmxhc3RDbGlja1RpbWUpIDwgdGhpcy50YXBEZWxheSkge1xyXG5cdFx0XHR0aGlzLmNhbmNlbE5leHRDbGljayA9IHRydWU7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICgoZXZlbnQudGltZVN0YW1wIC0gdGhpcy50cmFja2luZ0NsaWNrU3RhcnQpID4gdGhpcy50YXBUaW1lb3V0KSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFJlc2V0IHRvIHByZXZlbnQgd3JvbmcgY2xpY2sgY2FuY2VsIG9uIGlucHV0IChpc3N1ZSAjMTU2KS5cclxuXHRcdHRoaXMuY2FuY2VsTmV4dENsaWNrID0gZmFsc2U7XHJcblxyXG5cdFx0dGhpcy5sYXN0Q2xpY2tUaW1lID0gZXZlbnQudGltZVN0YW1wO1xyXG5cclxuXHRcdHRyYWNraW5nQ2xpY2tTdGFydCA9IHRoaXMudHJhY2tpbmdDbGlja1N0YXJ0O1xyXG5cdFx0dGhpcy50cmFja2luZ0NsaWNrID0gZmFsc2U7XHJcblx0XHR0aGlzLnRyYWNraW5nQ2xpY2tTdGFydCA9IDA7XHJcblxyXG5cdFx0Ly8gT24gc29tZSBpT1MgZGV2aWNlcywgdGhlIHRhcmdldEVsZW1lbnQgc3VwcGxpZWQgd2l0aCB0aGUgZXZlbnQgaXMgaW52YWxpZCBpZiB0aGUgbGF5ZXJcclxuXHRcdC8vIGlzIHBlcmZvcm1pbmcgYSB0cmFuc2l0aW9uIG9yIHNjcm9sbCwgYW5kIGhhcyB0byBiZSByZS1kZXRlY3RlZCBtYW51YWxseS4gTm90ZSB0aGF0XHJcblx0XHQvLyBmb3IgdGhpcyB0byBmdW5jdGlvbiBjb3JyZWN0bHksIGl0IG11c3QgYmUgY2FsbGVkICphZnRlciogdGhlIGV2ZW50IHRhcmdldCBpcyBjaGVja2VkIVxyXG5cdFx0Ly8gU2VlIGlzc3VlICM1NzsgYWxzbyBmaWxlZCBhcyByZGFyOi8vMTMwNDg1ODkgLlxyXG5cdFx0aWYgKGRldmljZUlzSU9TV2l0aEJhZFRhcmdldCkge1xyXG5cdFx0XHR0b3VjaCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdO1xyXG5cclxuXHRcdFx0Ly8gSW4gY2VydGFpbiBjYXNlcyBhcmd1bWVudHMgb2YgZWxlbWVudEZyb21Qb2ludCBjYW4gYmUgbmVnYXRpdmUsIHNvIHByZXZlbnQgc2V0dGluZyB0YXJnZXRFbGVtZW50IHRvIG51bGxcclxuXHRcdFx0dGFyZ2V0RWxlbWVudCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQodG91Y2gucGFnZVggLSB3aW5kb3cucGFnZVhPZmZzZXQsIHRvdWNoLnBhZ2VZIC0gd2luZG93LnBhZ2VZT2Zmc2V0KSB8fCB0YXJnZXRFbGVtZW50O1xyXG5cdFx0XHR0YXJnZXRFbGVtZW50LmZhc3RDbGlja1Njcm9sbFBhcmVudCA9IHRoaXMudGFyZ2V0RWxlbWVudC5mYXN0Q2xpY2tTY3JvbGxQYXJlbnQ7XHJcblx0XHR9XHJcblxyXG5cdFx0dGFyZ2V0VGFnTmFtZSA9IHRhcmdldEVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0aWYgKHRhcmdldFRhZ05hbWUgPT09ICdsYWJlbCcpIHtcclxuXHRcdFx0Zm9yRWxlbWVudCA9IHRoaXMuZmluZENvbnRyb2wodGFyZ2V0RWxlbWVudCk7XHJcblx0XHRcdGlmIChmb3JFbGVtZW50KSB7XHJcblx0XHRcdFx0dGhpcy5mb2N1cyh0YXJnZXRFbGVtZW50KTtcclxuXHRcdFx0XHRpZiAoZGV2aWNlSXNBbmRyb2lkKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0YXJnZXRFbGVtZW50ID0gZm9yRWxlbWVudDtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIGlmICh0aGlzLm5lZWRzRm9jdXModGFyZ2V0RWxlbWVudCkpIHtcclxuXHJcblx0XHRcdC8vIENhc2UgMTogSWYgdGhlIHRvdWNoIHN0YXJ0ZWQgYSB3aGlsZSBhZ28gKGJlc3QgZ3Vlc3MgaXMgMTAwbXMgYmFzZWQgb24gdGVzdHMgZm9yIGlzc3VlICMzNikgdGhlbiBmb2N1cyB3aWxsIGJlIHRyaWdnZXJlZCBhbnl3YXkuIFJldHVybiBlYXJseSBhbmQgdW5zZXQgdGhlIHRhcmdldCBlbGVtZW50IHJlZmVyZW5jZSBzbyB0aGF0IHRoZSBzdWJzZXF1ZW50IGNsaWNrIHdpbGwgYmUgYWxsb3dlZCB0aHJvdWdoLlxyXG5cdFx0XHQvLyBDYXNlIDI6IFdpdGhvdXQgdGhpcyBleGNlcHRpb24gZm9yIGlucHV0IGVsZW1lbnRzIHRhcHBlZCB3aGVuIHRoZSBkb2N1bWVudCBpcyBjb250YWluZWQgaW4gYW4gaWZyYW1lLCB0aGVuIGFueSBpbnB1dHRlZCB0ZXh0IHdvbid0IGJlIHZpc2libGUgZXZlbiB0aG91Z2ggdGhlIHZhbHVlIGF0dHJpYnV0ZSBpcyB1cGRhdGVkIGFzIHRoZSB1c2VyIHR5cGVzIChpc3N1ZSAjMzcpLlxyXG5cdFx0XHRpZiAoKGV2ZW50LnRpbWVTdGFtcCAtIHRyYWNraW5nQ2xpY2tTdGFydCkgPiAxMDAgfHwgKGRldmljZUlzSU9TICYmIHdpbmRvdy50b3AgIT09IHdpbmRvdyAmJiB0YXJnZXRUYWdOYW1lID09PSAnaW5wdXQnKSkge1xyXG5cdFx0XHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmZvY3VzKHRhcmdldEVsZW1lbnQpO1xyXG5cdFx0XHR0aGlzLnNlbmRDbGljayh0YXJnZXRFbGVtZW50LCBldmVudCk7XHJcblxyXG5cdFx0XHQvLyBTZWxlY3QgZWxlbWVudHMgbmVlZCB0aGUgZXZlbnQgdG8gZ28gdGhyb3VnaCBvbiBpT1MgNCwgb3RoZXJ3aXNlIHRoZSBzZWxlY3RvciBtZW51IHdvbid0IG9wZW4uXHJcblx0XHRcdC8vIEFsc28gdGhpcyBicmVha3Mgb3BlbmluZyBzZWxlY3RzIHdoZW4gVm9pY2VPdmVyIGlzIGFjdGl2ZSBvbiBpT1M2LCBpT1M3IChhbmQgcG9zc2libHkgb3RoZXJzKVxyXG5cdFx0XHRpZiAoIWRldmljZUlzSU9TIHx8IHRhcmdldFRhZ05hbWUgIT09ICdzZWxlY3QnKSB7XHJcblx0XHRcdFx0dGhpcy50YXJnZXRFbGVtZW50ID0gbnVsbDtcclxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGRldmljZUlzSU9TICYmICFkZXZpY2VJc0lPUzQpIHtcclxuXHJcblx0XHRcdC8vIERvbid0IHNlbmQgYSBzeW50aGV0aWMgY2xpY2sgZXZlbnQgaWYgdGhlIHRhcmdldCBlbGVtZW50IGlzIGNvbnRhaW5lZCB3aXRoaW4gYSBwYXJlbnQgbGF5ZXIgdGhhdCB3YXMgc2Nyb2xsZWRcclxuXHRcdFx0Ly8gYW5kIHRoaXMgdGFwIGlzIGJlaW5nIHVzZWQgdG8gc3RvcCB0aGUgc2Nyb2xsaW5nICh1c3VhbGx5IGluaXRpYXRlZCBieSBhIGZsaW5nIC0gaXNzdWUgIzQyKS5cclxuXHRcdFx0c2Nyb2xsUGFyZW50ID0gdGFyZ2V0RWxlbWVudC5mYXN0Q2xpY2tTY3JvbGxQYXJlbnQ7XHJcblx0XHRcdGlmIChzY3JvbGxQYXJlbnQgJiYgc2Nyb2xsUGFyZW50LmZhc3RDbGlja0xhc3RTY3JvbGxUb3AgIT09IHNjcm9sbFBhcmVudC5zY3JvbGxUb3ApIHtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFByZXZlbnQgdGhlIGFjdHVhbCBjbGljayBmcm9tIGdvaW5nIHRob3VnaCAtIHVubGVzcyB0aGUgdGFyZ2V0IG5vZGUgaXMgbWFya2VkIGFzIHJlcXVpcmluZ1xyXG5cdFx0Ly8gcmVhbCBjbGlja3Mgb3IgaWYgaXQgaXMgaW4gdGhlIHdoaXRlbGlzdCBpbiB3aGljaCBjYXNlIG9ubHkgbm9uLXByb2dyYW1tYXRpYyBjbGlja3MgYXJlIHBlcm1pdHRlZC5cclxuXHRcdGlmICghdGhpcy5uZWVkc0NsaWNrKHRhcmdldEVsZW1lbnQpKSB7XHJcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdHRoaXMuc2VuZENsaWNrKHRhcmdldEVsZW1lbnQsIGV2ZW50KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fTtcclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIE9uIHRvdWNoIGNhbmNlbCwgc3RvcCB0cmFja2luZyB0aGUgY2xpY2suXHJcblx0ICpcclxuXHQgKiBAcmV0dXJucyB7dm9pZH1cclxuXHQgKi9cclxuXHRGYXN0Q2xpY2sucHJvdG90eXBlLm9uVG91Y2hDYW5jZWwgPSBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMudHJhY2tpbmdDbGljayA9IGZhbHNlO1xyXG5cdFx0dGhpcy50YXJnZXRFbGVtZW50ID0gbnVsbDtcclxuXHR9O1xyXG5cclxuXHJcblx0LyoqXHJcblx0ICogRGV0ZXJtaW5lIG1vdXNlIGV2ZW50cyB3aGljaCBzaG91bGQgYmUgcGVybWl0dGVkLlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtFdmVudH0gZXZlbnRcclxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuXHQgKi9cclxuXHRGYXN0Q2xpY2sucHJvdG90eXBlLm9uTW91c2UgPSBmdW5jdGlvbihldmVudCkge1xyXG5cclxuXHRcdC8vIElmIGEgdGFyZ2V0IGVsZW1lbnQgd2FzIG5ldmVyIHNldCAoYmVjYXVzZSBhIHRvdWNoIGV2ZW50IHdhcyBuZXZlciBmaXJlZCkgYWxsb3cgdGhlIGV2ZW50XHJcblx0XHRpZiAoIXRoaXMudGFyZ2V0RWxlbWVudCkge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZXZlbnQuZm9yd2FyZGVkVG91Y2hFdmVudCkge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBQcm9ncmFtbWF0aWNhbGx5IGdlbmVyYXRlZCBldmVudHMgdGFyZ2V0aW5nIGEgc3BlY2lmaWMgZWxlbWVudCBzaG91bGQgYmUgcGVybWl0dGVkXHJcblx0XHRpZiAoIWV2ZW50LmNhbmNlbGFibGUpIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gRGVyaXZlIGFuZCBjaGVjayB0aGUgdGFyZ2V0IGVsZW1lbnQgdG8gc2VlIHdoZXRoZXIgdGhlIG1vdXNlIGV2ZW50IG5lZWRzIHRvIGJlIHBlcm1pdHRlZDtcclxuXHRcdC8vIHVubGVzcyBleHBsaWNpdGx5IGVuYWJsZWQsIHByZXZlbnQgbm9uLXRvdWNoIGNsaWNrIGV2ZW50cyBmcm9tIHRyaWdnZXJpbmcgYWN0aW9ucyxcclxuXHRcdC8vIHRvIHByZXZlbnQgZ2hvc3QvZG91YmxlY2xpY2tzLlxyXG5cdFx0aWYgKCF0aGlzLm5lZWRzQ2xpY2sodGhpcy50YXJnZXRFbGVtZW50KSB8fCB0aGlzLmNhbmNlbE5leHRDbGljaykge1xyXG5cclxuXHRcdFx0Ly8gUHJldmVudCBhbnkgdXNlci1hZGRlZCBsaXN0ZW5lcnMgZGVjbGFyZWQgb24gRmFzdENsaWNrIGVsZW1lbnQgZnJvbSBiZWluZyBmaXJlZC5cclxuXHRcdFx0aWYgKGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbikge1xyXG5cdFx0XHRcdGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHQvLyBQYXJ0IG9mIHRoZSBoYWNrIGZvciBicm93c2VycyB0aGF0IGRvbid0IHN1cHBvcnQgRXZlbnQjc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uIChlLmcuIEFuZHJvaWQgMilcclxuXHRcdFx0XHRldmVudC5wcm9wYWdhdGlvblN0b3BwZWQgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBDYW5jZWwgdGhlIGV2ZW50XHJcblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIElmIHRoZSBtb3VzZSBldmVudCBpcyBwZXJtaXR0ZWQsIHJldHVybiB0cnVlIGZvciB0aGUgYWN0aW9uIHRvIGdvIHRocm91Z2guXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9O1xyXG5cclxuXHJcblx0LyoqXHJcblx0ICogT24gYWN0dWFsIGNsaWNrcywgZGV0ZXJtaW5lIHdoZXRoZXIgdGhpcyBpcyBhIHRvdWNoLWdlbmVyYXRlZCBjbGljaywgYSBjbGljayBhY3Rpb24gb2NjdXJyaW5nXHJcblx0ICogbmF0dXJhbGx5IGFmdGVyIGEgZGVsYXkgYWZ0ZXIgYSB0b3VjaCAod2hpY2ggbmVlZHMgdG8gYmUgY2FuY2VsbGVkIHRvIGF2b2lkIGR1cGxpY2F0aW9uKSwgb3JcclxuXHQgKiBhbiBhY3R1YWwgY2xpY2sgd2hpY2ggc2hvdWxkIGJlIHBlcm1pdHRlZC5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XHJcblx0ICogQHJldHVybnMge2Jvb2xlYW59XHJcblx0ICovXHJcblx0RmFzdENsaWNrLnByb3RvdHlwZS5vbkNsaWNrID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdHZhciBwZXJtaXR0ZWQ7XHJcblxyXG5cdFx0Ly8gSXQncyBwb3NzaWJsZSBmb3IgYW5vdGhlciBGYXN0Q2xpY2stbGlrZSBsaWJyYXJ5IGRlbGl2ZXJlZCB3aXRoIHRoaXJkLXBhcnR5IGNvZGUgdG8gZmlyZSBhIGNsaWNrIGV2ZW50IGJlZm9yZSBGYXN0Q2xpY2sgZG9lcyAoaXNzdWUgIzQ0KS4gSW4gdGhhdCBjYXNlLCBzZXQgdGhlIGNsaWNrLXRyYWNraW5nIGZsYWcgYmFjayB0byBmYWxzZSBhbmQgcmV0dXJuIGVhcmx5LiBUaGlzIHdpbGwgY2F1c2Ugb25Ub3VjaEVuZCB0byByZXR1cm4gZWFybHkuXHJcblx0XHRpZiAodGhpcy50cmFja2luZ0NsaWNrKSB7XHJcblx0XHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XHJcblx0XHRcdHRoaXMudHJhY2tpbmdDbGljayA9IGZhbHNlO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBWZXJ5IG9kZCBiZWhhdmlvdXIgb24gaU9TIChpc3N1ZSAjMTgpOiBpZiBhIHN1Ym1pdCBlbGVtZW50IGlzIHByZXNlbnQgaW5zaWRlIGEgZm9ybSBhbmQgdGhlIHVzZXIgaGl0cyBlbnRlciBpbiB0aGUgaU9TIHNpbXVsYXRvciBvciBjbGlja3MgdGhlIEdvIGJ1dHRvbiBvbiB0aGUgcG9wLXVwIE9TIGtleWJvYXJkIHRoZSBhIGtpbmQgb2YgJ2Zha2UnIGNsaWNrIGV2ZW50IHdpbGwgYmUgdHJpZ2dlcmVkIHdpdGggdGhlIHN1Ym1pdC10eXBlIGlucHV0IGVsZW1lbnQgYXMgdGhlIHRhcmdldC5cclxuXHRcdGlmIChldmVudC50YXJnZXQudHlwZSA9PT0gJ3N1Ym1pdCcgJiYgZXZlbnQuZGV0YWlsID09PSAwKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHBlcm1pdHRlZCA9IHRoaXMub25Nb3VzZShldmVudCk7XHJcblxyXG5cdFx0Ly8gT25seSB1bnNldCB0YXJnZXRFbGVtZW50IGlmIHRoZSBjbGljayBpcyBub3QgcGVybWl0dGVkLiBUaGlzIHdpbGwgZW5zdXJlIHRoYXQgdGhlIGNoZWNrIGZvciAhdGFyZ2V0RWxlbWVudCBpbiBvbk1vdXNlIGZhaWxzIGFuZCB0aGUgYnJvd3NlcidzIGNsaWNrIGRvZXNuJ3QgZ28gdGhyb3VnaC5cclxuXHRcdGlmICghcGVybWl0dGVkKSB7XHJcblx0XHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gSWYgY2xpY2tzIGFyZSBwZXJtaXR0ZWQsIHJldHVybiB0cnVlIGZvciB0aGUgYWN0aW9uIHRvIGdvIHRocm91Z2guXHJcblx0XHRyZXR1cm4gcGVybWl0dGVkO1xyXG5cdH07XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBSZW1vdmUgYWxsIEZhc3RDbGljaydzIGV2ZW50IGxpc3RlbmVycy5cclxuXHQgKlxyXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxyXG5cdCAqL1xyXG5cdEZhc3RDbGljay5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGxheWVyID0gdGhpcy5sYXllcjtcclxuXHJcblx0XHRpZiAoZGV2aWNlSXNBbmRyb2lkKSB7XHJcblx0XHRcdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIHRoaXMub25Nb3VzZSwgdHJ1ZSk7XHJcblx0XHRcdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMub25Nb3VzZSwgdHJ1ZSk7XHJcblx0XHRcdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm9uTW91c2UsIHRydWUpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbkNsaWNrLCB0cnVlKTtcclxuXHRcdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLm9uVG91Y2hTdGFydCwgZmFsc2UpO1xyXG5cdFx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vblRvdWNoTW92ZSwgZmFsc2UpO1xyXG5cdFx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLm9uVG91Y2hFbmQsIGZhbHNlKTtcclxuXHRcdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5vblRvdWNoQ2FuY2VsLCBmYWxzZSk7XHJcblx0fTtcclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIENoZWNrIHdoZXRoZXIgRmFzdENsaWNrIGlzIG5lZWRlZC5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB7RWxlbWVudH0gbGF5ZXIgVGhlIGxheWVyIHRvIGxpc3RlbiBvblxyXG5cdCAqL1xyXG5cdEZhc3RDbGljay5ub3ROZWVkZWQgPSBmdW5jdGlvbihsYXllcikge1xyXG5cdFx0dmFyIG1ldGFWaWV3cG9ydDtcclxuXHRcdHZhciBjaHJvbWVWZXJzaW9uO1xyXG5cdFx0dmFyIGJsYWNrYmVycnlWZXJzaW9uO1xyXG5cdFx0dmFyIGZpcmVmb3hWZXJzaW9uO1xyXG5cclxuXHRcdC8vIERldmljZXMgdGhhdCBkb24ndCBzdXBwb3J0IHRvdWNoIGRvbid0IG5lZWQgRmFzdENsaWNrXHJcblx0XHRpZiAodHlwZW9mIHdpbmRvdy5vbnRvdWNoc3RhcnQgPT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIENocm9tZSB2ZXJzaW9uIC0gemVybyBmb3Igb3RoZXIgYnJvd3NlcnNcclxuXHRcdGNocm9tZVZlcnNpb24gPSArKC9DaHJvbWVcXC8oWzAtOV0rKS8uZXhlYyhuYXZpZ2F0b3IudXNlckFnZW50KSB8fCBbLDBdKVsxXTtcclxuXHJcblx0XHRpZiAoY2hyb21lVmVyc2lvbikge1xyXG5cclxuXHRcdFx0aWYgKGRldmljZUlzQW5kcm9pZCkge1xyXG5cdFx0XHRcdG1ldGFWaWV3cG9ydCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21ldGFbbmFtZT12aWV3cG9ydF0nKTtcclxuXHJcblx0XHRcdFx0aWYgKG1ldGFWaWV3cG9ydCkge1xyXG5cdFx0XHRcdFx0Ly8gQ2hyb21lIG9uIEFuZHJvaWQgd2l0aCB1c2VyLXNjYWxhYmxlPVwibm9cIiBkb2Vzbid0IG5lZWQgRmFzdENsaWNrIChpc3N1ZSAjODkpXHJcblx0XHRcdFx0XHRpZiAobWV0YVZpZXdwb3J0LmNvbnRlbnQuaW5kZXhPZigndXNlci1zY2FsYWJsZT1ubycpICE9PSAtMSkge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vIENocm9tZSAzMiBhbmQgYWJvdmUgd2l0aCB3aWR0aD1kZXZpY2Utd2lkdGggb3IgbGVzcyBkb24ndCBuZWVkIEZhc3RDbGlja1xyXG5cdFx0XHRcdFx0aWYgKGNocm9tZVZlcnNpb24gPiAzMSAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsV2lkdGggPD0gd2luZG93Lm91dGVyV2lkdGgpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gQ2hyb21lIGRlc2t0b3AgZG9lc24ndCBuZWVkIEZhc3RDbGljayAoaXNzdWUgIzE1KVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGRldmljZUlzQmxhY2tCZXJyeTEwKSB7XHJcblx0XHRcdGJsYWNrYmVycnlWZXJzaW9uID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvVmVyc2lvblxcLyhbMC05XSopXFwuKFswLTldKikvKTtcclxuXHJcblx0XHRcdC8vIEJsYWNrQmVycnkgMTAuMysgZG9lcyBub3QgcmVxdWlyZSBGYXN0Y2xpY2sgbGlicmFyeS5cclxuXHRcdFx0Ly8gaHR0cHM6Ly9naXRodWIuY29tL2Z0bGFicy9mYXN0Y2xpY2svaXNzdWVzLzI1MVxyXG5cdFx0XHRpZiAoYmxhY2tiZXJyeVZlcnNpb25bMV0gPj0gMTAgJiYgYmxhY2tiZXJyeVZlcnNpb25bMl0gPj0gMykge1xyXG5cdFx0XHRcdG1ldGFWaWV3cG9ydCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21ldGFbbmFtZT12aWV3cG9ydF0nKTtcclxuXHJcblx0XHRcdFx0aWYgKG1ldGFWaWV3cG9ydCkge1xyXG5cdFx0XHRcdFx0Ly8gdXNlci1zY2FsYWJsZT1ubyBlbGltaW5hdGVzIGNsaWNrIGRlbGF5LlxyXG5cdFx0XHRcdFx0aWYgKG1ldGFWaWV3cG9ydC5jb250ZW50LmluZGV4T2YoJ3VzZXItc2NhbGFibGU9bm8nKSAhPT0gLTEpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvLyB3aWR0aD1kZXZpY2Utd2lkdGggKG9yIGxlc3MgdGhhbiBkZXZpY2Utd2lkdGgpIGVsaW1pbmF0ZXMgY2xpY2sgZGVsYXkuXHJcblx0XHRcdFx0XHRpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFdpZHRoIDw9IHdpbmRvdy5vdXRlcldpZHRoKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIElFMTAgd2l0aCAtbXMtdG91Y2gtYWN0aW9uOiBub25lIG9yIG1hbmlwdWxhdGlvbiwgd2hpY2ggZGlzYWJsZXMgZG91YmxlLXRhcC10by16b29tIChpc3N1ZSAjOTcpXHJcblx0XHRpZiAobGF5ZXIuc3R5bGUubXNUb3VjaEFjdGlvbiA9PT0gJ25vbmUnIHx8IGxheWVyLnN0eWxlLnRvdWNoQWN0aW9uID09PSAnbWFuaXB1bGF0aW9uJykge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBGaXJlZm94IHZlcnNpb24gLSB6ZXJvIGZvciBvdGhlciBicm93c2Vyc1xyXG5cdFx0ZmlyZWZveFZlcnNpb24gPSArKC9GaXJlZm94XFwvKFswLTldKykvLmV4ZWMobmF2aWdhdG9yLnVzZXJBZ2VudCkgfHwgWywwXSlbMV07XHJcblxyXG5cdFx0aWYgKGZpcmVmb3hWZXJzaW9uID49IDI3KSB7XHJcblx0XHRcdC8vIEZpcmVmb3ggMjcrIGRvZXMgbm90IGhhdmUgdGFwIGRlbGF5IGlmIHRoZSBjb250ZW50IGlzIG5vdCB6b29tYWJsZSAtIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTkyMjg5NlxyXG5cclxuXHRcdFx0bWV0YVZpZXdwb3J0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPXZpZXdwb3J0XScpO1xyXG5cdFx0XHRpZiAobWV0YVZpZXdwb3J0ICYmIChtZXRhVmlld3BvcnQuY29udGVudC5pbmRleE9mKCd1c2VyLXNjYWxhYmxlPW5vJykgIT09IC0xIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxXaWR0aCA8PSB3aW5kb3cub3V0ZXJXaWR0aCkpIHtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIElFMTE6IHByZWZpeGVkIC1tcy10b3VjaC1hY3Rpb24gaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCBhbmQgaXQncyByZWNvbWVuZGVkIHRvIHVzZSBub24tcHJlZml4ZWQgdmVyc2lvblxyXG5cdFx0Ly8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L3dpbmRvd3MvYXBwcy9IaDc2NzMxMy5hc3B4XHJcblx0XHRpZiAobGF5ZXIuc3R5bGUudG91Y2hBY3Rpb24gPT09ICdub25lJyB8fCBsYXllci5zdHlsZS50b3VjaEFjdGlvbiA9PT0gJ21hbmlwdWxhdGlvbicpIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH07XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBGYWN0b3J5IG1ldGhvZCBmb3IgY3JlYXRpbmcgYSBGYXN0Q2xpY2sgb2JqZWN0XHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge0VsZW1lbnR9IGxheWVyIFRoZSBsYXllciB0byBsaXN0ZW4gb25cclxuXHQgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0c1xyXG5cdCAqL1xyXG5cdEZhc3RDbGljay5hdHRhY2ggPSBmdW5jdGlvbihsYXllciwgb3B0aW9ucykge1xyXG5cdFx0cmV0dXJuIG5ldyBGYXN0Q2xpY2sobGF5ZXIsIG9wdGlvbnMpO1xyXG5cdH07XHJcblxyXG5cclxuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PT0gJ29iamVjdCcgJiYgZGVmaW5lLmFtZCkge1xyXG5cclxuXHRcdC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cclxuXHRcdGRlZmluZShmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIEZhc3RDbGljaztcclxuXHRcdH0pO1xyXG5cdH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcclxuXHRcdG1vZHVsZS5leHBvcnRzID0gRmFzdENsaWNrLmF0dGFjaDtcclxuXHRcdG1vZHVsZS5leHBvcnRzLkZhc3RDbGljayA9IEZhc3RDbGljaztcclxuXHR9IGVsc2Uge1xyXG5cdFx0d2luZG93LkZhc3RDbGljayA9IEZhc3RDbGljaztcclxuXHR9XHJcbn0oKSk7IiwidmFyIG0gPSAoZnVuY3Rpb24gYXBwKHdpbmRvdywgdW5kZWZpbmVkKSB7XHJcblx0dmFyIE9CSkVDVCA9IFwiW29iamVjdCBPYmplY3RdXCIsXHJcblx0XHRBUlJBWSA9IFwiW29iamVjdCBBcnJheV1cIixcclxuXHRcdFNUUklORyA9IFwiW29iamVjdCBTdHJpbmddXCIsXHJcblx0XHRGVU5DVElPTiA9IFwiZnVuY3Rpb25cIjtcclxuXHJcblx0dmFyIHR5cGUgPSB7fS50b1N0cmluZztcclxuXHR2YXIgcGFyc2VyID0gLyg/OihefCN8XFwuKShbXiNcXC5cXFtcXF1dKykpfChcXFsuKz9cXF0pL2c7XHJcblx0dmFyIGF0dHJQYXJzZXIgPSAvXFxbKC4rPykoPzo9KFwifCd8KSguKj8pXFwyKT9cXF0vO1xyXG5cdHZhciB2b2lkRWxlbWVudHMgPSAvXihBUkVBfEJBU0V8QlJ8Q09MfENPTU1BTkR8RU1CRUR8SFJ8SU1HfElOUFVUfEtFWUdFTnxMSU5LfE1FVEF8UEFSQU18U09VUkNFfFRSQUNLfFdCUikkLztcclxuXHR2YXIgbm9vcCA9IGZ1bmN0aW9uKCkge307XHJcblxyXG5cdC8vIGNhY2hpbmcgY29tbW9ubHkgdXNlZCB2YXJpYWJsZXNcclxuXHR2YXIgJGRvY3VtZW50LFxyXG5cdFx0JGxvY2F0aW9uLFxyXG5cdFx0JHJlcXVlc3RBbmltYXRpb25GcmFtZSxcclxuXHRcdCRjYW5jZWxBbmltYXRpb25GcmFtZTtcclxuXHJcblx0Ly8gc2VsZiBpbnZva2luZyBmdW5jdGlvbiBuZWVkZWQgYmVjYXVzZSBvZiB0aGUgd2F5IG1vY2tzIHdvcmtcclxuXHRmdW5jdGlvbiBpbml0aWFsaXplKHdpbmRvdyl7XHJcblx0XHQkZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XHJcblx0XHQkbG9jYXRpb24gPSB3aW5kb3cubG9jYXRpb247XHJcblx0XHQkY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgfHwgd2luZG93LmNsZWFyVGltZW91dDtcclxuXHRcdCRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5zZXRUaW1lb3V0O1xyXG5cdH1cclxuXHJcblx0aW5pdGlhbGl6ZSh3aW5kb3cpO1xyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQHR5cGVkZWYge1N0cmluZ30gVGFnXHJcblx0ICogQSBzdHJpbmcgdGhhdCBsb29rcyBsaWtlIC0+IGRpdi5jbGFzc25hbWUjaWRbcGFyYW09b25lXVtwYXJhbTI9dHdvXVxyXG5cdCAqIFdoaWNoIGRlc2NyaWJlcyBhIERPTSBub2RlXHJcblx0ICovXHJcblxyXG5cdC8qKlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtUYWd9IFRoZSBET00gbm9kZSB0YWdcclxuXHQgKiBAcGFyYW0ge09iamVjdD1bXX0gb3B0aW9uYWwga2V5LXZhbHVlIHBhaXJzIHRvIGJlIG1hcHBlZCB0byBET00gYXR0cnNcclxuXHQgKiBAcGFyYW0gey4uLm1Ob2RlPVtdfSBaZXJvIG9yIG1vcmUgTWl0aHJpbCBjaGlsZCBub2Rlcy4gQ2FuIGJlIGFuIGFycmF5LCBvciBzcGxhdCAob3B0aW9uYWwpXHJcblx0ICpcclxuXHQgKi9cclxuXHRmdW5jdGlvbiBtKCkge1xyXG5cdFx0dmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cyksXHJcblx0XHRcdGhhc0F0dHJzID0gYXJnc1sxXSAhPSBudWxsICYmIHR5cGUuY2FsbChhcmdzWzFdKSA9PT0gT0JKRUNUICYmICEoXCJ0YWdcIiBpbiBhcmdzWzFdIHx8IFwidmlld1wiIGluIGFyZ3NbMV0pICYmICEoXCJzdWJ0cmVlXCIgaW4gYXJnc1sxXSksXHJcblx0XHRcdGF0dHJzID0gaGFzQXR0cnMgPyBhcmdzWzFdIDoge30sXHJcblx0XHRcdGNsYXNzQXR0ck5hbWUgPSBcImNsYXNzXCIgaW4gYXR0cnMgPyBcImNsYXNzXCIgOiBcImNsYXNzTmFtZVwiLFxyXG5cdFx0XHRjZWxsID0ge3RhZzogXCJkaXZcIiwgYXR0cnM6IHt9fSxcclxuXHRcdFx0bWF0Y2gsXHJcblx0XHRcdGNsYXNzZXMgPSBbXTtcclxuXHJcblx0XHRpZiAodHlwZS5jYWxsKGFyZ3NbMF0pICE9IFNUUklORykge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJzZWxlY3RvciBpbiBtKHNlbGVjdG9yLCBhdHRycywgY2hpbGRyZW4pIHNob3VsZCBiZSBhIHN0cmluZ1wiKTtcclxuXHRcdH1cclxuXHJcblx0XHR3aGlsZSAobWF0Y2ggPSBwYXJzZXIuZXhlYyhhcmdzWzBdKSkge1xyXG5cdFx0XHRpZiAobWF0Y2hbMV0gPT09IFwiXCIgJiYgbWF0Y2hbMl0pIGNlbGwudGFnID0gbWF0Y2hbMl07XHJcblx0XHRcdGVsc2UgaWYgKG1hdGNoWzFdID09PSBcIiNcIikgY2VsbC5hdHRycy5pZCA9IG1hdGNoWzJdO1xyXG5cdFx0XHRlbHNlIGlmIChtYXRjaFsxXSA9PT0gXCIuXCIpIGNsYXNzZXMucHVzaChtYXRjaFsyXSk7XHJcblx0XHRcdGVsc2UgaWYgKG1hdGNoWzNdWzBdID09PSBcIltcIikge1xyXG5cdFx0XHRcdHZhciBwYWlyID0gYXR0clBhcnNlci5leGVjKG1hdGNoWzNdKTtcclxuXHRcdFx0XHRjZWxsLmF0dHJzW3BhaXJbMV1dID0gcGFpclszXSB8fCAocGFpclsyXSA/IFwiXCIgOnRydWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGNoaWxkcmVuID0gaGFzQXR0cnMgPyBhcmdzLnNsaWNlKDIpIDogYXJncy5zbGljZSgxKTtcclxuXHRcdGlmIChjaGlsZHJlbi5sZW5ndGggPT09IDEgJiYgdHlwZS5jYWxsKGNoaWxkcmVuWzBdKSA9PT0gQVJSQVkpIHtcclxuXHRcdFx0Y2VsbC5jaGlsZHJlbiA9IGNoaWxkcmVuWzBdO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y2VsbC5jaGlsZHJlbiA9IGNoaWxkcmVuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAodmFyIGF0dHJOYW1lIGluIGF0dHJzKSB7XHJcblx0XHRcdGlmIChhdHRycy5oYXNPd25Qcm9wZXJ0eShhdHRyTmFtZSkpIHtcclxuXHRcdFx0XHRpZiAoYXR0ck5hbWUgPT09IGNsYXNzQXR0ck5hbWUgJiYgYXR0cnNbYXR0ck5hbWVdICE9IG51bGwgJiYgYXR0cnNbYXR0ck5hbWVdICE9PSBcIlwiKSB7XHJcblx0XHRcdFx0XHRjbGFzc2VzLnB1c2goYXR0cnNbYXR0ck5hbWVdKTtcclxuXHRcdFx0XHRcdGNlbGwuYXR0cnNbYXR0ck5hbWVdID0gXCJcIjsgLy9jcmVhdGUga2V5IGluIGNvcnJlY3QgaXRlcmF0aW9uIG9yZGVyXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNlbGwuYXR0cnNbYXR0ck5hbWVdID0gYXR0cnNbYXR0ck5hbWVdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKGNsYXNzZXMubGVuZ3RoID4gMCkgY2VsbC5hdHRyc1tjbGFzc0F0dHJOYW1lXSA9IGNsYXNzZXMuam9pbihcIiBcIik7XHJcblxyXG5cdFx0cmV0dXJuIGNlbGw7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBidWlsZChwYXJlbnRFbGVtZW50LCBwYXJlbnRUYWcsIHBhcmVudENhY2hlLCBwYXJlbnRJbmRleCwgZGF0YSwgY2FjaGVkLCBzaG91bGRSZWF0dGFjaCwgaW5kZXgsIGVkaXRhYmxlLCBuYW1lc3BhY2UsIGNvbmZpZ3MpIHtcclxuXHRcdC8vYGJ1aWxkYCBpcyBhIHJlY3Vyc2l2ZSBmdW5jdGlvbiB0aGF0IG1hbmFnZXMgY3JlYXRpb24vZGlmZmluZy9yZW1vdmFsIG9mIERPTSBlbGVtZW50cyBiYXNlZCBvbiBjb21wYXJpc29uIGJldHdlZW4gYGRhdGFgIGFuZCBgY2FjaGVkYFxyXG5cdFx0Ly90aGUgZGlmZiBhbGdvcml0aG0gY2FuIGJlIHN1bW1hcml6ZWQgYXMgdGhpczpcclxuXHRcdC8vMSAtIGNvbXBhcmUgYGRhdGFgIGFuZCBgY2FjaGVkYFxyXG5cdFx0Ly8yIC0gaWYgdGhleSBhcmUgZGlmZmVyZW50LCBjb3B5IGBkYXRhYCB0byBgY2FjaGVkYCBhbmQgdXBkYXRlIHRoZSBET00gYmFzZWQgb24gd2hhdCB0aGUgZGlmZmVyZW5jZSBpc1xyXG5cdFx0Ly8zIC0gcmVjdXJzaXZlbHkgYXBwbHkgdGhpcyBhbGdvcml0aG0gZm9yIGV2ZXJ5IGFycmF5IGFuZCBmb3IgdGhlIGNoaWxkcmVuIG9mIGV2ZXJ5IHZpcnR1YWwgZWxlbWVudFxyXG5cclxuXHRcdC8vdGhlIGBjYWNoZWRgIGRhdGEgc3RydWN0dXJlIGlzIGVzc2VudGlhbGx5IHRoZSBzYW1lIGFzIHRoZSBwcmV2aW91cyByZWRyYXcncyBgZGF0YWAgZGF0YSBzdHJ1Y3R1cmUsIHdpdGggYSBmZXcgYWRkaXRpb25zOlxyXG5cdFx0Ly8tIGBjYWNoZWRgIGFsd2F5cyBoYXMgYSBwcm9wZXJ0eSBjYWxsZWQgYG5vZGVzYCwgd2hpY2ggaXMgYSBsaXN0IG9mIERPTSBlbGVtZW50cyB0aGF0IGNvcnJlc3BvbmQgdG8gdGhlIGRhdGEgcmVwcmVzZW50ZWQgYnkgdGhlIHJlc3BlY3RpdmUgdmlydHVhbCBlbGVtZW50XHJcblx0XHQvLy0gaW4gb3JkZXIgdG8gc3VwcG9ydCBhdHRhY2hpbmcgYG5vZGVzYCBhcyBhIHByb3BlcnR5IG9mIGBjYWNoZWRgLCBgY2FjaGVkYCBpcyAqYWx3YXlzKiBhIG5vbi1wcmltaXRpdmUgb2JqZWN0LCBpLmUuIGlmIHRoZSBkYXRhIHdhcyBhIHN0cmluZywgdGhlbiBjYWNoZWQgaXMgYSBTdHJpbmcgaW5zdGFuY2UuIElmIGRhdGEgd2FzIGBudWxsYCBvciBgdW5kZWZpbmVkYCwgY2FjaGVkIGlzIGBuZXcgU3RyaW5nKFwiXCIpYFxyXG5cdFx0Ly8tIGBjYWNoZWQgYWxzbyBoYXMgYSBgY29uZmlnQ29udGV4dGAgcHJvcGVydHksIHdoaWNoIGlzIHRoZSBzdGF0ZSBzdG9yYWdlIG9iamVjdCBleHBvc2VkIGJ5IGNvbmZpZyhlbGVtZW50LCBpc0luaXRpYWxpemVkLCBjb250ZXh0KVxyXG5cdFx0Ly8tIHdoZW4gYGNhY2hlZGAgaXMgYW4gT2JqZWN0LCBpdCByZXByZXNlbnRzIGEgdmlydHVhbCBlbGVtZW50OyB3aGVuIGl0J3MgYW4gQXJyYXksIGl0IHJlcHJlc2VudHMgYSBsaXN0IG9mIGVsZW1lbnRzOyB3aGVuIGl0J3MgYSBTdHJpbmcsIE51bWJlciBvciBCb29sZWFuLCBpdCByZXByZXNlbnRzIGEgdGV4dCBub2RlXHJcblxyXG5cdFx0Ly9gcGFyZW50RWxlbWVudGAgaXMgYSBET00gZWxlbWVudCB1c2VkIGZvciBXM0MgRE9NIEFQSSBjYWxsc1xyXG5cdFx0Ly9gcGFyZW50VGFnYCBpcyBvbmx5IHVzZWQgZm9yIGhhbmRsaW5nIGEgY29ybmVyIGNhc2UgZm9yIHRleHRhcmVhIHZhbHVlc1xyXG5cdFx0Ly9gcGFyZW50Q2FjaGVgIGlzIHVzZWQgdG8gcmVtb3ZlIG5vZGVzIGluIHNvbWUgbXVsdGktbm9kZSBjYXNlc1xyXG5cdFx0Ly9gcGFyZW50SW5kZXhgIGFuZCBgaW5kZXhgIGFyZSB1c2VkIHRvIGZpZ3VyZSBvdXQgdGhlIG9mZnNldCBvZiBub2Rlcy4gVGhleSdyZSBhcnRpZmFjdHMgZnJvbSBiZWZvcmUgYXJyYXlzIHN0YXJ0ZWQgYmVpbmcgZmxhdHRlbmVkIGFuZCBhcmUgbGlrZWx5IHJlZmFjdG9yYWJsZVxyXG5cdFx0Ly9gZGF0YWAgYW5kIGBjYWNoZWRgIGFyZSwgcmVzcGVjdGl2ZWx5LCB0aGUgbmV3IGFuZCBvbGQgbm9kZXMgYmVpbmcgZGlmZmVkXHJcblx0XHQvL2BzaG91bGRSZWF0dGFjaGAgaXMgYSBmbGFnIGluZGljYXRpbmcgd2hldGhlciBhIHBhcmVudCBub2RlIHdhcyByZWNyZWF0ZWQgKGlmIHNvLCBhbmQgaWYgdGhpcyBub2RlIGlzIHJldXNlZCwgdGhlbiB0aGlzIG5vZGUgbXVzdCByZWF0dGFjaCBpdHNlbGYgdG8gdGhlIG5ldyBwYXJlbnQpXHJcblx0XHQvL2BlZGl0YWJsZWAgaXMgYSBmbGFnIHRoYXQgaW5kaWNhdGVzIHdoZXRoZXIgYW4gYW5jZXN0b3IgaXMgY29udGVudGVkaXRhYmxlXHJcblx0XHQvL2BuYW1lc3BhY2VgIGluZGljYXRlcyB0aGUgY2xvc2VzdCBIVE1MIG5hbWVzcGFjZSBhcyBpdCBjYXNjYWRlcyBkb3duIGZyb20gYW4gYW5jZXN0b3JcclxuXHRcdC8vYGNvbmZpZ3NgIGlzIGEgbGlzdCBvZiBjb25maWcgZnVuY3Rpb25zIHRvIHJ1biBhZnRlciB0aGUgdG9wbW9zdCBgYnVpbGRgIGNhbGwgZmluaXNoZXMgcnVubmluZ1xyXG5cclxuXHRcdC8vdGhlcmUncyBsb2dpYyB0aGF0IHJlbGllcyBvbiB0aGUgYXNzdW1wdGlvbiB0aGF0IG51bGwgYW5kIHVuZGVmaW5lZCBkYXRhIGFyZSBlcXVpdmFsZW50IHRvIGVtcHR5IHN0cmluZ3NcclxuXHRcdC8vLSB0aGlzIHByZXZlbnRzIGxpZmVjeWNsZSBzdXJwcmlzZXMgZnJvbSBwcm9jZWR1cmFsIGhlbHBlcnMgdGhhdCBtaXggaW1wbGljaXQgYW5kIGV4cGxpY2l0IHJldHVybiBzdGF0ZW1lbnRzIChlLmcuIGZ1bmN0aW9uIGZvbygpIHtpZiAoY29uZCkgcmV0dXJuIG0oXCJkaXZcIil9XHJcblx0XHQvLy0gaXQgc2ltcGxpZmllcyBkaWZmaW5nIGNvZGVcclxuXHRcdC8vZGF0YS50b1N0cmluZygpIG1pZ2h0IHRocm93IG9yIHJldHVybiBudWxsIGlmIGRhdGEgaXMgdGhlIHJldHVybiB2YWx1ZSBvZiBDb25zb2xlLmxvZyBpbiBGaXJlZm94IChiZWhhdmlvciBkZXBlbmRzIG9uIHZlcnNpb24pXHJcblx0XHR0cnkge2lmIChkYXRhID09IG51bGwgfHwgZGF0YS50b1N0cmluZygpID09IG51bGwpIGRhdGEgPSBcIlwiO30gY2F0Y2ggKGUpIHtkYXRhID0gXCJcIjt9XHJcblx0XHRpZiAoZGF0YS5zdWJ0cmVlID09PSBcInJldGFpblwiKSByZXR1cm4gY2FjaGVkO1xyXG5cdFx0dmFyIGNhY2hlZFR5cGUgPSB0eXBlLmNhbGwoY2FjaGVkKSwgZGF0YVR5cGUgPSB0eXBlLmNhbGwoZGF0YSk7XHJcblx0XHRpZiAoY2FjaGVkID09IG51bGwgfHwgY2FjaGVkVHlwZSAhPT0gZGF0YVR5cGUpIHtcclxuXHRcdFx0aWYgKGNhY2hlZCAhPSBudWxsKSB7XHJcblx0XHRcdFx0aWYgKHBhcmVudENhY2hlICYmIHBhcmVudENhY2hlLm5vZGVzKSB7XHJcblx0XHRcdFx0XHR2YXIgb2Zmc2V0ID0gaW5kZXggLSBwYXJlbnRJbmRleDtcclxuXHRcdFx0XHRcdHZhciBlbmQgPSBvZmZzZXQgKyAoZGF0YVR5cGUgPT09IEFSUkFZID8gZGF0YSA6IGNhY2hlZC5ub2RlcykubGVuZ3RoO1xyXG5cdFx0XHRcdFx0Y2xlYXIocGFyZW50Q2FjaGUubm9kZXMuc2xpY2Uob2Zmc2V0LCBlbmQpLCBwYXJlbnRDYWNoZS5zbGljZShvZmZzZXQsIGVuZCkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGlmIChjYWNoZWQubm9kZXMpIGNsZWFyKGNhY2hlZC5ub2RlcywgY2FjaGVkKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYWNoZWQgPSBuZXcgZGF0YS5jb25zdHJ1Y3RvcjtcclxuXHRcdFx0aWYgKGNhY2hlZC50YWcpIGNhY2hlZCA9IHt9OyAvL2lmIGNvbnN0cnVjdG9yIGNyZWF0ZXMgYSB2aXJ0dWFsIGRvbSBlbGVtZW50LCB1c2UgYSBibGFuayBvYmplY3QgYXMgdGhlIGJhc2UgY2FjaGVkIG5vZGUgaW5zdGVhZCBvZiBjb3B5aW5nIHRoZSB2aXJ0dWFsIGVsICgjMjc3KVxyXG5cdFx0XHRjYWNoZWQubm9kZXMgPSBbXTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZGF0YVR5cGUgPT09IEFSUkFZKSB7XHJcblx0XHRcdC8vcmVjdXJzaXZlbHkgZmxhdHRlbiBhcnJheVxyXG5cdFx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRcdGlmICh0eXBlLmNhbGwoZGF0YVtpXSkgPT09IEFSUkFZKSB7XHJcblx0XHRcdFx0XHRkYXRhID0gZGF0YS5jb25jYXQuYXBwbHkoW10sIGRhdGEpO1xyXG5cdFx0XHRcdFx0aS0tOyAvL2NoZWNrIGN1cnJlbnQgaW5kZXggYWdhaW4gYW5kIGZsYXR0ZW4gdW50aWwgdGhlcmUgYXJlIG5vIG1vcmUgbmVzdGVkIGFycmF5cyBhdCB0aGF0IGluZGV4XHJcblx0XHRcdFx0XHRsZW4gPSBkYXRhLmxlbmd0aDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBub2RlcyA9IFtdLCBpbnRhY3QgPSBjYWNoZWQubGVuZ3RoID09PSBkYXRhLmxlbmd0aCwgc3ViQXJyYXlDb3VudCA9IDA7XHJcblxyXG5cdFx0XHQvL2tleXMgYWxnb3JpdGhtOiBzb3J0IGVsZW1lbnRzIHdpdGhvdXQgcmVjcmVhdGluZyB0aGVtIGlmIGtleXMgYXJlIHByZXNlbnRcclxuXHRcdFx0Ly8xKSBjcmVhdGUgYSBtYXAgb2YgYWxsIGV4aXN0aW5nIGtleXMsIGFuZCBtYXJrIGFsbCBmb3IgZGVsZXRpb25cclxuXHRcdFx0Ly8yKSBhZGQgbmV3IGtleXMgdG8gbWFwIGFuZCBtYXJrIHRoZW0gZm9yIGFkZGl0aW9uXHJcblx0XHRcdC8vMykgaWYga2V5IGV4aXN0cyBpbiBuZXcgbGlzdCwgY2hhbmdlIGFjdGlvbiBmcm9tIGRlbGV0aW9uIHRvIGEgbW92ZVxyXG5cdFx0XHQvLzQpIGZvciBlYWNoIGtleSwgaGFuZGxlIGl0cyBjb3JyZXNwb25kaW5nIGFjdGlvbiBhcyBtYXJrZWQgaW4gcHJldmlvdXMgc3RlcHNcclxuXHRcdFx0dmFyIERFTEVUSU9OID0gMSwgSU5TRVJUSU9OID0gMiAsIE1PVkUgPSAzO1xyXG5cdFx0XHR2YXIgZXhpc3RpbmcgPSB7fSwgc2hvdWxkTWFpbnRhaW5JZGVudGl0aWVzID0gZmFsc2U7XHJcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgY2FjaGVkLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0aWYgKGNhY2hlZFtpXSAmJiBjYWNoZWRbaV0uYXR0cnMgJiYgY2FjaGVkW2ldLmF0dHJzLmtleSAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRzaG91bGRNYWludGFpbklkZW50aXRpZXMgPSB0cnVlO1xyXG5cdFx0XHRcdFx0ZXhpc3RpbmdbY2FjaGVkW2ldLmF0dHJzLmtleV0gPSB7YWN0aW9uOiBERUxFVElPTiwgaW5kZXg6IGl9O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIGd1aWQgPSAwXHJcblx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0aWYgKGRhdGFbaV0gJiYgZGF0YVtpXS5hdHRycyAmJiBkYXRhW2ldLmF0dHJzLmtleSAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBqID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGogPCBsZW47IGorKykge1xyXG5cdFx0XHRcdFx0XHRpZiAoZGF0YVtqXSAmJiBkYXRhW2pdLmF0dHJzICYmIGRhdGFbal0uYXR0cnMua2V5ID09IG51bGwpIHtcclxuXHRcdFx0XHRcdFx0XHRkYXRhW2pdLmF0dHJzLmtleSA9IFwiX19taXRocmlsX19cIiArIGd1aWQrKztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoc2hvdWxkTWFpbnRhaW5JZGVudGl0aWVzKSB7XHJcblx0XHRcdFx0dmFyIGtleXNEaWZmZXIgPSBmYWxzZTtcclxuXHRcdFx0XHRpZiAoZGF0YS5sZW5ndGggIT0gY2FjaGVkLmxlbmd0aCkga2V5c0RpZmZlciA9IHRydWVcclxuXHRcdFx0XHRlbHNlIGZvciAodmFyIGkgPSAwLCBjYWNoZWRDZWxsLCBkYXRhQ2VsbDsgY2FjaGVkQ2VsbCA9IGNhY2hlZFtpXSwgZGF0YUNlbGwgPSBkYXRhW2ldOyBpKyspIHtcclxuXHRcdFx0XHRcdGlmIChjYWNoZWRDZWxsLmF0dHJzICYmIGRhdGFDZWxsLmF0dHJzICYmIGNhY2hlZENlbGwuYXR0cnMua2V5ICE9IGRhdGFDZWxsLmF0dHJzLmtleSkge1xyXG5cdFx0XHRcdFx0XHRrZXlzRGlmZmVyID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0YnJlYWtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChrZXlzRGlmZmVyKSB7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRcdFx0XHRpZiAoZGF0YVtpXSAmJiBkYXRhW2ldLmF0dHJzKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGRhdGFbaV0uYXR0cnMua2V5ICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBrZXkgPSBkYXRhW2ldLmF0dHJzLmtleTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmICghZXhpc3Rpbmdba2V5XSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRleGlzdGluZ1trZXldID0ge2FjdGlvbjogSU5TRVJUSU9OLCBpbmRleDogaX07XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRleGlzdGluZ1trZXldID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGlvbjogTU9WRSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpbmRleDogaSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcm9tOiBleGlzdGluZ1trZXldLmluZGV4LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsZW1lbnQ6IGNhY2hlZC5ub2Rlc1tleGlzdGluZ1trZXldLmluZGV4XSB8fCAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dmFyIGFjdGlvbnMgPSBbXTtcclxuXHRcdFx0XHRcdGZvciAodmFyIHByb3AgaW4gZXhpc3RpbmcpIGFjdGlvbnMucHVzaChleGlzdGluZ1twcm9wXSk7XHJcblx0XHRcdFx0XHR2YXIgY2hhbmdlcyA9IGFjdGlvbnMuc29ydChzb3J0Q2hhbmdlcyk7XHJcblx0XHRcdFx0XHR2YXIgbmV3Q2FjaGVkID0gbmV3IEFycmF5KGNhY2hlZC5sZW5ndGgpO1xyXG5cdFx0XHRcdFx0bmV3Q2FjaGVkLm5vZGVzID0gY2FjaGVkLm5vZGVzLnNsaWNlKCk7XHJcblxyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGNoYW5nZTsgY2hhbmdlID0gY2hhbmdlc1tpXTsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdGlmIChjaGFuZ2UuYWN0aW9uID09PSBERUxFVElPTikge1xyXG5cdFx0XHRcdFx0XHRcdGNsZWFyKGNhY2hlZFtjaGFuZ2UuaW5kZXhdLm5vZGVzLCBjYWNoZWRbY2hhbmdlLmluZGV4XSk7XHJcblx0XHRcdFx0XHRcdFx0bmV3Q2FjaGVkLnNwbGljZShjaGFuZ2UuaW5kZXgsIDEpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmIChjaGFuZ2UuYWN0aW9uID09PSBJTlNFUlRJT04pIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgZHVtbXkgPSAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHRcdFx0XHRcdFx0XHRkdW1teS5rZXkgPSBkYXRhW2NoYW5nZS5pbmRleF0uYXR0cnMua2V5O1xyXG5cdFx0XHRcdFx0XHRcdHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGR1bW15LCBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbY2hhbmdlLmluZGV4XSB8fCBudWxsKTtcclxuXHRcdFx0XHRcdFx0XHRuZXdDYWNoZWQuc3BsaWNlKGNoYW5nZS5pbmRleCwgMCwge2F0dHJzOiB7a2V5OiBkYXRhW2NoYW5nZS5pbmRleF0uYXR0cnMua2V5fSwgbm9kZXM6IFtkdW1teV19KTtcclxuXHRcdFx0XHRcdFx0XHRuZXdDYWNoZWQubm9kZXNbY2hhbmdlLmluZGV4XSA9IGR1bW15O1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoY2hhbmdlLmFjdGlvbiA9PT0gTU9WRSkge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbY2hhbmdlLmluZGV4XSAhPT0gY2hhbmdlLmVsZW1lbnQgJiYgY2hhbmdlLmVsZW1lbnQgIT09IG51bGwpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGNoYW5nZS5lbGVtZW50LCBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbY2hhbmdlLmluZGV4XSB8fCBudWxsKVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRuZXdDYWNoZWRbY2hhbmdlLmluZGV4XSA9IGNhY2hlZFtjaGFuZ2UuZnJvbV07XHJcblx0XHRcdFx0XHRcdFx0bmV3Q2FjaGVkLm5vZGVzW2NoYW5nZS5pbmRleF0gPSBjaGFuZ2UuZWxlbWVudFxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjYWNoZWQgPSBuZXdDYWNoZWQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdC8vZW5kIGtleSBhbGdvcml0aG1cclxuXHJcblx0XHRcdGZvciAodmFyIGkgPSAwLCBjYWNoZUNvdW50ID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRcdC8vZGlmZiBlYWNoIGl0ZW0gaW4gdGhlIGFycmF5XHJcblx0XHRcdFx0dmFyIGl0ZW0gPSBidWlsZChwYXJlbnRFbGVtZW50LCBwYXJlbnRUYWcsIGNhY2hlZCwgaW5kZXgsIGRhdGFbaV0sIGNhY2hlZFtjYWNoZUNvdW50XSwgc2hvdWxkUmVhdHRhY2gsIGluZGV4ICsgc3ViQXJyYXlDb3VudCB8fCBzdWJBcnJheUNvdW50LCBlZGl0YWJsZSwgbmFtZXNwYWNlLCBjb25maWdzKTtcclxuXHRcdFx0XHRpZiAoaXRlbSA9PT0gdW5kZWZpbmVkKSBjb250aW51ZTtcclxuXHRcdFx0XHRpZiAoIWl0ZW0ubm9kZXMuaW50YWN0KSBpbnRhY3QgPSBmYWxzZTtcclxuXHRcdFx0XHRpZiAoaXRlbS4kdHJ1c3RlZCkge1xyXG5cdFx0XHRcdFx0Ly9maXggb2Zmc2V0IG9mIG5leHQgZWxlbWVudCBpZiBpdGVtIHdhcyBhIHRydXN0ZWQgc3RyaW5nIHcvIG1vcmUgdGhhbiBvbmUgaHRtbCBlbGVtZW50XHJcblx0XHRcdFx0XHQvL3RoZSBmaXJzdCBjbGF1c2UgaW4gdGhlIHJlZ2V4cCBtYXRjaGVzIGVsZW1lbnRzXHJcblx0XHRcdFx0XHQvL3RoZSBzZWNvbmQgY2xhdXNlIChhZnRlciB0aGUgcGlwZSkgbWF0Y2hlcyB0ZXh0IG5vZGVzXHJcblx0XHRcdFx0XHRzdWJBcnJheUNvdW50ICs9IChpdGVtLm1hdGNoKC88W15cXC9dfFxcPlxccypbXjxdL2cpIHx8IFswXSkubGVuZ3RoO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHN1YkFycmF5Q291bnQgKz0gdHlwZS5jYWxsKGl0ZW0pID09PSBBUlJBWSA/IGl0ZW0ubGVuZ3RoIDogMTtcclxuXHRcdFx0XHRjYWNoZWRbY2FjaGVDb3VudCsrXSA9IGl0ZW1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIWludGFjdCkge1xyXG5cdFx0XHRcdC8vZGlmZiB0aGUgYXJyYXkgaXRzZWxmXHJcblxyXG5cdFx0XHRcdC8vdXBkYXRlIHRoZSBsaXN0IG9mIERPTSBub2RlcyBieSBjb2xsZWN0aW5nIHRoZSBub2RlcyBmcm9tIGVhY2ggaXRlbVxyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0XHRpZiAoY2FjaGVkW2ldICE9IG51bGwpIG5vZGVzLnB1c2guYXBwbHkobm9kZXMsIGNhY2hlZFtpXS5ub2RlcylcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly9yZW1vdmUgaXRlbXMgZnJvbSB0aGUgZW5kIG9mIHRoZSBhcnJheSBpZiB0aGUgbmV3IGFycmF5IGlzIHNob3J0ZXIgdGhhbiB0aGUgb2xkIG9uZVxyXG5cdFx0XHRcdC8vaWYgZXJyb3JzIGV2ZXIgaGFwcGVuIGhlcmUsIHRoZSBpc3N1ZSBpcyBtb3N0IGxpa2VseSBhIGJ1ZyBpbiB0aGUgY29uc3RydWN0aW9uIG9mIHRoZSBgY2FjaGVkYCBkYXRhIHN0cnVjdHVyZSBzb21ld2hlcmUgZWFybGllciBpbiB0aGUgcHJvZ3JhbVxyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwLCBub2RlOyBub2RlID0gY2FjaGVkLm5vZGVzW2ldOyBpKyspIHtcclxuXHRcdFx0XHRcdGlmIChub2RlLnBhcmVudE5vZGUgIT0gbnVsbCAmJiBub2Rlcy5pbmRleE9mKG5vZGUpIDwgMCkgY2xlYXIoW25vZGVdLCBbY2FjaGVkW2ldXSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGRhdGEubGVuZ3RoIDwgY2FjaGVkLmxlbmd0aCkgY2FjaGVkLmxlbmd0aCA9IGRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdGNhY2hlZC5ub2RlcyA9IG5vZGVzXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRhdGEgIT0gbnVsbCAmJiBkYXRhVHlwZSA9PT0gT0JKRUNUKSB7XHJcblx0XHRcdHZhciB2aWV3cyA9IFtdLFxyXG5cdFx0XHRcdGNvbnRyb2xsZXJzID0gW107XHJcblxyXG5cdFx0XHR3aGlsZSAoZGF0YS52aWV3KSB7XHJcblx0XHRcdFx0dmFyIHZpZXcgPSBkYXRhLnZpZXcuJG9yaWdpbmFsIHx8IGRhdGEudmlldztcclxuXHRcdFx0XHR2YXIgY29udHJvbGxlckluZGV4ID0gbS5yZWRyYXcuc3RyYXRlZ3koKSA9PSBcImRpZmZcIiAmJiBjYWNoZWQudmlld3MgPyBjYWNoZWQudmlld3MuaW5kZXhPZih2aWV3KSA6IC0xO1xyXG5cdFx0XHRcdHZhciBjb250cm9sbGVyID0gY29udHJvbGxlckluZGV4ID4gLTEgPyBjYWNoZWQuY29udHJvbGxlcnNbY29udHJvbGxlckluZGV4XSA6IG5ldyAoZGF0YS5jb250cm9sbGVyIHx8IG5vb3ApO1xyXG5cdFx0XHRcdHZhciBrZXkgPSBkYXRhICYmIGRhdGEuYXR0cnMgJiYgZGF0YS5hdHRycy5rZXk7XHJcblx0XHRcdFx0ZGF0YSA9IHBlbmRpbmdSZXF1ZXN0cyA9PSAwIHx8IChjYWNoZWQgJiYgY2FjaGVkLmNvbnRyb2xsZXJzICYmIGNhY2hlZC5jb250cm9sbGVycy5pbmRleE9mKGNvbnRyb2xsZXIpID4gLTEpID8gZGF0YS52aWV3KGNvbnRyb2xsZXIpIDoge3RhZzogXCJwbGFjZWhvbGRlclwifTtcclxuXHRcdFx0XHRpZiAoZGF0YS5zdWJ0cmVlID09PSBcInJldGFpblwiKSByZXR1cm4gY2FjaGVkO1xyXG5cdFx0XHRcdGlmIChrZXkpIHtcclxuXHRcdFx0XHRcdGlmICghZGF0YS5hdHRycykgZGF0YS5hdHRycyA9IHt9O1xyXG5cdFx0XHRcdFx0ZGF0YS5hdHRycy5rZXkgPSBrZXlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGNvbnRyb2xsZXIub251bmxvYWQpIHVubG9hZGVycy5wdXNoKHtjb250cm9sbGVyOiBjb250cm9sbGVyLCBoYW5kbGVyOiBjb250cm9sbGVyLm9udW5sb2FkfSk7XHJcblx0XHRcdFx0dmlld3MucHVzaCh2aWV3KTtcclxuXHRcdFx0XHRjb250cm9sbGVycy5wdXNoKGNvbnRyb2xsZXIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghZGF0YS50YWcgJiYgY29udHJvbGxlcnMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgdGVtcGxhdGUgbXVzdCByZXR1cm4gYSB2aXJ0dWFsIGVsZW1lbnQsIG5vdCBhbiBhcnJheSwgc3RyaW5nLCBldGMuXCIpXHJcblx0XHRcdGlmICghZGF0YS5hdHRycykgZGF0YS5hdHRycyA9IHt9O1xyXG5cdFx0XHRpZiAoIWNhY2hlZC5hdHRycykgY2FjaGVkLmF0dHJzID0ge307XHJcblxyXG5cdFx0XHR2YXIgZGF0YUF0dHJLZXlzID0gT2JqZWN0LmtleXMoZGF0YS5hdHRycyk7XHJcblx0XHRcdHZhciBoYXNLZXlzID0gZGF0YUF0dHJLZXlzLmxlbmd0aCA+IChcImtleVwiIGluIGRhdGEuYXR0cnMgPyAxIDogMCk7XHJcblx0XHRcdC8vaWYgYW4gZWxlbWVudCBpcyBkaWZmZXJlbnQgZW5vdWdoIGZyb20gdGhlIG9uZSBpbiBjYWNoZSwgcmVjcmVhdGUgaXRcclxuXHRcdFx0aWYgKGRhdGEudGFnICE9IGNhY2hlZC50YWcgfHwgZGF0YUF0dHJLZXlzLnNvcnQoKS5qb2luKCkgIT0gT2JqZWN0LmtleXMoY2FjaGVkLmF0dHJzKS5zb3J0KCkuam9pbigpIHx8IGRhdGEuYXR0cnMuaWQgIT0gY2FjaGVkLmF0dHJzLmlkIHx8IGRhdGEuYXR0cnMua2V5ICE9IGNhY2hlZC5hdHRycy5rZXkgfHwgKG0ucmVkcmF3LnN0cmF0ZWd5KCkgPT0gXCJhbGxcIiAmJiAoIWNhY2hlZC5jb25maWdDb250ZXh0IHx8IGNhY2hlZC5jb25maWdDb250ZXh0LnJldGFpbiAhPT0gdHJ1ZSkpIHx8IChtLnJlZHJhdy5zdHJhdGVneSgpID09IFwiZGlmZlwiICYmIGNhY2hlZC5jb25maWdDb250ZXh0ICYmIGNhY2hlZC5jb25maWdDb250ZXh0LnJldGFpbiA9PT0gZmFsc2UpKSB7XHJcblx0XHRcdFx0aWYgKGNhY2hlZC5ub2Rlcy5sZW5ndGgpIGNsZWFyKGNhY2hlZC5ub2Rlcyk7XHJcblx0XHRcdFx0aWYgKGNhY2hlZC5jb25maWdDb250ZXh0ICYmIHR5cGVvZiBjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCA9PT0gRlVOQ1RJT04pIGNhY2hlZC5jb25maWdDb250ZXh0Lm9udW5sb2FkKClcclxuXHRcdFx0XHRpZiAoY2FjaGVkLmNvbnRyb2xsZXJzKSB7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgY29udHJvbGxlcjsgY29udHJvbGxlciA9IGNhY2hlZC5jb250cm9sbGVyc1tpXTsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgY29udHJvbGxlci5vbnVubG9hZCA9PT0gRlVOQ1RJT04pIGNvbnRyb2xsZXIub251bmxvYWQoe3ByZXZlbnREZWZhdWx0OiBub29wfSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHR5cGUuY2FsbChkYXRhLnRhZykgIT0gU1RSSU5HKSByZXR1cm47XHJcblxyXG5cdFx0XHR2YXIgbm9kZSwgaXNOZXcgPSBjYWNoZWQubm9kZXMubGVuZ3RoID09PSAwO1xyXG5cdFx0XHRpZiAoZGF0YS5hdHRycy54bWxucykgbmFtZXNwYWNlID0gZGF0YS5hdHRycy54bWxucztcclxuXHRcdFx0ZWxzZSBpZiAoZGF0YS50YWcgPT09IFwic3ZnXCIpIG5hbWVzcGFjZSA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIjtcclxuXHRcdFx0ZWxzZSBpZiAoZGF0YS50YWcgPT09IFwibWF0aFwiKSBuYW1lc3BhY2UgPSBcImh0dHA6Ly93d3cudzMub3JnLzE5OTgvTWF0aC9NYXRoTUxcIjtcclxuXHJcblx0XHRcdGlmIChpc05ldykge1xyXG5cdFx0XHRcdGlmIChkYXRhLmF0dHJzLmlzKSBub2RlID0gbmFtZXNwYWNlID09PSB1bmRlZmluZWQgPyAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChkYXRhLnRhZywgZGF0YS5hdHRycy5pcykgOiAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZSwgZGF0YS50YWcsIGRhdGEuYXR0cnMuaXMpO1xyXG5cdFx0XHRcdGVsc2Ugbm9kZSA9IG5hbWVzcGFjZSA9PT0gdW5kZWZpbmVkID8gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZGF0YS50YWcpIDogJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhuYW1lc3BhY2UsIGRhdGEudGFnKTtcclxuXHRcdFx0XHRjYWNoZWQgPSB7XHJcblx0XHRcdFx0XHR0YWc6IGRhdGEudGFnLFxyXG5cdFx0XHRcdFx0Ly9zZXQgYXR0cmlidXRlcyBmaXJzdCwgdGhlbiBjcmVhdGUgY2hpbGRyZW5cclxuXHRcdFx0XHRcdGF0dHJzOiBoYXNLZXlzID8gc2V0QXR0cmlidXRlcyhub2RlLCBkYXRhLnRhZywgZGF0YS5hdHRycywge30sIG5hbWVzcGFjZSkgOiBkYXRhLmF0dHJzLFxyXG5cdFx0XHRcdFx0Y2hpbGRyZW46IGRhdGEuY2hpbGRyZW4gIT0gbnVsbCAmJiBkYXRhLmNoaWxkcmVuLmxlbmd0aCA+IDAgP1xyXG5cdFx0XHRcdFx0XHRidWlsZChub2RlLCBkYXRhLnRhZywgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGRhdGEuY2hpbGRyZW4sIGNhY2hlZC5jaGlsZHJlbiwgdHJ1ZSwgMCwgZGF0YS5hdHRycy5jb250ZW50ZWRpdGFibGUgPyBub2RlIDogZWRpdGFibGUsIG5hbWVzcGFjZSwgY29uZmlncykgOlxyXG5cdFx0XHRcdFx0XHRkYXRhLmNoaWxkcmVuLFxyXG5cdFx0XHRcdFx0bm9kZXM6IFtub2RlXVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0aWYgKGNvbnRyb2xsZXJzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0Y2FjaGVkLnZpZXdzID0gdmlld3NcclxuXHRcdFx0XHRcdGNhY2hlZC5jb250cm9sbGVycyA9IGNvbnRyb2xsZXJzXHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgY29udHJvbGxlcjsgY29udHJvbGxlciA9IGNvbnRyb2xsZXJzW2ldOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0aWYgKGNvbnRyb2xsZXIub251bmxvYWQgJiYgY29udHJvbGxlci5vbnVubG9hZC4kb2xkKSBjb250cm9sbGVyLm9udW5sb2FkID0gY29udHJvbGxlci5vbnVubG9hZC4kb2xkXHJcblx0XHRcdFx0XHRcdGlmIChwZW5kaW5nUmVxdWVzdHMgJiYgY29udHJvbGxlci5vbnVubG9hZCkge1xyXG5cdFx0XHRcdFx0XHRcdHZhciBvbnVubG9hZCA9IGNvbnRyb2xsZXIub251bmxvYWRcclxuXHRcdFx0XHRcdFx0XHRjb250cm9sbGVyLm9udW5sb2FkID0gbm9vcFxyXG5cdFx0XHRcdFx0XHRcdGNvbnRyb2xsZXIub251bmxvYWQuJG9sZCA9IG9udW5sb2FkXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChjYWNoZWQuY2hpbGRyZW4gJiYgIWNhY2hlZC5jaGlsZHJlbi5ub2RlcykgY2FjaGVkLmNoaWxkcmVuLm5vZGVzID0gW107XHJcblx0XHRcdFx0Ly9lZGdlIGNhc2U6IHNldHRpbmcgdmFsdWUgb24gPHNlbGVjdD4gZG9lc24ndCB3b3JrIGJlZm9yZSBjaGlsZHJlbiBleGlzdCwgc28gc2V0IGl0IGFnYWluIGFmdGVyIGNoaWxkcmVuIGhhdmUgYmVlbiBjcmVhdGVkXHJcblx0XHRcdFx0aWYgKGRhdGEudGFnID09PSBcInNlbGVjdFwiICYmIFwidmFsdWVcIiBpbiBkYXRhLmF0dHJzKSBzZXRBdHRyaWJ1dGVzKG5vZGUsIGRhdGEudGFnLCB7dmFsdWU6IGRhdGEuYXR0cnMudmFsdWV9LCB7fSwgbmFtZXNwYWNlKTtcclxuXHRcdFx0XHRwYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShub2RlLCBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdIHx8IG51bGwpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0bm9kZSA9IGNhY2hlZC5ub2Rlc1swXTtcclxuXHRcdFx0XHRpZiAoaGFzS2V5cykgc2V0QXR0cmlidXRlcyhub2RlLCBkYXRhLnRhZywgZGF0YS5hdHRycywgY2FjaGVkLmF0dHJzLCBuYW1lc3BhY2UpO1xyXG5cdFx0XHRcdGNhY2hlZC5jaGlsZHJlbiA9IGJ1aWxkKG5vZGUsIGRhdGEudGFnLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZGF0YS5jaGlsZHJlbiwgY2FjaGVkLmNoaWxkcmVuLCBmYWxzZSwgMCwgZGF0YS5hdHRycy5jb250ZW50ZWRpdGFibGUgPyBub2RlIDogZWRpdGFibGUsIG5hbWVzcGFjZSwgY29uZmlncyk7XHJcblx0XHRcdFx0Y2FjaGVkLm5vZGVzLmludGFjdCA9IHRydWU7XHJcblx0XHRcdFx0aWYgKGNvbnRyb2xsZXJzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0Y2FjaGVkLnZpZXdzID0gdmlld3NcclxuXHRcdFx0XHRcdGNhY2hlZC5jb250cm9sbGVycyA9IGNvbnRyb2xsZXJzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChzaG91bGRSZWF0dGFjaCA9PT0gdHJ1ZSAmJiBub2RlICE9IG51bGwpIHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKG5vZGUsIHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF0gfHwgbnVsbClcclxuXHRcdFx0fVxyXG5cdFx0XHQvL3NjaGVkdWxlIGNvbmZpZ3MgdG8gYmUgY2FsbGVkLiBUaGV5IGFyZSBjYWxsZWQgYWZ0ZXIgYGJ1aWxkYCBmaW5pc2hlcyBydW5uaW5nXHJcblx0XHRcdGlmICh0eXBlb2YgZGF0YS5hdHRyc1tcImNvbmZpZ1wiXSA9PT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0XHR2YXIgY29udGV4dCA9IGNhY2hlZC5jb25maWdDb250ZXh0ID0gY2FjaGVkLmNvbmZpZ0NvbnRleHQgfHwge307XHJcblxyXG5cdFx0XHRcdC8vIGJpbmRcclxuXHRcdFx0XHR2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbihkYXRhLCBhcmdzKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBkYXRhLmF0dHJzW1wiY29uZmlnXCJdLmFwcGx5KGRhdGEsIGFyZ3MpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRjb25maWdzLnB1c2goY2FsbGJhY2soZGF0YSwgW25vZGUsICFpc05ldywgY29udGV4dCwgY2FjaGVkXSkpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHR5cGVvZiBkYXRhICE9IEZVTkNUSU9OKSB7XHJcblx0XHRcdC8vaGFuZGxlIHRleHQgbm9kZXNcclxuXHRcdFx0dmFyIG5vZGVzO1xyXG5cdFx0XHRpZiAoY2FjaGVkLm5vZGVzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRcdGlmIChkYXRhLiR0cnVzdGVkKSB7XHJcblx0XHRcdFx0XHRub2RlcyA9IGluamVjdEhUTUwocGFyZW50RWxlbWVudCwgaW5kZXgsIGRhdGEpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0bm9kZXMgPSBbJGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRhdGEpXTtcclxuXHRcdFx0XHRcdGlmICghcGFyZW50RWxlbWVudC5ub2RlTmFtZS5tYXRjaCh2b2lkRWxlbWVudHMpKSBwYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShub2Rlc1swXSwgcGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2luZGV4XSB8fCBudWxsKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYWNoZWQgPSBcInN0cmluZyBudW1iZXIgYm9vbGVhblwiLmluZGV4T2YodHlwZW9mIGRhdGEpID4gLTEgPyBuZXcgZGF0YS5jb25zdHJ1Y3RvcihkYXRhKSA6IGRhdGE7XHJcblx0XHRcdFx0Y2FjaGVkLm5vZGVzID0gbm9kZXNcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChjYWNoZWQudmFsdWVPZigpICE9PSBkYXRhLnZhbHVlT2YoKSB8fCBzaG91bGRSZWF0dGFjaCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdG5vZGVzID0gY2FjaGVkLm5vZGVzO1xyXG5cdFx0XHRcdGlmICghZWRpdGFibGUgfHwgZWRpdGFibGUgIT09ICRkb2N1bWVudC5hY3RpdmVFbGVtZW50KSB7XHJcblx0XHRcdFx0XHRpZiAoZGF0YS4kdHJ1c3RlZCkge1xyXG5cdFx0XHRcdFx0XHRjbGVhcihub2RlcywgY2FjaGVkKTtcclxuXHRcdFx0XHRcdFx0bm9kZXMgPSBpbmplY3RIVE1MKHBhcmVudEVsZW1lbnQsIGluZGV4LCBkYXRhKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdC8vY29ybmVyIGNhc2U6IHJlcGxhY2luZyB0aGUgbm9kZVZhbHVlIG9mIGEgdGV4dCBub2RlIHRoYXQgaXMgYSBjaGlsZCBvZiBhIHRleHRhcmVhL2NvbnRlbnRlZGl0YWJsZSBkb2Vzbid0IHdvcmtcclxuXHRcdFx0XHRcdFx0Ly93ZSBuZWVkIHRvIHVwZGF0ZSB0aGUgdmFsdWUgcHJvcGVydHkgb2YgdGhlIHBhcmVudCB0ZXh0YXJlYSBvciB0aGUgaW5uZXJIVE1MIG9mIHRoZSBjb250ZW50ZWRpdGFibGUgZWxlbWVudCBpbnN0ZWFkXHJcblx0XHRcdFx0XHRcdGlmIChwYXJlbnRUYWcgPT09IFwidGV4dGFyZWFcIikgcGFyZW50RWxlbWVudC52YWx1ZSA9IGRhdGE7XHJcblx0XHRcdFx0XHRcdGVsc2UgaWYgKGVkaXRhYmxlKSBlZGl0YWJsZS5pbm5lckhUTUwgPSBkYXRhO1xyXG5cdFx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAobm9kZXNbMF0ubm9kZVR5cGUgPT09IDEgfHwgbm9kZXMubGVuZ3RoID4gMSkgeyAvL3dhcyBhIHRydXN0ZWQgc3RyaW5nXHJcblx0XHRcdFx0XHRcdFx0XHRjbGVhcihjYWNoZWQubm9kZXMsIGNhY2hlZCk7XHJcblx0XHRcdFx0XHRcdFx0XHRub2RlcyA9IFskZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGF0YSldXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKG5vZGVzWzBdLCBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdIHx8IG51bGwpO1xyXG5cdFx0XHRcdFx0XHRcdG5vZGVzWzBdLm5vZGVWYWx1ZSA9IGRhdGFcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYWNoZWQgPSBuZXcgZGF0YS5jb25zdHJ1Y3RvcihkYXRhKTtcclxuXHRcdFx0XHRjYWNoZWQubm9kZXMgPSBub2Rlc1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgY2FjaGVkLm5vZGVzLmludGFjdCA9IHRydWVcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gY2FjaGVkXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzb3J0Q2hhbmdlcyhhLCBiKSB7XHJcblx0XHRyZXR1cm4gYS5hY3Rpb24gLSBiLmFjdGlvbiB8fCBhLmluZGV4IC0gYi5pbmRleDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldEF0dHJpYnV0ZXMobm9kZSwgdGFnLCBkYXRhQXR0cnMsIGNhY2hlZEF0dHJzLCBuYW1lc3BhY2UpIHtcclxuXHRcdGZvciAodmFyIGF0dHJOYW1lIGluIGRhdGFBdHRycykge1xyXG5cdFx0XHR2YXIgZGF0YUF0dHIgPSBkYXRhQXR0cnNbYXR0ck5hbWVdO1xyXG5cdFx0XHR2YXIgY2FjaGVkQXR0ciA9IGNhY2hlZEF0dHJzW2F0dHJOYW1lXTtcclxuXHRcdFx0aWYgKCEoYXR0ck5hbWUgaW4gY2FjaGVkQXR0cnMpIHx8IChjYWNoZWRBdHRyICE9PSBkYXRhQXR0cikpIHtcclxuXHRcdFx0XHRjYWNoZWRBdHRyc1thdHRyTmFtZV0gPSBkYXRhQXR0cjtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0Ly9gY29uZmlnYCBpc24ndCBhIHJlYWwgYXR0cmlidXRlcywgc28gaWdub3JlIGl0XHJcblx0XHRcdFx0XHRpZiAoYXR0ck5hbWUgPT09IFwiY29uZmlnXCIgfHwgYXR0ck5hbWUgPT0gXCJrZXlcIikgY29udGludWU7XHJcblx0XHRcdFx0XHQvL2hvb2sgZXZlbnQgaGFuZGxlcnMgdG8gdGhlIGF1dG8tcmVkcmF3aW5nIHN5c3RlbVxyXG5cdFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRhdGFBdHRyID09PSBGVU5DVElPTiAmJiBhdHRyTmFtZS5pbmRleE9mKFwib25cIikgPT09IDApIHtcclxuXHRcdFx0XHRcdFx0bm9kZVthdHRyTmFtZV0gPSBhdXRvcmVkcmF3KGRhdGFBdHRyLCBub2RlKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly9oYW5kbGUgYHN0eWxlOiB7Li4ufWBcclxuXHRcdFx0XHRcdGVsc2UgaWYgKGF0dHJOYW1lID09PSBcInN0eWxlXCIgJiYgZGF0YUF0dHIgIT0gbnVsbCAmJiB0eXBlLmNhbGwoZGF0YUF0dHIpID09PSBPQkpFQ1QpIHtcclxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgcnVsZSBpbiBkYXRhQXR0cikge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChjYWNoZWRBdHRyID09IG51bGwgfHwgY2FjaGVkQXR0cltydWxlXSAhPT0gZGF0YUF0dHJbcnVsZV0pIG5vZGUuc3R5bGVbcnVsZV0gPSBkYXRhQXR0cltydWxlXVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGZvciAodmFyIHJ1bGUgaW4gY2FjaGVkQXR0cikge1xyXG5cdFx0XHRcdFx0XHRcdGlmICghKHJ1bGUgaW4gZGF0YUF0dHIpKSBub2RlLnN0eWxlW3J1bGVdID0gXCJcIlxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvL2hhbmRsZSBTVkdcclxuXHRcdFx0XHRcdGVsc2UgaWYgKG5hbWVzcGFjZSAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRcdGlmIChhdHRyTmFtZSA9PT0gXCJocmVmXCIpIG5vZGUuc2V0QXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsIFwiaHJlZlwiLCBkYXRhQXR0cik7XHJcblx0XHRcdFx0XHRcdGVsc2UgaWYgKGF0dHJOYW1lID09PSBcImNsYXNzTmFtZVwiKSBub2RlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGRhdGFBdHRyKTtcclxuXHRcdFx0XHRcdFx0ZWxzZSBub2RlLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgZGF0YUF0dHIpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvL2hhbmRsZSBjYXNlcyB0aGF0IGFyZSBwcm9wZXJ0aWVzIChidXQgaWdub3JlIGNhc2VzIHdoZXJlIHdlIHNob3VsZCB1c2Ugc2V0QXR0cmlidXRlIGluc3RlYWQpXHJcblx0XHRcdFx0XHQvLy0gbGlzdCBhbmQgZm9ybSBhcmUgdHlwaWNhbGx5IHVzZWQgYXMgc3RyaW5ncywgYnV0IGFyZSBET00gZWxlbWVudCByZWZlcmVuY2VzIGluIGpzXHJcblx0XHRcdFx0XHQvLy0gd2hlbiB1c2luZyBDU1Mgc2VsZWN0b3JzIChlLmcuIGBtKFwiW3N0eWxlPScnXVwiKWApLCBzdHlsZSBpcyB1c2VkIGFzIGEgc3RyaW5nLCBidXQgaXQncyBhbiBvYmplY3QgaW4ganNcclxuXHRcdFx0XHRcdGVsc2UgaWYgKGF0dHJOYW1lIGluIG5vZGUgJiYgIShhdHRyTmFtZSA9PT0gXCJsaXN0XCIgfHwgYXR0ck5hbWUgPT09IFwic3R5bGVcIiB8fCBhdHRyTmFtZSA9PT0gXCJmb3JtXCIgfHwgYXR0ck5hbWUgPT09IFwidHlwZVwiIHx8IGF0dHJOYW1lID09PSBcIndpZHRoXCIgfHwgYXR0ck5hbWUgPT09IFwiaGVpZ2h0XCIpKSB7XHJcblx0XHRcdFx0XHRcdC8vIzM0OCBkb24ndCBzZXQgdGhlIHZhbHVlIGlmIG5vdCBuZWVkZWQgb3RoZXJ3aXNlIGN1cnNvciBwbGFjZW1lbnQgYnJlYWtzIGluIENocm9tZVxyXG5cdFx0XHRcdFx0XHRpZiAodGFnICE9PSBcImlucHV0XCIgfHwgbm9kZVthdHRyTmFtZV0gIT09IGRhdGFBdHRyKSBub2RlW2F0dHJOYW1lXSA9IGRhdGFBdHRyXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIG5vZGUuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCBkYXRhQXR0cilcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdC8vc3dhbGxvdyBJRSdzIGludmFsaWQgYXJndW1lbnQgZXJyb3JzIHRvIG1pbWljIEhUTUwncyBmYWxsYmFjay10by1kb2luZy1ub3RoaW5nLW9uLWludmFsaWQtYXR0cmlidXRlcyBiZWhhdmlvclxyXG5cdFx0XHRcdFx0aWYgKGUubWVzc2FnZS5pbmRleE9mKFwiSW52YWxpZCBhcmd1bWVudFwiKSA8IDApIHRocm93IGVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8jMzQ4IGRhdGFBdHRyIG1heSBub3QgYmUgYSBzdHJpbmcsIHNvIHVzZSBsb29zZSBjb21wYXJpc29uIChkb3VibGUgZXF1YWwpIGluc3RlYWQgb2Ygc3RyaWN0ICh0cmlwbGUgZXF1YWwpXHJcblx0XHRcdGVsc2UgaWYgKGF0dHJOYW1lID09PSBcInZhbHVlXCIgJiYgdGFnID09PSBcImlucHV0XCIgJiYgbm9kZS52YWx1ZSAhPSBkYXRhQXR0cikge1xyXG5cdFx0XHRcdG5vZGUudmFsdWUgPSBkYXRhQXR0clxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY2FjaGVkQXR0cnM7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjbGVhcihub2RlcywgY2FjaGVkKSB7XHJcblx0XHRmb3IgKHZhciBpID0gbm9kZXMubGVuZ3RoIC0gMTsgaSA+IC0xOyBpLS0pIHtcclxuXHRcdFx0aWYgKG5vZGVzW2ldICYmIG5vZGVzW2ldLnBhcmVudE5vZGUpIHtcclxuXHRcdFx0XHR0cnkge25vZGVzW2ldLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZXNbaV0pfVxyXG5cdFx0XHRcdGNhdGNoIChlKSB7fSAvL2lnbm9yZSBpZiB0aGlzIGZhaWxzIGR1ZSB0byBvcmRlciBvZiBldmVudHMgKHNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzIxOTI2MDgzL2ZhaWxlZC10by1leGVjdXRlLXJlbW92ZWNoaWxkLW9uLW5vZGUpXHJcblx0XHRcdFx0Y2FjaGVkID0gW10uY29uY2F0KGNhY2hlZCk7XHJcblx0XHRcdFx0aWYgKGNhY2hlZFtpXSkgdW5sb2FkKGNhY2hlZFtpXSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKG5vZGVzLmxlbmd0aCAhPSAwKSBub2Rlcy5sZW5ndGggPSAwO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gdW5sb2FkKGNhY2hlZCkge1xyXG5cdFx0aWYgKGNhY2hlZC5jb25maWdDb250ZXh0ICYmIHR5cGVvZiBjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCA9PT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0Y2FjaGVkLmNvbmZpZ0NvbnRleHQub251bmxvYWQoKTtcclxuXHRcdFx0Y2FjaGVkLmNvbmZpZ0NvbnRleHQub251bmxvYWQgPSBudWxsXHJcblx0XHR9XHJcblx0XHRpZiAoY2FjaGVkLmNvbnRyb2xsZXJzKSB7XHJcblx0XHRcdGZvciAodmFyIGkgPSAwLCBjb250cm9sbGVyOyBjb250cm9sbGVyID0gY2FjaGVkLmNvbnRyb2xsZXJzW2ldOyBpKyspIHtcclxuXHRcdFx0XHRpZiAodHlwZW9mIGNvbnRyb2xsZXIub251bmxvYWQgPT09IEZVTkNUSU9OKSBjb250cm9sbGVyLm9udW5sb2FkKHtwcmV2ZW50RGVmYXVsdDogbm9vcH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAoY2FjaGVkLmNoaWxkcmVuKSB7XHJcblx0XHRcdGlmICh0eXBlLmNhbGwoY2FjaGVkLmNoaWxkcmVuKSA9PT0gQVJSQVkpIHtcclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMCwgY2hpbGQ7IGNoaWxkID0gY2FjaGVkLmNoaWxkcmVuW2ldOyBpKyspIHVubG9hZChjaGlsZClcclxuXHRcdFx0fSBlbHNlIGlmIChjYWNoZWQuY2hpbGRyZW4udGFnKSB7XHJcblx0XHRcdFx0dW5sb2FkKGNhY2hlZC5jaGlsZHJlbik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGluamVjdEhUTUwocGFyZW50RWxlbWVudCwgaW5kZXgsIGRhdGEpIHtcclxuXHRcdHZhciBuZXh0U2libGluZyA9IHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF07XHJcblx0XHRpZiAobmV4dFNpYmxpbmcpIHtcclxuXHRcdFx0dmFyIGlzRWxlbWVudCA9IG5leHRTaWJsaW5nLm5vZGVUeXBlICE9IDE7XHJcblx0XHRcdHZhciBwbGFjZWhvbGRlciA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuXHRcdFx0aWYgKGlzRWxlbWVudCkge1xyXG5cdFx0XHRcdHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKHBsYWNlaG9sZGVyLCBuZXh0U2libGluZyB8fCBudWxsKTtcclxuXHRcdFx0XHRwbGFjZWhvbGRlci5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmViZWdpblwiLCBkYXRhKTtcclxuXHRcdFx0XHRwYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHBsYWNlaG9sZGVyKVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG5leHRTaWJsaW5nLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWJlZ2luXCIsIGRhdGEpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRwYXJlbnRFbGVtZW50Lmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWVuZFwiLCBkYXRhKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgbm9kZXMgPSBbXTtcclxuXHJcblx0XHR3aGlsZSAocGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2luZGV4XSAhPT0gbmV4dFNpYmxpbmcpIHtcclxuXHRcdFx0bm9kZXMucHVzaChwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdKTtcclxuXHRcdFx0aW5kZXgrK1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5vZGVzO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYXV0b3JlZHJhdyhjYWxsYmFjaywgb2JqZWN0KSB7XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRlID0gZSB8fCBldmVudDtcclxuXHRcdFx0bS5yZWRyYXcuc3RyYXRlZ3koXCJkaWZmXCIpO1xyXG5cdFx0XHRtLnN0YXJ0Q29tcHV0YXRpb24oKTtcclxuXHRcdFx0dHJ5IHtyZXR1cm4gY2FsbGJhY2suY2FsbChvYmplY3QsIGUpfVxyXG5cdFx0XHRmaW5hbGx5IHtcclxuXHRcdFx0XHRlbmRGaXJzdENvbXB1dGF0aW9uKClcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dmFyIGh0bWw7XHJcblx0dmFyIGRvY3VtZW50Tm9kZSA9IHtcclxuXHRcdGFwcGVuZENoaWxkOiBmdW5jdGlvbihub2RlKSB7XHJcblx0XHRcdGlmIChodG1sID09PSB1bmRlZmluZWQpIGh0bWwgPSAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImh0bWxcIik7XHJcblx0XHRcdGlmICgkZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmICRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgIT09IG5vZGUpIHtcclxuXHRcdFx0XHQkZG9jdW1lbnQucmVwbGFjZUNoaWxkKG5vZGUsICRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSAkZG9jdW1lbnQuYXBwZW5kQ2hpbGQobm9kZSk7XHJcblx0XHRcdHRoaXMuY2hpbGROb2RlcyA9ICRkb2N1bWVudC5jaGlsZE5vZGVzXHJcblx0XHR9LFxyXG5cdFx0aW5zZXJ0QmVmb3JlOiBmdW5jdGlvbihub2RlKSB7XHJcblx0XHRcdHRoaXMuYXBwZW5kQ2hpbGQobm9kZSlcclxuXHRcdH0sXHJcblx0XHRjaGlsZE5vZGVzOiBbXVxyXG5cdH07XHJcblxyXG5cdHZhciBub2RlQ2FjaGUgPSBbXSxcclxuXHRcdGNlbGxDYWNoZSA9IHt9O1xyXG5cclxuXHRtLnJlbmRlciA9IGZ1bmN0aW9uKHJvb3QsIGNlbGwsIGZvcmNlUmVjcmVhdGlvbikge1xyXG5cdFx0dmFyIGNvbmZpZ3MgPSBbXTtcclxuXHRcdGlmICghcm9vdCkgdGhyb3cgbmV3IEVycm9yKFwiRW5zdXJlIHRoZSBET00gZWxlbWVudCBiZWluZyBwYXNzZWQgdG8gbS5yb3V0ZS9tLm1vdW50L20ucmVuZGVyIGlzIG5vdCB1bmRlZmluZWQuXCIpO1xyXG5cdFx0dmFyIGlkID0gZ2V0Q2VsbENhY2hlS2V5KHJvb3QpO1xyXG5cdFx0dmFyIGlzRG9jdW1lbnRSb290ID0gcm9vdCA9PT0gJGRvY3VtZW50O1xyXG5cdFx0dmFyIG5vZGUgPSBpc0RvY3VtZW50Um9vdCB8fCByb290ID09PSAkZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ID8gZG9jdW1lbnROb2RlIDogcm9vdDtcclxuXHRcdGlmIChpc0RvY3VtZW50Um9vdCAmJiBjZWxsLnRhZyAhPSBcImh0bWxcIikgY2VsbCA9IHt0YWc6IFwiaHRtbFwiLCBhdHRyczoge30sIGNoaWxkcmVuOiBjZWxsfTtcclxuXHRcdGlmIChjZWxsQ2FjaGVbaWRdID09PSB1bmRlZmluZWQpIGNsZWFyKG5vZGUuY2hpbGROb2Rlcyk7XHJcblx0XHRpZiAoZm9yY2VSZWNyZWF0aW9uID09PSB0cnVlKSByZXNldChyb290KTtcclxuXHRcdGNlbGxDYWNoZVtpZF0gPSBidWlsZChub2RlLCBudWxsLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgY2VsbCwgY2VsbENhY2hlW2lkXSwgZmFsc2UsIDAsIG51bGwsIHVuZGVmaW5lZCwgY29uZmlncyk7XHJcblx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gY29uZmlncy5sZW5ndGg7IGkgPCBsZW47IGkrKykgY29uZmlnc1tpXSgpXHJcblx0fTtcclxuXHJcblx0ZnVuY3Rpb24gZ2V0Q2VsbENhY2hlS2V5KGVsZW1lbnQpIHtcclxuXHRcdHZhciBpbmRleCA9IG5vZGVDYWNoZS5pbmRleE9mKGVsZW1lbnQpO1xyXG5cdFx0cmV0dXJuIGluZGV4IDwgMCA/IG5vZGVDYWNoZS5wdXNoKGVsZW1lbnQpIC0gMSA6IGluZGV4XHJcblx0fVxyXG5cclxuXHRtLnRydXN0ID0gZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHZhbHVlID0gbmV3IFN0cmluZyh2YWx1ZSk7XHJcblx0XHR2YWx1ZS4kdHJ1c3RlZCA9IHRydWU7XHJcblx0XHRyZXR1cm4gdmFsdWVcclxuXHR9O1xyXG5cclxuXHRmdW5jdGlvbiBnZXR0ZXJzZXR0ZXIoc3RvcmUpIHtcclxuXHRcdHZhciBwcm9wID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmIChhcmd1bWVudHMubGVuZ3RoKSBzdG9yZSA9IGFyZ3VtZW50c1swXTtcclxuXHRcdFx0cmV0dXJuIHN0b3JlXHJcblx0XHR9O1xyXG5cclxuXHRcdHByb3AudG9KU09OID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiBzdG9yZVxyXG5cdFx0fTtcclxuXHJcblx0XHRyZXR1cm4gcHJvcFxyXG5cdH1cclxuXHJcblx0bS5wcm9wID0gZnVuY3Rpb24gKHN0b3JlKSB7XHJcblx0XHQvL25vdGU6IHVzaW5nIG5vbi1zdHJpY3QgZXF1YWxpdHkgY2hlY2sgaGVyZSBiZWNhdXNlIHdlJ3JlIGNoZWNraW5nIGlmIHN0b3JlIGlzIG51bGwgT1IgdW5kZWZpbmVkXHJcblx0XHRpZiAoKChzdG9yZSAhPSBudWxsICYmIHR5cGUuY2FsbChzdG9yZSkgPT09IE9CSkVDVCkgfHwgdHlwZW9mIHN0b3JlID09PSBGVU5DVElPTikgJiYgdHlwZW9mIHN0b3JlLnRoZW4gPT09IEZVTkNUSU9OKSB7XHJcblx0XHRcdHJldHVybiBwcm9waWZ5KHN0b3JlKVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBnZXR0ZXJzZXR0ZXIoc3RvcmUpXHJcblx0fTtcclxuXHJcblx0dmFyIHJvb3RzID0gW10sXHJcblx0XHRjb21wb25lbnRzID0gW10sXHJcblx0XHRjb250cm9sbGVycyA9IFtdLFxyXG5cdFx0bGFzdFJlZHJhd0lkID0gbnVsbCxcclxuXHRcdGxhc3RSZWRyYXdDYWxsVGltZSA9IDAsXHJcblx0XHRjb21wdXRlUHJlUmVkcmF3SG9vayA9IG51bGwsXHJcblx0XHRjb21wdXRlUG9zdFJlZHJhd0hvb2sgPSBudWxsLFxyXG5cdFx0cHJldmVudGVkID0gZmFsc2UsXHJcblx0XHR0b3BDb21wb25lbnQsXHJcblx0XHR1bmxvYWRlcnMgPSBbXTtcclxuXHJcblx0dmFyIEZSQU1FX0JVREdFVCA9IDE2OyAvLzYwIGZyYW1lcyBwZXIgc2Vjb25kID0gMSBjYWxsIHBlciAxNiBtc1xyXG5cclxuXHRmdW5jdGlvbiBwYXJhbWV0ZXJpemUoY29tcG9uZW50LCBhcmdzKSB7XHJcblx0XHR2YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gKGNvbXBvbmVudC5jb250cm9sbGVyIHx8IG5vb3ApLmFwcGx5KHRoaXMsIGFyZ3MpIHx8IHRoaXNcclxuXHRcdH1cclxuXHRcdHZhciB2aWV3ID0gZnVuY3Rpb24oY3RybCkge1xyXG5cdFx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIGFyZ3MgPSBhcmdzLmNvbmNhdChbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpXHJcblx0XHRcdHJldHVybiBjb21wb25lbnQudmlldy5hcHBseShjb21wb25lbnQsIGFyZ3MgPyBbY3RybF0uY29uY2F0KGFyZ3MpIDogW2N0cmxdKVxyXG5cdFx0fVxyXG5cdFx0dmlldy4kb3JpZ2luYWwgPSBjb21wb25lbnQudmlld1xyXG5cdFx0dmFyIG91dHB1dCA9IHtjb250cm9sbGVyOiBjb250cm9sbGVyLCB2aWV3OiB2aWV3fVxyXG5cdFx0aWYgKGFyZ3NbMF0gJiYgYXJnc1swXS5rZXkgIT0gbnVsbCkgb3V0cHV0LmF0dHJzID0ge2tleTogYXJnc1swXS5rZXl9XHJcblx0XHRyZXR1cm4gb3V0cHV0XHJcblx0fVxyXG5cclxuXHRtLmNvbXBvbmVudCA9IGZ1bmN0aW9uKGNvbXBvbmVudCkge1xyXG5cdFx0cmV0dXJuIHBhcmFtZXRlcml6ZShjb21wb25lbnQsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSlcclxuXHR9XHJcblxyXG5cdG0ubW91bnQgPSBtLm1vZHVsZSA9IGZ1bmN0aW9uKHJvb3QsIGNvbXBvbmVudCkge1xyXG5cdFx0aWYgKCFyb290KSB0aHJvdyBuZXcgRXJyb3IoXCJQbGVhc2UgZW5zdXJlIHRoZSBET00gZWxlbWVudCBleGlzdHMgYmVmb3JlIHJlbmRlcmluZyBhIHRlbXBsYXRlIGludG8gaXQuXCIpO1xyXG5cdFx0dmFyIGluZGV4ID0gcm9vdHMuaW5kZXhPZihyb290KTtcclxuXHRcdGlmIChpbmRleCA8IDApIGluZGV4ID0gcm9vdHMubGVuZ3RoO1xyXG5cclxuXHRcdHZhciBpc1ByZXZlbnRlZCA9IGZhbHNlO1xyXG5cdFx0dmFyIGV2ZW50ID0ge3ByZXZlbnREZWZhdWx0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0aXNQcmV2ZW50ZWQgPSB0cnVlO1xyXG5cdFx0XHRjb21wdXRlUHJlUmVkcmF3SG9vayA9IGNvbXB1dGVQb3N0UmVkcmF3SG9vayA9IG51bGw7XHJcblx0XHR9fTtcclxuXHRcdGZvciAodmFyIGkgPSAwLCB1bmxvYWRlcjsgdW5sb2FkZXIgPSB1bmxvYWRlcnNbaV07IGkrKykge1xyXG5cdFx0XHR1bmxvYWRlci5oYW5kbGVyLmNhbGwodW5sb2FkZXIuY29udHJvbGxlciwgZXZlbnQpXHJcblx0XHRcdHVubG9hZGVyLmNvbnRyb2xsZXIub251bmxvYWQgPSBudWxsXHJcblx0XHR9XHJcblx0XHRpZiAoaXNQcmV2ZW50ZWQpIHtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIHVubG9hZGVyOyB1bmxvYWRlciA9IHVubG9hZGVyc1tpXTsgaSsrKSB1bmxvYWRlci5jb250cm9sbGVyLm9udW5sb2FkID0gdW5sb2FkZXIuaGFuZGxlclxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB1bmxvYWRlcnMgPSBbXVxyXG5cclxuXHRcdGlmIChjb250cm9sbGVyc1tpbmRleF0gJiYgdHlwZW9mIGNvbnRyb2xsZXJzW2luZGV4XS5vbnVubG9hZCA9PT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0Y29udHJvbGxlcnNbaW5kZXhdLm9udW5sb2FkKGV2ZW50KVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghaXNQcmV2ZW50ZWQpIHtcclxuXHRcdFx0bS5yZWRyYXcuc3RyYXRlZ3koXCJhbGxcIik7XHJcblx0XHRcdG0uc3RhcnRDb21wdXRhdGlvbigpO1xyXG5cdFx0XHRyb290c1tpbmRleF0gPSByb290O1xyXG5cdFx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDIpIGNvbXBvbmVudCA9IHN1YmNvbXBvbmVudChjb21wb25lbnQsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSlcclxuXHRcdFx0dmFyIGN1cnJlbnRDb21wb25lbnQgPSB0b3BDb21wb25lbnQgPSBjb21wb25lbnQgPSBjb21wb25lbnQgfHwge2NvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge319O1xyXG5cdFx0XHR2YXIgY29uc3RydWN0b3IgPSBjb21wb25lbnQuY29udHJvbGxlciB8fCBub29wXHJcblx0XHRcdHZhciBjb250cm9sbGVyID0gbmV3IGNvbnN0cnVjdG9yO1xyXG5cdFx0XHQvL2NvbnRyb2xsZXJzIG1heSBjYWxsIG0ubW91bnQgcmVjdXJzaXZlbHkgKHZpYSBtLnJvdXRlIHJlZGlyZWN0cywgZm9yIGV4YW1wbGUpXHJcblx0XHRcdC8vdGhpcyBjb25kaXRpb25hbCBlbnN1cmVzIG9ubHkgdGhlIGxhc3QgcmVjdXJzaXZlIG0ubW91bnQgY2FsbCBpcyBhcHBsaWVkXHJcblx0XHRcdGlmIChjdXJyZW50Q29tcG9uZW50ID09PSB0b3BDb21wb25lbnQpIHtcclxuXHRcdFx0XHRjb250cm9sbGVyc1tpbmRleF0gPSBjb250cm9sbGVyO1xyXG5cdFx0XHRcdGNvbXBvbmVudHNbaW5kZXhdID0gY29tcG9uZW50XHJcblx0XHRcdH1cclxuXHRcdFx0ZW5kRmlyc3RDb21wdXRhdGlvbigpO1xyXG5cdFx0XHRyZXR1cm4gY29udHJvbGxlcnNbaW5kZXhdXHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0dmFyIHJlZHJhd2luZyA9IGZhbHNlO1xyXG5cclxuXHRtLnJlZHJhdyA9IGZ1bmN0aW9uIChmb3JjZSkge1xyXG5cdFx0aWYgKHJlZHJhd2luZykgcmV0dXJuXHJcblx0XHRyZWRyYXdpbmcgPSB0cnVlXHJcblx0XHQvL2xhc3RSZWRyYXdJZCBpcyBhIHBvc2l0aXZlIG51bWJlciBpZiBhIHNlY29uZCByZWRyYXcgaXMgcmVxdWVzdGVkIGJlZm9yZSB0aGUgbmV4dCBhbmltYXRpb24gZnJhbWVcclxuXHRcdC8vbGFzdFJlZHJhd0lEIGlzIG51bGwgaWYgaXQncyB0aGUgZmlyc3QgcmVkcmF3IGFuZCBub3QgYW4gZXZlbnQgaGFuZGxlclxyXG5cdFx0aWYgKGxhc3RSZWRyYXdJZCAmJiBmb3JjZSAhPT0gdHJ1ZSkge1xyXG5cdFx0XHQvL3doZW4gc2V0VGltZW91dDogb25seSByZXNjaGVkdWxlIHJlZHJhdyBpZiB0aW1lIGJldHdlZW4gbm93IGFuZCBwcmV2aW91cyByZWRyYXcgaXMgYmlnZ2VyIHRoYW4gYSBmcmFtZSwgb3RoZXJ3aXNlIGtlZXAgY3VycmVudGx5IHNjaGVkdWxlZCB0aW1lb3V0XHJcblx0XHRcdC8vd2hlbiByQUY6IGFsd2F5cyByZXNjaGVkdWxlIHJlZHJhd1xyXG5cdFx0XHRpZiAoJHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCBuZXcgRGF0ZSAtIGxhc3RSZWRyYXdDYWxsVGltZSA+IEZSQU1FX0JVREdFVCkge1xyXG5cdFx0XHRcdGlmIChsYXN0UmVkcmF3SWQgPiAwKSAkY2FuY2VsQW5pbWF0aW9uRnJhbWUobGFzdFJlZHJhd0lkKTtcclxuXHRcdFx0XHRsYXN0UmVkcmF3SWQgPSAkcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlZHJhdywgRlJBTUVfQlVER0VUKVxyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZWRyYXcoKTtcclxuXHRcdFx0bGFzdFJlZHJhd0lkID0gJHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0bGFzdFJlZHJhd0lkID0gbnVsbDtcclxuXHRcdFx0fSwgRlJBTUVfQlVER0VUKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZWRyYXdpbmcgPSBmYWxzZTtcclxuXHR9O1xyXG5cclxuXHRtLnJlZHJhdy5zdHJhdGVneSA9IG0ucHJvcCgpO1xyXG5cclxuXHRmdW5jdGlvbiByZWRyYXcoKSB7XHJcblx0XHRpZiAoY29tcHV0ZVByZVJlZHJhd0hvb2spIHtcclxuXHRcdFx0Y29tcHV0ZVByZVJlZHJhd0hvb2soKVxyXG5cdFx0XHRjb21wdXRlUHJlUmVkcmF3SG9vayA9IG51bGxcclxuXHRcdH1cclxuXHRcdGZvciAodmFyIGkgPSAwLCByb290OyByb290ID0gcm9vdHNbaV07IGkrKykge1xyXG5cdFx0XHRpZiAoY29udHJvbGxlcnNbaV0pIHtcclxuXHRcdFx0XHR2YXIgYXJncyA9IGNvbXBvbmVudHNbaV0uY29udHJvbGxlciAmJiBjb21wb25lbnRzW2ldLmNvbnRyb2xsZXIuJCRhcmdzID8gW2NvbnRyb2xsZXJzW2ldXS5jb25jYXQoY29tcG9uZW50c1tpXS5jb250cm9sbGVyLiQkYXJncykgOiBbY29udHJvbGxlcnNbaV1dXHJcblx0XHRcdFx0bS5yZW5kZXIocm9vdCwgY29tcG9uZW50c1tpXS52aWV3ID8gY29tcG9uZW50c1tpXS52aWV3KGNvbnRyb2xsZXJzW2ldLCBhcmdzKSA6IFwiXCIpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vYWZ0ZXIgcmVuZGVyaW5nIHdpdGhpbiBhIHJvdXRlZCBjb250ZXh0LCB3ZSBuZWVkIHRvIHNjcm9sbCBiYWNrIHRvIHRoZSB0b3AsIGFuZCBmZXRjaCB0aGUgZG9jdW1lbnQgdGl0bGUgZm9yIGhpc3RvcnkucHVzaFN0YXRlXHJcblx0XHRpZiAoY29tcHV0ZVBvc3RSZWRyYXdIb29rKSB7XHJcblx0XHRcdGNvbXB1dGVQb3N0UmVkcmF3SG9vaygpO1xyXG5cdFx0XHRjb21wdXRlUG9zdFJlZHJhd0hvb2sgPSBudWxsXHJcblx0XHR9XHJcblx0XHRsYXN0UmVkcmF3SWQgPSBudWxsO1xyXG5cdFx0bGFzdFJlZHJhd0NhbGxUaW1lID0gbmV3IERhdGU7XHJcblx0XHRtLnJlZHJhdy5zdHJhdGVneShcImRpZmZcIilcclxuXHR9XHJcblxyXG5cdHZhciBwZW5kaW5nUmVxdWVzdHMgPSAwO1xyXG5cdG0uc3RhcnRDb21wdXRhdGlvbiA9IGZ1bmN0aW9uKCkge3BlbmRpbmdSZXF1ZXN0cysrfTtcclxuXHJcblx0bS5lbmRDb21wdXRhdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0cGVuZGluZ1JlcXVlc3RzID0gTWF0aC5tYXgocGVuZGluZ1JlcXVlc3RzIC0gMSwgMCk7XHJcblx0XHRpZiAocGVuZGluZ1JlcXVlc3RzID09PSAwKSBtLnJlZHJhdygpXHJcblx0fTtcclxuXHJcblx0dmFyIGVuZEZpcnN0Q29tcHV0YXRpb24gPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmIChtLnJlZHJhdy5zdHJhdGVneSgpID09IFwibm9uZVwiKSB7XHJcblx0XHRcdHBlbmRpbmdSZXF1ZXN0cy0tXHJcblx0XHRcdG0ucmVkcmF3LnN0cmF0ZWd5KFwiZGlmZlwiKVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBtLmVuZENvbXB1dGF0aW9uKCk7XHJcblx0fVxyXG5cclxuXHRtLndpdGhBdHRyID0gZnVuY3Rpb24ocHJvcCwgd2l0aEF0dHJDYWxsYmFjaykge1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0ZSA9IGUgfHwgZXZlbnQ7XHJcblx0XHRcdHZhciBjdXJyZW50VGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0IHx8IHRoaXM7XHJcblx0XHRcdHdpdGhBdHRyQ2FsbGJhY2socHJvcCBpbiBjdXJyZW50VGFyZ2V0ID8gY3VycmVudFRhcmdldFtwcm9wXSA6IGN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKHByb3ApKVxyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8vcm91dGluZ1xyXG5cdHZhciBtb2RlcyA9IHtwYXRobmFtZTogXCJcIiwgaGFzaDogXCIjXCIsIHNlYXJjaDogXCI/XCJ9O1xyXG5cdHZhciByZWRpcmVjdCA9IG5vb3AsXHJcblx0XHRyb3V0ZVBhcmFtcyxcclxuXHRcdGN1cnJlbnRSb3V0ZSxcclxuXHRcdGlzRGVmYXVsdFJvdXRlID0gZmFsc2U7XHJcblxyXG5cdG0ucm91dGUgPSBmdW5jdGlvbigpIHtcclxuXHRcdC8vbS5yb3V0ZSgpXHJcblx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGN1cnJlbnRSb3V0ZTtcclxuXHRcdC8vbS5yb3V0ZShlbCwgZGVmYXVsdFJvdXRlLCByb3V0ZXMpXHJcblx0XHRlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzICYmIHR5cGUuY2FsbChhcmd1bWVudHNbMV0pID09PSBTVFJJTkcpIHtcclxuXHRcdFx0dmFyIHJvb3QgPSBhcmd1bWVudHNbMF0sIGRlZmF1bHRSb3V0ZSA9IGFyZ3VtZW50c1sxXSwgcm91dGVyID0gYXJndW1lbnRzWzJdO1xyXG5cdFx0XHRyZWRpcmVjdCA9IGZ1bmN0aW9uKHNvdXJjZSkge1xyXG5cdFx0XHRcdHZhciBwYXRoID0gY3VycmVudFJvdXRlID0gbm9ybWFsaXplUm91dGUoc291cmNlKTtcclxuXHRcdFx0XHRpZiAoIXJvdXRlQnlWYWx1ZShyb290LCByb3V0ZXIsIHBhdGgpKSB7XHJcblx0XHRcdFx0XHRpZiAoaXNEZWZhdWx0Um91dGUpIHRocm93IG5ldyBFcnJvcihcIkVuc3VyZSB0aGUgZGVmYXVsdCByb3V0ZSBtYXRjaGVzIG9uZSBvZiB0aGUgcm91dGVzIGRlZmluZWQgaW4gbS5yb3V0ZVwiKVxyXG5cdFx0XHRcdFx0aXNEZWZhdWx0Um91dGUgPSB0cnVlXHJcblx0XHRcdFx0XHRtLnJvdXRlKGRlZmF1bHRSb3V0ZSwgdHJ1ZSlcclxuXHRcdFx0XHRcdGlzRGVmYXVsdFJvdXRlID0gZmFsc2VcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdHZhciBsaXN0ZW5lciA9IG0ucm91dGUubW9kZSA9PT0gXCJoYXNoXCIgPyBcIm9uaGFzaGNoYW5nZVwiIDogXCJvbnBvcHN0YXRlXCI7XHJcblx0XHRcdHdpbmRvd1tsaXN0ZW5lcl0gPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgcGF0aCA9ICRsb2NhdGlvblttLnJvdXRlLm1vZGVdXHJcblx0XHRcdFx0aWYgKG0ucm91dGUubW9kZSA9PT0gXCJwYXRobmFtZVwiKSBwYXRoICs9ICRsb2NhdGlvbi5zZWFyY2hcclxuXHRcdFx0XHRpZiAoY3VycmVudFJvdXRlICE9IG5vcm1hbGl6ZVJvdXRlKHBhdGgpKSB7XHJcblx0XHRcdFx0XHRyZWRpcmVjdChwYXRoKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0Y29tcHV0ZVByZVJlZHJhd0hvb2sgPSBzZXRTY3JvbGw7XHJcblx0XHRcdHdpbmRvd1tsaXN0ZW5lcl0oKVxyXG5cdFx0fVxyXG5cdFx0Ly9jb25maWc6IG0ucm91dGVcclxuXHRcdGVsc2UgaWYgKGFyZ3VtZW50c1swXS5hZGRFdmVudExpc3RlbmVyIHx8IGFyZ3VtZW50c1swXS5hdHRhY2hFdmVudCkge1xyXG5cdFx0XHR2YXIgZWxlbWVudCA9IGFyZ3VtZW50c1swXTtcclxuXHRcdFx0dmFyIGlzSW5pdGlhbGl6ZWQgPSBhcmd1bWVudHNbMV07XHJcblx0XHRcdHZhciBjb250ZXh0ID0gYXJndW1lbnRzWzJdO1xyXG5cdFx0XHR2YXIgdmRvbSA9IGFyZ3VtZW50c1szXTtcclxuXHRcdFx0ZWxlbWVudC5ocmVmID0gKG0ucm91dGUubW9kZSAhPT0gJ3BhdGhuYW1lJyA/ICRsb2NhdGlvbi5wYXRobmFtZSA6ICcnKSArIG1vZGVzW20ucm91dGUubW9kZV0gKyB2ZG9tLmF0dHJzLmhyZWY7XHJcblx0XHRcdGlmIChlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHtcclxuXHRcdFx0XHRlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByb3V0ZVVub2J0cnVzaXZlKTtcclxuXHRcdFx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByb3V0ZVVub2J0cnVzaXZlKVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGVsZW1lbnQuZGV0YWNoRXZlbnQoXCJvbmNsaWNrXCIsIHJvdXRlVW5vYnRydXNpdmUpO1xyXG5cdFx0XHRcdGVsZW1lbnQuYXR0YWNoRXZlbnQoXCJvbmNsaWNrXCIsIHJvdXRlVW5vYnRydXNpdmUpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vbS5yb3V0ZShyb3V0ZSwgcGFyYW1zLCBzaG91bGRSZXBsYWNlSGlzdG9yeUVudHJ5KVxyXG5cdFx0ZWxzZSBpZiAodHlwZS5jYWxsKGFyZ3VtZW50c1swXSkgPT09IFNUUklORykge1xyXG5cdFx0XHR2YXIgb2xkUm91dGUgPSBjdXJyZW50Um91dGU7XHJcblx0XHRcdGN1cnJlbnRSb3V0ZSA9IGFyZ3VtZW50c1swXTtcclxuXHRcdFx0dmFyIGFyZ3MgPSBhcmd1bWVudHNbMV0gfHwge31cclxuXHRcdFx0dmFyIHF1ZXJ5SW5kZXggPSBjdXJyZW50Um91dGUuaW5kZXhPZihcIj9cIilcclxuXHRcdFx0dmFyIHBhcmFtcyA9IHF1ZXJ5SW5kZXggPiAtMSA/IHBhcnNlUXVlcnlTdHJpbmcoY3VycmVudFJvdXRlLnNsaWNlKHF1ZXJ5SW5kZXggKyAxKSkgOiB7fVxyXG5cdFx0XHRmb3IgKHZhciBpIGluIGFyZ3MpIHBhcmFtc1tpXSA9IGFyZ3NbaV1cclxuXHRcdFx0dmFyIHF1ZXJ5c3RyaW5nID0gYnVpbGRRdWVyeVN0cmluZyhwYXJhbXMpXHJcblx0XHRcdHZhciBjdXJyZW50UGF0aCA9IHF1ZXJ5SW5kZXggPiAtMSA/IGN1cnJlbnRSb3V0ZS5zbGljZSgwLCBxdWVyeUluZGV4KSA6IGN1cnJlbnRSb3V0ZVxyXG5cdFx0XHRpZiAocXVlcnlzdHJpbmcpIGN1cnJlbnRSb3V0ZSA9IGN1cnJlbnRQYXRoICsgKGN1cnJlbnRQYXRoLmluZGV4T2YoXCI/XCIpID09PSAtMSA/IFwiP1wiIDogXCImXCIpICsgcXVlcnlzdHJpbmc7XHJcblxyXG5cdFx0XHR2YXIgc2hvdWxkUmVwbGFjZUhpc3RvcnlFbnRyeSA9IChhcmd1bWVudHMubGVuZ3RoID09PSAzID8gYXJndW1lbnRzWzJdIDogYXJndW1lbnRzWzFdKSA9PT0gdHJ1ZSB8fCBvbGRSb3V0ZSA9PT0gYXJndW1lbnRzWzBdO1xyXG5cclxuXHRcdFx0aWYgKHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSkge1xyXG5cdFx0XHRcdGNvbXB1dGVQcmVSZWRyYXdIb29rID0gc2V0U2Nyb2xsXHJcblx0XHRcdFx0Y29tcHV0ZVBvc3RSZWRyYXdIb29rID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHR3aW5kb3cuaGlzdG9yeVtzaG91bGRSZXBsYWNlSGlzdG9yeUVudHJ5ID8gXCJyZXBsYWNlU3RhdGVcIiA6IFwicHVzaFN0YXRlXCJdKG51bGwsICRkb2N1bWVudC50aXRsZSwgbW9kZXNbbS5yb3V0ZS5tb2RlXSArIGN1cnJlbnRSb3V0ZSk7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRyZWRpcmVjdChtb2Rlc1ttLnJvdXRlLm1vZGVdICsgY3VycmVudFJvdXRlKVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdCRsb2NhdGlvblttLnJvdXRlLm1vZGVdID0gY3VycmVudFJvdXRlXHJcblx0XHRcdFx0cmVkaXJlY3QobW9kZXNbbS5yb3V0ZS5tb2RlXSArIGN1cnJlbnRSb3V0ZSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdG0ucm91dGUucGFyYW0gPSBmdW5jdGlvbihrZXkpIHtcclxuXHRcdGlmICghcm91dGVQYXJhbXMpIHRocm93IG5ldyBFcnJvcihcIllvdSBtdXN0IGNhbGwgbS5yb3V0ZShlbGVtZW50LCBkZWZhdWx0Um91dGUsIHJvdXRlcykgYmVmb3JlIGNhbGxpbmcgbS5yb3V0ZS5wYXJhbSgpXCIpXHJcblx0XHRyZXR1cm4gcm91dGVQYXJhbXNba2V5XVxyXG5cdH07XHJcblxyXG5cdG0ucm91dGUubW9kZSA9IFwic2VhcmNoXCI7XHJcblxyXG5cdGZ1bmN0aW9uIG5vcm1hbGl6ZVJvdXRlKHJvdXRlKSB7XHJcblx0XHRyZXR1cm4gcm91dGUuc2xpY2UobW9kZXNbbS5yb3V0ZS5tb2RlXS5sZW5ndGgpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiByb3V0ZUJ5VmFsdWUocm9vdCwgcm91dGVyLCBwYXRoKSB7XHJcblx0XHRyb3V0ZVBhcmFtcyA9IHt9O1xyXG5cclxuXHRcdHZhciBxdWVyeVN0YXJ0ID0gcGF0aC5pbmRleE9mKFwiP1wiKTtcclxuXHRcdGlmIChxdWVyeVN0YXJ0ICE9PSAtMSkge1xyXG5cdFx0XHRyb3V0ZVBhcmFtcyA9IHBhcnNlUXVlcnlTdHJpbmcocGF0aC5zdWJzdHIocXVlcnlTdGFydCArIDEsIHBhdGgubGVuZ3RoKSk7XHJcblx0XHRcdHBhdGggPSBwYXRoLnN1YnN0cigwLCBxdWVyeVN0YXJ0KVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEdldCBhbGwgcm91dGVzIGFuZCBjaGVjayBpZiB0aGVyZSdzXHJcblx0XHQvLyBhbiBleGFjdCBtYXRjaCBmb3IgdGhlIGN1cnJlbnQgcGF0aFxyXG5cdFx0dmFyIGtleXMgPSBPYmplY3Qua2V5cyhyb3V0ZXIpO1xyXG5cdFx0dmFyIGluZGV4ID0ga2V5cy5pbmRleE9mKHBhdGgpO1xyXG5cdFx0aWYoaW5kZXggIT09IC0xKXtcclxuXHRcdFx0bS5tb3VudChyb290LCByb3V0ZXJba2V5cyBbaW5kZXhdXSk7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAodmFyIHJvdXRlIGluIHJvdXRlcikge1xyXG5cdFx0XHRpZiAocm91dGUgPT09IHBhdGgpIHtcclxuXHRcdFx0XHRtLm1vdW50KHJvb3QsIHJvdXRlcltyb3V0ZV0pO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBtYXRjaGVyID0gbmV3IFJlZ0V4cChcIl5cIiArIHJvdXRlLnJlcGxhY2UoLzpbXlxcL10rP1xcLnszfS9nLCBcIiguKj8pXCIpLnJlcGxhY2UoLzpbXlxcL10rL2csIFwiKFteXFxcXC9dKylcIikgKyBcIlxcLz8kXCIpO1xyXG5cclxuXHRcdFx0aWYgKG1hdGNoZXIudGVzdChwYXRoKSkge1xyXG5cdFx0XHRcdHBhdGgucmVwbGFjZShtYXRjaGVyLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHZhciBrZXlzID0gcm91dGUubWF0Y2goLzpbXlxcL10rL2cpIHx8IFtdO1xyXG5cdFx0XHRcdFx0dmFyIHZhbHVlcyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxLCAtMik7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0ga2V5cy5sZW5ndGg7IGkgPCBsZW47IGkrKykgcm91dGVQYXJhbXNba2V5c1tpXS5yZXBsYWNlKC86fFxcLi9nLCBcIlwiKV0gPSBkZWNvZGVVUklDb21wb25lbnQodmFsdWVzW2ldKVxyXG5cdFx0XHRcdFx0bS5tb3VudChyb290LCByb3V0ZXJbcm91dGVdKVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHJvdXRlVW5vYnRydXNpdmUoZSkge1xyXG5cdFx0ZSA9IGUgfHwgZXZlbnQ7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUubWV0YUtleSB8fCBlLndoaWNoID09PSAyKSByZXR1cm47XHJcblx0XHRpZiAoZS5wcmV2ZW50RGVmYXVsdCkgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0ZWxzZSBlLnJldHVyblZhbHVlID0gZmFsc2U7XHJcblx0XHR2YXIgY3VycmVudFRhcmdldCA9IGUuY3VycmVudFRhcmdldCB8fCBlLnNyY0VsZW1lbnQ7XHJcblx0XHR2YXIgYXJncyA9IG0ucm91dGUubW9kZSA9PT0gXCJwYXRobmFtZVwiICYmIGN1cnJlbnRUYXJnZXQuc2VhcmNoID8gcGFyc2VRdWVyeVN0cmluZyhjdXJyZW50VGFyZ2V0LnNlYXJjaC5zbGljZSgxKSkgOiB7fTtcclxuXHRcdHdoaWxlIChjdXJyZW50VGFyZ2V0ICYmIGN1cnJlbnRUYXJnZXQubm9kZU5hbWUudG9VcHBlckNhc2UoKSAhPSBcIkFcIikgY3VycmVudFRhcmdldCA9IGN1cnJlbnRUYXJnZXQucGFyZW50Tm9kZVxyXG5cdFx0bS5yb3V0ZShjdXJyZW50VGFyZ2V0W20ucm91dGUubW9kZV0uc2xpY2UobW9kZXNbbS5yb3V0ZS5tb2RlXS5sZW5ndGgpLCBhcmdzKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U2Nyb2xsKCkge1xyXG5cdFx0aWYgKG0ucm91dGUubW9kZSAhPSBcImhhc2hcIiAmJiAkbG9jYXRpb24uaGFzaCkgJGxvY2F0aW9uLmhhc2ggPSAkbG9jYXRpb24uaGFzaDtcclxuXHRcdGVsc2Ugd2luZG93LnNjcm9sbFRvKDAsIDApXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBidWlsZFF1ZXJ5U3RyaW5nKG9iamVjdCwgcHJlZml4KSB7XHJcblx0XHR2YXIgZHVwbGljYXRlcyA9IHt9XHJcblx0XHR2YXIgc3RyID0gW11cclxuXHRcdGZvciAodmFyIHByb3AgaW4gb2JqZWN0KSB7XHJcblx0XHRcdHZhciBrZXkgPSBwcmVmaXggPyBwcmVmaXggKyBcIltcIiArIHByb3AgKyBcIl1cIiA6IHByb3BcclxuXHRcdFx0dmFyIHZhbHVlID0gb2JqZWN0W3Byb3BdXHJcblx0XHRcdHZhciB2YWx1ZVR5cGUgPSB0eXBlLmNhbGwodmFsdWUpXHJcblx0XHRcdHZhciBwYWlyID0gKHZhbHVlID09PSBudWxsKSA/IGVuY29kZVVSSUNvbXBvbmVudChrZXkpIDpcclxuXHRcdFx0XHR2YWx1ZVR5cGUgPT09IE9CSkVDVCA/IGJ1aWxkUXVlcnlTdHJpbmcodmFsdWUsIGtleSkgOlxyXG5cdFx0XHRcdHZhbHVlVHlwZSA9PT0gQVJSQVkgPyB2YWx1ZS5yZWR1Y2UoZnVuY3Rpb24obWVtbywgaXRlbSkge1xyXG5cdFx0XHRcdFx0aWYgKCFkdXBsaWNhdGVzW2tleV0pIGR1cGxpY2F0ZXNba2V5XSA9IHt9XHJcblx0XHRcdFx0XHRpZiAoIWR1cGxpY2F0ZXNba2V5XVtpdGVtXSkge1xyXG5cdFx0XHRcdFx0XHRkdXBsaWNhdGVzW2tleV1baXRlbV0gPSB0cnVlXHJcblx0XHRcdFx0XHRcdHJldHVybiBtZW1vLmNvbmNhdChlbmNvZGVVUklDb21wb25lbnQoa2V5KSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KGl0ZW0pKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIG1lbW9cclxuXHRcdFx0XHR9LCBbXSkuam9pbihcIiZcIikgOlxyXG5cdFx0XHRcdGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpXHJcblx0XHRcdGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSBzdHIucHVzaChwYWlyKVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHN0ci5qb2luKFwiJlwiKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcGFyc2VRdWVyeVN0cmluZyhzdHIpIHtcclxuXHRcdGlmIChzdHIuY2hhckF0KDApID09PSBcIj9cIikgc3RyID0gc3RyLnN1YnN0cmluZygxKTtcclxuXHJcblx0XHR2YXIgcGFpcnMgPSBzdHIuc3BsaXQoXCImXCIpLCBwYXJhbXMgPSB7fTtcclxuXHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBwYWlycy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHR2YXIgcGFpciA9IHBhaXJzW2ldLnNwbGl0KFwiPVwiKTtcclxuXHRcdFx0dmFyIGtleSA9IGRlY29kZVVSSUNvbXBvbmVudChwYWlyWzBdKVxyXG5cdFx0XHR2YXIgdmFsdWUgPSBwYWlyLmxlbmd0aCA9PSAyID8gZGVjb2RlVVJJQ29tcG9uZW50KHBhaXJbMV0pIDogbnVsbFxyXG5cdFx0XHRpZiAocGFyYW1zW2tleV0gIT0gbnVsbCkge1xyXG5cdFx0XHRcdGlmICh0eXBlLmNhbGwocGFyYW1zW2tleV0pICE9PSBBUlJBWSkgcGFyYW1zW2tleV0gPSBbcGFyYW1zW2tleV1dXHJcblx0XHRcdFx0cGFyYW1zW2tleV0ucHVzaCh2YWx1ZSlcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRwYXJhbXNba2V5XSA9IHZhbHVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcGFyYW1zO1xyXG5cdH1cclxuXHJcblx0bS5yb3V0ZS5idWlsZFF1ZXJ5U3RyaW5nID0gYnVpbGRRdWVyeVN0cmluZztcclxuXHRtLnJvdXRlLnBhcnNlUXVlcnlTdHJpbmcgPSBwYXJzZVF1ZXJ5U3RyaW5nO1xyXG5cclxuXHRmdW5jdGlvbiByZXNldChyb290KSB7XHJcblx0XHR2YXIgY2FjaGVLZXkgPSBnZXRDZWxsQ2FjaGVLZXkocm9vdCk7XHJcblx0XHRjbGVhcihyb290LmNoaWxkTm9kZXMsIGNlbGxDYWNoZVtjYWNoZUtleV0pO1xyXG5cdFx0Y2VsbENhY2hlW2NhY2hlS2V5XSA9IHVuZGVmaW5lZFxyXG5cdH1cclxuXHJcblx0bS5kZWZlcnJlZCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBkZWZlcnJlZCA9IG5ldyBEZWZlcnJlZCgpO1xyXG5cdFx0ZGVmZXJyZWQucHJvbWlzZSA9IHByb3BpZnkoZGVmZXJyZWQucHJvbWlzZSk7XHJcblx0XHRyZXR1cm4gZGVmZXJyZWRcclxuXHR9O1xyXG5cclxuXHRmdW5jdGlvbiBwcm9waWZ5KHByb21pc2UsIGluaXRpYWxWYWx1ZSkge1xyXG5cdFx0dmFyIHByb3AgPSBtLnByb3AoaW5pdGlhbFZhbHVlKTtcclxuXHRcdHByb21pc2UudGhlbihwcm9wKTtcclxuXHRcdHByb3AudGhlbiA9IGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG5cdFx0XHRyZXR1cm4gcHJvcGlmeShwcm9taXNlLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KSwgaW5pdGlhbFZhbHVlKVxyXG5cdFx0fTtcclxuXHRcdHJldHVybiBwcm9wO1xyXG5cdH1cclxuXHJcblx0Ly9Qcm9taXoubWl0aHJpbC5qcyB8IFpvbG1laXN0ZXIgfCBNSVRcclxuXHQvL2EgbW9kaWZpZWQgdmVyc2lvbiBvZiBQcm9taXouanMsIHdoaWNoIGRvZXMgbm90IGNvbmZvcm0gdG8gUHJvbWlzZXMvQSsgZm9yIHR3byByZWFzb25zOlxyXG5cdC8vMSkgYHRoZW5gIGNhbGxiYWNrcyBhcmUgY2FsbGVkIHN5bmNocm9ub3VzbHkgKGJlY2F1c2Ugc2V0VGltZW91dCBpcyB0b28gc2xvdywgYW5kIHRoZSBzZXRJbW1lZGlhdGUgcG9seWZpbGwgaXMgdG9vIGJpZ1xyXG5cdC8vMikgdGhyb3dpbmcgc3ViY2xhc3NlcyBvZiBFcnJvciBjYXVzZSB0aGUgZXJyb3IgdG8gYmUgYnViYmxlZCB1cCBpbnN0ZWFkIG9mIHRyaWdnZXJpbmcgcmVqZWN0aW9uIChiZWNhdXNlIHRoZSBzcGVjIGRvZXMgbm90IGFjY291bnQgZm9yIHRoZSBpbXBvcnRhbnQgdXNlIGNhc2Ugb2YgZGVmYXVsdCBicm93c2VyIGVycm9yIGhhbmRsaW5nLCBpLmUuIG1lc3NhZ2Ugdy8gbGluZSBudW1iZXIpXHJcblx0ZnVuY3Rpb24gRGVmZXJyZWQoc3VjY2Vzc0NhbGxiYWNrLCBmYWlsdXJlQ2FsbGJhY2spIHtcclxuXHRcdHZhciBSRVNPTFZJTkcgPSAxLCBSRUpFQ1RJTkcgPSAyLCBSRVNPTFZFRCA9IDMsIFJFSkVDVEVEID0gNDtcclxuXHRcdHZhciBzZWxmID0gdGhpcywgc3RhdGUgPSAwLCBwcm9taXNlVmFsdWUgPSAwLCBuZXh0ID0gW107XHJcblxyXG5cdFx0c2VsZltcInByb21pc2VcIl0gPSB7fTtcclxuXHJcblx0XHRzZWxmW1wicmVzb2x2ZVwiXSA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRcdGlmICghc3RhdGUpIHtcclxuXHRcdFx0XHRwcm9taXNlVmFsdWUgPSB2YWx1ZTtcclxuXHRcdFx0XHRzdGF0ZSA9IFJFU09MVklORztcclxuXHJcblx0XHRcdFx0ZmlyZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fTtcclxuXHJcblx0XHRzZWxmW1wicmVqZWN0XCJdID0gZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdFx0aWYgKCFzdGF0ZSkge1xyXG5cdFx0XHRcdHByb21pc2VWYWx1ZSA9IHZhbHVlO1xyXG5cdFx0XHRcdHN0YXRlID0gUkVKRUNUSU5HO1xyXG5cclxuXHRcdFx0XHRmaXJlKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9O1xyXG5cclxuXHRcdHNlbGYucHJvbWlzZVtcInRoZW5cIl0gPSBmdW5jdGlvbihzdWNjZXNzQ2FsbGJhY2ssIGZhaWx1cmVDYWxsYmFjaykge1xyXG5cdFx0XHR2YXIgZGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQoc3VjY2Vzc0NhbGxiYWNrLCBmYWlsdXJlQ2FsbGJhY2spO1xyXG5cdFx0XHRpZiAoc3RhdGUgPT09IFJFU09MVkVEKSB7XHJcblx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShwcm9taXNlVmFsdWUpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoc3RhdGUgPT09IFJFSkVDVEVEKSB7XHJcblx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KHByb21pc2VWYWx1ZSlcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRuZXh0LnB1c2goZGVmZXJyZWQpXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2VcclxuXHRcdH07XHJcblxyXG5cdFx0ZnVuY3Rpb24gZmluaXNoKHR5cGUpIHtcclxuXHRcdFx0c3RhdGUgPSB0eXBlIHx8IFJFSkVDVEVEO1xyXG5cdFx0XHRuZXh0Lm1hcChmdW5jdGlvbihkZWZlcnJlZCkge1xyXG5cdFx0XHRcdHN0YXRlID09PSBSRVNPTFZFRCAmJiBkZWZlcnJlZC5yZXNvbHZlKHByb21pc2VWYWx1ZSkgfHwgZGVmZXJyZWQucmVqZWN0KHByb21pc2VWYWx1ZSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHRoZW5uYWJsZSh0aGVuLCBzdWNjZXNzQ2FsbGJhY2ssIGZhaWx1cmVDYWxsYmFjaywgbm90VGhlbm5hYmxlQ2FsbGJhY2spIHtcclxuXHRcdFx0aWYgKCgocHJvbWlzZVZhbHVlICE9IG51bGwgJiYgdHlwZS5jYWxsKHByb21pc2VWYWx1ZSkgPT09IE9CSkVDVCkgfHwgdHlwZW9mIHByb21pc2VWYWx1ZSA9PT0gRlVOQ1RJT04pICYmIHR5cGVvZiB0aGVuID09PSBGVU5DVElPTikge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHQvLyBjb3VudCBwcm90ZWN0cyBhZ2FpbnN0IGFidXNlIGNhbGxzIGZyb20gc3BlYyBjaGVja2VyXHJcblx0XHRcdFx0XHR2YXIgY291bnQgPSAwO1xyXG5cdFx0XHRcdFx0dGhlbi5jYWxsKHByb21pc2VWYWx1ZSwgZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGNvdW50KyspIHJldHVybjtcclxuXHRcdFx0XHRcdFx0cHJvbWlzZVZhbHVlID0gdmFsdWU7XHJcblx0XHRcdFx0XHRcdHN1Y2Nlc3NDYWxsYmFjaygpO1xyXG5cdFx0XHRcdFx0fSwgZnVuY3Rpb24gKHZhbHVlKSB7XHJcblx0XHRcdFx0XHRcdGlmIChjb3VudCsrKSByZXR1cm47XHJcblx0XHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHRmYWlsdXJlQ2FsbGJhY2soKTtcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdFx0bS5kZWZlcnJlZC5vbmVycm9yKGUpO1xyXG5cdFx0XHRcdFx0cHJvbWlzZVZhbHVlID0gZTtcclxuXHRcdFx0XHRcdGZhaWx1cmVDYWxsYmFjaygpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRub3RUaGVubmFibGVDYWxsYmFjaygpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gZmlyZSgpIHtcclxuXHRcdFx0Ly8gY2hlY2sgaWYgaXQncyBhIHRoZW5hYmxlXHJcblx0XHRcdHZhciB0aGVuO1xyXG5cclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHR0aGVuID0gcHJvbWlzZVZhbHVlICYmIHByb21pc2VWYWx1ZS50aGVuXHJcblx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRtLmRlZmVycmVkLm9uZXJyb3IoZSk7XHJcblx0XHRcdFx0cHJvbWlzZVZhbHVlID0gZTtcclxuXHRcdFx0XHRzdGF0ZSA9IFJFSkVDVElORztcclxuXHRcdFx0XHRyZXR1cm4gZmlyZSgpXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoZW5uYWJsZSh0aGVuLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRzdGF0ZSA9IFJFU09MVklORztcclxuXHRcdFx0XHRmaXJlKClcclxuXHRcdFx0fSwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c3RhdGUgPSBSRUpFQ1RJTkc7XHJcblx0XHRcdFx0ZmlyZSgpXHJcblx0XHRcdH0sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRpZiAoc3RhdGUgPT09IFJFU09MVklORyAmJiB0eXBlb2Ygc3VjY2Vzc0NhbGxiYWNrID09PSBGVU5DVElPTikge1xyXG5cdFx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSBzdWNjZXNzQ2FsbGJhY2socHJvbWlzZVZhbHVlKTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoc3RhdGUgPT09IFJFSkVDVElORyAmJiB0eXBlb2YgZmFpbHVyZUNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdFx0XHRcdFx0cHJvbWlzZVZhbHVlID0gZmFpbHVyZUNhbGxiYWNrKHByb21pc2VWYWx1ZSk7XHJcblx0XHRcdFx0XHRcdHN0YXRlID0gUkVTT0xWSU5HO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdG0uZGVmZXJyZWQub25lcnJvcihlKTtcclxuXHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IGU7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmluaXNoKCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAocHJvbWlzZVZhbHVlID09PSBzZWxmKSB7XHJcblx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSBUeXBlRXJyb3IoKTtcclxuXHRcdFx0XHRcdGZpbmlzaCgpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aGVubmFibGUodGhlbiwgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHRmaW5pc2goUkVTT0xWRUQpO1xyXG5cdFx0XHRcdFx0fSwgZmluaXNoLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRcdGZpbmlzaChzdGF0ZSA9PT0gUkVTT0xWSU5HICYmIFJFU09MVkVEKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHR9XHJcblx0bS5kZWZlcnJlZC5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xyXG5cdFx0aWYgKHR5cGUuY2FsbChlKSA9PT0gXCJbb2JqZWN0IEVycm9yXVwiICYmICFlLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkubWF0Y2goLyBFcnJvci8pKSB0aHJvdyBlO1xyXG5cdH07XHJcblxyXG5cdG0uc3luYyA9IGZ1bmN0aW9uKGFyZ3MpIHtcclxuXHRcdHZhciBtZXRob2QgPSBcInJlc29sdmVcIjtcclxuXHRcdGZ1bmN0aW9uIHN5bmNocm9uaXplcihwb3MsIHJlc29sdmVkKSB7XHJcblx0XHRcdHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRcdHJlc3VsdHNbcG9zXSA9IHZhbHVlO1xyXG5cdFx0XHRcdGlmICghcmVzb2x2ZWQpIG1ldGhvZCA9IFwicmVqZWN0XCI7XHJcblx0XHRcdFx0aWYgKC0tb3V0c3RhbmRpbmcgPT09IDApIHtcclxuXHRcdFx0XHRcdGRlZmVycmVkLnByb21pc2UocmVzdWx0cyk7XHJcblx0XHRcdFx0XHRkZWZlcnJlZFttZXRob2RdKHJlc3VsdHMpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiB2YWx1ZVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGRlZmVycmVkID0gbS5kZWZlcnJlZCgpO1xyXG5cdFx0dmFyIG91dHN0YW5kaW5nID0gYXJncy5sZW5ndGg7XHJcblx0XHR2YXIgcmVzdWx0cyA9IG5ldyBBcnJheShvdXRzdGFuZGluZyk7XHJcblx0XHRpZiAoYXJncy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGFyZ3NbaV0udGhlbihzeW5jaHJvbml6ZXIoaSwgdHJ1ZSksIHN5bmNocm9uaXplcihpLCBmYWxzZSkpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2UgZGVmZXJyZWQucmVzb2x2ZShbXSk7XHJcblxyXG5cdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2VcclxuXHR9O1xyXG5cclxuXHRmdW5jdGlvbiBpZGVudGl0eSh2YWx1ZSkge1xyXG5cdFx0cmV0dXJuIHZhbHVlO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYWpheChvcHRpb25zKSB7XHJcblx0XHRpZiAob3B0aW9ucy5kYXRhVHlwZSAmJiBvcHRpb25zLmRhdGFUeXBlLnRvTG93ZXJDYXNlKCkgPT09IFwianNvbnBcIikge1xyXG5cdFx0XHR2YXIgY2FsbGJhY2tLZXkgPSBcIm1pdGhyaWxfY2FsbGJhY2tfXCIgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKSArIFwiX1wiICsgKE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDFlMTYpKS50b1N0cmluZygzNik7XHJcblx0XHRcdHZhciBzY3JpcHQgPSAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcclxuXHJcblx0XHRcdHdpbmRvd1tjYWxsYmFja0tleV0gPSBmdW5jdGlvbihyZXNwKSB7XHJcblx0XHRcdFx0c2NyaXB0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcclxuXHRcdFx0XHRvcHRpb25zLm9ubG9hZCh7XHJcblx0XHRcdFx0XHR0eXBlOiBcImxvYWRcIixcclxuXHRcdFx0XHRcdHRhcmdldDoge1xyXG5cdFx0XHRcdFx0XHRyZXNwb25zZVRleHQ6IHJlc3BcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHR3aW5kb3dbY2FsbGJhY2tLZXldID0gdW5kZWZpbmVkXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRzY3JpcHQub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xyXG5cclxuXHRcdFx0XHRvcHRpb25zLm9uZXJyb3Ioe1xyXG5cdFx0XHRcdFx0dHlwZTogXCJlcnJvclwiLFxyXG5cdFx0XHRcdFx0dGFyZ2V0OiB7XHJcblx0XHRcdFx0XHRcdHN0YXR1czogNTAwLFxyXG5cdFx0XHRcdFx0XHRyZXNwb25zZVRleHQ6IEpTT04uc3RyaW5naWZ5KHtlcnJvcjogXCJFcnJvciBtYWtpbmcganNvbnAgcmVxdWVzdFwifSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHR3aW5kb3dbY2FsbGJhY2tLZXldID0gdW5kZWZpbmVkO1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHNjcmlwdC5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRzY3JpcHQuc3JjID0gb3B0aW9ucy51cmxcclxuXHRcdFx0XHQrIChvcHRpb25zLnVybC5pbmRleE9mKFwiP1wiKSA+IDAgPyBcIiZcIiA6IFwiP1wiKVxyXG5cdFx0XHRcdCsgKG9wdGlvbnMuY2FsbGJhY2tLZXkgPyBvcHRpb25zLmNhbGxiYWNrS2V5IDogXCJjYWxsYmFja1wiKVxyXG5cdFx0XHRcdCsgXCI9XCIgKyBjYWxsYmFja0tleVxyXG5cdFx0XHRcdCsgXCImXCIgKyBidWlsZFF1ZXJ5U3RyaW5nKG9wdGlvbnMuZGF0YSB8fCB7fSk7XHJcblx0XHRcdCRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdClcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciB4aHIgPSBuZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0O1xyXG5cdFx0XHR4aHIub3BlbihvcHRpb25zLm1ldGhvZCwgb3B0aW9ucy51cmwsIHRydWUsIG9wdGlvbnMudXNlciwgb3B0aW9ucy5wYXNzd29yZCk7XHJcblx0XHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcclxuXHRcdFx0XHRcdGlmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSBvcHRpb25zLm9ubG9hZCh7dHlwZTogXCJsb2FkXCIsIHRhcmdldDogeGhyfSk7XHJcblx0XHRcdFx0XHRlbHNlIG9wdGlvbnMub25lcnJvcih7dHlwZTogXCJlcnJvclwiLCB0YXJnZXQ6IHhocn0pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHRpZiAob3B0aW9ucy5zZXJpYWxpemUgPT09IEpTT04uc3RyaW5naWZ5ICYmIG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLm1ldGhvZCAhPT0gXCJHRVRcIikge1xyXG5cdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiKVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChvcHRpb25zLmRlc2VyaWFsaXplID09PSBKU09OLnBhcnNlKSB7XHJcblx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIiwgXCJhcHBsaWNhdGlvbi9qc29uLCB0ZXh0LypcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHR5cGVvZiBvcHRpb25zLmNvbmZpZyA9PT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0XHR2YXIgbWF5YmVYaHIgPSBvcHRpb25zLmNvbmZpZyh4aHIsIG9wdGlvbnMpO1xyXG5cdFx0XHRcdGlmIChtYXliZVhociAhPSBudWxsKSB4aHIgPSBtYXliZVhoclxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgZGF0YSA9IG9wdGlvbnMubWV0aG9kID09PSBcIkdFVFwiIHx8ICFvcHRpb25zLmRhdGEgPyBcIlwiIDogb3B0aW9ucy5kYXRhXHJcblx0XHRcdGlmIChkYXRhICYmICh0eXBlLmNhbGwoZGF0YSkgIT0gU1RSSU5HICYmIGRhdGEuY29uc3RydWN0b3IgIT0gd2luZG93LkZvcm1EYXRhKSkge1xyXG5cdFx0XHRcdHRocm93IFwiUmVxdWVzdCBkYXRhIHNob3VsZCBiZSBlaXRoZXIgYmUgYSBzdHJpbmcgb3IgRm9ybURhdGEuIENoZWNrIHRoZSBgc2VyaWFsaXplYCBvcHRpb24gaW4gYG0ucmVxdWVzdGBcIjtcclxuXHRcdFx0fVxyXG5cdFx0XHR4aHIuc2VuZChkYXRhKTtcclxuXHRcdFx0cmV0dXJuIHhocjtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGJpbmREYXRhKHhock9wdGlvbnMsIGRhdGEsIHNlcmlhbGl6ZSkge1xyXG5cdFx0aWYgKHhock9wdGlvbnMubWV0aG9kID09PSBcIkdFVFwiICYmIHhock9wdGlvbnMuZGF0YVR5cGUgIT0gXCJqc29ucFwiKSB7XHJcblx0XHRcdHZhciBwcmVmaXggPSB4aHJPcHRpb25zLnVybC5pbmRleE9mKFwiP1wiKSA8IDAgPyBcIj9cIiA6IFwiJlwiO1xyXG5cdFx0XHR2YXIgcXVlcnlzdHJpbmcgPSBidWlsZFF1ZXJ5U3RyaW5nKGRhdGEpO1xyXG5cdFx0XHR4aHJPcHRpb25zLnVybCA9IHhock9wdGlvbnMudXJsICsgKHF1ZXJ5c3RyaW5nID8gcHJlZml4ICsgcXVlcnlzdHJpbmcgOiBcIlwiKTtcclxuXHRcdH1cclxuXHRcdGVsc2UgeGhyT3B0aW9ucy5kYXRhID0gc2VyaWFsaXplKGRhdGEpO1xyXG5cdFx0cmV0dXJuIHhock9wdGlvbnM7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBwYXJhbWV0ZXJpemVVcmwodXJsLCBkYXRhKSB7XHJcblx0XHR2YXIgdG9rZW5zID0gdXJsLm1hdGNoKC86W2Etel1cXHcrL2dpKTtcclxuXHRcdGlmICh0b2tlbnMgJiYgZGF0YSkge1xyXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdHZhciBrZXkgPSB0b2tlbnNbaV0uc2xpY2UoMSk7XHJcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UodG9rZW5zW2ldLCBkYXRhW2tleV0pO1xyXG5cdFx0XHRcdGRlbGV0ZSBkYXRhW2tleV07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiB1cmw7XHJcblx0fVxyXG5cclxuXHRtLnJlcXVlc3QgPSBmdW5jdGlvbih4aHJPcHRpb25zKSB7XHJcblx0XHRpZiAoeGhyT3B0aW9ucy5iYWNrZ3JvdW5kICE9PSB0cnVlKSBtLnN0YXJ0Q29tcHV0YXRpb24oKTtcclxuXHRcdHZhciBkZWZlcnJlZCA9IG5ldyBEZWZlcnJlZCgpO1xyXG5cdFx0dmFyIGlzSlNPTlAgPSB4aHJPcHRpb25zLmRhdGFUeXBlICYmIHhock9wdGlvbnMuZGF0YVR5cGUudG9Mb3dlckNhc2UoKSA9PT0gXCJqc29ucFwiO1xyXG5cdFx0dmFyIHNlcmlhbGl6ZSA9IHhock9wdGlvbnMuc2VyaWFsaXplID0gaXNKU09OUCA/IGlkZW50aXR5IDogeGhyT3B0aW9ucy5zZXJpYWxpemUgfHwgSlNPTi5zdHJpbmdpZnk7XHJcblx0XHR2YXIgZGVzZXJpYWxpemUgPSB4aHJPcHRpb25zLmRlc2VyaWFsaXplID0gaXNKU09OUCA/IGlkZW50aXR5IDogeGhyT3B0aW9ucy5kZXNlcmlhbGl6ZSB8fCBKU09OLnBhcnNlO1xyXG5cdFx0dmFyIGV4dHJhY3QgPSBpc0pTT05QID8gZnVuY3Rpb24oanNvbnApIHtyZXR1cm4ganNvbnAucmVzcG9uc2VUZXh0fSA6IHhock9wdGlvbnMuZXh0cmFjdCB8fCBmdW5jdGlvbih4aHIpIHtcclxuXHRcdFx0cmV0dXJuIHhoci5yZXNwb25zZVRleHQubGVuZ3RoID09PSAwICYmIGRlc2VyaWFsaXplID09PSBKU09OLnBhcnNlID8gbnVsbCA6IHhoci5yZXNwb25zZVRleHRcclxuXHRcdH07XHJcblx0XHR4aHJPcHRpb25zLm1ldGhvZCA9ICh4aHJPcHRpb25zLm1ldGhvZCB8fCAnR0VUJykudG9VcHBlckNhc2UoKTtcclxuXHRcdHhock9wdGlvbnMudXJsID0gcGFyYW1ldGVyaXplVXJsKHhock9wdGlvbnMudXJsLCB4aHJPcHRpb25zLmRhdGEpO1xyXG5cdFx0eGhyT3B0aW9ucyA9IGJpbmREYXRhKHhock9wdGlvbnMsIHhock9wdGlvbnMuZGF0YSwgc2VyaWFsaXplKTtcclxuXHRcdHhock9wdGlvbnMub25sb2FkID0geGhyT3B0aW9ucy5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdGUgPSBlIHx8IGV2ZW50O1xyXG5cdFx0XHRcdHZhciB1bndyYXAgPSAoZS50eXBlID09PSBcImxvYWRcIiA/IHhock9wdGlvbnMudW53cmFwU3VjY2VzcyA6IHhock9wdGlvbnMudW53cmFwRXJyb3IpIHx8IGlkZW50aXR5O1xyXG5cdFx0XHRcdHZhciByZXNwb25zZSA9IHVud3JhcChkZXNlcmlhbGl6ZShleHRyYWN0KGUudGFyZ2V0LCB4aHJPcHRpb25zKSksIGUudGFyZ2V0KTtcclxuXHRcdFx0XHRpZiAoZS50eXBlID09PSBcImxvYWRcIikge1xyXG5cdFx0XHRcdFx0aWYgKHR5cGUuY2FsbChyZXNwb25zZSkgPT09IEFSUkFZICYmIHhock9wdGlvbnMudHlwZSkge1xyXG5cdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHJlc3BvbnNlLmxlbmd0aDsgaSsrKSByZXNwb25zZVtpXSA9IG5ldyB4aHJPcHRpb25zLnR5cGUocmVzcG9uc2VbaV0pXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIGlmICh4aHJPcHRpb25zLnR5cGUpIHJlc3BvbnNlID0gbmV3IHhock9wdGlvbnMudHlwZShyZXNwb25zZSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZGVmZXJyZWRbZS50eXBlID09PSBcImxvYWRcIiA/IFwicmVzb2x2ZVwiIDogXCJyZWplY3RcIl0ocmVzcG9uc2UpXHJcblx0XHRcdH1cclxuXHRcdFx0Y2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRtLmRlZmVycmVkLm9uZXJyb3IoZSk7XHJcblx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KGUpXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHhock9wdGlvbnMuYmFja2dyb3VuZCAhPT0gdHJ1ZSkgbS5lbmRDb21wdXRhdGlvbigpXHJcblx0XHR9O1xyXG5cdFx0YWpheCh4aHJPcHRpb25zKTtcclxuXHRcdGRlZmVycmVkLnByb21pc2UgPSBwcm9waWZ5KGRlZmVycmVkLnByb21pc2UsIHhock9wdGlvbnMuaW5pdGlhbFZhbHVlKTtcclxuXHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlXHJcblx0fTtcclxuXHJcblx0Ly90ZXN0aW5nIEFQSVxyXG5cdG0uZGVwcyA9IGZ1bmN0aW9uKG1vY2spIHtcclxuXHRcdGluaXRpYWxpemUod2luZG93ID0gbW9jayB8fCB3aW5kb3cpO1xyXG5cdFx0cmV0dXJuIHdpbmRvdztcclxuXHR9O1xyXG5cclxuXHQvL2ZvciBpbnRlcm5hbCB0ZXN0aW5nIG9ubHksIGRvIG5vdCB1c2UgYG0uZGVwcy5mYWN0b3J5YFxyXG5cdG0uZGVwcy5mYWN0b3J5ID0gYXBwO1xyXG5cclxuXHRyZXR1cm4gbTtcclxufSkodHlwZW9mIHdpbmRvdyAhPSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pO1xyXG5cclxuaWYgKHR5cGVvZiBtb2R1bGUgIT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUgIT09IG51bGwgJiYgbW9kdWxlLmV4cG9ydHMpIG1vZHVsZS5leHBvcnRzID0gbTtcclxuZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIGRlZmluZShmdW5jdGlvbigpIHtyZXR1cm4gbX0pO1xyXG4iLCIvKipcclxuICogUHViU3ViLmpzIC0gSmF2YXNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgUHVibGlzaC9TdWJzY3JpYmUgcGF0dGVybi5cclxuICogQHZlcnNpb24gMC4wLjZcclxuICogQGhvbWVwYWdlIGh0dHBzOi8vZ2l0aHViLmNvbS9nZW9yYXBib3gvUHViU3ViXHJcbiAqIEBhdXRob3IgR2VvcmdlIFJhcHRpcyAoaHR0cHM6Ly9naXRodWIuY29tL2dlb3JhcGJveClcclxuICpcclxuICogVGhlIE1JVCBMaWNlbnNlIChNSVQpXHJcbiAqXHJcbiAqIENvcHlyaWdodCAoYykgMjAxNCBHZW9yZ2UgUmFwdGlzXHJcbiAqXHJcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxyXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXHJcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcclxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXHJcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XHJcbiAqXHJcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxyXG4gKiBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxyXG4gKlxyXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxyXG4gKiBTT0ZUV0FSRS5cclxuICovXHJcbihmdW5jdGlvbiAobmFtZSwgY29udGV4dCwgZGVmaW5pdGlvbikge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcclxuICAgICAgICBkZWZpbmUoZGVmaW5pdGlvbik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnRleHRbbmFtZV0gPSBkZWZpbml0aW9uKCk7XHJcbiAgICB9XHJcbn0oJ1B1YlN1YicsIHRoaXMsIGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgUHViU3ViID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMudG9waWNzID0ge307ICAgIC8vIFN0b3JhZ2UgZm9yIHRvcGljcyB0aGF0IGNhbiBiZSBicm9hZGNhc3Qgb3IgbGlzdGVuZWQgdG8uXHJcbiAgICAgICAgdGhpcy5zdWJVaWQgPSAtMTsgICAgLy8gQSB0b3BpYyBpZGVudGlmaWVyLlxyXG4gICAgfSxcclxuICAgIHByb3RvID0gUHViU3ViLnByb3RvdHlwZTtcclxuXHJcbiAgICAvKipcclxuXHQgKiBBbGlhcyBhIG1ldGhvZCB3aGlsZSBrZWVwaW5nIHRoZSBjb250ZXh0IGNvcnJlY3QsXHJcblx0ICogdG8gYWxsb3cgZm9yIG92ZXJ3cml0aW5nIG9mIHRhcmdldCBtZXRob2QuXHJcblx0ICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmbiBUaGUgbmFtZSBvZiB0aGUgdGFyZ2V0IG1ldGhvZC5cclxuXHQgKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIGFsaWFzZWQgbWV0aG9kLlxyXG5cdCAqL1xyXG4gICAgZnVuY3Rpb24gYWxpYXMoZm4pIHtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gY2xvc3VyZSAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzW2ZuXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTdWJzY3JpYmUgdG8gZXZlbnRzIG9mIGludGVyZXN0IHdpdGggYSBzcGVjaWZpYyB0b3BpYyBuYW1lIGFuZCBhXHJcbiAgICAgKiBjYWxsYmFjayBmdW5jdGlvbiwgdG8gYmUgZXhlY3V0ZWQgd2hlbiB0aGUgdG9waWMvZXZlbnQgaXMgb2JzZXJ2ZWQuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHRvcGljIHtTdHJpbmd9IFRoZSB0b3BpYyBuYW1lLlxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIHtGdW5jdGlvbn0gQ2FsbGJhY2sgZnVuY3Rpb24gdG8gZXhlY3V0ZSBvbiBldmVudC5cclxuXHQgKiBAcGFyYW0gb25jZSB7Qm9vbGVhbn0gQ2hlY2tzIGlmIGV2ZW50IHdpbGwgYmUgdHJpZ2dlcmVkIG9ubHkgb25lIHRpbWUgKG9wdGlvbmFsKS5cclxuICAgICAqIEByZXR1cm4gbnVtYmVyIHRva2VuXHJcbiAgICAgKi9cclxuICAgIHByb3RvLnN1YnNjcmliZSA9IGZ1bmN0aW9uICh0b3BpYywgY2FsbGJhY2ssIG9uY2UpIHtcclxuICAgICAgICB2YXIgdG9rZW4gPSAodGhpcy5zdWJVaWQgKz0gMSksXHJcbiAgICAgICAgICAgIG9iaiA9IHt9O1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMudG9waWNzW3RvcGljXSkge1xyXG4gICAgICAgICAgICB0aGlzLnRvcGljc1t0b3BpY10gPSBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9iai50b2tlbiA9IHRva2VuO1xyXG4gICAgICAgIG9iai5jYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gICAgICAgIG9iai5vbmNlID0gISFvbmNlO1xyXG5cclxuICAgICAgICB0aGlzLnRvcGljc1t0b3BpY10ucHVzaChvYmopO1xyXG5cclxuICAgICAgICByZXR1cm4gdG9rZW47XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG5cdCAqIFN1YnNjcmliZSB0byBldmVudHMgb2YgaW50ZXJlc3Qgc2V0dGluZyBhIGZsYWdcclxuXHQgKiBpbmRpY2F0aW5nIHRoZSBldmVudCB3aWxsIGJlIHB1Ymxpc2hlZCBvbmx5IG9uZSB0aW1lLlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHRvcGljIHtTdHJpbmd9IFRoZSB0b3BpYyBuYW1lLlxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIHtGdW5jdGlvbn0gQ2FsbGJhY2sgZnVuY3Rpb24gdG8gZXhlY3V0ZSBvbiBldmVudC5cclxuXHQgKi9cclxuICAgIHByb3RvLnN1YnNjcmliZU9uY2UgPSBmdW5jdGlvbiAodG9waWMsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5zdWJzY3JpYmUodG9waWMsIGNhbGxiYWNrLCB0cnVlKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQdWJsaXNoIG9yIGJyb2FkY2FzdCBldmVudHMgb2YgaW50ZXJlc3Qgd2l0aCBhIHNwZWNpZmljXHJcbiAgICAgKiB0b3BpYyBuYW1lIGFuZCBhcmd1bWVudHMgc3VjaCBhcyB0aGUgZGF0YSB0byBwYXNzIGFsb25nLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB0b3BpYyB7U3RyaW5nfSBUaGUgdG9waWMgbmFtZS5cclxuICAgICAqIEBwYXJhbSBhcmdzIHtPYmplY3QgfHwgQXJyYXl9IFRoZSBkYXRhIHRvIGJlIHBhc3NlZC5cclxuICAgICAqIEByZXR1cm4gYm9vbCBmYWxzZSBpZiB0b3BpYyBkb2VzIG5vdCBleGlzdC5cclxuICAgICAqIEByZXR1cm4gYm9vbCB0cnVlIGlmIHRvcGljIGV4aXN0cyBhbmQgZXZlbnQgaXMgcHVibGlzaGVkLlxyXG4gICAgICovXHJcbiAgICBwcm90by5wdWJsaXNoID0gZnVuY3Rpb24gKHRvcGljLCBhcmdzKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxyXG4gICAgICAgICAgICBzdWJzY3JpYmVycyxcclxuICAgICAgICAgICAgbGVuO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMudG9waWNzW3RvcGljXSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc3Vic2NyaWJlcnMgPSB0aGF0LnRvcGljc1t0b3BpY107XHJcbiAgICAgICAgICAgIGxlbiA9IHN1YnNjcmliZXJzID8gc3Vic2NyaWJlcnMubGVuZ3RoIDogMDtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChsZW4pIHtcclxuICAgICAgICAgICAgICAgIGxlbiAtPSAxO1xyXG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlcnNbbGVuXS5jYWxsYmFjayh0b3BpYywgYXJncyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVW5zdWJzY3JpYmUgZnJvbSBldmVudCBiYXNlZCBvbiB0b2tlbml6ZWQgcmVmZXJlbmNlLFxyXG4gICAgICAgICAgICAgICAgLy8gaWYgc3Vic2NyaWJlcidzIHByb3BlcnR5IG9uY2UgaXMgc2V0IHRvIHRydWUuXHJcbiAgICAgICAgICAgICAgICBpZiAoc3Vic2NyaWJlcnNbbGVuXS5vbmNlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC51bnN1YnNjcmliZShzdWJzY3JpYmVyc1tsZW5dLnRva2VuKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIDApO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVbnN1YnNjcmliZSBmcm9tIGEgc3BlY2lmaWMgdG9waWMsIGJhc2VkIG9uICB0aGUgdG9waWMgbmFtZSxcclxuICAgICAqIG9yIGJhc2VkIG9uIGEgdG9rZW5pemVkIHJlZmVyZW5jZSB0byB0aGUgc3Vic2NyaXB0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB0IHtTdHJpbmcgfHwgT2JqZWN0fSBUb3BpYyBuYW1lIG9yIHN1YnNjcmlwdGlvbiByZWZlcmVuZWNlLlxyXG4gICAgICogQHJldHVybiBib29sIGZhbHNlIGlmIGFyZ3VtZW50IHBhc3NlZCBkb2VzIG5vdCBtYXRjaCBhIHN1YnNjcmliZWQgZXZlbnQuXHJcbiAgICAgKi9cclxuICAgIHByb3RvLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24gKHQpIHtcclxuICAgICAgICB2YXIgcHJvcCxcclxuICAgICAgICAgICAgbGVuLFxyXG4gICAgICAgICAgICB0ZiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBmb3IgKHByb3AgaW4gdGhpcy50b3BpY3MpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudG9waWNzLmhhc093blByb3BlcnR5KHByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50b3BpY3NbcHJvcF0pIHtcclxuICAgICAgICAgICAgICAgICAgICBsZW4gPSB0aGlzLnRvcGljc1twcm9wXS5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChsZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGVuIC09IDE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB0IGlzIGEgdG9rZW5pemVkIHJlZmVyZW5jZSB0byB0aGUgc3Vic2NyaXB0aW9uLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBSZW1vdmVzIG9uZSBzdWJzY3JpcHRpb24gZnJvbSB0aGUgYXJyYXkuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnRvcGljc1twcm9wXVtsZW5dLnRva2VuID09PSB0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvcGljc1twcm9wXS5zcGxpY2UobGVuLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB0IGlzIHRoZSBldmVudCB0eXBlLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBSZW1vdmVzIGFsbCB0aGUgc3Vic2NyaXB0aW9ucyB0aGF0IG1hdGNoIHRoZSBldmVudCB0eXBlLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcCA9PT0gdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3BpY3NbcHJvcF0uc3BsaWNlKGxlbiwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZiA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcblx0ICogUHJvbWlzZXMvQSsgaW1wbGVtZW50YXRpb24uXHJcblx0ICovXHJcbiAgICBwcm90by5hUGx1cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgU3RhdGUsXHJcbiAgICAgICAgICAgIEFwbHVzID0ge307XHJcblxyXG4gICAgICAgIFN0YXRlID0ge1xyXG4gICAgICAgICAgICBQRU5ESU5HOiAwLFxyXG4gICAgICAgICAgICBGVUxGSUxMRUQ6IDEsXHJcbiAgICAgICAgICAgIFJFSkVDVEVEOiAyXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gU2V0IGRlZmF1bHQgc3RhdGUuXHJcbiAgICAgICAgQXBsdXMuc3RhdGUgPSBTdGF0ZS5QRU5ESU5HO1xyXG5cclxuICAgICAgICAvKipcclxuXHRcdCAqIENoYW5nZXMgdGhlIHN0YXRlIG9mIGEgcHJvbWlzZS5cclxuXHRcdCAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0ZSBUaGUgc3RhdGUgb2YgdGhlIHByb21pc2UuXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ8T2JqZWN0fSB2YWx1ZSBUaGUgdmFsdWUgKG9yIHJlYXNvbikgd2UgZ2V0IHdoZW4gdGhlIHN0YXRlIGNoYW5nZXMuXHJcblx0XHQgKi9cclxuICAgICAgICBBcGx1cy5jaGFuZ2VTdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgLy8gQ2F0Y2ggY2hhbmdpbmcgdG8gc2FtZSBzdGF0ZSAocGVyaGFwcyB0cnlpbmcgdG8gY2hhbmdlIHRoZSB2YWx1ZSkuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlID09PSBzdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5cXCd0IHRyYW5zaXRpb24gdG8gc2FtZSBzdGF0ZTogJyArIHN0YXRlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gVHJ5aW5nIHRvIGNoYW5nZSBvdXQgb2YgZnVsZmlsbGVkIG9yIHJlamVjdGVkIHN0YXRlLlxyXG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gU3RhdGUuRlVMRklMTEVEIHx8IHRoaXMuc3RhdGUgPT09IFN0YXRlLlJFSkVDVEVEKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhblxcJ3QgdHJhbnNpdGlvbiBmcm9tIGN1cnJlbnQgc3RhdGU6ICcgKyBzdGF0ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIElmIHNlY29uZCBhcmd1bWVudCBpc24ndCBnaXZlbiBhdCBhbGwgKFBhc3NpbmcgdW5kZWZpbmVkIGlzIGFsbG93ZWQpLlxyXG4gICAgICAgICAgICBpZiAoc3RhdGUgPT09IFN0YXRlLkZVTEZJTExFRCAmJiBhcmd1bWVudHMubGVuZ3RoIDwgMikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcmFuc2l0aW9uIHRvIGZ1bGZpbGxlZCBtdXN0IGhhdmUgYSBub24gbnVsbCB2YWx1ZScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBJZiBhIG51bGwgcmVhc29uIGlzIHBhc3NlZCBpbi5cclxuICAgICAgICAgICAgLy8gTk9URTogVXNlIGRvdWJsZSBlcXVhbGl0eSBpbnN0ZWFkIG9mIHRyaXBwbGUgdG8gY2hlY2sgZm9yIGJvdGggbnVsbCBhbmQgdW5kZWZpbmVkLlxyXG4gICAgICAgICAgICBpZiAoc3RhdGUgPT09IFN0YXRlLlJFSkVDVEVEICYmIHZhbHVlID09IG51bGwpIHsgLy8ganNoaW50IGlnbm9yZTpsaW5lXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyYW5zaXRpb24gdG8gcmVqZWN0ZWQgbXVzdCBoYXZlIGEgbm9uIG51bGwgcmVhc29uJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTsgLy8gQ2hhbmdlIHN0YXRlLlxyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7IC8vIENoYW5nZSB0aGUgdmFsdWUuXHJcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZSgpOyAgICAgLy8gUmVzb2x2ZSB0aGUgcHJvbWlzZS5cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YXRlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG5cdFx0ICogRnVsZmlsbHMgYSBwcm9taXNlLlxyXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfE9iamVjdH0gdmFsdWVcclxuXHRcdCAqL1xyXG4gICAgICAgIEFwbHVzLmZ1bGZpbGwgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VTdGF0ZShTdGF0ZS5GVUxGSUxMRUQsIHZhbHVlKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuXHRcdCAqIFJlamVjdHMgYSBwcm9taXNlLlxyXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IHJlYXNvblxyXG5cdFx0ICovXHJcbiAgICAgICAgQXBsdXMucmVqZWN0ID0gZnVuY3Rpb24gKHJlYXNvbikge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZVN0YXRlKFN0YXRlLlJFSkVDVEVELCByZWFzb24pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7RnVuY3Rpb259IG9uRnVsZmlsbGVkIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0byBleGVjdXRlIGlmIHByb21pc2UgaXMgZnVsZmlsbGVkLlxyXG5cdFx0ICogQHBhcmFtIHtGdW5jdGlvbn0gb25SZWplY3RlZCBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdG8gZXhlY3V0ZSBpZiBwcm9taXNlIGlzIHJlamVjdGVkLlxyXG5cdFx0ICogQHJldHVybnMge09iamVjdH0gcHJvbWlzZSBSZXR1cm4gdGhlIHByb21pc2Ugb2JqZWN0IHRvIGFsbG93IGNoYWluaW5nLlxyXG5cdFx0ICovXHJcbiAgICAgICAgQXBsdXMudGhlbiA9IGZ1bmN0aW9uIChvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xyXG4gICAgICAgICAgICAvLyBJbml0aWFsaXplIGFycmF5IHRvIHN0b3JlIHRoZVxyXG4gICAgICAgICAgICAvLyBmdW5jdGlvbnMgdG8gZXhlY3V0ZSBsYXRlciBvbi5cclxuICAgICAgICAgICAgdGhpcy5jYWNoZSA9IHRoaXMuY2FjaGUgfHwgW107XHJcblxyXG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IE9iamVjdC5jcmVhdGUoQXBsdXMpLFxyXG4gICAgICAgICAgICAgICAgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFzeW5jKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuY2FjaGUucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVsZmlsbDogdHlwZW9mIG9uRnVsZmlsbGVkID09PSAnZnVuY3Rpb24nICYmIG9uRnVsZmlsbGVkLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdDogdHlwZW9mIG9uUmVqZWN0ZWQgPT09ICdmdW5jdGlvbicgJiYgb25SZWplY3RlZCxcclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlOiBwcm9taXNlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGF0LnJlc29sdmUoKTtcclxuICAgICAgICAgICAgfSwgNSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuXHRcdCAqIFJlc29sdmVzIHRoZSBwcm9taXNlLlxyXG5cdFx0ICogQHJldHVybnMge0Jvb2xlYW59IFJldHVybnMgZmFsc2UgaWYgc3RhdGUgaXMgcGVuZGluZy5cclxuXHRcdCAqL1xyXG4gICAgICAgIEFwbHVzLnJlc29sdmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vIEZpcnN0IGNoZWNrIGlmIHBlbmRpbmcuLi5cclxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IFN0YXRlLlBFTkRJTkcpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIG9iaixcclxuICAgICAgICAgICAgICAgIGZuO1xyXG5cclxuICAgICAgICAgICAgLy8gZm9yIGVhY2ggJ3RoZW4nLlxyXG4gICAgICAgICAgICB3aGlsZSAodGhpcy5jYWNoZSAmJiB0aGlzLmNhY2hlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgb2JqID0gdGhpcy5jYWNoZS5zaGlmdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgYXBwcm9wcmlhdGUgZnVuY3Rpb24gYmFzZWQgb24gc3RhdGUuXHJcbiAgICAgICAgICAgICAgICBmbiA9IHRoaXMuc3RhdGUgPT09IFN0YXRlLkZVTEZJTExFRCA/IG9iai5mdWxmaWxsIDogb2JqLnJlamVjdDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLnByb21pc2UuY2hhbmdlU3RhdGUodGhpcy5zdGF0ZSwgdGhpcy52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEZ1bGZpbGwgcHJvbWlzZSB3aXRoIHZhbHVlIG9yIHJlamVjdCB3aXRoIGVycm9yLlxyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGZuKHRoaXMudmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRGVhbCB3aXRoIHRoZSBwcm9taXNlIHJldHVybmVkLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlLnRoZW4gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnByb21pc2UuY2hhbmdlU3RhdGUoU3RhdGUuRlVMRklMTEVELCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnByb21pc2UuY2hhbmdlU3RhdGUoU3RhdGUuUkVKRUNURUQsIHJlYXNvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERlYWwgd2l0aCBvdGhlciB2YWx1ZSByZXR1cm5lZC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5wcm9taXNlLmNoYW5nZVN0YXRlKFN0YXRlLkZVTEZJTExFRCwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnByb21pc2UuY2hhbmdlU3RhdGUoU3RhdGUuUkVKRUNURUQsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuXHRcdCAqIEV4ZWN1dGVzIGEgZnVuY3Rpb24gYXN5bmNocm9ub3VzbHkuXHJcblx0XHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIHRoZSBjYWxsYmFjayBmdW5jdGlvbiB0byBleGVjdXRlLlxyXG5cdFx0ICovXHJcbiAgICAgICAgQXBsdXMuYXN5bmMgPSBmdW5jdGlvbiAoZnVuYywgZGVsYXkpIHtcclxuICAgICAgICAgICAgZGVsYXkgPSB0eXBlb2YgZGVsYXkgPT09ICd1bmRlZmluZWQnID8gNSA6IGRlbGF5O1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmMsIGRlbGF5KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShBcGx1cyk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWxpYXMgZm9yIHB1YmxpYyBtZXRob2RzLlxyXG4gICAgICogc3Vic2NyaWJlICAgICAtPiBvblxyXG4gICAgICogc3Vic2NyaWJlT25jZSAtPiBvbmNlXHJcbiAgICAgKiBwdWJsaXNoICAgICAgIC0+IHRyaWdnZXJcclxuICAgICAqIHVuc3Vic2NyaWJlICAgLT4gb2ZmXHJcbiAgICAgKiBhUGx1cyAgICAgICAgIC0+IHdoZW5cclxuICAgICAqL1xyXG4gICAgcHJvdG8ub24gPSBhbGlhcygnc3Vic2NyaWJlJyk7XHJcbiAgICBwcm90by5vbmNlID0gYWxpYXMoJ3N1YnNjcmliZU9uY2UnKTtcclxuICAgIHByb3RvLnRyaWdnZXIgPSBhbGlhcygncHVibGlzaCcpO1xyXG4gICAgcHJvdG8ub2ZmID0gYWxpYXMoJ3Vuc3Vic2NyaWJlJyk7XHJcbiAgICBwcm90by53aGVuID0gYWxpYXMoJ2FQbHVzJyk7XHJcblxyXG4gICAgcmV0dXJuIFB1YlN1YjtcclxufSkpO1xyXG4iLCIvKipcbiAqIFJvdXRlciBtb2R1bGVcbiAqIFByb3ZpZGVzIHJvdXRpbmcgdG8gYXBwbGljYXRpb24gZW5oYW5jZWQgd2l0aCBhbmltYXRpb25zIGFuZFxuICogYSByb3V0ZXIgd3JhcHBlciBnaXZpbmcgdXMgdGhlIGFiaWxpdHkgZm9yIGN1c3RvbSBhY3J0aW9uIHdoZW4gcm91dGUgY2hhbmdlcy5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGRvYykge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBhbmltYXRvciA9IHJlcXVpcmUoJy4vdXRpbHMvYW5pbWF0b3InKSxcblx0XHRkb20gPSByZXF1aXJlKCcuL3V0aWxzL2RvbScpLFxuXHRcdG9iaiA9IHJlcXVpcmUoJy4vdXRpbHMvb2JqZWN0cycpO1xuXG4gICAgdmFyIGVuYWJsZUFuaW1hdGlvbnMgPSB0cnVlLFxuXHRcdGFuaW1hdGlvbkV2ZW50ID0gZG9tLndoaWNoQW5pbWF0aW9uRXZlbnQoKSxcbiAgICAgICAgYW5pbWF0ZSA9IGFuaW1hdGlvbkV2ZW50ICYmIGVuYWJsZUFuaW1hdGlvbnMgP1xuICAgICAgICAgICAgYW5pbWF0b3IocGFnZUluLCBwYWdlT3V0LCB0cnVlLCBmYWxzZSkgOlxuICAgICAgICAgICAgZnVuY3Rpb24gKG15TW9kdWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG15TW9kdWxlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgYW5pbWF0aW9uQ2xhc3M7IC8vIEhvbGRzIHRoZSBjbGFzcyByZXNwb25zaWJsZSBmb3IgYW5pbWF0aW9uLlxuXG4gICAgLyoqXG4gICAgICogQW5pbWF0ZXMgcGFnZSBpbiB2aWV3LlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbCBUaGUgcGFnZSB2aWV3LlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIEZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIGFmdGVyIHRyYW5zaXRpb24gZW5kcy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwYWdlSW4oZWwsIGNhbGxiYWNrKSB7XG4gICAgICAgIC8vIE92ZXJyaWRlIGNhbGxiYWNrIGZ1bmN0aW9uIG9mIGFuaW1hdG9yLlxuICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBuZXh0ID0gZWwubmV4dEVsZW1lbnRTaWJsaW5nO1xuXG4gICAgICAgICAgICBkb2MuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCduby1hY3Rpb25zJyk7XG4gICAgICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGFuaW1hdGlvbkV2ZW50LCBjYWxsYmFjaywgZmFsc2UpO1xuICAgICAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICAgICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5leHQpO1xuICAgICAgICAgICAgICAgIG5leHQgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGFuaW1hdGlvbkNsYXNzICYmIGVsLmNsYXNzTGlzdC5hZGQoYW5pbWF0aW9uQ2xhc3MpO1xuICAgICAgICBkb2MuYm9keS5jbGFzc0xpc3QuYWRkKCduby1hY3Rpb25zJyk7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoYW5pbWF0aW9uRXZlbnQsIGNhbGxiYWNrLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW5pbWF0ZXMgcGFnZSBvdXQgb2Ygdmlldy5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZWwgVGhlIHBhZ2Ugdmlldy5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBGdW5jdGlvbiB0byBiZSBleGVjdXRlZCBhZnRlciB0cmFuc2l0aW9uIGVuZHMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gcGFnZU91dChlbCwgY2FsbGJhY2spIHtcbiAgICAgICAgLy8gT3ZlcnJpZGUgY2FsbGJhY2sgZnVuY3Rpb24gb2YgYW5pbWF0b3IuXG4gICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihhbmltYXRpb25FdmVudCwgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdwYWdlLW91dCcpO1xuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKGFuaW1hdGlvbkV2ZW50LCBjYWxsYmFjaywgZmFsc2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNpbXBsZSBSb3V0ZXIgd3JhcHBlciwgdG8gaGFuZGxlIGdlbmVyaWMgdGFza3MsIHdoZW4gcm91dGUgY2hhbmdlcy5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb01vZHVsZSBUaGUgbW9kdWxlIHRvIGJlIHByb3ZpZGVkIGZvciB0aGUgc3BlY2lmaWMgcm91dGUuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXSBEZWZhdWx0IG9wdGlvbnMgdG8gYmUgcHJvdmlkZWQgZm9yIGVhY2ggcm91dGUuIENhbiBiZSBvdmVycmlkZW4gYnkgdXNlci5cbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJvdXRlcihvTW9kdWxlLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIG5hbWU6ICcnLFxuICAgICAgICAgICAgYW5pbUNsYXNzOiAnJ1xuICAgICAgICB9O1xuICAgICAgICBvcHRpb25zID0gb2JqLmV4dGVuZCh7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgICAgICBkZWZhdWx0cyA9IG51bGw7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBhbmltYXRpb25DbGFzcyA9IG9wdGlvbnMuYW5pbUNsYXNzO1xuXG4gICAgICAgICAgICAgICAgLy8gU2V0IGEgZGVmYXVsdCBuYW1lIGZvciBlYWNoIHJvdXRlLCBpZiBvbmUgaXMgbm90IHByb3ZpZGVkLlxuICAgICAgICAgICAgICAgIG9wdGlvbnMubmFtZSA9IG9wdGlvbnMubmFtZSB8fCBtLnJvdXRlKCkucmVwbGFjZSgvXFwvL2csICcnKTtcblxuICAgICAgICAgICAgICAgIC8vIFNldCBhbiBhdHRyaWJ1dGUgdG8gYm9keSwgdG8gdXNlIGl0IGZvciBET00gbWFuaXB1bGF0aW9uIGFuZCBzdHlsaW5nLlxuICAgICAgICAgICAgICAgIGRvYy5ib2R5LnNldEF0dHJpYnV0ZSgnZGF0YS1wYWdlLW5hbWUnLCBvcHRpb25zLm5hbWUpO1xuXG4gICAgICAgICAgICAgICAgLy8gUmV0dXJuIHRoZSBtb2R1bGUncyBjb250cm9sbGVyIGlmIGF2YWlsYWJsZSwgZWxzZSB1bmRlZmluZWQuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9Nb2R1bGUuY29udHJvbGxlciA/IG5ldyBvTW9kdWxlLmNvbnRyb2xsZXIoKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB2aWV3OiBhbmltYXRlKG9Nb2R1bGUpLnZpZXdcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBDb25maWd1cmUgcm91dGluZyBtb2RlLlxuICAgIG0ucm91dGUubW9kZSA9ICdoYXNoJztcblxuICAgIHJldHVybiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplIGFwcGxpY2F0aW9uJ3Mgcm91dGVyLlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gcGFnZXNcbiAgICAgICAgICovXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uIChwYWdlcykge1xuICAgICAgICAgICAgLy8gRGVmaW5lIGFwcGxpY2F0aW9uJ3Mgcm91dGVzLlxuICAgICAgICAgICAgbS5yb3V0ZShkb2MucXVlcnlTZWxlY3RvcignbS12aWV3JyksICcvZGFzaGJvYXJkJywge1xuICAgICAgICAgICAgICAgICcvZGFzaGJvYXJkJzogcm91dGVyKHBhZ2VzLmRhc2hib2FyZCwge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnZGFzaGJvYXJkJyxcbiAgICAgICAgICAgICAgICAgICAgYW5pbUNsYXNzOiAncHQtc2xpZGUtdHRiJ1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICcvZGFzaGJvYXJkLzp1c2VyTmFtZSc6IHJvdXRlcihwYWdlcy5kYXNoYm9hcmQsIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2Rhc2hib2FyZCcsXG4gICAgICAgICAgICAgICAgICAgIGFuaW1DbGFzczogJ3B0LXNsaWRlLXR0YidcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAnL3VzZXJwcm9maWxlLzp1c2VyTmFtZSc6IHJvdXRlcihwYWdlcy51c2VycHJvZmlsZSwge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAndXNlcnByb2ZpbGUnLFxuICAgICAgICAgICAgICAgICAgICBhbmltQ2xhc3M6ICdwdC1zbGlkZS1ydGwnXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgJy9hYm91dCc6IHJvdXRlcihwYWdlcy5hYm91dCwge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnYWJvdXQnLFxuICAgICAgICAgICAgICAgICAgICBhbmltQ2xhc3M6ICdwdC1zbGlkZS1ydGwnXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgJy9jb250YWN0cyc6IHJvdXRlcihwYWdlcy5jb250YWN0cywge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29udGFjdHMnLFxuICAgICAgICAgICAgICAgICAgICBhbmltQ2xhc3M6ICdwdC1zbGlkZS1ydGwnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn0oZG9jdW1lbnQpKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgYW5pbWF0aW5nID0gZmFsc2U7IC8vIEZsYWcgdG8gaW5kaWNhdGUgd2hlbiBhbmltYXRpb24gaXMgaW4gcHJvZ3Jlc3MuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWZpbmUgYW4gYW5pbWF0b3IgY29uc2lzdGluZyBvZiBvcHRpb25hbCBpbmNvbWluZyBhbmQgb3V0Z29pbmcgYW5pbWF0aW9ucy5cclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGluY29taW5nXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvdXRnb2luZ1xyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBhbHdheXNBbmltYXRlIEZhbHNlIHVubGVzcyBzcGVjaWZpZWQgYXMgdHJ1ZTogZmFsc2UgbWVhbnMgYW4gaW5jb21pbmcgYW5pbWF0aW9uIHdpbGwgb25seSB0cmlnZ2VyIGlmIGFuIG91dGdvaW5nIGFuaW1hdGlvbiBpcyBhbHNvIGluIHByb2dyZXNzLlxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBkb250Q2xvbmUgRm9yY2luZyBkb250Q2xvbmUgdG8gdHJ1ZSBtZWFucyB0aGUgb3V0d2FyZCBhbmltYXRpb24gd2lsbCB1c2UgdGhlIG9yaWdpbmFsIGVsZW1lbnQgcmF0aGVyIHRoYW4gYSBjbG9uZS4gVGhpcyBjb3VsZCBpbXByb3ZlIHBlcmZvcm1hbmNlIGJ5IHJlY3ljbGluZyBlbGVtZW50cywgYnV0IGNhbiBsZWFkIHRvIHRyb3VibGU6IGNsb25lcyBoYXZlIHRoZSBhZHZhbnRhZ2Ugb2YgYmVpbmcgc3RyaXBwZWQgb2YgYWxsIGV2ZW50IGxpc3RlbmVycy5cclxuICAgICAqIEByZXR1cm5zIHtmdW5jdGlvbn0gYW5pbWF0b3JcclxuICAgICAqL1xyXG4gICAgdmFyIGFuaW1hdG9yID0gZnVuY3Rpb24gKGluY29taW5nLCBvdXRnb2luZywgYWx3YXlzQW5pbWF0ZSwgZG9udENsb25lKSB7XHJcbiAgICAgICAgLy8gVGhlIHJlc3VsdGluZyBhbmltYXRvciBjYW4gYmUgYXBwbGllZCB0byBhbnkgbnVtYmVyIG9mIGNvbXBvbmVudHNcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gYW5pbWF0ZSh4LCB5LCB6KSB7XHJcbiAgICAgICAgICAgIHZhciBjb25maWcsXHJcbiAgICAgICAgICAgICAgICBwYXJlbnQsXHJcbiAgICAgICAgICAgICAgICBuZXh0O1xyXG5cclxuICAgICAgICAgICAgaWYgKHgubm9kZVR5cGUpIHsgLy8gV2hlbiB1c2VkIGFzIGEgY29uZmlnIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uQ29uZmlnKHgsIHksIHopO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHguYXR0cnMpIHsgLy8gV2hlbiBwYXNzZWQgYSB2aXJ0dWFsIERPTSBub2RlICh0aGUgb3V0cHV0IG9mIG0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYmluZENvbmZpZ1RvKHgpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHgudmlldykgeyAvLyBXaGVuIGFwcGxpZWQgdG8gYSBNaXRocmlsIG1vZHVsZSAvIGNvbXBvbmVudFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiB4LmNvbnRyb2xsZXIgfHwgbm9vcCxcclxuICAgICAgICAgICAgICAgICAgICB2aWV3OiBmdW5jdGlvbiBhbmltYXRlZFZpZXcgKGN0cmwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJpbmRDb25maWdUbyh4LnZpZXcoY3RybCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGJpbmRDb25maWdUbyhub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25maWcgPSBub2RlLmF0dHJzLmNvbmZpZztcclxuICAgICAgICAgICAgICAgIG5vZGUuYXR0cnMuY29uZmlnID0gYW5pbWF0aW9uQ29uZmlnO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGFuaW1hdGlvbkNvbmZpZyhlbCwgaW5pdCwgY29udGV4dCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG91dHB1dCxcclxuICAgICAgICAgICAgICAgICAgICBvbnVubG9hZDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ID0gY29uZmlnKGVsLCBpbml0LCBjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgcm9vdCBlbGVtZW50IGFscmVhZHkgaGFzIGEgY29uZmlnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGl0IG1heSBhbHNvIGhhdmUgYW4gb251bmxvYWQgd2hpY2ggd2Ugc2hvdWxkIHRha2UgY2FyZSB0byBwcmVzZXJ2ZS5cclxuICAgICAgICAgICAgICAgICAgICBvbnVubG9hZCA9IGNvbnRleHQub251bmxvYWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFpbml0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluY29taW5nICYmIGFsd2F5c0FuaW1hdGUgfHwgYW5pbWF0aW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluY29taW5nKGVsLCBub29wLCBjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQub251bmxvYWQgPSBvdXRnb2luZyA/IG9udW5sb2FkID8gZnVuY3Rpb24gb251bmxvYWRXcmFwcGVyKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZWFyZG93bigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbnVubG9hZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gOiB0ZWFyZG93biA6IG9udW5sb2FkO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSBlbC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIG5leHQgPSBlbC5uZXh0U2libGluZztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHRlYXJkb3duKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbnNlcnRpb24gPSBkb250Q2xvbmUgPyBlbCA6IGVsLmNsb25lTm9kZSh0cnVlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHQgJiYgcGFyZW50ICYmIG5leHQucGFyZW50Tm9kZSA9PT0gcGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZSA9IG5leHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBhbmltYXRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uIHJlc2V0QW5pbWF0aW9uRmxhZyAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKGluc2VydGlvbiwgcmVmZXJlbmNlKTtcclxuICAgICAgICAgICAgICAgICAgICBvdXRnb2luZyhpbnNlcnRpb24sIGZ1bmN0aW9uIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyZW50LmNvbnRhaW5zKGluc2VydGlvbikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChpbnNlcnRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBub29wKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCczJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYW5pbWF0b3I7XHJcbn0oKSk7XHJcbiIsIi8qKlxyXG4gKiBET00gdXRpbGl0aWVzLlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGRvYykge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIC8qKlxyXG5cdCAqIERldGVjdHMgdGhlIHN1cHBvcnRlZCBwcm9wZXJ0eSBuYW1lIGZvciB0aGUgXCJ0cmFuc2l0aW9uZW5kXCIgZXZlbnQuICh0cmFuc2l0aW9uKVxyXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBzdXBwb3J0ZWQgcHJvcGVydHkgbmFtZS5cclxuXHQgKi9cclxuICAgIGZ1bmN0aW9uIHdoaWNoVHJhbnNpdGlvbkV2ZW50KCkge1xyXG4gICAgICAgIHZhciBrZXksXHJcbiAgICAgICAgICAgIGVsID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxyXG4gICAgICAgICAgICB0cmFuc2l0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICd0cmFuc2l0aW9uJzogJ3RyYW5zaXRpb25lbmQnLFxyXG4gICAgICAgICAgICAgICAgJ09UcmFuc2l0aW9uJzogJ29UcmFuc2l0aW9uRW5kJyxcclxuICAgICAgICAgICAgICAgICdNb3pUcmFuc2l0aW9uJzogJ3RyYW5zaXRpb25lbmQnLFxyXG4gICAgICAgICAgICAgICAgJ1dlYmtpdFRyYW5zaXRpb24nOiAnd2Via2l0VHJhbnNpdGlvbkVuZCdcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZm9yIChrZXkgaW4gdHJhbnNpdGlvbnMpIHtcclxuICAgICAgICAgICAgaWYgKHRyYW5zaXRpb25zLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlbC5zdHlsZVtrZXldICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRyYW5zaXRpb25zW2tleV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcblx0ICogRGV0ZWN0cyB0aGUgc3VwcG9ydGVkIHByb3BlcnR5IG5hbWUgZm9yIHRoZSBcImFuaW1hdGlvbmVuZFwiIGV2ZW50LiAoa2V5ZnJhbWVzKVxyXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBzdXBwb3J0ZWQgcHJvcGVydHkgbmFtZS5cclxuXHQgKi9cclxuICAgIGZ1bmN0aW9uIHdoaWNoQW5pbWF0aW9uRXZlbnQoKSB7XHJcbiAgICAgICAgdmFyIGtleSxcclxuICAgICAgICAgICAgZWwgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2JyksXHJcbiAgICAgICAgICAgIGFuaW1hdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAnYW5pbWF0aW9uJzogJ2FuaW1hdGlvbmVuZCcsXHJcbiAgICAgICAgICAgICAgICAnT0FuaW1hdGlvbic6ICdvQW5pbWF0aW9uRW5kJyxcclxuICAgICAgICAgICAgICAgICdNb3pBbmltYXRpb24nOiAnYW5pbWF0aW9uZW5kJyxcclxuICAgICAgICAgICAgICAgICdXZWJraXRBbmltYXRpb24nOiAnd2Via2l0QW5pbWF0aW9uRW5kJ1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICBmb3IgKGtleSBpbiBhbmltYXRpb25zKSB7XHJcbiAgICAgICAgICAgIGlmIChhbmltYXRpb25zLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlbC5zdHlsZVtrZXldICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFuaW1hdGlvbnNba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuXHQgKiBEZXRlY3RzIGlmIGEgZGV2aWNlIGlzIHRvdWNoIGVuYWJsZWQuXHJcblx0ICovXHJcbiAgICBmdW5jdGlvbiBpc1RvdWNoRGV2aWNlKCkge1xyXG4gICAgICAgIHZhciB1YSA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XHJcbiAgICAgICAgcmV0dXJuICdvbnRvdWNoc3RhcnQnIGluIGRvYy5kb2N1bWVudEVsZW1lbnQgfHxcclxuICAgICAgICAgICAgdWEuaW5kZXhPZignaVBhZCcpICE9PSAtMSB8fFxyXG4gICAgICAgICAgICB1YS5pbmRleE9mKCdpUGhvbmUnKSAhPT0gLTE7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB3aGljaFRyYW5zaXRpb25FdmVudDogd2hpY2hUcmFuc2l0aW9uRXZlbnQsXHJcbiAgICAgICAgd2hpY2hBbmltYXRpb25FdmVudDogd2hpY2hBbmltYXRpb25FdmVudCxcclxuICAgICAgICBpc1RvdWNoRGV2aWNlOiBpc1RvdWNoRGV2aWNlXHJcbiAgICB9O1xyXG59KGRvY3VtZW50KSk7XHJcbiIsIi8qKlxyXG4gKiBPYmplY3RzIHV0aWxpdGllcy5cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAvKipcclxuICAgICAqIE1lcmdlcyAoZGVlcCBjb3B5KSB0aGUgY29udGVudHMgb2YgdHdvIG9yIG1vcmUgb2JqZWN0cyB0b2dldGhlciBpbnRvIHRoZSBmaXJzdCBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0IFRoZSBvYmplY3QgdG8gZXh0ZW5kLiBJdCB3aWxsIHJlY2VpdmUgdGhlIG5ldyBwcm9wZXJ0aWVzLlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdDEgQW4gb2JqZWN0IGNvbnRhaW5pbmcgYWRkaXRpb25hbCBwcm9wZXJ0aWVzIHRvIG1lcmdlIGluLlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdE4gQWRkaXRpb25hbCBvYmplY3RzIGNvbnRhaW5pbmcgcHJvcGVydGllcyB0byBtZXJnZSBpbi5cclxuICAgICAqIEB1c2UgZXh0ZW5kKHt9LCBvYmoxLCBvYmpOKVxyXG4gICAgKi9cclxuICAgIGZ1bmN0aW9uIGV4dGVuZCgpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMSwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGFyZ3VtZW50c1tpXSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFyZ3VtZW50c1tpXS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFyZ3VtZW50c1tpXVtrZXldICYmIGFyZ3VtZW50c1tpXVtrZXldLmNvbnN0cnVjdG9yICYmIGFyZ3VtZW50c1tpXVtrZXldLmNvbnN0cnVjdG9yID09PSBPYmplY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzWzBdW2tleV0gPSBhcmd1bWVudHNbMF1ba2V5XSB8fCB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXh0ZW5kKGFyZ3VtZW50c1swXVtrZXldLCBhcmd1bWVudHNbaV1ba2V5XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzWzBdW2tleV0gPSBhcmd1bWVudHNbaV1ba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFyZ3VtZW50c1swXTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGV4dGVuZDogZXh0ZW5kXHJcbiAgICB9O1xyXG59KCkpO1xyXG4iXX0=
