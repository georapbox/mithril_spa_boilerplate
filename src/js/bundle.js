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

            return m('form', [
                m('.form-group', [
                    m('label', 'Name'),
                    m('input.form-control', {
                        type: 'text',
                        placeholder: 'eg: George Raptis',
                        oninput: m.withAttr('value', contact.name),
                        value: contact.name() || ''
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

            console.log(ps.topics);
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
                            m('th', 'Email')
                        ])
                    ]),
                    m('tbody', [
                        args.contacts().map(function (contact, idx) {
                            return m('tr.contact-item', {key: contact.id, config: fadesIn}, [
                                m('th', ++idx),
                                m('td', contact.name),
                                m('td', contact.email)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyIsInNyYy9qcy9jb21wb25lbnRzL21vZGFsLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvbmF2LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvcGFnZXMvYWJvdXQuanMiLCJzcmMvanMvY29tcG9uZW50cy9wYWdlcy9jb250YWN0cy5qcyIsInNyYy9qcy9jb21wb25lbnRzL3BhZ2VzL2Rhc2hib2FyZC5qcyIsInNyYy9qcy9jb21wb25lbnRzL3BhZ2VzL3VzZXJwcm9maWxlLmpzIiwic3JjL2pzL2xpYi9mYXN0Y2xpY2suanMiLCJzcmMvanMvbGliL21pdGhyaWwuanMiLCJzcmMvanMvbGliL3B1YnN1Yi5qcyIsInNyYy9qcy9yb3V0ZXIuanMiLCJzcmMvanMvdXRpbHMvYW5pbWF0b3IuanMiLCJzcmMvanMvdXRpbHMvZG9tLmpzIiwic3JjL2pzL3V0aWxzL29iamVjdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3gwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcHRDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uICh3aW4sIGRvYykge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHdpbi5tID0gcmVxdWlyZSgnLi9saWIvbWl0aHJpbCcpO1xyXG4gICAgd2luLmFwcCA9IHdpbi5hcHAgfHwge307XHJcblxyXG4gICAgdmFyIGF0dGFjaEZhc3RDbGljayA9IHJlcXVpcmUoJy4vbGliL2Zhc3RjbGljaycpO1xyXG4gICAgYXR0YWNoRmFzdENsaWNrKGRvYy5ib2R5KTtcclxuXHJcbiAgICB2YXIgcm91dGVyID0gcmVxdWlyZSgnLi9yb3V0ZXInKTtcclxuICAgIHJvdXRlci5pbml0KHtcclxuICAgICAgICBkYXNoYm9hcmQ6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9wYWdlcy9kYXNoYm9hcmQnKSxcclxuICAgICAgICB1c2VycHJvZmlsZTogcmVxdWlyZSgnLi9jb21wb25lbnRzL3BhZ2VzL3VzZXJwcm9maWxlJyksXHJcbiAgICAgICAgYWJvdXQ6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9wYWdlcy9hYm91dCcpLFxyXG4gICAgICAgIGNvbnRhY3RzOiByZXF1aXJlKCcuL2NvbXBvbmVudHMvcGFnZXMvY29udGFjdHMnKVxyXG4gICAgfSk7XHJcblxyXG4gICAgdmFyIG5hdiA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9uYXYnKTtcclxuICAgIG5hdi5yZW5kZXIoKTtcclxufSh3aW5kb3csIGRvY3VtZW50KSk7XHJcbiIsIi8qKlxyXG4gKiBNaXRocmlsLUJvb3RzdHJhcC1Nb2RhbFxyXG4gKiBBIE1pdGhyaWwgaW1wbGVtZW50YXRpb24gb2YgYSBCb290c3RyYXAgMyBtb2RhbCBkaWFsb2cuXHJcbiAqIEB2ZXJzaW9uIDAuMC4xXHJcbiAqIEBob21lcGFnZSBodHRwczovL2dpdGh1Yi5jb20vZ2VvcmFwYm94L01pdGhyaWwtQm9vdHN0cmFwLU1vZGFsXHJcbiAqIEBhdXRob3IgR2VvcmdlIFJhcHRpcyAoaHR0cHM6Ly9naXRodWIuY29tL2dlb3JhcGJveClcclxuICpcclxuICogVGhlIE1JVCBMaWNlbnNlIChNSVQpXHJcbiAqXHJcbiAqIENvcHlyaWdodCAoYykgMjAxNSBHZW9yZ2UgUmFwdGlzXHJcbiAqXHJcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxyXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXHJcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcclxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXHJcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XHJcbiAqXHJcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxyXG4gKiBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxyXG4gKlxyXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxyXG4gKiBTT0ZUV0FSRS5cclxuICovXHJcbihmdW5jdGlvbiAobmFtZSwgY29udGV4dCwgZGVmaW5pdGlvbikge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcclxuICAgICAgICBkZWZpbmUoZGVmaW5pdGlvbik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnRleHRbbmFtZV0gPSBkZWZpbml0aW9uKCk7XHJcbiAgICB9XHJcbn0oJ01vZGFsJywgdGhpcywgZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIG1vZGFsIGluc3RhbmNlLlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIE1vZGFsKCkge1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICB2YXIgbW9kYWxDb25maWcgPSBmdW5jdGlvbiAoZWxlbWVudCwgaXNJbml0aWFsaXplZCwgY29udGV4dCkge1xyXG4gICAgICAgICAgICBpZiAoIWlzSW5pdGlhbGl6ZWQpIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZmFkZWluJyk7XHJcbiAgICAgICAgICAgICAgICB9LCA1MCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGhhbmRsZUtleSA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMjcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbS5zdGFydENvbXB1dGF0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtLmVuZENvbXB1dGF0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaGFuZGxlQ2xpY2tPdXRzaWRlID0gIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbW9kYWwnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtLnN0YXJ0Q29tcHV0YXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG0uZW5kQ29tcHV0YXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVLZXksIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVDbGlja091dHNpZGUsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm9udW5sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVDbGlja091dHNpZGUsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlS2V5LCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gR2V0dGVyIC8gU2V0dGVyIGZvciBtb2RhbCdzIHZpc2liaWxpdHkgc3RhdHVzLlxyXG4gICAgICAgIHRoaXMudmlzaWJsZSA9IG0ucHJvcChmYWxzZSk7XHJcblxyXG4gICAgICAgIC8vIFRoZSBtb2RhbCdzIHZpZXcuXHJcbiAgICAgICAgdGhpcy52aWV3ID0gZnVuY3Rpb24gKG9wdHMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaWJsZSgpID9cclxuICAgICAgICAgICAgICAgIG0oJy5tb2RhbCcsIHtjb25maWc6IG1vZGFsQ29uZmlnfSwgW1xyXG4gICAgICAgICAgICAgICAgICAgIG0oJy5tb2RhbC1kaWFsb2cnLCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG0oJy5tb2RhbC1jb250ZW50JywgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5oZWFkZXIgPyBtKCcubW9kYWwtaGVhZGVyJywgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oJ2EuY2xvc2UnLCB7b25jbGljazogdGhpcy5oaWRlLmJpbmQodGhpcyl9LCBtLnRydXN0KCcmdGltZXM7JykpLCBvcHRzLmhlYWRlcigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKSA6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5ib2R5ID8gbSgnLm1vZGFsLWJvZHknLCBvcHRzLmJvZHkoKSkgOiAnJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuZm9vdGVyID8gbSgnLm1vZGFsLWZvb3RlcicsIG9wdHMuZm9vdGVyKCkpIDogJydcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSlcclxuICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgXSkgOiAnJztcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBwcm90byA9IE1vZGFsLnByb3RvdHlwZTtcclxuXHJcbiAgICBwcm90by5zaG93ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMudmlzaWJsZSA9IG0ucHJvcCh0cnVlKTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ21vZGFsLW9wZW4nKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJvdG8uaGlkZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnZpc2libGUgPSBtLnByb3AoZmFsc2UpO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtb3BlbicpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcm90by5pc1Zpc2libGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmlzaWJsZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gTW9kYWw7XHJcbn0pKTtcclxuIiwiLyoqXHJcbiAqIE1haW4gbmF2aWdhdGlvbiBjb21wb25lbnQuXHJcbiAqIEByZXR1cm5zIHtvYmplY3R9IFRoZSBuYXYgbW9kdWxlLlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKGRvYykge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBuYXYgPSB7fTtcclxuXHJcbiAgICBuYXYudmlldyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gbSgndWwubmF2Lm5hdi10YWJzJywgW1xyXG4gICAgICAgICAgICBtKCdsaS5kYXNoYm9hcmQnLCBbXHJcbiAgICAgICAgICAgICAgICBtKCdhW2hyZWY9XCIvZGFzaGJvYXJkXCJdJywge2NvbmZpZzogbS5yb3V0ZX0sICdEYXNoYm9hcmQnKVxyXG4gICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgbSgnbGkuYWJvdXQnLCBbXHJcbiAgICAgICAgICAgICAgICBtKCdhW2hyZWY9XCIvYWJvdXRcIl0nLCB7Y29uZmlnOiBtLnJvdXRlfSwgJ0Fib3V0JylcclxuICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgIG0oJ2xpLmNvbnRhY3QnLCBbXHJcbiAgICAgICAgICAgICAgICBtKCdhW2hyZWY9XCIvY29udGFjdHNcIl0nLCB7Y29uZmlnOiBtLnJvdXRlfSwgJ0NvbnRhY3RzJylcclxuICAgICAgICAgICAgXSlcclxuICAgICAgICBdKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbS5yZW5kZXIoZG9jLmdldEVsZW1lbnRCeUlkKCdqc19uYXYnKSwgbmF2LnZpZXcoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufShkb2N1bWVudCkpO1xyXG4iLCIvKipcclxuICogQWJvdXQgcGFnZS5cclxuICogQHJldHVybnMge29iamVjdH0gVGhlIGFib3V0IG1vZHVsZS5cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgTW9kYWwgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL21vZGFsJyksXHJcbiAgICAgICAgYWJvdXRNb2RhbCA9IG5ldyBNb2RhbCgpO1xyXG5cclxuICAgIHZhciBhYm91dCA9IHt9O1xyXG5cclxuICAgIGFib3V0LmNvbnRyb2xsZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5vbnVubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYWJvdXRNb2RhbC5oaWRlKCk7XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcblxyXG4gICAgYWJvdXQudmlldyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gbSgnZGl2Lm0tcGFnZScsIFtcclxuICAgICAgICAgICAgbSgnaDInLCB7XHJcbiAgICAgICAgICAgICAgICBjb25maWc6IGFib3V0LnZtLmNsaWNrTWVcclxuICAgICAgICAgICAgfSwgbS50cnVzdCgnQWJvdXQgcGFnZSA8c3BhbiBzdHlsZT1cImZvbnQtc2l6ZToxNHB4O1wiPihjbGljayBtZSk8L3NwYW4+JykpLFxyXG5cclxuICAgICAgICAgICAgbSgncCcsICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gVGVtcG9yYSB2b2x1cHRhdGVtLCBzaW50IG5lY2Vzc2l0YXRpYnVzIGJlYXRhZSwgcGVyc3BpY2lhdGlzIGRlc2VydW50IHByYWVzZW50aXVtIGl1c3RvLCBkaXN0aW5jdGlvIGNvcnJ1cHRpLCBsYWJvcnVtIGN1cGlkaXRhdGUgdXQuIFZlcml0YXRpcyBlb3MgaXVyZSBldmVuaWV0LCBuaXNpLCBtb2xsaXRpYSBwYXJpYXR1ciB1bmRlPycpLFxyXG5cclxuICAgICAgICAgICAgbSgncCcsICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gVGVtcG9yYSB2b2x1cHRhdGVtLCBzaW50IG5lY2Vzc2l0YXRpYnVzIGJlYXRhZSwgcGVyc3BpY2lhdGlzIGRlc2VydW50IHByYWVzZW50aXVtIGl1c3RvLCBkaXN0aW5jdGlvIGNvcnJ1cHRpLCBsYWJvcnVtIGN1cGlkaXRhdGUgdXQuIFZlcml0YXRpcyBlb3MgaXVyZSBldmVuaWV0LCBuaXNpLCBtb2xsaXRpYSBwYXJpYXR1ciB1bmRlPycpLFxyXG5cclxuICAgICAgICAgICAgbSgncCcsICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gVGVtcG9yYSB2b2x1cHRhdGVtLCBzaW50IG5lY2Vzc2l0YXRpYnVzIGJlYXRhZSwgcGVyc3BpY2lhdGlzIGRlc2VydW50IHByYWVzZW50aXVtIGl1c3RvLCBkaXN0aW5jdGlvIGNvcnJ1cHRpLCBsYWJvcnVtIGN1cGlkaXRhdGUgdXQuIFZlcml0YXRpcyBlb3MgaXVyZSBldmVuaWV0LCBuaXNpLCBtb2xsaXRpYSBwYXJpYXR1ciB1bmRlPycpLFxyXG5cclxuICAgICAgICAgICAgbSgncCcsICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gVGVtcG9yYSB2b2x1cHRhdGVtLCBzaW50IG5lY2Vzc2l0YXRpYnVzIGJlYXRhZSwgcGVyc3BpY2lhdGlzIGRlc2VydW50IHByYWVzZW50aXVtIGl1c3RvLCBkaXN0aW5jdGlvIGNvcnJ1cHRpLCBsYWJvcnVtIGN1cGlkaXRhdGUgdXQuIFZlcml0YXRpcyBlb3MgaXVyZSBldmVuaWV0LCBuaXNpLCBtb2xsaXRpYSBwYXJpYXR1ciB1bmRlPycpLFxyXG5cclxuICAgICAgICAgICAgbSgnYS5idG4uYnRuLXByaW1hcnknLCB7XHJcbiAgICAgICAgICAgICAgICBvbmNsaWNrOiBhYm91dE1vZGFsLnNob3cuYmluZChhYm91dE1vZGFsKVxyXG4gICAgICAgICAgICB9LCAnU2hvdyBtb2RhbCcpLFxyXG5cclxuICAgICAgICAgICAgYWJvdXRNb2RhbC52aWV3KHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtKCdoNC5tb2RhbC10aXRsZScsICdMb3JlbSBpcHN1bScpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGJvZHk6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbSgncCcsICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gVGVtcG9yYSB2b2x1cHRhdGVtLCBzaW50IG5lY2Vzc2l0YXRpYnVzIGJlYXRhZSwgcGVyc3BpY2lhdGlzIGRlc2VydW50IHByYWVzZW50aXVtIGl1c3RvLCBkaXN0aW5jdGlvIGNvcnJ1cHRpLCBsYWJvcnVtIGN1cGlkaXRhdGUgdXQuIFZlcml0YXRpcyBlb3MgaXVyZSBldmVuaWV0LCBuaXNpLCBtb2xsaXRpYSBwYXJpYXR1ciB1bmRlPycpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZvb3RlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtKCdhLmJ0bi5idG4tZGVmYXVsdCcsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25jbGljazogYWJvdXRNb2RhbC5oaWRlLmJpbmQoYWJvdXRNb2RhbClcclxuICAgICAgICAgICAgICAgICAgICB9LCAnQ2xvc2UnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdKTtcclxuICAgIH07XHJcblxyXG4gICAgYWJvdXQudm0gPSB7XHJcbiAgICAgICAgY2xpY2tNZTogZnVuY3Rpb24gKGVsZW1lbnQsIGlzSW5pdGlhbGl6ZWQsIGNvbnRleHQsIHZkb20pIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gbG9nKCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2VsZW1lbnQ6JywgZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaXNJbml0aWFsaXplZDonLCBpc0luaXRpYWxpemVkKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjb250ZXh0OicsIGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3Zkb206JywgdmRvbSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICFpc0luaXRpYWxpemVkICYmIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBsb2csIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQub251bmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUmVtb3ZpbmcgZXZlbnQgbGlzdGVuZXIgZnJvbSAnICsgZWxlbWVudC5ub2RlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbG9nLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gYWJvdXQ7XHJcbn0oKSk7XHJcbiIsIi8qKlxyXG4gKiBDb250YWN0IHBhZ2UuXHJcbiAqIEByZXR1cm5zIHtvYmplY3R9IFRoZSBjb250YWN0IG1vZHVsZS5cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgUHViU3ViID0gcmVxdWlyZSgnLi4vLi4vbGliL3B1YnN1YicpLFxyXG4gICAgICAgIHBzID0gbmV3IFB1YlN1YigpO1xyXG5cclxuICAgIHZhciBNb2RhbCA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvbW9kYWwnKSxcclxuICAgICAgICBuZXdDb250YWN0TW9kYWwgPSBuZXcgTW9kYWwoKTtcclxuXHJcbiAgICAvLyBIYXJkY29kZWQgY29udGFjdHMgZGF0YVxyXG4gICAgdmFyIGNvbnRhY3RzRGF0YSA9IFt7XHJcbiAgICAgICAgdXNlcm5hbWU6ICdqb2huZG9lJyxcclxuICAgICAgICBuYW1lOiAnSm9obiBEb2UnLFxyXG4gICAgICAgIGVtYWlsOiAnam9obmRvZUBob3RtYWlsLmNvbSdcclxuICAgIH0sIHtcclxuICAgICAgICB1c2VybmFtZTogJ2dlb3JhcGJveCcsXHJcbiAgICAgICAgbmFtZTogJ0dlb3JnZSBSYXB0aXMnLFxyXG4gICAgICAgIGVtYWlsOiAnZ2VvcmFwYm94QGdtYWlsLmNvbSdcclxuICAgIH0sIHtcclxuICAgICAgICB1c2VybmFtZTogJ21hcnlsb3UnLFxyXG4gICAgICAgIG5hbWU6ICdNYXJ5IExvdScsXHJcbiAgICAgICAgZW1haWw6ICdtbG91QHlhaG9vLmNvbSdcclxuICAgIH0sIHtcclxuICAgICAgICB1c2VybmFtZTogJ3RkdW5jYW4nLFxyXG4gICAgICAgIG5hbWU6ICdUaW0gRHVuY2FuJyxcclxuICAgICAgICBlbWFpbDogJ3RkdW5jYW5AZ21haWwuY29tJ1xyXG4gICAgfV07XHJcblxyXG4gICAgLy8gQ29udGFjdCBtb2RlbFxyXG4gICAgdmFyIENvbnRhY3QgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgIGRhdGEgPSBkYXRhIHx8IHt9O1xyXG4gICAgICAgIHRoaXMuaWQgPSBtLnByb3AoZGF0YS5pZCk7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbS5wcm9wKGRhdGEubmFtZSk7XHJcbiAgICAgICAgdGhpcy5lbWFpbCA9IG0ucHJvcChkYXRhLmVtYWlsKTtcclxuICAgIH07XHJcblxyXG4gICAgQ29udGFjdC5saXN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8qcmV0dXJuIG0ucmVxdWVzdCh7XHJcblx0XHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHRcdHVybDogJy4uL2RhdGEvdXNlcnMuanNvbidcclxuXHRcdH0pOyovXHJcblxyXG4gICAgICAgIG0uc3RhcnRDb21wdXRhdGlvbigpO1xyXG5cclxuICAgICAgICB2YXIgZGVmZXJyZWQgPSBtLmRlZmVycmVkKCk7XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGNvbnRhY3RzRGF0YSk7XHJcbiAgICAgICAgICAgIG0uZW5kQ29tcHV0YXRpb24oKTtcclxuICAgICAgICB9LCAwKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIENvbnRhY3Quc2F2ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgLypyZXR1cm4gbS5yZXF1ZXN0KHtcclxuXHRcdFx0bWV0aG9kOiAnUE9TVCcsXHJcblx0XHRcdHVybDogJy4uL2RhdGEvdXNlcnMuanNvbicsXHJcblx0XHRcdGRhdGE6IGRhdGFcclxuXHRcdH0pOyovXHJcblxyXG4gICAgICAgIHZhciBkZWZlcnJlZCA9IG0uZGVmZXJyZWQoKTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBuZXdDb250YWN0ID0ge1xyXG4gICAgICAgICAgICAgICAgaWQ6IGNvbnRhY3RzRGF0YS5sZW5ndGggKyAxLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogZGF0YS5uYW1lKCksXHJcbiAgICAgICAgICAgICAgICBlbWFpbDogZGF0YS5lbWFpbCgpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBjb250YWN0c0RhdGEucHVzaChuZXdDb250YWN0KTtcclxuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShuZXdDb250YWN0KTtcclxuICAgICAgICB9LCAwKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIENvbnRhY3RGb3JtIGNvbXBvbmVudFxyXG4gICAgdmFyIENvbnRhY3RGb3JtID0ge1xyXG4gICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uIChhcmdzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGFjdCA9IG0ucHJvcChhcmdzLmNvbnRhY3QgfHwgbmV3IENvbnRhY3QoKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICB2aWV3OiBmdW5jdGlvbiAoY3RybCwgYXJncykge1xyXG4gICAgICAgICAgICB2YXIgY29udGFjdCA9IGN0cmwuY29udGFjdCgpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG0oJ2Zvcm0nLCBbXHJcbiAgICAgICAgICAgICAgICBtKCcuZm9ybS1ncm91cCcsIFtcclxuICAgICAgICAgICAgICAgICAgICBtKCdsYWJlbCcsICdOYW1lJyksXHJcbiAgICAgICAgICAgICAgICAgICAgbSgnaW5wdXQuZm9ybS1jb250cm9sJywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndGV4dCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAnZWc6IEdlb3JnZSBSYXB0aXMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbmlucHV0OiBtLndpdGhBdHRyKCd2YWx1ZScsIGNvbnRhY3QubmFtZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjb250YWN0Lm5hbWUoKSB8fCAnJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICBdKSxcclxuXHJcbiAgICAgICAgICAgICAgICBtKCcuZm9ybS1ncm91cCcsIFtcclxuICAgICAgICAgICAgICAgICAgICBtKCdsYWJlbCcsICdFbWFpbCcpLFxyXG4gICAgICAgICAgICAgICAgICAgIG0oJ2lucHV0LmZvcm0tY29udHJvbCcsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtYWlsJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6ICdlZzogZ2VvcmFwYm94QGdtYWlsLmNvbScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uaW5wdXQ6IG0ud2l0aEF0dHIoJ3ZhbHVlJywgY29udGFjdC5lbWFpbCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjb250YWN0LmVtYWlsKCkgfHwgJydcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgXSksXHJcblxyXG4gICAgICAgICAgICAgICAgbSgnYnV0dG9uW3R5cGU9YnV0dG9uXS5idG4uYnRuLXByaW1hcnknLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgb25jbGljazogYXJncy5vbnNhdmUuYmluZCh0aGlzLCBjb250YWN0KVxyXG4gICAgICAgICAgICAgICAgfSwgJ1NhdmUnKVxyXG4gICAgICAgICAgICBdKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIENvbnRhY3RMaXN0IGNvbXBvbmVudFxyXG4gICAgdmFyIENvbnRhY3RzTGlzdCA9IHtcclxuICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHBzLm9uKCdVUERBVEVfQ09OVEFDVCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnVVBEQVRFRCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHBzLnRvcGljcyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICB2aWV3OiBmdW5jdGlvbiAoY3RybCwgYXJncykge1xyXG4gICAgICAgICAgICB2YXIgZmFkZXNJbiA9IGZ1bmN0aW9uIChlbGVtZW50LCBpc0luaXRpYWxpemVkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzSW5pdGlhbGl6ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDUwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBtKCcudGFibGUtcmVzcG9uc2l2ZScsIFtcclxuICAgICAgICAgICAgICAgIG0oJ3RhYmxlLnRhYmxlLnRhYmxlLWJvcmRlcmVkJywgW1xyXG4gICAgICAgICAgICAgICAgICAgIG0oJ3RoZWFkJywgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtKCd0cicsIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oJ3RoJywgJyMnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oJ3RoJywgJ05hbWUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oJ3RoJywgJ0VtYWlsJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSlcclxuICAgICAgICAgICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgICAgICAgICBtKCd0Ym9keScsIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJncy5jb250YWN0cygpLm1hcChmdW5jdGlvbiAoY29udGFjdCwgaWR4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbSgndHIuY29udGFjdC1pdGVtJywge2tleTogY29udGFjdC5pZCwgY29uZmlnOiBmYWRlc0lufSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oJ3RoJywgKytpZHgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oJ3RkJywgY29udGFjdC5uYW1lKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKCd0ZCcsIGNvbnRhY3QuZW1haWwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgXSlcclxuICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBDb250YWN0c1dpZGdldCBjb21wb25lbnRcclxuICAgIC8vIENlbnRyYWxpemVkIG1vZHVsZSwgcmVzcG9uc2libGUgZm9yIGludGVyZmFjaW5nIHdpdGggdGhlIG1vZGVsIGxheWVyXHJcbiAgICB2YXIgQ29udGFjdHNXaWRnZXQgPSB7fTtcclxuXHJcbiAgICBDb250YWN0c1dpZGdldC5jb250cm9sbGVyID0gZnVuY3Rpb24gdXBkYXRlICgpIHtcclxuICAgICAgICB0aGlzLmNvbnRhY3RzID0gQ29udGFjdC5saXN0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2F2ZSA9IGZ1bmN0aW9uIChjb250YWN0KSB7XHJcbiAgICAgICAgICAgIENvbnRhY3QuXHJcbiAgICAgICAgICAgICAgICBzYXZlKGNvbnRhY3QpLlxyXG4gICAgICAgICAgICAgICAgdGhlbih1cGRhdGUuYmluZCh0aGlzKSkuXHJcbiAgICAgICAgICAgICAgICB0aGVuKG5ld0NvbnRhY3RNb2RhbC5oaWRlKCkpO1xyXG5cclxuICAgICAgICAgICAgcHMudHJpZ2dlcignVVBEQVRFX0NPTlRBQ1QnKTtcclxuICAgICAgICB9LmJpbmQodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMub251bmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDb250YWN0c1dpZGdldCB1bmxvYWRlZCAtLT4gVW5zdWJzY3JpYmUgZm9ybSBldmVudHMnKTtcclxuICAgICAgICAgICAgcHMub2ZmKCdVUERBVEVfQ09OVEFDVCcpO1xyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG5cclxuICAgIENvbnRhY3RzV2lkZ2V0LnZpZXcgPSBmdW5jdGlvbiAoY3RybCkge1xyXG4gICAgICAgIHJldHVybiBtKCdkaXYubS1wYWdlJywgW1xyXG4gICAgICAgICAgICBtKCdoMicsICdDb250YWN0cycpLFxyXG5cclxuICAgICAgICAgICAgbSgncC5wdWxsLXJpZ2h0JywgW1xyXG4gICAgICAgICAgICAgICAgbSgnYS5idG4uYnRuLXByaW1hcnknLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgb25jbGljazogbmV3Q29udGFjdE1vZGFsLnNob3cuYmluZChuZXdDb250YWN0TW9kYWwpXHJcbiAgICAgICAgICAgICAgICB9LCAnQWRkIG5ldyBjb250YWN0JylcclxuICAgICAgICAgICAgXSksXHJcblxyXG4gICAgICAgICAgICBtKCcuY2xlYXInKSxcclxuXHJcbiAgICAgICAgICAgIG5ld0NvbnRhY3RNb2RhbC52aWV3KHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtKCdoNC5tb2RhbC10aXRsZScsICdOZXcgY29udGFjdCcpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGJvZHk6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbS5jb21wb25lbnQoQ29udGFjdEZvcm0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25zYXZlOiBjdHJsLnNhdmVcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSksXHJcblxyXG4gICAgICAgICAgICBtLmNvbXBvbmVudChDb250YWN0c0xpc3QsIHtcclxuICAgICAgICAgICAgICAgIGNvbnRhY3RzOiBjdHJsLmNvbnRhY3RzXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgXSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBDb250YWN0c1dpZGdldDtcclxufSgpKTtcclxuIiwiLyoqXHJcbiAqIERhc2hib2FyZCBwYWdlLlxyXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBUaGUgZGFzaGJvYXJkIG1vZHVsZS5cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgVXNlciA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IG0ucHJvcChkYXRhLmlkKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSBtLnByb3AoZGF0YS5uYW1lKTtcclxuICAgICAgICB0aGlzLnVzZXJuYW1lID0gbS5wcm9wKGRhdGEudXNlcm5hbWUpO1xyXG4gICAgfTtcclxuXHJcbiAgICBVc2VyLmxpc3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG0ucmVxdWVzdCh7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgIHVybDogJy4uL2RhdGEvdXNlcnMuanNvbicsXHJcbiAgICAgICAgICAgIHR5cGU6IFVzZXJcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgVXNlci5saXN0RXZlbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gbS5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgdXJsOiAnLi4vZGF0YS91c2Vycy5qc29uJyxcclxuICAgICAgICAgICAgdHlwZTogVXNlclxyXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGxpc3QpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxpc3QuZmlsdGVyKGZ1bmN0aW9uICh1c2VyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdXNlci5pZCgpICUgMiA9PT0gMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBkYXNoYm9hcmQgPSB7fTtcclxuXHJcbiAgICBkYXNoYm9hcmQuY29udHJvbGxlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmlkID0gbS5yb3V0ZS5wYXJhbSgndXNlck5hbWUnKTtcclxuICAgICAgICB0aGlzLmVycm9yID0gbS5wcm9wKCdFUlJPUicpO1xyXG4gICAgICAgIHRoaXMudXNlcnMgPSBVc2VyLmxpc3QoKS50aGVuKGZ1bmN0aW9uICh1c2Vycykge1xyXG4gICAgICAgICAgICBkYXNoYm9hcmQudm0uaW5pdCh1c2Vycyk7XHJcbiAgICAgICAgfSwgdGhpcy5lcnJvcik7XHJcbiAgICB9O1xyXG5cclxuICAgIGRhc2hib2FyZC52bSA9IHtcclxuICAgICAgICBpbml0OiBmdW5jdGlvbiAodXNlcnMpIHtcclxuICAgICAgICAgICAgZGFzaGJvYXJkLnZtLnVzZXJzID0gdXNlcnM7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBkYXNoYm9hcmQudmlldyA9IGZ1bmN0aW9uIChjb250cm9sbGVyKSB7XHJcbiAgICAgICAgcmV0dXJuIG0oJ2Rpdi5tLXBhZ2UnLCBbXHJcbiAgICAgICAgICAgIG0oJ3VsJywgW1xyXG4gICAgICAgICAgICAgICAgZGFzaGJvYXJkLnZtLnVzZXJzLm1hcChmdW5jdGlvbiAodXNyLCBpZHgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbSgnbGknLCB7a2V5OiB1c3IuaWR9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG0oJ2FbaHJlZj1cIi9kYXNoYm9hcmQvJyArIHVzci51c2VybmFtZSgpICsgJ1wiXScsIHtjb25maWc6IG0ucm91dGV9LCB1c3IubmFtZSgpKVxyXG4gICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgIG0oJ2gyJywgY29udHJvbGxlci5pZCA/ICgnSGVsbG8gJyArIGNvbnRyb2xsZXIuaWQpIDogJ1RoaXMgaXMgdGhlIGRhc2hib2FyZC4nKSxcclxuICAgICAgICAgICAgbSgncCcsIHtzdHlsZTogY29udHJvbGxlci5pZCA/ICdkaXNwbGF5OmJsb2NrJyA6ICdkaXNwbGF5Om5vbmUnfSwgW1xyXG4gICAgICAgICAgICAgICAgbSgnYVtocmVmPVwiL3VzZXJwcm9maWxlLycgKyBjb250cm9sbGVyLmlkICsgJ1wiXScsIHtjb25maWc6IG0ucm91dGV9LCAnUmVhZCBtb3JlJylcclxuICAgICAgICAgICAgXSlcclxuICAgICAgICBdKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRhc2hib2FyZDtcclxufSgpKTtcclxuIiwiLyoqXHJcbiAqIFVzZXIgUHJvZmlsZSBwYWdlLlxyXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBUaGUgdXNlcnByb2ZpbGUgbW9kdWxlLlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBVc2VyID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICB0aGlzLmlkID0gbS5wcm9wKGRhdGEuaWQpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG0ucHJvcChkYXRhLm5hbWUpO1xyXG4gICAgICAgIHRoaXMudXNlcm5hbWUgPSBtLnByb3AoZGF0YS51c2VybmFtZSk7XHJcbiAgICAgICAgdGhpcy5lbWFpbCA9IG0ucHJvcChkYXRhLmVtYWlsKTtcclxuICAgIH07XHJcblxyXG4gICAgVXNlci5nZXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG0ucmVxdWVzdCh7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgIHVybDogJy4uL2RhdGEvdXNlcnMuanNvbicsXHJcbiAgICAgICAgICAgIHR5cGU6IFVzZXJcclxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChsaXN0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsaXN0LmZpbHRlcihmdW5jdGlvbiAodXNlcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVzZXIudXNlcm5hbWUoKSA9PT0gbS5yb3V0ZS5wYXJhbSgndXNlck5hbWUnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciB1c2VycHJvZmlsZSA9IHt9O1xyXG5cclxuICAgIHVzZXJwcm9maWxlLmNvbnRyb2xsZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IG0ucm91dGUucGFyYW0oJ3VzZXJOYW1lJyk7XHJcbiAgICAgICAgdGhpcy5lcnJvciA9IG0ucHJvcCgnRVJST1InKTtcclxuICAgICAgICB0aGlzLnVzZXIgPSBVc2VyLmdldCgpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcclxuICAgICAgICAgICAgdXNlcnByb2ZpbGUudm0uaW5pdCh1c2VyKTtcclxuICAgICAgICB9LCB0aGlzLmVycm9yKTtcclxuICAgIH07XHJcblxyXG4gICAgdXNlcnByb2ZpbGUudm0gPSB7XHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKHVzZXIpIHtcclxuICAgICAgICAgICAgdXNlcnByb2ZpbGUudm0udXNlciA9IHVzZXI7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB1c2VycHJvZmlsZS52aWV3ID0gZnVuY3Rpb24gKGNvbnRyb2xsZXIpIHtcclxuICAgICAgICByZXR1cm4gbSgnZGl2Lm0tcGFnZScsIFtcclxuICAgICAgICAgICAgdXNlcnByb2ZpbGUudm0udXNlci5tYXAoZnVuY3Rpb24gKHVzciwgaWR4KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbSgnZGl2JywgW1xyXG4gICAgICAgICAgICAgICAgICAgIG0oJ2gyJywgdXNyLm5hbWUoKSksXHJcbiAgICAgICAgICAgICAgICAgICAgbSgncCcsICdVc2VybmFtZTogJyArIHVzci51c2VybmFtZSgpKSxcclxuICAgICAgICAgICAgICAgICAgICBtKCdwJywgJ0VtYWlsOiAnICsgdXNyLmVtYWlsKCkpLFxyXG4gICAgICAgICAgICAgICAgICAgIG0oJ2FbaHJlZj1cImphdmFzY3JpcHQ6bS5yb3V0ZShcXCcvZGFzaGJvYXJkXFwnKVwiXScsICdCYWNrIHRvIERhc2hib2FyZCcpXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHVzZXJwcm9maWxlO1xyXG59KCkpO1xyXG4iLCI7KGZ1bmN0aW9uICgpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBwcmVzZXJ2ZSBGYXN0Q2xpY2s6IHBvbHlmaWxsIHRvIHJlbW92ZSBjbGljayBkZWxheXMgb24gYnJvd3NlcnMgd2l0aCB0b3VjaCBVSXMuXHJcblx0ICpcclxuXHQgKiBAY29kaW5nc3RhbmRhcmQgZnRsYWJzLWpzdjJcclxuXHQgKiBAY29weXJpZ2h0IFRoZSBGaW5hbmNpYWwgVGltZXMgTGltaXRlZCBbQWxsIFJpZ2h0cyBSZXNlcnZlZF1cclxuXHQgKiBAbGljZW5zZSBNSVQgTGljZW5zZSAoc2VlIExJQ0VOU0UudHh0KVxyXG5cdCAqL1xyXG5cclxuXHQvKmpzbGludCBicm93c2VyOnRydWUsIG5vZGU6dHJ1ZSovXHJcblx0LypnbG9iYWwgZGVmaW5lLCBFdmVudCwgTm9kZSovXHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBJbnN0YW50aWF0ZSBmYXN0LWNsaWNraW5nIGxpc3RlbmVycyBvbiB0aGUgc3BlY2lmaWVkIGxheWVyLlxyXG5cdCAqXHJcblx0ICogQGNvbnN0cnVjdG9yXHJcblx0ICogQHBhcmFtIHtFbGVtZW50fSBsYXllciBUaGUgbGF5ZXIgdG8gbGlzdGVuIG9uXHJcblx0ICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyB0byBvdmVycmlkZSB0aGUgZGVmYXVsdHNcclxuXHQgKi9cclxuXHRmdW5jdGlvbiBGYXN0Q2xpY2sobGF5ZXIsIG9wdGlvbnMpIHtcclxuXHRcdHZhciBvbGRPbkNsaWNrO1xyXG5cclxuXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogV2hldGhlciBhIGNsaWNrIGlzIGN1cnJlbnRseSBiZWluZyB0cmFja2VkLlxyXG5cdFx0ICpcclxuXHRcdCAqIEB0eXBlIGJvb2xlYW5cclxuXHRcdCAqL1xyXG5cdFx0dGhpcy50cmFja2luZ0NsaWNrID0gZmFsc2U7XHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogVGltZXN0YW1wIGZvciB3aGVuIGNsaWNrIHRyYWNraW5nIHN0YXJ0ZWQuXHJcblx0XHQgKlxyXG5cdFx0ICogQHR5cGUgbnVtYmVyXHJcblx0XHQgKi9cclxuXHRcdHRoaXMudHJhY2tpbmdDbGlja1N0YXJ0ID0gMDtcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBUaGUgZWxlbWVudCBiZWluZyB0cmFja2VkIGZvciBhIGNsaWNrLlxyXG5cdFx0ICpcclxuXHRcdCAqIEB0eXBlIEV2ZW50VGFyZ2V0XHJcblx0XHQgKi9cclxuXHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogWC1jb29yZGluYXRlIG9mIHRvdWNoIHN0YXJ0IGV2ZW50LlxyXG5cdFx0ICpcclxuXHRcdCAqIEB0eXBlIG51bWJlclxyXG5cdFx0ICovXHJcblx0XHR0aGlzLnRvdWNoU3RhcnRYID0gMDtcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBZLWNvb3JkaW5hdGUgb2YgdG91Y2ggc3RhcnQgZXZlbnQuXHJcblx0XHQgKlxyXG5cdFx0ICogQHR5cGUgbnVtYmVyXHJcblx0XHQgKi9cclxuXHRcdHRoaXMudG91Y2hTdGFydFkgPSAwO1xyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIElEIG9mIHRoZSBsYXN0IHRvdWNoLCByZXRyaWV2ZWQgZnJvbSBUb3VjaC5pZGVudGlmaWVyLlxyXG5cdFx0ICpcclxuXHRcdCAqIEB0eXBlIG51bWJlclxyXG5cdFx0ICovXHJcblx0XHR0aGlzLmxhc3RUb3VjaElkZW50aWZpZXIgPSAwO1xyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFRvdWNobW92ZSBib3VuZGFyeSwgYmV5b25kIHdoaWNoIGEgY2xpY2sgd2lsbCBiZSBjYW5jZWxsZWQuXHJcblx0XHQgKlxyXG5cdFx0ICogQHR5cGUgbnVtYmVyXHJcblx0XHQgKi9cclxuXHRcdHRoaXMudG91Y2hCb3VuZGFyeSA9IG9wdGlvbnMudG91Y2hCb3VuZGFyeSB8fCAxMDtcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBUaGUgRmFzdENsaWNrIGxheWVyLlxyXG5cdFx0ICpcclxuXHRcdCAqIEB0eXBlIEVsZW1lbnRcclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5sYXllciA9IGxheWVyO1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogVGhlIG1pbmltdW0gdGltZSBiZXR3ZWVuIHRhcCh0b3VjaHN0YXJ0IGFuZCB0b3VjaGVuZCkgZXZlbnRzXHJcblx0XHQgKlxyXG5cdFx0ICogQHR5cGUgbnVtYmVyXHJcblx0XHQgKi9cclxuXHRcdHRoaXMudGFwRGVsYXkgPSBvcHRpb25zLnRhcERlbGF5IHx8IDIwMDtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFRoZSBtYXhpbXVtIHRpbWUgZm9yIGEgdGFwXHJcblx0XHQgKlxyXG5cdFx0ICogQHR5cGUgbnVtYmVyXHJcblx0XHQgKi9cclxuXHRcdHRoaXMudGFwVGltZW91dCA9IG9wdGlvbnMudGFwVGltZW91dCB8fCA3MDA7XHJcblxyXG5cdFx0aWYgKEZhc3RDbGljay5ub3ROZWVkZWQobGF5ZXIpKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBTb21lIG9sZCB2ZXJzaW9ucyBvZiBBbmRyb2lkIGRvbid0IGhhdmUgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRcclxuXHRcdGZ1bmN0aW9uIGJpbmQobWV0aG9kLCBjb250ZXh0KSB7XHJcblx0XHRcdHJldHVybiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ldGhvZC5hcHBseShjb250ZXh0LCBhcmd1bWVudHMpOyB9O1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHR2YXIgbWV0aG9kcyA9IFsnb25Nb3VzZScsICdvbkNsaWNrJywgJ29uVG91Y2hTdGFydCcsICdvblRvdWNoTW92ZScsICdvblRvdWNoRW5kJywgJ29uVG91Y2hDYW5jZWwnXTtcclxuXHRcdHZhciBjb250ZXh0ID0gdGhpcztcclxuXHRcdGZvciAodmFyIGkgPSAwLCBsID0gbWV0aG9kcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuXHRcdFx0Y29udGV4dFttZXRob2RzW2ldXSA9IGJpbmQoY29udGV4dFttZXRob2RzW2ldXSwgY29udGV4dCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU2V0IHVwIGV2ZW50IGhhbmRsZXJzIGFzIHJlcXVpcmVkXHJcblx0XHRpZiAoZGV2aWNlSXNBbmRyb2lkKSB7XHJcblx0XHRcdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIHRoaXMub25Nb3VzZSwgdHJ1ZSk7XHJcblx0XHRcdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMub25Nb3VzZSwgdHJ1ZSk7XHJcblx0XHRcdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm9uTW91c2UsIHRydWUpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbkNsaWNrLCB0cnVlKTtcclxuXHRcdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLm9uVG91Y2hTdGFydCwgZmFsc2UpO1xyXG5cdFx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vblRvdWNoTW92ZSwgZmFsc2UpO1xyXG5cdFx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLm9uVG91Y2hFbmQsIGZhbHNlKTtcclxuXHRcdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5vblRvdWNoQ2FuY2VsLCBmYWxzZSk7XHJcblxyXG5cdFx0Ly8gSGFjayBpcyByZXF1aXJlZCBmb3IgYnJvd3NlcnMgdGhhdCBkb24ndCBzdXBwb3J0IEV2ZW50I3N0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiAoZS5nLiBBbmRyb2lkIDIpXHJcblx0XHQvLyB3aGljaCBpcyBob3cgRmFzdENsaWNrIG5vcm1hbGx5IHN0b3BzIGNsaWNrIGV2ZW50cyBidWJibGluZyB0byBjYWxsYmFja3MgcmVnaXN0ZXJlZCBvbiB0aGUgRmFzdENsaWNrXHJcblx0XHQvLyBsYXllciB3aGVuIHRoZXkgYXJlIGNhbmNlbGxlZC5cclxuXHRcdGlmICghRXZlbnQucHJvdG90eXBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbikge1xyXG5cdFx0XHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgY2FsbGJhY2ssIGNhcHR1cmUpIHtcclxuXHRcdFx0XHR2YXIgcm12ID0gTm9kZS5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lcjtcclxuXHRcdFx0XHRpZiAodHlwZSA9PT0gJ2NsaWNrJykge1xyXG5cdFx0XHRcdFx0cm12LmNhbGwobGF5ZXIsIHR5cGUsIGNhbGxiYWNrLmhpamFja2VkIHx8IGNhbGxiYWNrLCBjYXB0dXJlKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cm12LmNhbGwobGF5ZXIsIHR5cGUsIGNhbGxiYWNrLCBjYXB0dXJlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRsYXllci5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgY2FsbGJhY2ssIGNhcHR1cmUpIHtcclxuXHRcdFx0XHR2YXIgYWR2ID0gTm9kZS5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcjtcclxuXHRcdFx0XHRpZiAodHlwZSA9PT0gJ2NsaWNrJykge1xyXG5cdFx0XHRcdFx0YWR2LmNhbGwobGF5ZXIsIHR5cGUsIGNhbGxiYWNrLmhpamFja2VkIHx8IChjYWxsYmFjay5oaWphY2tlZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRcdFx0XHRcdGlmICghZXZlbnQucHJvcGFnYXRpb25TdG9wcGVkKSB7XHJcblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2soZXZlbnQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KSwgY2FwdHVyZSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGFkdi5jYWxsKGxheWVyLCB0eXBlLCBjYWxsYmFjaywgY2FwdHVyZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIElmIGEgaGFuZGxlciBpcyBhbHJlYWR5IGRlY2xhcmVkIGluIHRoZSBlbGVtZW50J3Mgb25jbGljayBhdHRyaWJ1dGUsIGl0IHdpbGwgYmUgZmlyZWQgYmVmb3JlXHJcblx0XHQvLyBGYXN0Q2xpY2sncyBvbkNsaWNrIGhhbmRsZXIuIEZpeCB0aGlzIGJ5IHB1bGxpbmcgb3V0IHRoZSB1c2VyLWRlZmluZWQgaGFuZGxlciBmdW5jdGlvbiBhbmRcclxuXHRcdC8vIGFkZGluZyBpdCBhcyBsaXN0ZW5lci5cclxuXHRcdGlmICh0eXBlb2YgbGF5ZXIub25jbGljayA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cclxuXHRcdFx0Ly8gQW5kcm9pZCBicm93c2VyIG9uIGF0IGxlYXN0IDMuMiByZXF1aXJlcyBhIG5ldyByZWZlcmVuY2UgdG8gdGhlIGZ1bmN0aW9uIGluIGxheWVyLm9uY2xpY2tcclxuXHRcdFx0Ly8gLSB0aGUgb2xkIG9uZSB3b24ndCB3b3JrIGlmIHBhc3NlZCB0byBhZGRFdmVudExpc3RlbmVyIGRpcmVjdGx5LlxyXG5cdFx0XHRvbGRPbkNsaWNrID0gbGF5ZXIub25jbGljaztcclxuXHRcdFx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0XHRcdG9sZE9uQ2xpY2soZXZlbnQpO1xyXG5cdFx0XHR9LCBmYWxzZSk7XHJcblx0XHRcdGxheWVyLm9uY2xpY2sgPSBudWxsO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0KiBXaW5kb3dzIFBob25lIDguMSBmYWtlcyB1c2VyIGFnZW50IHN0cmluZyB0byBsb29rIGxpa2UgQW5kcm9pZCBhbmQgaVBob25lLlxyXG5cdCpcclxuXHQqIEB0eXBlIGJvb2xlYW5cclxuXHQqL1xyXG5cdHZhciBkZXZpY2VJc1dpbmRvd3NQaG9uZSA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIldpbmRvd3MgUGhvbmVcIikgPj0gMDtcclxuXHJcblx0LyoqXHJcblx0ICogQW5kcm9pZCByZXF1aXJlcyBleGNlcHRpb25zLlxyXG5cdCAqXHJcblx0ICogQHR5cGUgYm9vbGVhblxyXG5cdCAqL1xyXG5cdHZhciBkZXZpY2VJc0FuZHJvaWQgPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ0FuZHJvaWQnKSA+IDAgJiYgIWRldmljZUlzV2luZG93c1Bob25lO1xyXG5cclxuXHJcblx0LyoqXHJcblx0ICogaU9TIHJlcXVpcmVzIGV4Y2VwdGlvbnMuXHJcblx0ICpcclxuXHQgKiBAdHlwZSBib29sZWFuXHJcblx0ICovXHJcblx0dmFyIGRldmljZUlzSU9TID0gL2lQKGFkfGhvbmV8b2QpLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpICYmICFkZXZpY2VJc1dpbmRvd3NQaG9uZTtcclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIGlPUyA0IHJlcXVpcmVzIGFuIGV4Y2VwdGlvbiBmb3Igc2VsZWN0IGVsZW1lbnRzLlxyXG5cdCAqXHJcblx0ICogQHR5cGUgYm9vbGVhblxyXG5cdCAqL1xyXG5cdHZhciBkZXZpY2VJc0lPUzQgPSBkZXZpY2VJc0lPUyAmJiAoL09TIDRfXFxkKF9cXGQpPy8pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBpT1MgNi4wLTcuKiByZXF1aXJlcyB0aGUgdGFyZ2V0IGVsZW1lbnQgdG8gYmUgbWFudWFsbHkgZGVyaXZlZFxyXG5cdCAqXHJcblx0ICogQHR5cGUgYm9vbGVhblxyXG5cdCAqL1xyXG5cdHZhciBkZXZpY2VJc0lPU1dpdGhCYWRUYXJnZXQgPSBkZXZpY2VJc0lPUyAmJiAoL09TIFs2LTddX1xcZC8pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XHJcblxyXG5cdC8qKlxyXG5cdCAqIEJsYWNrQmVycnkgcmVxdWlyZXMgZXhjZXB0aW9ucy5cclxuXHQgKlxyXG5cdCAqIEB0eXBlIGJvb2xlYW5cclxuXHQgKi9cclxuXHR2YXIgZGV2aWNlSXNCbGFja0JlcnJ5MTAgPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ0JCMTAnKSA+IDA7XHJcblxyXG5cdC8qKlxyXG5cdCAqIERldGVybWluZSB3aGV0aGVyIGEgZ2l2ZW4gZWxlbWVudCByZXF1aXJlcyBhIG5hdGl2ZSBjbGljay5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB7RXZlbnRUYXJnZXR8RWxlbWVudH0gdGFyZ2V0IFRhcmdldCBET00gZWxlbWVudFxyXG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIHRydWUgaWYgdGhlIGVsZW1lbnQgbmVlZHMgYSBuYXRpdmUgY2xpY2tcclxuXHQgKi9cclxuXHRGYXN0Q2xpY2sucHJvdG90eXBlLm5lZWRzQ2xpY2sgPSBmdW5jdGlvbih0YXJnZXQpIHtcclxuXHRcdHN3aXRjaCAodGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpIHtcclxuXHJcblx0XHQvLyBEb24ndCBzZW5kIGEgc3ludGhldGljIGNsaWNrIHRvIGRpc2FibGVkIGlucHV0cyAoaXNzdWUgIzYyKVxyXG5cdFx0Y2FzZSAnYnV0dG9uJzpcclxuXHRcdGNhc2UgJ3NlbGVjdCc6XHJcblx0XHRjYXNlICd0ZXh0YXJlYSc6XHJcblx0XHRcdGlmICh0YXJnZXQuZGlzYWJsZWQpIHtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlICdpbnB1dCc6XHJcblxyXG5cdFx0XHQvLyBGaWxlIGlucHV0cyBuZWVkIHJlYWwgY2xpY2tzIG9uIGlPUyA2IGR1ZSB0byBhIGJyb3dzZXIgYnVnIChpc3N1ZSAjNjgpXHJcblx0XHRcdGlmICgoZGV2aWNlSXNJT1MgJiYgdGFyZ2V0LnR5cGUgPT09ICdmaWxlJykgfHwgdGFyZ2V0LmRpc2FibGVkKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAnbGFiZWwnOlxyXG5cdFx0Y2FzZSAnaWZyYW1lJzogLy8gaU9TOCBob21lc2NyZWVuIGFwcHMgY2FuIHByZXZlbnQgZXZlbnRzIGJ1YmJsaW5nIGludG8gZnJhbWVzXHJcblx0XHRjYXNlICd2aWRlbyc6XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoL1xcYm5lZWRzY2xpY2tcXGIvKS50ZXN0KHRhcmdldC5jbGFzc05hbWUpO1xyXG5cdH07XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBEZXRlcm1pbmUgd2hldGhlciBhIGdpdmVuIGVsZW1lbnQgcmVxdWlyZXMgYSBjYWxsIHRvIGZvY3VzIHRvIHNpbXVsYXRlIGNsaWNrIGludG8gZWxlbWVudC5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB7RXZlbnRUYXJnZXR8RWxlbWVudH0gdGFyZ2V0IFRhcmdldCBET00gZWxlbWVudFxyXG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIHRydWUgaWYgdGhlIGVsZW1lbnQgcmVxdWlyZXMgYSBjYWxsIHRvIGZvY3VzIHRvIHNpbXVsYXRlIG5hdGl2ZSBjbGljay5cclxuXHQgKi9cclxuXHRGYXN0Q2xpY2sucHJvdG90eXBlLm5lZWRzRm9jdXMgPSBmdW5jdGlvbih0YXJnZXQpIHtcclxuXHRcdHN3aXRjaCAodGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpIHtcclxuXHRcdGNhc2UgJ3RleHRhcmVhJzpcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRjYXNlICdzZWxlY3QnOlxyXG5cdFx0XHRyZXR1cm4gIWRldmljZUlzQW5kcm9pZDtcclxuXHRcdGNhc2UgJ2lucHV0JzpcclxuXHRcdFx0c3dpdGNoICh0YXJnZXQudHlwZSkge1xyXG5cdFx0XHRjYXNlICdidXR0b24nOlxyXG5cdFx0XHRjYXNlICdjaGVja2JveCc6XHJcblx0XHRcdGNhc2UgJ2ZpbGUnOlxyXG5cdFx0XHRjYXNlICdpbWFnZSc6XHJcblx0XHRcdGNhc2UgJ3JhZGlvJzpcclxuXHRcdFx0Y2FzZSAnc3VibWl0JzpcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIE5vIHBvaW50IGluIGF0dGVtcHRpbmcgdG8gZm9jdXMgZGlzYWJsZWQgaW5wdXRzXHJcblx0XHRcdHJldHVybiAhdGFyZ2V0LmRpc2FibGVkICYmICF0YXJnZXQucmVhZE9ubHk7XHJcblx0XHRkZWZhdWx0OlxyXG5cdFx0XHRyZXR1cm4gKC9cXGJuZWVkc2ZvY3VzXFxiLykudGVzdCh0YXJnZXQuY2xhc3NOYW1lKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHJcblx0LyoqXHJcblx0ICogU2VuZCBhIGNsaWNrIGV2ZW50IHRvIHRoZSBzcGVjaWZpZWQgZWxlbWVudC5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB7RXZlbnRUYXJnZXR8RWxlbWVudH0gdGFyZ2V0RWxlbWVudFxyXG5cdCAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XHJcblx0ICovXHJcblx0RmFzdENsaWNrLnByb3RvdHlwZS5zZW5kQ2xpY2sgPSBmdW5jdGlvbih0YXJnZXRFbGVtZW50LCBldmVudCkge1xyXG5cdFx0dmFyIGNsaWNrRXZlbnQsIHRvdWNoO1xyXG5cclxuXHRcdC8vIE9uIHNvbWUgQW5kcm9pZCBkZXZpY2VzIGFjdGl2ZUVsZW1lbnQgbmVlZHMgdG8gYmUgYmx1cnJlZCBvdGhlcndpc2UgdGhlIHN5bnRoZXRpYyBjbGljayB3aWxsIGhhdmUgbm8gZWZmZWN0ICgjMjQpXHJcblx0XHRpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSB0YXJnZXRFbGVtZW50KSB7XHJcblx0XHRcdGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1cigpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRvdWNoID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF07XHJcblxyXG5cdFx0Ly8gU3ludGhlc2lzZSBhIGNsaWNrIGV2ZW50LCB3aXRoIGFuIGV4dHJhIGF0dHJpYnV0ZSBzbyBpdCBjYW4gYmUgdHJhY2tlZFxyXG5cdFx0Y2xpY2tFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdNb3VzZUV2ZW50cycpO1xyXG5cdFx0Y2xpY2tFdmVudC5pbml0TW91c2VFdmVudCh0aGlzLmRldGVybWluZUV2ZW50VHlwZSh0YXJnZXRFbGVtZW50KSwgdHJ1ZSwgdHJ1ZSwgd2luZG93LCAxLCB0b3VjaC5zY3JlZW5YLCB0b3VjaC5zY3JlZW5ZLCB0b3VjaC5jbGllbnRYLCB0b3VjaC5jbGllbnRZLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgMCwgbnVsbCk7XHJcblx0XHRjbGlja0V2ZW50LmZvcndhcmRlZFRvdWNoRXZlbnQgPSB0cnVlO1xyXG5cdFx0dGFyZ2V0RWxlbWVudC5kaXNwYXRjaEV2ZW50KGNsaWNrRXZlbnQpO1xyXG5cdH07XHJcblxyXG5cdEZhc3RDbGljay5wcm90b3R5cGUuZGV0ZXJtaW5lRXZlbnRUeXBlID0gZnVuY3Rpb24odGFyZ2V0RWxlbWVudCkge1xyXG5cclxuXHRcdC8vSXNzdWUgIzE1OTogQW5kcm9pZCBDaHJvbWUgU2VsZWN0IEJveCBkb2VzIG5vdCBvcGVuIHdpdGggYSBzeW50aGV0aWMgY2xpY2sgZXZlbnRcclxuXHRcdGlmIChkZXZpY2VJc0FuZHJvaWQgJiYgdGFyZ2V0RWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzZWxlY3QnKSB7XHJcblx0XHRcdHJldHVybiAnbW91c2Vkb3duJztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gJ2NsaWNrJztcclxuXHR9O1xyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQHBhcmFtIHtFdmVudFRhcmdldHxFbGVtZW50fSB0YXJnZXRFbGVtZW50XHJcblx0ICovXHJcblx0RmFzdENsaWNrLnByb3RvdHlwZS5mb2N1cyA9IGZ1bmN0aW9uKHRhcmdldEVsZW1lbnQpIHtcclxuXHRcdHZhciBsZW5ndGg7XHJcblxyXG5cdFx0Ly8gSXNzdWUgIzE2MDogb24gaU9TIDcsIHNvbWUgaW5wdXQgZWxlbWVudHMgKGUuZy4gZGF0ZSBkYXRldGltZSBtb250aCkgdGhyb3cgYSB2YWd1ZSBUeXBlRXJyb3Igb24gc2V0U2VsZWN0aW9uUmFuZ2UuIFRoZXNlIGVsZW1lbnRzIGRvbid0IGhhdmUgYW4gaW50ZWdlciB2YWx1ZSBmb3IgdGhlIHNlbGVjdGlvblN0YXJ0IGFuZCBzZWxlY3Rpb25FbmQgcHJvcGVydGllcywgYnV0IHVuZm9ydHVuYXRlbHkgdGhhdCBjYW4ndCBiZSB1c2VkIGZvciBkZXRlY3Rpb24gYmVjYXVzZSBhY2Nlc3NpbmcgdGhlIHByb3BlcnRpZXMgYWxzbyB0aHJvd3MgYSBUeXBlRXJyb3IuIEp1c3QgY2hlY2sgdGhlIHR5cGUgaW5zdGVhZC4gRmlsZWQgYXMgQXBwbGUgYnVnICMxNTEyMjcyNC5cclxuXHRcdGlmIChkZXZpY2VJc0lPUyAmJiB0YXJnZXRFbGVtZW50LnNldFNlbGVjdGlvblJhbmdlICYmIHRhcmdldEVsZW1lbnQudHlwZS5pbmRleE9mKCdkYXRlJykgIT09IDAgJiYgdGFyZ2V0RWxlbWVudC50eXBlICE9PSAndGltZScgJiYgdGFyZ2V0RWxlbWVudC50eXBlICE9PSAnbW9udGgnKSB7XHJcblx0XHRcdGxlbmd0aCA9IHRhcmdldEVsZW1lbnQudmFsdWUubGVuZ3RoO1xyXG5cdFx0XHR0YXJnZXRFbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKGxlbmd0aCwgbGVuZ3RoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRhcmdldEVsZW1lbnQuZm9jdXMoKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQ2hlY2sgd2hldGhlciB0aGUgZ2l2ZW4gdGFyZ2V0IGVsZW1lbnQgaXMgYSBjaGlsZCBvZiBhIHNjcm9sbGFibGUgbGF5ZXIgYW5kIGlmIHNvLCBzZXQgYSBmbGFnIG9uIGl0LlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtFdmVudFRhcmdldHxFbGVtZW50fSB0YXJnZXRFbGVtZW50XHJcblx0ICovXHJcblx0RmFzdENsaWNrLnByb3RvdHlwZS51cGRhdGVTY3JvbGxQYXJlbnQgPSBmdW5jdGlvbih0YXJnZXRFbGVtZW50KSB7XHJcblx0XHR2YXIgc2Nyb2xsUGFyZW50LCBwYXJlbnRFbGVtZW50O1xyXG5cclxuXHRcdHNjcm9sbFBhcmVudCA9IHRhcmdldEVsZW1lbnQuZmFzdENsaWNrU2Nyb2xsUGFyZW50O1xyXG5cclxuXHRcdC8vIEF0dGVtcHQgdG8gZGlzY292ZXIgd2hldGhlciB0aGUgdGFyZ2V0IGVsZW1lbnQgaXMgY29udGFpbmVkIHdpdGhpbiBhIHNjcm9sbGFibGUgbGF5ZXIuIFJlLWNoZWNrIGlmIHRoZVxyXG5cdFx0Ly8gdGFyZ2V0IGVsZW1lbnQgd2FzIG1vdmVkIHRvIGFub3RoZXIgcGFyZW50LlxyXG5cdFx0aWYgKCFzY3JvbGxQYXJlbnQgfHwgIXNjcm9sbFBhcmVudC5jb250YWlucyh0YXJnZXRFbGVtZW50KSkge1xyXG5cdFx0XHRwYXJlbnRFbGVtZW50ID0gdGFyZ2V0RWxlbWVudDtcclxuXHRcdFx0ZG8ge1xyXG5cdFx0XHRcdGlmIChwYXJlbnRFbGVtZW50LnNjcm9sbEhlaWdodCA+IHBhcmVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0KSB7XHJcblx0XHRcdFx0XHRzY3JvbGxQYXJlbnQgPSBwYXJlbnRFbGVtZW50O1xyXG5cdFx0XHRcdFx0dGFyZ2V0RWxlbWVudC5mYXN0Q2xpY2tTY3JvbGxQYXJlbnQgPSBwYXJlbnRFbGVtZW50O1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRwYXJlbnRFbGVtZW50ID0gcGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG5cdFx0XHR9IHdoaWxlIChwYXJlbnRFbGVtZW50KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBBbHdheXMgdXBkYXRlIHRoZSBzY3JvbGwgdG9wIHRyYWNrZXIgaWYgcG9zc2libGUuXHJcblx0XHRpZiAoc2Nyb2xsUGFyZW50KSB7XHJcblx0XHRcdHNjcm9sbFBhcmVudC5mYXN0Q2xpY2tMYXN0U2Nyb2xsVG9wID0gc2Nyb2xsUGFyZW50LnNjcm9sbFRvcDtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQHBhcmFtIHtFdmVudFRhcmdldH0gdGFyZ2V0RWxlbWVudFxyXG5cdCAqIEByZXR1cm5zIHtFbGVtZW50fEV2ZW50VGFyZ2V0fVxyXG5cdCAqL1xyXG5cdEZhc3RDbGljay5wcm90b3R5cGUuZ2V0VGFyZ2V0RWxlbWVudEZyb21FdmVudFRhcmdldCA9IGZ1bmN0aW9uKGV2ZW50VGFyZ2V0KSB7XHJcblxyXG5cdFx0Ly8gT24gc29tZSBvbGRlciBicm93c2VycyAobm90YWJseSBTYWZhcmkgb24gaU9TIDQuMSAtIHNlZSBpc3N1ZSAjNTYpIHRoZSBldmVudCB0YXJnZXQgbWF5IGJlIGEgdGV4dCBub2RlLlxyXG5cdFx0aWYgKGV2ZW50VGFyZ2V0Lm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSkge1xyXG5cdFx0XHRyZXR1cm4gZXZlbnRUYXJnZXQucGFyZW50Tm9kZTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZXZlbnRUYXJnZXQ7XHJcblx0fTtcclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIE9uIHRvdWNoIHN0YXJ0LCByZWNvcmQgdGhlIHBvc2l0aW9uIGFuZCBzY3JvbGwgb2Zmc2V0LlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtFdmVudH0gZXZlbnRcclxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuXHQgKi9cclxuXHRGYXN0Q2xpY2sucHJvdG90eXBlLm9uVG91Y2hTdGFydCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHR2YXIgdGFyZ2V0RWxlbWVudCwgdG91Y2gsIHNlbGVjdGlvbjtcclxuXHJcblx0XHQvLyBJZ25vcmUgbXVsdGlwbGUgdG91Y2hlcywgb3RoZXJ3aXNlIHBpbmNoLXRvLXpvb20gaXMgcHJldmVudGVkIGlmIGJvdGggZmluZ2VycyBhcmUgb24gdGhlIEZhc3RDbGljayBlbGVtZW50IChpc3N1ZSAjMTExKS5cclxuXHRcdGlmIChldmVudC50YXJnZXRUb3VjaGVzLmxlbmd0aCA+IDEpIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0dGFyZ2V0RWxlbWVudCA9IHRoaXMuZ2V0VGFyZ2V0RWxlbWVudEZyb21FdmVudFRhcmdldChldmVudC50YXJnZXQpO1xyXG5cdFx0dG91Y2ggPSBldmVudC50YXJnZXRUb3VjaGVzWzBdO1xyXG5cclxuXHRcdGlmIChkZXZpY2VJc0lPUykge1xyXG5cclxuXHRcdFx0Ly8gT25seSB0cnVzdGVkIGV2ZW50cyB3aWxsIGRlc2VsZWN0IHRleHQgb24gaU9TIChpc3N1ZSAjNDkpXHJcblx0XHRcdHNlbGVjdGlvbiA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcclxuXHRcdFx0aWYgKHNlbGVjdGlvbi5yYW5nZUNvdW50ICYmICFzZWxlY3Rpb24uaXNDb2xsYXBzZWQpIHtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCFkZXZpY2VJc0lPUzQpIHtcclxuXHJcblx0XHRcdFx0Ly8gV2VpcmQgdGhpbmdzIGhhcHBlbiBvbiBpT1Mgd2hlbiBhbiBhbGVydCBvciBjb25maXJtIGRpYWxvZyBpcyBvcGVuZWQgZnJvbSBhIGNsaWNrIGV2ZW50IGNhbGxiYWNrIChpc3N1ZSAjMjMpOlxyXG5cdFx0XHRcdC8vIHdoZW4gdGhlIHVzZXIgbmV4dCB0YXBzIGFueXdoZXJlIGVsc2Ugb24gdGhlIHBhZ2UsIG5ldyB0b3VjaHN0YXJ0IGFuZCB0b3VjaGVuZCBldmVudHMgYXJlIGRpc3BhdGNoZWRcclxuXHRcdFx0XHQvLyB3aXRoIHRoZSBzYW1lIGlkZW50aWZpZXIgYXMgdGhlIHRvdWNoIGV2ZW50IHRoYXQgcHJldmlvdXNseSB0cmlnZ2VyZWQgdGhlIGNsaWNrIHRoYXQgdHJpZ2dlcmVkIHRoZSBhbGVydC5cclxuXHRcdFx0XHQvLyBTYWRseSwgdGhlcmUgaXMgYW4gaXNzdWUgb24gaU9TIDQgdGhhdCBjYXVzZXMgc29tZSBub3JtYWwgdG91Y2ggZXZlbnRzIHRvIGhhdmUgdGhlIHNhbWUgaWRlbnRpZmllciBhcyBhblxyXG5cdFx0XHRcdC8vIGltbWVkaWF0ZWx5IHByZWNlZWRpbmcgdG91Y2ggZXZlbnQgKGlzc3VlICM1MiksIHNvIHRoaXMgZml4IGlzIHVuYXZhaWxhYmxlIG9uIHRoYXQgcGxhdGZvcm0uXHJcblx0XHRcdFx0Ly8gSXNzdWUgMTIwOiB0b3VjaC5pZGVudGlmaWVyIGlzIDAgd2hlbiBDaHJvbWUgZGV2IHRvb2xzICdFbXVsYXRlIHRvdWNoIGV2ZW50cycgaXMgc2V0IHdpdGggYW4gaU9TIGRldmljZSBVQSBzdHJpbmcsXHJcblx0XHRcdFx0Ly8gd2hpY2ggY2F1c2VzIGFsbCB0b3VjaCBldmVudHMgdG8gYmUgaWdub3JlZC4gQXMgdGhpcyBibG9jayBvbmx5IGFwcGxpZXMgdG8gaU9TLCBhbmQgaU9TIGlkZW50aWZpZXJzIGFyZSBhbHdheXMgbG9uZyxcclxuXHRcdFx0XHQvLyByYW5kb20gaW50ZWdlcnMsIGl0J3Mgc2FmZSB0byB0byBjb250aW51ZSBpZiB0aGUgaWRlbnRpZmllciBpcyAwIGhlcmUuXHJcblx0XHRcdFx0aWYgKHRvdWNoLmlkZW50aWZpZXIgJiYgdG91Y2guaWRlbnRpZmllciA9PT0gdGhpcy5sYXN0VG91Y2hJZGVudGlmaWVyKSB7XHJcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5sYXN0VG91Y2hJZGVudGlmaWVyID0gdG91Y2guaWRlbnRpZmllcjtcclxuXHJcblx0XHRcdFx0Ly8gSWYgdGhlIHRhcmdldCBlbGVtZW50IGlzIGEgY2hpbGQgb2YgYSBzY3JvbGxhYmxlIGxheWVyICh1c2luZyAtd2Via2l0LW92ZXJmbG93LXNjcm9sbGluZzogdG91Y2gpIGFuZDpcclxuXHRcdFx0XHQvLyAxKSB0aGUgdXNlciBkb2VzIGEgZmxpbmcgc2Nyb2xsIG9uIHRoZSBzY3JvbGxhYmxlIGxheWVyXHJcblx0XHRcdFx0Ly8gMikgdGhlIHVzZXIgc3RvcHMgdGhlIGZsaW5nIHNjcm9sbCB3aXRoIGFub3RoZXIgdGFwXHJcblx0XHRcdFx0Ly8gdGhlbiB0aGUgZXZlbnQudGFyZ2V0IG9mIHRoZSBsYXN0ICd0b3VjaGVuZCcgZXZlbnQgd2lsbCBiZSB0aGUgZWxlbWVudCB0aGF0IHdhcyB1bmRlciB0aGUgdXNlcidzIGZpbmdlclxyXG5cdFx0XHRcdC8vIHdoZW4gdGhlIGZsaW5nIHNjcm9sbCB3YXMgc3RhcnRlZCwgY2F1c2luZyBGYXN0Q2xpY2sgdG8gc2VuZCBhIGNsaWNrIGV2ZW50IHRvIHRoYXQgbGF5ZXIgLSB1bmxlc3MgYSBjaGVja1xyXG5cdFx0XHRcdC8vIGlzIG1hZGUgdG8gZW5zdXJlIHRoYXQgYSBwYXJlbnQgbGF5ZXIgd2FzIG5vdCBzY3JvbGxlZCBiZWZvcmUgc2VuZGluZyBhIHN5bnRoZXRpYyBjbGljayAoaXNzdWUgIzQyKS5cclxuXHRcdFx0XHR0aGlzLnVwZGF0ZVNjcm9sbFBhcmVudCh0YXJnZXRFbGVtZW50KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMudHJhY2tpbmdDbGljayA9IHRydWU7XHJcblx0XHR0aGlzLnRyYWNraW5nQ2xpY2tTdGFydCA9IGV2ZW50LnRpbWVTdGFtcDtcclxuXHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IHRhcmdldEVsZW1lbnQ7XHJcblxyXG5cdFx0dGhpcy50b3VjaFN0YXJ0WCA9IHRvdWNoLnBhZ2VYO1xyXG5cdFx0dGhpcy50b3VjaFN0YXJ0WSA9IHRvdWNoLnBhZ2VZO1xyXG5cclxuXHRcdC8vIFByZXZlbnQgcGhhbnRvbSBjbGlja3Mgb24gZmFzdCBkb3VibGUtdGFwIChpc3N1ZSAjMzYpXHJcblx0XHRpZiAoKGV2ZW50LnRpbWVTdGFtcCAtIHRoaXMubGFzdENsaWNrVGltZSkgPCB0aGlzLnRhcERlbGF5KSB7XHJcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fTtcclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEJhc2VkIG9uIGEgdG91Y2htb3ZlIGV2ZW50IG9iamVjdCwgY2hlY2sgd2hldGhlciB0aGUgdG91Y2ggaGFzIG1vdmVkIHBhc3QgYSBib3VuZGFyeSBzaW5jZSBpdCBzdGFydGVkLlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtFdmVudH0gZXZlbnRcclxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuXHQgKi9cclxuXHRGYXN0Q2xpY2sucHJvdG90eXBlLnRvdWNoSGFzTW92ZWQgPSBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0dmFyIHRvdWNoID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0sIGJvdW5kYXJ5ID0gdGhpcy50b3VjaEJvdW5kYXJ5O1xyXG5cclxuXHRcdGlmIChNYXRoLmFicyh0b3VjaC5wYWdlWCAtIHRoaXMudG91Y2hTdGFydFgpID4gYm91bmRhcnkgfHwgTWF0aC5hYnModG91Y2gucGFnZVkgLSB0aGlzLnRvdWNoU3RhcnRZKSA+IGJvdW5kYXJ5KSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9O1xyXG5cclxuXHJcblx0LyoqXHJcblx0ICogVXBkYXRlIHRoZSBsYXN0IHBvc2l0aW9uLlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtFdmVudH0gZXZlbnRcclxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuXHQgKi9cclxuXHRGYXN0Q2xpY2sucHJvdG90eXBlLm9uVG91Y2hNb3ZlID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdGlmICghdGhpcy50cmFja2luZ0NsaWNrKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIElmIHRoZSB0b3VjaCBoYXMgbW92ZWQsIGNhbmNlbCB0aGUgY2xpY2sgdHJhY2tpbmdcclxuXHRcdGlmICh0aGlzLnRhcmdldEVsZW1lbnQgIT09IHRoaXMuZ2V0VGFyZ2V0RWxlbWVudEZyb21FdmVudFRhcmdldChldmVudC50YXJnZXQpIHx8IHRoaXMudG91Y2hIYXNNb3ZlZChldmVudCkpIHtcclxuXHRcdFx0dGhpcy50cmFja2luZ0NsaWNrID0gZmFsc2U7XHJcblx0XHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fTtcclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEF0dGVtcHQgdG8gZmluZCB0aGUgbGFiZWxsZWQgY29udHJvbCBmb3IgdGhlIGdpdmVuIGxhYmVsIGVsZW1lbnQuXHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fEhUTUxMYWJlbEVsZW1lbnR9IGxhYmVsRWxlbWVudFxyXG5cdCAqIEByZXR1cm5zIHtFbGVtZW50fG51bGx9XHJcblx0ICovXHJcblx0RmFzdENsaWNrLnByb3RvdHlwZS5maW5kQ29udHJvbCA9IGZ1bmN0aW9uKGxhYmVsRWxlbWVudCkge1xyXG5cclxuXHRcdC8vIEZhc3QgcGF0aCBmb3IgbmV3ZXIgYnJvd3NlcnMgc3VwcG9ydGluZyB0aGUgSFRNTDUgY29udHJvbCBhdHRyaWJ1dGVcclxuXHRcdGlmIChsYWJlbEVsZW1lbnQuY29udHJvbCAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdHJldHVybiBsYWJlbEVsZW1lbnQuY29udHJvbDtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBBbGwgYnJvd3NlcnMgdW5kZXIgdGVzdCB0aGF0IHN1cHBvcnQgdG91Y2ggZXZlbnRzIGFsc28gc3VwcG9ydCB0aGUgSFRNTDUgaHRtbEZvciBhdHRyaWJ1dGVcclxuXHRcdGlmIChsYWJlbEVsZW1lbnQuaHRtbEZvcikge1xyXG5cdFx0XHRyZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobGFiZWxFbGVtZW50Lmh0bWxGb3IpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIElmIG5vIGZvciBhdHRyaWJ1dGUgZXhpc3RzLCBhdHRlbXB0IHRvIHJldHJpZXZlIHRoZSBmaXJzdCBsYWJlbGxhYmxlIGRlc2NlbmRhbnQgZWxlbWVudFxyXG5cdFx0Ly8gdGhlIGxpc3Qgb2Ygd2hpY2ggaXMgZGVmaW5lZCBoZXJlOiBodHRwOi8vd3d3LnczLm9yZy9UUi9odG1sNS9mb3Jtcy5odG1sI2NhdGVnb3J5LWxhYmVsXHJcblx0XHRyZXR1cm4gbGFiZWxFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbiwgaW5wdXQ6bm90KFt0eXBlPWhpZGRlbl0pLCBrZXlnZW4sIG1ldGVyLCBvdXRwdXQsIHByb2dyZXNzLCBzZWxlY3QsIHRleHRhcmVhJyk7XHJcblx0fTtcclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIE9uIHRvdWNoIGVuZCwgZGV0ZXJtaW5lIHdoZXRoZXIgdG8gc2VuZCBhIGNsaWNrIGV2ZW50IGF0IG9uY2UuXHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge0V2ZW50fSBldmVudFxyXG5cdCAqIEByZXR1cm5zIHtib29sZWFufVxyXG5cdCAqL1xyXG5cdEZhc3RDbGljay5wcm90b3R5cGUub25Ub3VjaEVuZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHR2YXIgZm9yRWxlbWVudCwgdHJhY2tpbmdDbGlja1N0YXJ0LCB0YXJnZXRUYWdOYW1lLCBzY3JvbGxQYXJlbnQsIHRvdWNoLCB0YXJnZXRFbGVtZW50ID0gdGhpcy50YXJnZXRFbGVtZW50O1xyXG5cclxuXHRcdGlmICghdGhpcy50cmFja2luZ0NsaWNrKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFByZXZlbnQgcGhhbnRvbSBjbGlja3Mgb24gZmFzdCBkb3VibGUtdGFwIChpc3N1ZSAjMzYpXHJcblx0XHRpZiAoKGV2ZW50LnRpbWVTdGFtcCAtIHRoaXMubGFzdENsaWNrVGltZSkgPCB0aGlzLnRhcERlbGF5KSB7XHJcblx0XHRcdHRoaXMuY2FuY2VsTmV4dENsaWNrID0gdHJ1ZTtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKChldmVudC50aW1lU3RhbXAgLSB0aGlzLnRyYWNraW5nQ2xpY2tTdGFydCkgPiB0aGlzLnRhcFRpbWVvdXQpIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUmVzZXQgdG8gcHJldmVudCB3cm9uZyBjbGljayBjYW5jZWwgb24gaW5wdXQgKGlzc3VlICMxNTYpLlxyXG5cdFx0dGhpcy5jYW5jZWxOZXh0Q2xpY2sgPSBmYWxzZTtcclxuXHJcblx0XHR0aGlzLmxhc3RDbGlja1RpbWUgPSBldmVudC50aW1lU3RhbXA7XHJcblxyXG5cdFx0dHJhY2tpbmdDbGlja1N0YXJ0ID0gdGhpcy50cmFja2luZ0NsaWNrU3RhcnQ7XHJcblx0XHR0aGlzLnRyYWNraW5nQ2xpY2sgPSBmYWxzZTtcclxuXHRcdHRoaXMudHJhY2tpbmdDbGlja1N0YXJ0ID0gMDtcclxuXHJcblx0XHQvLyBPbiBzb21lIGlPUyBkZXZpY2VzLCB0aGUgdGFyZ2V0RWxlbWVudCBzdXBwbGllZCB3aXRoIHRoZSBldmVudCBpcyBpbnZhbGlkIGlmIHRoZSBsYXllclxyXG5cdFx0Ly8gaXMgcGVyZm9ybWluZyBhIHRyYW5zaXRpb24gb3Igc2Nyb2xsLCBhbmQgaGFzIHRvIGJlIHJlLWRldGVjdGVkIG1hbnVhbGx5LiBOb3RlIHRoYXRcclxuXHRcdC8vIGZvciB0aGlzIHRvIGZ1bmN0aW9uIGNvcnJlY3RseSwgaXQgbXVzdCBiZSBjYWxsZWQgKmFmdGVyKiB0aGUgZXZlbnQgdGFyZ2V0IGlzIGNoZWNrZWQhXHJcblx0XHQvLyBTZWUgaXNzdWUgIzU3OyBhbHNvIGZpbGVkIGFzIHJkYXI6Ly8xMzA0ODU4OSAuXHJcblx0XHRpZiAoZGV2aWNlSXNJT1NXaXRoQmFkVGFyZ2V0KSB7XHJcblx0XHRcdHRvdWNoID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF07XHJcblxyXG5cdFx0XHQvLyBJbiBjZXJ0YWluIGNhc2VzIGFyZ3VtZW50cyBvZiBlbGVtZW50RnJvbVBvaW50IGNhbiBiZSBuZWdhdGl2ZSwgc28gcHJldmVudCBzZXR0aW5nIHRhcmdldEVsZW1lbnQgdG8gbnVsbFxyXG5cdFx0XHR0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludCh0b3VjaC5wYWdlWCAtIHdpbmRvdy5wYWdlWE9mZnNldCwgdG91Y2gucGFnZVkgLSB3aW5kb3cucGFnZVlPZmZzZXQpIHx8IHRhcmdldEVsZW1lbnQ7XHJcblx0XHRcdHRhcmdldEVsZW1lbnQuZmFzdENsaWNrU2Nyb2xsUGFyZW50ID0gdGhpcy50YXJnZXRFbGVtZW50LmZhc3RDbGlja1Njcm9sbFBhcmVudDtcclxuXHRcdH1cclxuXHJcblx0XHR0YXJnZXRUYWdOYW1lID0gdGFyZ2V0RWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XHJcblx0XHRpZiAodGFyZ2V0VGFnTmFtZSA9PT0gJ2xhYmVsJykge1xyXG5cdFx0XHRmb3JFbGVtZW50ID0gdGhpcy5maW5kQ29udHJvbCh0YXJnZXRFbGVtZW50KTtcclxuXHRcdFx0aWYgKGZvckVsZW1lbnQpIHtcclxuXHRcdFx0XHR0aGlzLmZvY3VzKHRhcmdldEVsZW1lbnQpO1xyXG5cdFx0XHRcdGlmIChkZXZpY2VJc0FuZHJvaWQpIHtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRhcmdldEVsZW1lbnQgPSBmb3JFbGVtZW50O1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMubmVlZHNGb2N1cyh0YXJnZXRFbGVtZW50KSkge1xyXG5cclxuXHRcdFx0Ly8gQ2FzZSAxOiBJZiB0aGUgdG91Y2ggc3RhcnRlZCBhIHdoaWxlIGFnbyAoYmVzdCBndWVzcyBpcyAxMDBtcyBiYXNlZCBvbiB0ZXN0cyBmb3IgaXNzdWUgIzM2KSB0aGVuIGZvY3VzIHdpbGwgYmUgdHJpZ2dlcmVkIGFueXdheS4gUmV0dXJuIGVhcmx5IGFuZCB1bnNldCB0aGUgdGFyZ2V0IGVsZW1lbnQgcmVmZXJlbmNlIHNvIHRoYXQgdGhlIHN1YnNlcXVlbnQgY2xpY2sgd2lsbCBiZSBhbGxvd2VkIHRocm91Z2guXHJcblx0XHRcdC8vIENhc2UgMjogV2l0aG91dCB0aGlzIGV4Y2VwdGlvbiBmb3IgaW5wdXQgZWxlbWVudHMgdGFwcGVkIHdoZW4gdGhlIGRvY3VtZW50IGlzIGNvbnRhaW5lZCBpbiBhbiBpZnJhbWUsIHRoZW4gYW55IGlucHV0dGVkIHRleHQgd29uJ3QgYmUgdmlzaWJsZSBldmVuIHRob3VnaCB0aGUgdmFsdWUgYXR0cmlidXRlIGlzIHVwZGF0ZWQgYXMgdGhlIHVzZXIgdHlwZXMgKGlzc3VlICMzNykuXHJcblx0XHRcdGlmICgoZXZlbnQudGltZVN0YW1wIC0gdHJhY2tpbmdDbGlja1N0YXJ0KSA+IDEwMCB8fCAoZGV2aWNlSXNJT1MgJiYgd2luZG93LnRvcCAhPT0gd2luZG93ICYmIHRhcmdldFRhZ05hbWUgPT09ICdpbnB1dCcpKSB7XHJcblx0XHRcdFx0dGhpcy50YXJnZXRFbGVtZW50ID0gbnVsbDtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuZm9jdXModGFyZ2V0RWxlbWVudCk7XHJcblx0XHRcdHRoaXMuc2VuZENsaWNrKHRhcmdldEVsZW1lbnQsIGV2ZW50KTtcclxuXHJcblx0XHRcdC8vIFNlbGVjdCBlbGVtZW50cyBuZWVkIHRoZSBldmVudCB0byBnbyB0aHJvdWdoIG9uIGlPUyA0LCBvdGhlcndpc2UgdGhlIHNlbGVjdG9yIG1lbnUgd29uJ3Qgb3Blbi5cclxuXHRcdFx0Ly8gQWxzbyB0aGlzIGJyZWFrcyBvcGVuaW5nIHNlbGVjdHMgd2hlbiBWb2ljZU92ZXIgaXMgYWN0aXZlIG9uIGlPUzYsIGlPUzcgKGFuZCBwb3NzaWJseSBvdGhlcnMpXHJcblx0XHRcdGlmICghZGV2aWNlSXNJT1MgfHwgdGFyZ2V0VGFnTmFtZSAhPT0gJ3NlbGVjdCcpIHtcclxuXHRcdFx0XHR0aGlzLnRhcmdldEVsZW1lbnQgPSBudWxsO1xyXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZGV2aWNlSXNJT1MgJiYgIWRldmljZUlzSU9TNCkge1xyXG5cclxuXHRcdFx0Ly8gRG9uJ3Qgc2VuZCBhIHN5bnRoZXRpYyBjbGljayBldmVudCBpZiB0aGUgdGFyZ2V0IGVsZW1lbnQgaXMgY29udGFpbmVkIHdpdGhpbiBhIHBhcmVudCBsYXllciB0aGF0IHdhcyBzY3JvbGxlZFxyXG5cdFx0XHQvLyBhbmQgdGhpcyB0YXAgaXMgYmVpbmcgdXNlZCB0byBzdG9wIHRoZSBzY3JvbGxpbmcgKHVzdWFsbHkgaW5pdGlhdGVkIGJ5IGEgZmxpbmcgLSBpc3N1ZSAjNDIpLlxyXG5cdFx0XHRzY3JvbGxQYXJlbnQgPSB0YXJnZXRFbGVtZW50LmZhc3RDbGlja1Njcm9sbFBhcmVudDtcclxuXHRcdFx0aWYgKHNjcm9sbFBhcmVudCAmJiBzY3JvbGxQYXJlbnQuZmFzdENsaWNrTGFzdFNjcm9sbFRvcCAhPT0gc2Nyb2xsUGFyZW50LnNjcm9sbFRvcCkge1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUHJldmVudCB0aGUgYWN0dWFsIGNsaWNrIGZyb20gZ29pbmcgdGhvdWdoIC0gdW5sZXNzIHRoZSB0YXJnZXQgbm9kZSBpcyBtYXJrZWQgYXMgcmVxdWlyaW5nXHJcblx0XHQvLyByZWFsIGNsaWNrcyBvciBpZiBpdCBpcyBpbiB0aGUgd2hpdGVsaXN0IGluIHdoaWNoIGNhc2Ugb25seSBub24tcHJvZ3JhbW1hdGljIGNsaWNrcyBhcmUgcGVybWl0dGVkLlxyXG5cdFx0aWYgKCF0aGlzLm5lZWRzQ2xpY2sodGFyZ2V0RWxlbWVudCkpIHtcclxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0dGhpcy5zZW5kQ2xpY2sodGFyZ2V0RWxlbWVudCwgZXZlbnQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9O1xyXG5cclxuXHJcblx0LyoqXHJcblx0ICogT24gdG91Y2ggY2FuY2VsLCBzdG9wIHRyYWNraW5nIHRoZSBjbGljay5cclxuXHQgKlxyXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxyXG5cdCAqL1xyXG5cdEZhc3RDbGljay5wcm90b3R5cGUub25Ub3VjaENhbmNlbCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy50cmFja2luZ0NsaWNrID0gZmFsc2U7XHJcblx0XHR0aGlzLnRhcmdldEVsZW1lbnQgPSBudWxsO1xyXG5cdH07XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBEZXRlcm1pbmUgbW91c2UgZXZlbnRzIHdoaWNoIHNob3VsZCBiZSBwZXJtaXR0ZWQuXHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge0V2ZW50fSBldmVudFxyXG5cdCAqIEByZXR1cm5zIHtib29sZWFufVxyXG5cdCAqL1xyXG5cdEZhc3RDbGljay5wcm90b3R5cGUub25Nb3VzZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblxyXG5cdFx0Ly8gSWYgYSB0YXJnZXQgZWxlbWVudCB3YXMgbmV2ZXIgc2V0IChiZWNhdXNlIGEgdG91Y2ggZXZlbnQgd2FzIG5ldmVyIGZpcmVkKSBhbGxvdyB0aGUgZXZlbnRcclxuXHRcdGlmICghdGhpcy50YXJnZXRFbGVtZW50KSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChldmVudC5mb3J3YXJkZWRUb3VjaEV2ZW50KSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFByb2dyYW1tYXRpY2FsbHkgZ2VuZXJhdGVkIGV2ZW50cyB0YXJnZXRpbmcgYSBzcGVjaWZpYyBlbGVtZW50IHNob3VsZCBiZSBwZXJtaXR0ZWRcclxuXHRcdGlmICghZXZlbnQuY2FuY2VsYWJsZSkge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBEZXJpdmUgYW5kIGNoZWNrIHRoZSB0YXJnZXQgZWxlbWVudCB0byBzZWUgd2hldGhlciB0aGUgbW91c2UgZXZlbnQgbmVlZHMgdG8gYmUgcGVybWl0dGVkO1xyXG5cdFx0Ly8gdW5sZXNzIGV4cGxpY2l0bHkgZW5hYmxlZCwgcHJldmVudCBub24tdG91Y2ggY2xpY2sgZXZlbnRzIGZyb20gdHJpZ2dlcmluZyBhY3Rpb25zLFxyXG5cdFx0Ly8gdG8gcHJldmVudCBnaG9zdC9kb3VibGVjbGlja3MuXHJcblx0XHRpZiAoIXRoaXMubmVlZHNDbGljayh0aGlzLnRhcmdldEVsZW1lbnQpIHx8IHRoaXMuY2FuY2VsTmV4dENsaWNrKSB7XHJcblxyXG5cdFx0XHQvLyBQcmV2ZW50IGFueSB1c2VyLWFkZGVkIGxpc3RlbmVycyBkZWNsYXJlZCBvbiBGYXN0Q2xpY2sgZWxlbWVudCBmcm9tIGJlaW5nIGZpcmVkLlxyXG5cdFx0XHRpZiAoZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKSB7XHJcblx0XHRcdFx0ZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdC8vIFBhcnQgb2YgdGhlIGhhY2sgZm9yIGJyb3dzZXJzIHRoYXQgZG9uJ3Qgc3VwcG9ydCBFdmVudCNzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24gKGUuZy4gQW5kcm9pZCAyKVxyXG5cdFx0XHRcdGV2ZW50LnByb3BhZ2F0aW9uU3RvcHBlZCA9IHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIENhbmNlbCB0aGUgZXZlbnRcclxuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gSWYgdGhlIG1vdXNlIGV2ZW50IGlzIHBlcm1pdHRlZCwgcmV0dXJuIHRydWUgZm9yIHRoZSBhY3Rpb24gdG8gZ28gdGhyb3VnaC5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH07XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBPbiBhY3R1YWwgY2xpY2tzLCBkZXRlcm1pbmUgd2hldGhlciB0aGlzIGlzIGEgdG91Y2gtZ2VuZXJhdGVkIGNsaWNrLCBhIGNsaWNrIGFjdGlvbiBvY2N1cnJpbmdcclxuXHQgKiBuYXR1cmFsbHkgYWZ0ZXIgYSBkZWxheSBhZnRlciBhIHRvdWNoICh3aGljaCBuZWVkcyB0byBiZSBjYW5jZWxsZWQgdG8gYXZvaWQgZHVwbGljYXRpb24pLCBvclxyXG5cdCAqIGFuIGFjdHVhbCBjbGljayB3aGljaCBzaG91bGQgYmUgcGVybWl0dGVkLlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtFdmVudH0gZXZlbnRcclxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuXHQgKi9cclxuXHRGYXN0Q2xpY2sucHJvdG90eXBlLm9uQ2xpY2sgPSBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0dmFyIHBlcm1pdHRlZDtcclxuXHJcblx0XHQvLyBJdCdzIHBvc3NpYmxlIGZvciBhbm90aGVyIEZhc3RDbGljay1saWtlIGxpYnJhcnkgZGVsaXZlcmVkIHdpdGggdGhpcmQtcGFydHkgY29kZSB0byBmaXJlIGEgY2xpY2sgZXZlbnQgYmVmb3JlIEZhc3RDbGljayBkb2VzIChpc3N1ZSAjNDQpLiBJbiB0aGF0IGNhc2UsIHNldCB0aGUgY2xpY2stdHJhY2tpbmcgZmxhZyBiYWNrIHRvIGZhbHNlIGFuZCByZXR1cm4gZWFybHkuIFRoaXMgd2lsbCBjYXVzZSBvblRvdWNoRW5kIHRvIHJldHVybiBlYXJseS5cclxuXHRcdGlmICh0aGlzLnRyYWNraW5nQ2xpY2spIHtcclxuXHRcdFx0dGhpcy50YXJnZXRFbGVtZW50ID0gbnVsbDtcclxuXHRcdFx0dGhpcy50cmFja2luZ0NsaWNrID0gZmFsc2U7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFZlcnkgb2RkIGJlaGF2aW91ciBvbiBpT1MgKGlzc3VlICMxOCk6IGlmIGEgc3VibWl0IGVsZW1lbnQgaXMgcHJlc2VudCBpbnNpZGUgYSBmb3JtIGFuZCB0aGUgdXNlciBoaXRzIGVudGVyIGluIHRoZSBpT1Mgc2ltdWxhdG9yIG9yIGNsaWNrcyB0aGUgR28gYnV0dG9uIG9uIHRoZSBwb3AtdXAgT1Mga2V5Ym9hcmQgdGhlIGEga2luZCBvZiAnZmFrZScgY2xpY2sgZXZlbnQgd2lsbCBiZSB0cmlnZ2VyZWQgd2l0aCB0aGUgc3VibWl0LXR5cGUgaW5wdXQgZWxlbWVudCBhcyB0aGUgdGFyZ2V0LlxyXG5cdFx0aWYgKGV2ZW50LnRhcmdldC50eXBlID09PSAnc3VibWl0JyAmJiBldmVudC5kZXRhaWwgPT09IDApIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0cGVybWl0dGVkID0gdGhpcy5vbk1vdXNlKGV2ZW50KTtcclxuXHJcblx0XHQvLyBPbmx5IHVuc2V0IHRhcmdldEVsZW1lbnQgaWYgdGhlIGNsaWNrIGlzIG5vdCBwZXJtaXR0ZWQuIFRoaXMgd2lsbCBlbnN1cmUgdGhhdCB0aGUgY2hlY2sgZm9yICF0YXJnZXRFbGVtZW50IGluIG9uTW91c2UgZmFpbHMgYW5kIHRoZSBicm93c2VyJ3MgY2xpY2sgZG9lc24ndCBnbyB0aHJvdWdoLlxyXG5cdFx0aWYgKCFwZXJtaXR0ZWQpIHtcclxuXHRcdFx0dGhpcy50YXJnZXRFbGVtZW50ID0gbnVsbDtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBJZiBjbGlja3MgYXJlIHBlcm1pdHRlZCwgcmV0dXJuIHRydWUgZm9yIHRoZSBhY3Rpb24gdG8gZ28gdGhyb3VnaC5cclxuXHRcdHJldHVybiBwZXJtaXR0ZWQ7XHJcblx0fTtcclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIFJlbW92ZSBhbGwgRmFzdENsaWNrJ3MgZXZlbnQgbGlzdGVuZXJzLlxyXG5cdCAqXHJcblx0ICogQHJldHVybnMge3ZvaWR9XHJcblx0ICovXHJcblx0RmFzdENsaWNrLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgbGF5ZXIgPSB0aGlzLmxheWVyO1xyXG5cclxuXHRcdGlmIChkZXZpY2VJc0FuZHJvaWQpIHtcclxuXHRcdFx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgdGhpcy5vbk1vdXNlLCB0cnVlKTtcclxuXHRcdFx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5vbk1vdXNlLCB0cnVlKTtcclxuXHRcdFx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25Nb3VzZSwgdHJ1ZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uQ2xpY2ssIHRydWUpO1xyXG5cdFx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMub25Ub3VjaFN0YXJ0LCBmYWxzZSk7XHJcblx0XHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLm9uVG91Y2hNb3ZlLCBmYWxzZSk7XHJcblx0XHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMub25Ub3VjaEVuZCwgZmFsc2UpO1xyXG5cdFx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0aGlzLm9uVG91Y2hDYW5jZWwsIGZhbHNlKTtcclxuXHR9O1xyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQ2hlY2sgd2hldGhlciBGYXN0Q2xpY2sgaXMgbmVlZGVkLlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtFbGVtZW50fSBsYXllciBUaGUgbGF5ZXIgdG8gbGlzdGVuIG9uXHJcblx0ICovXHJcblx0RmFzdENsaWNrLm5vdE5lZWRlZCA9IGZ1bmN0aW9uKGxheWVyKSB7XHJcblx0XHR2YXIgbWV0YVZpZXdwb3J0O1xyXG5cdFx0dmFyIGNocm9tZVZlcnNpb247XHJcblx0XHR2YXIgYmxhY2tiZXJyeVZlcnNpb247XHJcblx0XHR2YXIgZmlyZWZveFZlcnNpb247XHJcblxyXG5cdFx0Ly8gRGV2aWNlcyB0aGF0IGRvbid0IHN1cHBvcnQgdG91Y2ggZG9uJ3QgbmVlZCBGYXN0Q2xpY2tcclxuXHRcdGlmICh0eXBlb2Ygd2luZG93Lm9udG91Y2hzdGFydCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQ2hyb21lIHZlcnNpb24gLSB6ZXJvIGZvciBvdGhlciBicm93c2Vyc1xyXG5cdFx0Y2hyb21lVmVyc2lvbiA9ICsoL0Nocm9tZVxcLyhbMC05XSspLy5leGVjKG5hdmlnYXRvci51c2VyQWdlbnQpIHx8IFssMF0pWzFdO1xyXG5cclxuXHRcdGlmIChjaHJvbWVWZXJzaW9uKSB7XHJcblxyXG5cdFx0XHRpZiAoZGV2aWNlSXNBbmRyb2lkKSB7XHJcblx0XHRcdFx0bWV0YVZpZXdwb3J0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPXZpZXdwb3J0XScpO1xyXG5cclxuXHRcdFx0XHRpZiAobWV0YVZpZXdwb3J0KSB7XHJcblx0XHRcdFx0XHQvLyBDaHJvbWUgb24gQW5kcm9pZCB3aXRoIHVzZXItc2NhbGFibGU9XCJub1wiIGRvZXNuJ3QgbmVlZCBGYXN0Q2xpY2sgKGlzc3VlICM4OSlcclxuXHRcdFx0XHRcdGlmIChtZXRhVmlld3BvcnQuY29udGVudC5pbmRleE9mKCd1c2VyLXNjYWxhYmxlPW5vJykgIT09IC0xKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly8gQ2hyb21lIDMyIGFuZCBhYm92ZSB3aXRoIHdpZHRoPWRldmljZS13aWR0aCBvciBsZXNzIGRvbid0IG5lZWQgRmFzdENsaWNrXHJcblx0XHRcdFx0XHRpZiAoY2hyb21lVmVyc2lvbiA+IDMxICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxXaWR0aCA8PSB3aW5kb3cub3V0ZXJXaWR0aCkge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBDaHJvbWUgZGVza3RvcCBkb2Vzbid0IG5lZWQgRmFzdENsaWNrIChpc3N1ZSAjMTUpXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZGV2aWNlSXNCbGFja0JlcnJ5MTApIHtcclxuXHRcdFx0YmxhY2tiZXJyeVZlcnNpb24gPSBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9WZXJzaW9uXFwvKFswLTldKilcXC4oWzAtOV0qKS8pO1xyXG5cclxuXHRcdFx0Ly8gQmxhY2tCZXJyeSAxMC4zKyBkb2VzIG5vdCByZXF1aXJlIEZhc3RjbGljayBsaWJyYXJ5LlxyXG5cdFx0XHQvLyBodHRwczovL2dpdGh1Yi5jb20vZnRsYWJzL2Zhc3RjbGljay9pc3N1ZXMvMjUxXHJcblx0XHRcdGlmIChibGFja2JlcnJ5VmVyc2lvblsxXSA+PSAxMCAmJiBibGFja2JlcnJ5VmVyc2lvblsyXSA+PSAzKSB7XHJcblx0XHRcdFx0bWV0YVZpZXdwb3J0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPXZpZXdwb3J0XScpO1xyXG5cclxuXHRcdFx0XHRpZiAobWV0YVZpZXdwb3J0KSB7XHJcblx0XHRcdFx0XHQvLyB1c2VyLXNjYWxhYmxlPW5vIGVsaW1pbmF0ZXMgY2xpY2sgZGVsYXkuXHJcblx0XHRcdFx0XHRpZiAobWV0YVZpZXdwb3J0LmNvbnRlbnQuaW5kZXhPZigndXNlci1zY2FsYWJsZT1ubycpICE9PSAtMSkge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vIHdpZHRoPWRldmljZS13aWR0aCAob3IgbGVzcyB0aGFuIGRldmljZS13aWR0aCkgZWxpbWluYXRlcyBjbGljayBkZWxheS5cclxuXHRcdFx0XHRcdGlmIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsV2lkdGggPD0gd2luZG93Lm91dGVyV2lkdGgpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gSUUxMCB3aXRoIC1tcy10b3VjaC1hY3Rpb246IG5vbmUgb3IgbWFuaXB1bGF0aW9uLCB3aGljaCBkaXNhYmxlcyBkb3VibGUtdGFwLXRvLXpvb20gKGlzc3VlICM5NylcclxuXHRcdGlmIChsYXllci5zdHlsZS5tc1RvdWNoQWN0aW9uID09PSAnbm9uZScgfHwgbGF5ZXIuc3R5bGUudG91Y2hBY3Rpb24gPT09ICdtYW5pcHVsYXRpb24nKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEZpcmVmb3ggdmVyc2lvbiAtIHplcm8gZm9yIG90aGVyIGJyb3dzZXJzXHJcblx0XHRmaXJlZm94VmVyc2lvbiA9ICsoL0ZpcmVmb3hcXC8oWzAtOV0rKS8uZXhlYyhuYXZpZ2F0b3IudXNlckFnZW50KSB8fCBbLDBdKVsxXTtcclxuXHJcblx0XHRpZiAoZmlyZWZveFZlcnNpb24gPj0gMjcpIHtcclxuXHRcdFx0Ly8gRmlyZWZveCAyNysgZG9lcyBub3QgaGF2ZSB0YXAgZGVsYXkgaWYgdGhlIGNvbnRlbnQgaXMgbm90IHpvb21hYmxlIC0gaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9OTIyODk2XHJcblxyXG5cdFx0XHRtZXRhVmlld3BvcnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9dmlld3BvcnRdJyk7XHJcblx0XHRcdGlmIChtZXRhVmlld3BvcnQgJiYgKG1ldGFWaWV3cG9ydC5jb250ZW50LmluZGV4T2YoJ3VzZXItc2NhbGFibGU9bm8nKSAhPT0gLTEgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFdpZHRoIDw9IHdpbmRvdy5vdXRlcldpZHRoKSkge1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gSUUxMTogcHJlZml4ZWQgLW1zLXRvdWNoLWFjdGlvbiBpcyBubyBsb25nZXIgc3VwcG9ydGVkIGFuZCBpdCdzIHJlY29tZW5kZWQgdG8gdXNlIG5vbi1wcmVmaXhlZCB2ZXJzaW9uXHJcblx0XHQvLyBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvd2luZG93cy9hcHBzL0hoNzY3MzEzLmFzcHhcclxuXHRcdGlmIChsYXllci5zdHlsZS50b3VjaEFjdGlvbiA9PT0gJ25vbmUnIHx8IGxheWVyLnN0eWxlLnRvdWNoQWN0aW9uID09PSAnbWFuaXB1bGF0aW9uJykge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fTtcclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEZhY3RvcnkgbWV0aG9kIGZvciBjcmVhdGluZyBhIEZhc3RDbGljayBvYmplY3RcclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB7RWxlbWVudH0gbGF5ZXIgVGhlIGxheWVyIHRvIGxpc3RlbiBvblxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIG9wdGlvbnMgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHRzXHJcblx0ICovXHJcblx0RmFzdENsaWNrLmF0dGFjaCA9IGZ1bmN0aW9uKGxheWVyLCBvcHRpb25zKSB7XHJcblx0XHRyZXR1cm4gbmV3IEZhc3RDbGljayhsYXllciwgb3B0aW9ucyk7XHJcblx0fTtcclxuXHJcblxyXG5cdGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09PSAnb2JqZWN0JyAmJiBkZWZpbmUuYW1kKSB7XHJcblxyXG5cdFx0Ly8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxyXG5cdFx0ZGVmaW5lKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gRmFzdENsaWNrO1xyXG5cdFx0fSk7XHJcblx0fSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBGYXN0Q2xpY2suYXR0YWNoO1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMuRmFzdENsaWNrID0gRmFzdENsaWNrO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR3aW5kb3cuRmFzdENsaWNrID0gRmFzdENsaWNrO1xyXG5cdH1cclxufSgpKTsiLCJ2YXIgbSA9IChmdW5jdGlvbiBhcHAod2luZG93LCB1bmRlZmluZWQpIHtcclxuXHR2YXIgT0JKRUNUID0gXCJbb2JqZWN0IE9iamVjdF1cIixcclxuXHRcdEFSUkFZID0gXCJbb2JqZWN0IEFycmF5XVwiLFxyXG5cdFx0U1RSSU5HID0gXCJbb2JqZWN0IFN0cmluZ11cIixcclxuXHRcdEZVTkNUSU9OID0gXCJmdW5jdGlvblwiO1xyXG5cclxuXHR2YXIgdHlwZSA9IHt9LnRvU3RyaW5nO1xyXG5cdHZhciBwYXJzZXIgPSAvKD86KF58I3xcXC4pKFteI1xcLlxcW1xcXV0rKSl8KFxcWy4rP1xcXSkvZztcclxuXHR2YXIgYXR0clBhcnNlciA9IC9cXFsoLis/KSg/Oj0oXCJ8J3wpKC4qPylcXDIpP1xcXS87XHJcblx0dmFyIHZvaWRFbGVtZW50cyA9IC9eKEFSRUF8QkFTRXxCUnxDT0x8Q09NTUFORHxFTUJFRHxIUnxJTUd8SU5QVVR8S0VZR0VOfExJTkt8TUVUQXxQQVJBTXxTT1VSQ0V8VFJBQ0t8V0JSKSQvO1xyXG5cdHZhciBub29wID0gZnVuY3Rpb24oKSB7fTtcclxuXHJcblx0Ly8gY2FjaGluZyBjb21tb25seSB1c2VkIHZhcmlhYmxlc1xyXG5cdHZhciAkZG9jdW1lbnQsXHJcblx0XHQkbG9jYXRpb24sXHJcblx0XHQkcmVxdWVzdEFuaW1hdGlvbkZyYW1lLFxyXG5cdFx0JGNhbmNlbEFuaW1hdGlvbkZyYW1lO1xyXG5cclxuXHQvLyBzZWxmIGludm9raW5nIGZ1bmN0aW9uIG5lZWRlZCBiZWNhdXNlIG9mIHRoZSB3YXkgbW9ja3Mgd29ya1xyXG5cdGZ1bmN0aW9uIGluaXRpYWxpemUod2luZG93KXtcclxuXHRcdCRkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcclxuXHRcdCRsb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbjtcclxuXHRcdCRjYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cuY2xlYXJUaW1lb3V0O1xyXG5cdFx0JHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93LnNldFRpbWVvdXQ7XHJcblx0fVxyXG5cclxuXHRpbml0aWFsaXplKHdpbmRvdyk7XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBAdHlwZWRlZiB7U3RyaW5nfSBUYWdcclxuXHQgKiBBIHN0cmluZyB0aGF0IGxvb2tzIGxpa2UgLT4gZGl2LmNsYXNzbmFtZSNpZFtwYXJhbT1vbmVdW3BhcmFtMj10d29dXHJcblx0ICogV2hpY2ggZGVzY3JpYmVzIGEgRE9NIG5vZGVcclxuXHQgKi9cclxuXHJcblx0LyoqXHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge1RhZ30gVGhlIERPTSBub2RlIHRhZ1xyXG5cdCAqIEBwYXJhbSB7T2JqZWN0PVtdfSBvcHRpb25hbCBrZXktdmFsdWUgcGFpcnMgdG8gYmUgbWFwcGVkIHRvIERPTSBhdHRyc1xyXG5cdCAqIEBwYXJhbSB7Li4ubU5vZGU9W119IFplcm8gb3IgbW9yZSBNaXRocmlsIGNoaWxkIG5vZGVzLiBDYW4gYmUgYW4gYXJyYXksIG9yIHNwbGF0IChvcHRpb25hbClcclxuXHQgKlxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIG0oKSB7XHJcblx0XHR2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSxcclxuXHRcdFx0aGFzQXR0cnMgPSBhcmdzWzFdICE9IG51bGwgJiYgdHlwZS5jYWxsKGFyZ3NbMV0pID09PSBPQkpFQ1QgJiYgIShcInRhZ1wiIGluIGFyZ3NbMV0gfHwgXCJ2aWV3XCIgaW4gYXJnc1sxXSkgJiYgIShcInN1YnRyZWVcIiBpbiBhcmdzWzFdKSxcclxuXHRcdFx0YXR0cnMgPSBoYXNBdHRycyA/IGFyZ3NbMV0gOiB7fSxcclxuXHRcdFx0Y2xhc3NBdHRyTmFtZSA9IFwiY2xhc3NcIiBpbiBhdHRycyA/IFwiY2xhc3NcIiA6IFwiY2xhc3NOYW1lXCIsXHJcblx0XHRcdGNlbGwgPSB7dGFnOiBcImRpdlwiLCBhdHRyczoge319LFxyXG5cdFx0XHRtYXRjaCxcclxuXHRcdFx0Y2xhc3NlcyA9IFtdO1xyXG5cclxuXHRcdGlmICh0eXBlLmNhbGwoYXJnc1swXSkgIT0gU1RSSU5HKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcInNlbGVjdG9yIGluIG0oc2VsZWN0b3IsIGF0dHJzLCBjaGlsZHJlbikgc2hvdWxkIGJlIGEgc3RyaW5nXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHdoaWxlIChtYXRjaCA9IHBhcnNlci5leGVjKGFyZ3NbMF0pKSB7XHJcblx0XHRcdGlmIChtYXRjaFsxXSA9PT0gXCJcIiAmJiBtYXRjaFsyXSkgY2VsbC50YWcgPSBtYXRjaFsyXTtcclxuXHRcdFx0ZWxzZSBpZiAobWF0Y2hbMV0gPT09IFwiI1wiKSBjZWxsLmF0dHJzLmlkID0gbWF0Y2hbMl07XHJcblx0XHRcdGVsc2UgaWYgKG1hdGNoWzFdID09PSBcIi5cIikgY2xhc3Nlcy5wdXNoKG1hdGNoWzJdKTtcclxuXHRcdFx0ZWxzZSBpZiAobWF0Y2hbM11bMF0gPT09IFwiW1wiKSB7XHJcblx0XHRcdFx0dmFyIHBhaXIgPSBhdHRyUGFyc2VyLmV4ZWMobWF0Y2hbM10pO1xyXG5cdFx0XHRcdGNlbGwuYXR0cnNbcGFpclsxXV0gPSBwYWlyWzNdIHx8IChwYWlyWzJdID8gXCJcIiA6dHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR2YXIgY2hpbGRyZW4gPSBoYXNBdHRycyA/IGFyZ3Muc2xpY2UoMikgOiBhcmdzLnNsaWNlKDEpO1xyXG5cdFx0aWYgKGNoaWxkcmVuLmxlbmd0aCA9PT0gMSAmJiB0eXBlLmNhbGwoY2hpbGRyZW5bMF0pID09PSBBUlJBWSkge1xyXG5cdFx0XHRjZWxsLmNoaWxkcmVuID0gY2hpbGRyZW5bMF07XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjZWxsLmNoaWxkcmVuID0gY2hpbGRyZW47XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yICh2YXIgYXR0ck5hbWUgaW4gYXR0cnMpIHtcclxuXHRcdFx0aWYgKGF0dHJzLmhhc093blByb3BlcnR5KGF0dHJOYW1lKSkge1xyXG5cdFx0XHRcdGlmIChhdHRyTmFtZSA9PT0gY2xhc3NBdHRyTmFtZSAmJiBhdHRyc1thdHRyTmFtZV0gIT0gbnVsbCAmJiBhdHRyc1thdHRyTmFtZV0gIT09IFwiXCIpIHtcclxuXHRcdFx0XHRcdGNsYXNzZXMucHVzaChhdHRyc1thdHRyTmFtZV0pO1xyXG5cdFx0XHRcdFx0Y2VsbC5hdHRyc1thdHRyTmFtZV0gPSBcIlwiOyAvL2NyZWF0ZSBrZXkgaW4gY29ycmVjdCBpdGVyYXRpb24gb3JkZXJcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y2VsbC5hdHRyc1thdHRyTmFtZV0gPSBhdHRyc1thdHRyTmFtZV07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAoY2xhc3Nlcy5sZW5ndGggPiAwKSBjZWxsLmF0dHJzW2NsYXNzQXR0ck5hbWVdID0gY2xhc3Nlcy5qb2luKFwiIFwiKTtcclxuXHJcblx0XHRyZXR1cm4gY2VsbDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGJ1aWxkKHBhcmVudEVsZW1lbnQsIHBhcmVudFRhZywgcGFyZW50Q2FjaGUsIHBhcmVudEluZGV4LCBkYXRhLCBjYWNoZWQsIHNob3VsZFJlYXR0YWNoLCBpbmRleCwgZWRpdGFibGUsIG5hbWVzcGFjZSwgY29uZmlncykge1xyXG5cdFx0Ly9gYnVpbGRgIGlzIGEgcmVjdXJzaXZlIGZ1bmN0aW9uIHRoYXQgbWFuYWdlcyBjcmVhdGlvbi9kaWZmaW5nL3JlbW92YWwgb2YgRE9NIGVsZW1lbnRzIGJhc2VkIG9uIGNvbXBhcmlzb24gYmV0d2VlbiBgZGF0YWAgYW5kIGBjYWNoZWRgXHJcblx0XHQvL3RoZSBkaWZmIGFsZ29yaXRobSBjYW4gYmUgc3VtbWFyaXplZCBhcyB0aGlzOlxyXG5cdFx0Ly8xIC0gY29tcGFyZSBgZGF0YWAgYW5kIGBjYWNoZWRgXHJcblx0XHQvLzIgLSBpZiB0aGV5IGFyZSBkaWZmZXJlbnQsIGNvcHkgYGRhdGFgIHRvIGBjYWNoZWRgIGFuZCB1cGRhdGUgdGhlIERPTSBiYXNlZCBvbiB3aGF0IHRoZSBkaWZmZXJlbmNlIGlzXHJcblx0XHQvLzMgLSByZWN1cnNpdmVseSBhcHBseSB0aGlzIGFsZ29yaXRobSBmb3IgZXZlcnkgYXJyYXkgYW5kIGZvciB0aGUgY2hpbGRyZW4gb2YgZXZlcnkgdmlydHVhbCBlbGVtZW50XHJcblxyXG5cdFx0Ly90aGUgYGNhY2hlZGAgZGF0YSBzdHJ1Y3R1cmUgaXMgZXNzZW50aWFsbHkgdGhlIHNhbWUgYXMgdGhlIHByZXZpb3VzIHJlZHJhdydzIGBkYXRhYCBkYXRhIHN0cnVjdHVyZSwgd2l0aCBhIGZldyBhZGRpdGlvbnM6XHJcblx0XHQvLy0gYGNhY2hlZGAgYWx3YXlzIGhhcyBhIHByb3BlcnR5IGNhbGxlZCBgbm9kZXNgLCB3aGljaCBpcyBhIGxpc3Qgb2YgRE9NIGVsZW1lbnRzIHRoYXQgY29ycmVzcG9uZCB0byB0aGUgZGF0YSByZXByZXNlbnRlZCBieSB0aGUgcmVzcGVjdGl2ZSB2aXJ0dWFsIGVsZW1lbnRcclxuXHRcdC8vLSBpbiBvcmRlciB0byBzdXBwb3J0IGF0dGFjaGluZyBgbm9kZXNgIGFzIGEgcHJvcGVydHkgb2YgYGNhY2hlZGAsIGBjYWNoZWRgIGlzICphbHdheXMqIGEgbm9uLXByaW1pdGl2ZSBvYmplY3QsIGkuZS4gaWYgdGhlIGRhdGEgd2FzIGEgc3RyaW5nLCB0aGVuIGNhY2hlZCBpcyBhIFN0cmluZyBpbnN0YW5jZS4gSWYgZGF0YSB3YXMgYG51bGxgIG9yIGB1bmRlZmluZWRgLCBjYWNoZWQgaXMgYG5ldyBTdHJpbmcoXCJcIilgXHJcblx0XHQvLy0gYGNhY2hlZCBhbHNvIGhhcyBhIGBjb25maWdDb250ZXh0YCBwcm9wZXJ0eSwgd2hpY2ggaXMgdGhlIHN0YXRlIHN0b3JhZ2Ugb2JqZWN0IGV4cG9zZWQgYnkgY29uZmlnKGVsZW1lbnQsIGlzSW5pdGlhbGl6ZWQsIGNvbnRleHQpXHJcblx0XHQvLy0gd2hlbiBgY2FjaGVkYCBpcyBhbiBPYmplY3QsIGl0IHJlcHJlc2VudHMgYSB2aXJ0dWFsIGVsZW1lbnQ7IHdoZW4gaXQncyBhbiBBcnJheSwgaXQgcmVwcmVzZW50cyBhIGxpc3Qgb2YgZWxlbWVudHM7IHdoZW4gaXQncyBhIFN0cmluZywgTnVtYmVyIG9yIEJvb2xlYW4sIGl0IHJlcHJlc2VudHMgYSB0ZXh0IG5vZGVcclxuXHJcblx0XHQvL2BwYXJlbnRFbGVtZW50YCBpcyBhIERPTSBlbGVtZW50IHVzZWQgZm9yIFczQyBET00gQVBJIGNhbGxzXHJcblx0XHQvL2BwYXJlbnRUYWdgIGlzIG9ubHkgdXNlZCBmb3IgaGFuZGxpbmcgYSBjb3JuZXIgY2FzZSBmb3IgdGV4dGFyZWEgdmFsdWVzXHJcblx0XHQvL2BwYXJlbnRDYWNoZWAgaXMgdXNlZCB0byByZW1vdmUgbm9kZXMgaW4gc29tZSBtdWx0aS1ub2RlIGNhc2VzXHJcblx0XHQvL2BwYXJlbnRJbmRleGAgYW5kIGBpbmRleGAgYXJlIHVzZWQgdG8gZmlndXJlIG91dCB0aGUgb2Zmc2V0IG9mIG5vZGVzLiBUaGV5J3JlIGFydGlmYWN0cyBmcm9tIGJlZm9yZSBhcnJheXMgc3RhcnRlZCBiZWluZyBmbGF0dGVuZWQgYW5kIGFyZSBsaWtlbHkgcmVmYWN0b3JhYmxlXHJcblx0XHQvL2BkYXRhYCBhbmQgYGNhY2hlZGAgYXJlLCByZXNwZWN0aXZlbHksIHRoZSBuZXcgYW5kIG9sZCBub2RlcyBiZWluZyBkaWZmZWRcclxuXHRcdC8vYHNob3VsZFJlYXR0YWNoYCBpcyBhIGZsYWcgaW5kaWNhdGluZyB3aGV0aGVyIGEgcGFyZW50IG5vZGUgd2FzIHJlY3JlYXRlZCAoaWYgc28sIGFuZCBpZiB0aGlzIG5vZGUgaXMgcmV1c2VkLCB0aGVuIHRoaXMgbm9kZSBtdXN0IHJlYXR0YWNoIGl0c2VsZiB0byB0aGUgbmV3IHBhcmVudClcclxuXHRcdC8vYGVkaXRhYmxlYCBpcyBhIGZsYWcgdGhhdCBpbmRpY2F0ZXMgd2hldGhlciBhbiBhbmNlc3RvciBpcyBjb250ZW50ZWRpdGFibGVcclxuXHRcdC8vYG5hbWVzcGFjZWAgaW5kaWNhdGVzIHRoZSBjbG9zZXN0IEhUTUwgbmFtZXNwYWNlIGFzIGl0IGNhc2NhZGVzIGRvd24gZnJvbSBhbiBhbmNlc3RvclxyXG5cdFx0Ly9gY29uZmlnc2AgaXMgYSBsaXN0IG9mIGNvbmZpZyBmdW5jdGlvbnMgdG8gcnVuIGFmdGVyIHRoZSB0b3Btb3N0IGBidWlsZGAgY2FsbCBmaW5pc2hlcyBydW5uaW5nXHJcblxyXG5cdFx0Ly90aGVyZSdzIGxvZ2ljIHRoYXQgcmVsaWVzIG9uIHRoZSBhc3N1bXB0aW9uIHRoYXQgbnVsbCBhbmQgdW5kZWZpbmVkIGRhdGEgYXJlIGVxdWl2YWxlbnQgdG8gZW1wdHkgc3RyaW5nc1xyXG5cdFx0Ly8tIHRoaXMgcHJldmVudHMgbGlmZWN5Y2xlIHN1cnByaXNlcyBmcm9tIHByb2NlZHVyYWwgaGVscGVycyB0aGF0IG1peCBpbXBsaWNpdCBhbmQgZXhwbGljaXQgcmV0dXJuIHN0YXRlbWVudHMgKGUuZy4gZnVuY3Rpb24gZm9vKCkge2lmIChjb25kKSByZXR1cm4gbShcImRpdlwiKX1cclxuXHRcdC8vLSBpdCBzaW1wbGlmaWVzIGRpZmZpbmcgY29kZVxyXG5cdFx0Ly9kYXRhLnRvU3RyaW5nKCkgbWlnaHQgdGhyb3cgb3IgcmV0dXJuIG51bGwgaWYgZGF0YSBpcyB0aGUgcmV0dXJuIHZhbHVlIG9mIENvbnNvbGUubG9nIGluIEZpcmVmb3ggKGJlaGF2aW9yIGRlcGVuZHMgb24gdmVyc2lvbilcclxuXHRcdHRyeSB7aWYgKGRhdGEgPT0gbnVsbCB8fCBkYXRhLnRvU3RyaW5nKCkgPT0gbnVsbCkgZGF0YSA9IFwiXCI7fSBjYXRjaCAoZSkge2RhdGEgPSBcIlwiO31cclxuXHRcdGlmIChkYXRhLnN1YnRyZWUgPT09IFwicmV0YWluXCIpIHJldHVybiBjYWNoZWQ7XHJcblx0XHR2YXIgY2FjaGVkVHlwZSA9IHR5cGUuY2FsbChjYWNoZWQpLCBkYXRhVHlwZSA9IHR5cGUuY2FsbChkYXRhKTtcclxuXHRcdGlmIChjYWNoZWQgPT0gbnVsbCB8fCBjYWNoZWRUeXBlICE9PSBkYXRhVHlwZSkge1xyXG5cdFx0XHRpZiAoY2FjaGVkICE9IG51bGwpIHtcclxuXHRcdFx0XHRpZiAocGFyZW50Q2FjaGUgJiYgcGFyZW50Q2FjaGUubm9kZXMpIHtcclxuXHRcdFx0XHRcdHZhciBvZmZzZXQgPSBpbmRleCAtIHBhcmVudEluZGV4O1xyXG5cdFx0XHRcdFx0dmFyIGVuZCA9IG9mZnNldCArIChkYXRhVHlwZSA9PT0gQVJSQVkgPyBkYXRhIDogY2FjaGVkLm5vZGVzKS5sZW5ndGg7XHJcblx0XHRcdFx0XHRjbGVhcihwYXJlbnRDYWNoZS5ub2Rlcy5zbGljZShvZmZzZXQsIGVuZCksIHBhcmVudENhY2hlLnNsaWNlKG9mZnNldCwgZW5kKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgaWYgKGNhY2hlZC5ub2RlcykgY2xlYXIoY2FjaGVkLm5vZGVzLCBjYWNoZWQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhY2hlZCA9IG5ldyBkYXRhLmNvbnN0cnVjdG9yO1xyXG5cdFx0XHRpZiAoY2FjaGVkLnRhZykgY2FjaGVkID0ge307IC8vaWYgY29uc3RydWN0b3IgY3JlYXRlcyBhIHZpcnR1YWwgZG9tIGVsZW1lbnQsIHVzZSBhIGJsYW5rIG9iamVjdCBhcyB0aGUgYmFzZSBjYWNoZWQgbm9kZSBpbnN0ZWFkIG9mIGNvcHlpbmcgdGhlIHZpcnR1YWwgZWwgKCMyNzcpXHJcblx0XHRcdGNhY2hlZC5ub2RlcyA9IFtdO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChkYXRhVHlwZSA9PT0gQVJSQVkpIHtcclxuXHRcdFx0Ly9yZWN1cnNpdmVseSBmbGF0dGVuIGFycmF5XHJcblx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0aWYgKHR5cGUuY2FsbChkYXRhW2ldKSA9PT0gQVJSQVkpIHtcclxuXHRcdFx0XHRcdGRhdGEgPSBkYXRhLmNvbmNhdC5hcHBseShbXSwgZGF0YSk7XHJcblx0XHRcdFx0XHRpLS07IC8vY2hlY2sgY3VycmVudCBpbmRleCBhZ2FpbiBhbmQgZmxhdHRlbiB1bnRpbCB0aGVyZSBhcmUgbm8gbW9yZSBuZXN0ZWQgYXJyYXlzIGF0IHRoYXQgaW5kZXhcclxuXHRcdFx0XHRcdGxlbiA9IGRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIG5vZGVzID0gW10sIGludGFjdCA9IGNhY2hlZC5sZW5ndGggPT09IGRhdGEubGVuZ3RoLCBzdWJBcnJheUNvdW50ID0gMDtcclxuXHJcblx0XHRcdC8va2V5cyBhbGdvcml0aG06IHNvcnQgZWxlbWVudHMgd2l0aG91dCByZWNyZWF0aW5nIHRoZW0gaWYga2V5cyBhcmUgcHJlc2VudFxyXG5cdFx0XHQvLzEpIGNyZWF0ZSBhIG1hcCBvZiBhbGwgZXhpc3Rpbmcga2V5cywgYW5kIG1hcmsgYWxsIGZvciBkZWxldGlvblxyXG5cdFx0XHQvLzIpIGFkZCBuZXcga2V5cyB0byBtYXAgYW5kIG1hcmsgdGhlbSBmb3IgYWRkaXRpb25cclxuXHRcdFx0Ly8zKSBpZiBrZXkgZXhpc3RzIGluIG5ldyBsaXN0LCBjaGFuZ2UgYWN0aW9uIGZyb20gZGVsZXRpb24gdG8gYSBtb3ZlXHJcblx0XHRcdC8vNCkgZm9yIGVhY2gga2V5LCBoYW5kbGUgaXRzIGNvcnJlc3BvbmRpbmcgYWN0aW9uIGFzIG1hcmtlZCBpbiBwcmV2aW91cyBzdGVwc1xyXG5cdFx0XHR2YXIgREVMRVRJT04gPSAxLCBJTlNFUlRJT04gPSAyICwgTU9WRSA9IDM7XHJcblx0XHRcdHZhciBleGlzdGluZyA9IHt9LCBzaG91bGRNYWludGFpbklkZW50aXRpZXMgPSBmYWxzZTtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjYWNoZWQubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRpZiAoY2FjaGVkW2ldICYmIGNhY2hlZFtpXS5hdHRycyAmJiBjYWNoZWRbaV0uYXR0cnMua2V5ICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdHNob3VsZE1haW50YWluSWRlbnRpdGllcyA9IHRydWU7XHJcblx0XHRcdFx0XHRleGlzdGluZ1tjYWNoZWRbaV0uYXR0cnMua2V5XSA9IHthY3Rpb246IERFTEVUSU9OLCBpbmRleDogaX07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgZ3VpZCA9IDBcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRpZiAoZGF0YVtpXSAmJiBkYXRhW2ldLmF0dHJzICYmIGRhdGFbaV0uYXR0cnMua2V5ICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdGZvciAodmFyIGogPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XHJcblx0XHRcdFx0XHRcdGlmIChkYXRhW2pdICYmIGRhdGFbal0uYXR0cnMgJiYgZGF0YVtqXS5hdHRycy5rZXkgPT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFbal0uYXR0cnMua2V5ID0gXCJfX21pdGhyaWxfX1wiICsgZ3VpZCsrO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChzaG91bGRNYWludGFpbklkZW50aXRpZXMpIHtcclxuXHRcdFx0XHR2YXIga2V5c0RpZmZlciA9IGZhbHNlO1xyXG5cdFx0XHRcdGlmIChkYXRhLmxlbmd0aCAhPSBjYWNoZWQubGVuZ3RoKSBrZXlzRGlmZmVyID0gdHJ1ZVxyXG5cdFx0XHRcdGVsc2UgZm9yICh2YXIgaSA9IDAsIGNhY2hlZENlbGwsIGRhdGFDZWxsOyBjYWNoZWRDZWxsID0gY2FjaGVkW2ldLCBkYXRhQ2VsbCA9IGRhdGFbaV07IGkrKykge1xyXG5cdFx0XHRcdFx0aWYgKGNhY2hlZENlbGwuYXR0cnMgJiYgZGF0YUNlbGwuYXR0cnMgJiYgY2FjaGVkQ2VsbC5hdHRycy5rZXkgIT0gZGF0YUNlbGwuYXR0cnMua2V5KSB7XHJcblx0XHRcdFx0XHRcdGtleXNEaWZmZXIgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRicmVha1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKGtleXNEaWZmZXIpIHtcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdGlmIChkYXRhW2ldICYmIGRhdGFbaV0uYXR0cnMpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoZGF0YVtpXS5hdHRycy5rZXkgIT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIGtleSA9IGRhdGFbaV0uYXR0cnMua2V5O1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFleGlzdGluZ1trZXldKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGV4aXN0aW5nW2tleV0gPSB7YWN0aW9uOiBJTlNFUlRJT04sIGluZGV4OiBpfTtcclxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGV4aXN0aW5nW2tleV0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YWN0aW9uOiBNT1ZFLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGluZGV4OiBpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZyb206IGV4aXN0aW5nW2tleV0uaW5kZXgsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxlbWVudDogY2FjaGVkLm5vZGVzW2V4aXN0aW5nW2tleV0uaW5kZXhdIHx8ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXHJcblx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR2YXIgYWN0aW9ucyA9IFtdO1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgcHJvcCBpbiBleGlzdGluZykgYWN0aW9ucy5wdXNoKGV4aXN0aW5nW3Byb3BdKTtcclxuXHRcdFx0XHRcdHZhciBjaGFuZ2VzID0gYWN0aW9ucy5zb3J0KHNvcnRDaGFuZ2VzKTtcclxuXHRcdFx0XHRcdHZhciBuZXdDYWNoZWQgPSBuZXcgQXJyYXkoY2FjaGVkLmxlbmd0aCk7XHJcblx0XHRcdFx0XHRuZXdDYWNoZWQubm9kZXMgPSBjYWNoZWQubm9kZXMuc2xpY2UoKTtcclxuXHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgY2hhbmdlOyBjaGFuZ2UgPSBjaGFuZ2VzW2ldOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0aWYgKGNoYW5nZS5hY3Rpb24gPT09IERFTEVUSU9OKSB7XHJcblx0XHRcdFx0XHRcdFx0Y2xlYXIoY2FjaGVkW2NoYW5nZS5pbmRleF0ubm9kZXMsIGNhY2hlZFtjaGFuZ2UuaW5kZXhdKTtcclxuXHRcdFx0XHRcdFx0XHRuZXdDYWNoZWQuc3BsaWNlKGNoYW5nZS5pbmRleCwgMSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYgKGNoYW5nZS5hY3Rpb24gPT09IElOU0VSVElPTikge1xyXG5cdFx0XHRcdFx0XHRcdHZhciBkdW1teSA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5cdFx0XHRcdFx0XHRcdGR1bW15LmtleSA9IGRhdGFbY2hhbmdlLmluZGV4XS5hdHRycy5rZXk7XHJcblx0XHRcdFx0XHRcdFx0cGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoZHVtbXksIHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tjaGFuZ2UuaW5kZXhdIHx8IG51bGwpO1xyXG5cdFx0XHRcdFx0XHRcdG5ld0NhY2hlZC5zcGxpY2UoY2hhbmdlLmluZGV4LCAwLCB7YXR0cnM6IHtrZXk6IGRhdGFbY2hhbmdlLmluZGV4XS5hdHRycy5rZXl9LCBub2RlczogW2R1bW15XX0pO1xyXG5cdFx0XHRcdFx0XHRcdG5ld0NhY2hlZC5ub2Rlc1tjaGFuZ2UuaW5kZXhdID0gZHVtbXk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGlmIChjaGFuZ2UuYWN0aW9uID09PSBNT1ZFKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tjaGFuZ2UuaW5kZXhdICE9PSBjaGFuZ2UuZWxlbWVudCAmJiBjaGFuZ2UuZWxlbWVudCAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoY2hhbmdlLmVsZW1lbnQsIHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tjaGFuZ2UuaW5kZXhdIHx8IG51bGwpXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdG5ld0NhY2hlZFtjaGFuZ2UuaW5kZXhdID0gY2FjaGVkW2NoYW5nZS5mcm9tXTtcclxuXHRcdFx0XHRcdFx0XHRuZXdDYWNoZWQubm9kZXNbY2hhbmdlLmluZGV4XSA9IGNoYW5nZS5lbGVtZW50XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNhY2hlZCA9IG5ld0NhY2hlZDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Ly9lbmQga2V5IGFsZ29yaXRobVxyXG5cclxuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGNhY2hlQ291bnQgPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0Ly9kaWZmIGVhY2ggaXRlbSBpbiB0aGUgYXJyYXlcclxuXHRcdFx0XHR2YXIgaXRlbSA9IGJ1aWxkKHBhcmVudEVsZW1lbnQsIHBhcmVudFRhZywgY2FjaGVkLCBpbmRleCwgZGF0YVtpXSwgY2FjaGVkW2NhY2hlQ291bnRdLCBzaG91bGRSZWF0dGFjaCwgaW5kZXggKyBzdWJBcnJheUNvdW50IHx8IHN1YkFycmF5Q291bnQsIGVkaXRhYmxlLCBuYW1lc3BhY2UsIGNvbmZpZ3MpO1xyXG5cdFx0XHRcdGlmIChpdGVtID09PSB1bmRlZmluZWQpIGNvbnRpbnVlO1xyXG5cdFx0XHRcdGlmICghaXRlbS5ub2Rlcy5pbnRhY3QpIGludGFjdCA9IGZhbHNlO1xyXG5cdFx0XHRcdGlmIChpdGVtLiR0cnVzdGVkKSB7XHJcblx0XHRcdFx0XHQvL2ZpeCBvZmZzZXQgb2YgbmV4dCBlbGVtZW50IGlmIGl0ZW0gd2FzIGEgdHJ1c3RlZCBzdHJpbmcgdy8gbW9yZSB0aGFuIG9uZSBodG1sIGVsZW1lbnRcclxuXHRcdFx0XHRcdC8vdGhlIGZpcnN0IGNsYXVzZSBpbiB0aGUgcmVnZXhwIG1hdGNoZXMgZWxlbWVudHNcclxuXHRcdFx0XHRcdC8vdGhlIHNlY29uZCBjbGF1c2UgKGFmdGVyIHRoZSBwaXBlKSBtYXRjaGVzIHRleHQgbm9kZXNcclxuXHRcdFx0XHRcdHN1YkFycmF5Q291bnQgKz0gKGl0ZW0ubWF0Y2goLzxbXlxcL118XFw+XFxzKltePF0vZykgfHwgWzBdKS5sZW5ndGg7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Ugc3ViQXJyYXlDb3VudCArPSB0eXBlLmNhbGwoaXRlbSkgPT09IEFSUkFZID8gaXRlbS5sZW5ndGggOiAxO1xyXG5cdFx0XHRcdGNhY2hlZFtjYWNoZUNvdW50KytdID0gaXRlbVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghaW50YWN0KSB7XHJcblx0XHRcdFx0Ly9kaWZmIHRoZSBhcnJheSBpdHNlbGZcclxuXHJcblx0XHRcdFx0Ly91cGRhdGUgdGhlIGxpc3Qgb2YgRE9NIG5vZGVzIGJ5IGNvbGxlY3RpbmcgdGhlIG5vZGVzIGZyb20gZWFjaCBpdGVtXHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRcdGlmIChjYWNoZWRbaV0gIT0gbnVsbCkgbm9kZXMucHVzaC5hcHBseShub2RlcywgY2FjaGVkW2ldLm5vZGVzKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvL3JlbW92ZSBpdGVtcyBmcm9tIHRoZSBlbmQgb2YgdGhlIGFycmF5IGlmIHRoZSBuZXcgYXJyYXkgaXMgc2hvcnRlciB0aGFuIHRoZSBvbGQgb25lXHJcblx0XHRcdFx0Ly9pZiBlcnJvcnMgZXZlciBoYXBwZW4gaGVyZSwgdGhlIGlzc3VlIGlzIG1vc3QgbGlrZWx5IGEgYnVnIGluIHRoZSBjb25zdHJ1Y3Rpb24gb2YgdGhlIGBjYWNoZWRgIGRhdGEgc3RydWN0dXJlIHNvbWV3aGVyZSBlYXJsaWVyIGluIHRoZSBwcm9ncmFtXHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIG5vZGU7IG5vZGUgPSBjYWNoZWQubm9kZXNbaV07IGkrKykge1xyXG5cdFx0XHRcdFx0aWYgKG5vZGUucGFyZW50Tm9kZSAhPSBudWxsICYmIG5vZGVzLmluZGV4T2Yobm9kZSkgPCAwKSBjbGVhcihbbm9kZV0sIFtjYWNoZWRbaV1dKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoZGF0YS5sZW5ndGggPCBjYWNoZWQubGVuZ3RoKSBjYWNoZWQubGVuZ3RoID0gZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0Y2FjaGVkLm5vZGVzID0gbm9kZXNcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoZGF0YSAhPSBudWxsICYmIGRhdGFUeXBlID09PSBPQkpFQ1QpIHtcclxuXHRcdFx0dmFyIHZpZXdzID0gW10sXHJcblx0XHRcdFx0Y29udHJvbGxlcnMgPSBbXTtcclxuXHJcblx0XHRcdHdoaWxlIChkYXRhLnZpZXcpIHtcclxuXHRcdFx0XHR2YXIgdmlldyA9IGRhdGEudmlldy4kb3JpZ2luYWwgfHwgZGF0YS52aWV3O1xyXG5cdFx0XHRcdHZhciBjb250cm9sbGVySW5kZXggPSBtLnJlZHJhdy5zdHJhdGVneSgpID09IFwiZGlmZlwiICYmIGNhY2hlZC52aWV3cyA/IGNhY2hlZC52aWV3cy5pbmRleE9mKHZpZXcpIDogLTE7XHJcblx0XHRcdFx0dmFyIGNvbnRyb2xsZXIgPSBjb250cm9sbGVySW5kZXggPiAtMSA/IGNhY2hlZC5jb250cm9sbGVyc1tjb250cm9sbGVySW5kZXhdIDogbmV3IChkYXRhLmNvbnRyb2xsZXIgfHwgbm9vcCk7XHJcblx0XHRcdFx0dmFyIGtleSA9IGRhdGEgJiYgZGF0YS5hdHRycyAmJiBkYXRhLmF0dHJzLmtleTtcclxuXHRcdFx0XHRkYXRhID0gcGVuZGluZ1JlcXVlc3RzID09IDAgfHwgKGNhY2hlZCAmJiBjYWNoZWQuY29udHJvbGxlcnMgJiYgY2FjaGVkLmNvbnRyb2xsZXJzLmluZGV4T2YoY29udHJvbGxlcikgPiAtMSkgPyBkYXRhLnZpZXcoY29udHJvbGxlcikgOiB7dGFnOiBcInBsYWNlaG9sZGVyXCJ9O1xyXG5cdFx0XHRcdGlmIChkYXRhLnN1YnRyZWUgPT09IFwicmV0YWluXCIpIHJldHVybiBjYWNoZWQ7XHJcblx0XHRcdFx0aWYgKGtleSkge1xyXG5cdFx0XHRcdFx0aWYgKCFkYXRhLmF0dHJzKSBkYXRhLmF0dHJzID0ge307XHJcblx0XHRcdFx0XHRkYXRhLmF0dHJzLmtleSA9IGtleVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoY29udHJvbGxlci5vbnVubG9hZCkgdW5sb2FkZXJzLnB1c2goe2NvbnRyb2xsZXI6IGNvbnRyb2xsZXIsIGhhbmRsZXI6IGNvbnRyb2xsZXIub251bmxvYWR9KTtcclxuXHRcdFx0XHR2aWV3cy5wdXNoKHZpZXcpO1xyXG5cdFx0XHRcdGNvbnRyb2xsZXJzLnB1c2goY29udHJvbGxlcik7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFkYXRhLnRhZyAmJiBjb250cm9sbGVycy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCB0ZW1wbGF0ZSBtdXN0IHJldHVybiBhIHZpcnR1YWwgZWxlbWVudCwgbm90IGFuIGFycmF5LCBzdHJpbmcsIGV0Yy5cIilcclxuXHRcdFx0aWYgKCFkYXRhLmF0dHJzKSBkYXRhLmF0dHJzID0ge307XHJcblx0XHRcdGlmICghY2FjaGVkLmF0dHJzKSBjYWNoZWQuYXR0cnMgPSB7fTtcclxuXHJcblx0XHRcdHZhciBkYXRhQXR0cktleXMgPSBPYmplY3Qua2V5cyhkYXRhLmF0dHJzKTtcclxuXHRcdFx0dmFyIGhhc0tleXMgPSBkYXRhQXR0cktleXMubGVuZ3RoID4gKFwia2V5XCIgaW4gZGF0YS5hdHRycyA/IDEgOiAwKTtcclxuXHRcdFx0Ly9pZiBhbiBlbGVtZW50IGlzIGRpZmZlcmVudCBlbm91Z2ggZnJvbSB0aGUgb25lIGluIGNhY2hlLCByZWNyZWF0ZSBpdFxyXG5cdFx0XHRpZiAoZGF0YS50YWcgIT0gY2FjaGVkLnRhZyB8fCBkYXRhQXR0cktleXMuc29ydCgpLmpvaW4oKSAhPSBPYmplY3Qua2V5cyhjYWNoZWQuYXR0cnMpLnNvcnQoKS5qb2luKCkgfHwgZGF0YS5hdHRycy5pZCAhPSBjYWNoZWQuYXR0cnMuaWQgfHwgZGF0YS5hdHRycy5rZXkgIT0gY2FjaGVkLmF0dHJzLmtleSB8fCAobS5yZWRyYXcuc3RyYXRlZ3koKSA9PSBcImFsbFwiICYmICghY2FjaGVkLmNvbmZpZ0NvbnRleHQgfHwgY2FjaGVkLmNvbmZpZ0NvbnRleHQucmV0YWluICE9PSB0cnVlKSkgfHwgKG0ucmVkcmF3LnN0cmF0ZWd5KCkgPT0gXCJkaWZmXCIgJiYgY2FjaGVkLmNvbmZpZ0NvbnRleHQgJiYgY2FjaGVkLmNvbmZpZ0NvbnRleHQucmV0YWluID09PSBmYWxzZSkpIHtcclxuXHRcdFx0XHRpZiAoY2FjaGVkLm5vZGVzLmxlbmd0aCkgY2xlYXIoY2FjaGVkLm5vZGVzKTtcclxuXHRcdFx0XHRpZiAoY2FjaGVkLmNvbmZpZ0NvbnRleHQgJiYgdHlwZW9mIGNhY2hlZC5jb25maWdDb250ZXh0Lm9udW5sb2FkID09PSBGVU5DVElPTikgY2FjaGVkLmNvbmZpZ0NvbnRleHQub251bmxvYWQoKVxyXG5cdFx0XHRcdGlmIChjYWNoZWQuY29udHJvbGxlcnMpIHtcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwLCBjb250cm9sbGVyOyBjb250cm9sbGVyID0gY2FjaGVkLmNvbnRyb2xsZXJzW2ldOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBjb250cm9sbGVyLm9udW5sb2FkID09PSBGVU5DVElPTikgY29udHJvbGxlci5vbnVubG9hZCh7cHJldmVudERlZmF1bHQ6IG5vb3B9KVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodHlwZS5jYWxsKGRhdGEudGFnKSAhPSBTVFJJTkcpIHJldHVybjtcclxuXHJcblx0XHRcdHZhciBub2RlLCBpc05ldyA9IGNhY2hlZC5ub2Rlcy5sZW5ndGggPT09IDA7XHJcblx0XHRcdGlmIChkYXRhLmF0dHJzLnhtbG5zKSBuYW1lc3BhY2UgPSBkYXRhLmF0dHJzLnhtbG5zO1xyXG5cdFx0XHRlbHNlIGlmIChkYXRhLnRhZyA9PT0gXCJzdmdcIikgbmFtZXNwYWNlID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiO1xyXG5cdFx0XHRlbHNlIGlmIChkYXRhLnRhZyA9PT0gXCJtYXRoXCIpIG5hbWVzcGFjZSA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OC9NYXRoL01hdGhNTFwiO1xyXG5cclxuXHRcdFx0aWYgKGlzTmV3KSB7XHJcblx0XHRcdFx0aWYgKGRhdGEuYXR0cnMuaXMpIG5vZGUgPSBuYW1lc3BhY2UgPT09IHVuZGVmaW5lZCA/ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KGRhdGEudGFnLCBkYXRhLmF0dHJzLmlzKSA6ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlLCBkYXRhLnRhZywgZGF0YS5hdHRycy5pcyk7XHJcblx0XHRcdFx0ZWxzZSBub2RlID0gbmFtZXNwYWNlID09PSB1bmRlZmluZWQgPyAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChkYXRhLnRhZykgOiAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZSwgZGF0YS50YWcpO1xyXG5cdFx0XHRcdGNhY2hlZCA9IHtcclxuXHRcdFx0XHRcdHRhZzogZGF0YS50YWcsXHJcblx0XHRcdFx0XHQvL3NldCBhdHRyaWJ1dGVzIGZpcnN0LCB0aGVuIGNyZWF0ZSBjaGlsZHJlblxyXG5cdFx0XHRcdFx0YXR0cnM6IGhhc0tleXMgPyBzZXRBdHRyaWJ1dGVzKG5vZGUsIGRhdGEudGFnLCBkYXRhLmF0dHJzLCB7fSwgbmFtZXNwYWNlKSA6IGRhdGEuYXR0cnMsXHJcblx0XHRcdFx0XHRjaGlsZHJlbjogZGF0YS5jaGlsZHJlbiAhPSBudWxsICYmIGRhdGEuY2hpbGRyZW4ubGVuZ3RoID4gMCA/XHJcblx0XHRcdFx0XHRcdGJ1aWxkKG5vZGUsIGRhdGEudGFnLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZGF0YS5jaGlsZHJlbiwgY2FjaGVkLmNoaWxkcmVuLCB0cnVlLCAwLCBkYXRhLmF0dHJzLmNvbnRlbnRlZGl0YWJsZSA/IG5vZGUgOiBlZGl0YWJsZSwgbmFtZXNwYWNlLCBjb25maWdzKSA6XHJcblx0XHRcdFx0XHRcdGRhdGEuY2hpbGRyZW4sXHJcblx0XHRcdFx0XHRub2RlczogW25vZGVdXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRpZiAoY29udHJvbGxlcnMubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRjYWNoZWQudmlld3MgPSB2aWV3c1xyXG5cdFx0XHRcdFx0Y2FjaGVkLmNvbnRyb2xsZXJzID0gY29udHJvbGxlcnNcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwLCBjb250cm9sbGVyOyBjb250cm9sbGVyID0gY29udHJvbGxlcnNbaV07IGkrKykge1xyXG5cdFx0XHRcdFx0XHRpZiAoY29udHJvbGxlci5vbnVubG9hZCAmJiBjb250cm9sbGVyLm9udW5sb2FkLiRvbGQpIGNvbnRyb2xsZXIub251bmxvYWQgPSBjb250cm9sbGVyLm9udW5sb2FkLiRvbGRcclxuXHRcdFx0XHRcdFx0aWYgKHBlbmRpbmdSZXF1ZXN0cyAmJiBjb250cm9sbGVyLm9udW5sb2FkKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIG9udW5sb2FkID0gY29udHJvbGxlci5vbnVubG9hZFxyXG5cdFx0XHRcdFx0XHRcdGNvbnRyb2xsZXIub251bmxvYWQgPSBub29wXHJcblx0XHRcdFx0XHRcdFx0Y29udHJvbGxlci5vbnVubG9hZC4kb2xkID0gb251bmxvYWRcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKGNhY2hlZC5jaGlsZHJlbiAmJiAhY2FjaGVkLmNoaWxkcmVuLm5vZGVzKSBjYWNoZWQuY2hpbGRyZW4ubm9kZXMgPSBbXTtcclxuXHRcdFx0XHQvL2VkZ2UgY2FzZTogc2V0dGluZyB2YWx1ZSBvbiA8c2VsZWN0PiBkb2Vzbid0IHdvcmsgYmVmb3JlIGNoaWxkcmVuIGV4aXN0LCBzbyBzZXQgaXQgYWdhaW4gYWZ0ZXIgY2hpbGRyZW4gaGF2ZSBiZWVuIGNyZWF0ZWRcclxuXHRcdFx0XHRpZiAoZGF0YS50YWcgPT09IFwic2VsZWN0XCIgJiYgXCJ2YWx1ZVwiIGluIGRhdGEuYXR0cnMpIHNldEF0dHJpYnV0ZXMobm9kZSwgZGF0YS50YWcsIHt2YWx1ZTogZGF0YS5hdHRycy52YWx1ZX0sIHt9LCBuYW1lc3BhY2UpO1xyXG5cdFx0XHRcdHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKG5vZGUsIHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF0gfHwgbnVsbClcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRub2RlID0gY2FjaGVkLm5vZGVzWzBdO1xyXG5cdFx0XHRcdGlmIChoYXNLZXlzKSBzZXRBdHRyaWJ1dGVzKG5vZGUsIGRhdGEudGFnLCBkYXRhLmF0dHJzLCBjYWNoZWQuYXR0cnMsIG5hbWVzcGFjZSk7XHJcblx0XHRcdFx0Y2FjaGVkLmNoaWxkcmVuID0gYnVpbGQobm9kZSwgZGF0YS50YWcsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBkYXRhLmNoaWxkcmVuLCBjYWNoZWQuY2hpbGRyZW4sIGZhbHNlLCAwLCBkYXRhLmF0dHJzLmNvbnRlbnRlZGl0YWJsZSA/IG5vZGUgOiBlZGl0YWJsZSwgbmFtZXNwYWNlLCBjb25maWdzKTtcclxuXHRcdFx0XHRjYWNoZWQubm9kZXMuaW50YWN0ID0gdHJ1ZTtcclxuXHRcdFx0XHRpZiAoY29udHJvbGxlcnMubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRjYWNoZWQudmlld3MgPSB2aWV3c1xyXG5cdFx0XHRcdFx0Y2FjaGVkLmNvbnRyb2xsZXJzID0gY29udHJvbGxlcnNcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHNob3VsZFJlYXR0YWNoID09PSB0cnVlICYmIG5vZGUgIT0gbnVsbCkgcGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUobm9kZSwgcGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2luZGV4XSB8fCBudWxsKVxyXG5cdFx0XHR9XHJcblx0XHRcdC8vc2NoZWR1bGUgY29uZmlncyB0byBiZSBjYWxsZWQuIFRoZXkgYXJlIGNhbGxlZCBhZnRlciBgYnVpbGRgIGZpbmlzaGVzIHJ1bm5pbmdcclxuXHRcdFx0aWYgKHR5cGVvZiBkYXRhLmF0dHJzW1wiY29uZmlnXCJdID09PSBGVU5DVElPTikge1xyXG5cdFx0XHRcdHZhciBjb250ZXh0ID0gY2FjaGVkLmNvbmZpZ0NvbnRleHQgPSBjYWNoZWQuY29uZmlnQ29udGV4dCB8fCB7fTtcclxuXHJcblx0XHRcdFx0Ly8gYmluZFxyXG5cdFx0XHRcdHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uKGRhdGEsIGFyZ3MpIHtcclxuXHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGRhdGEuYXR0cnNbXCJjb25maWdcIl0uYXBwbHkoZGF0YSwgYXJncylcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGNvbmZpZ3MucHVzaChjYWxsYmFjayhkYXRhLCBbbm9kZSwgIWlzTmV3LCBjb250ZXh0LCBjYWNoZWRdKSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodHlwZW9mIGRhdGEgIT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0Ly9oYW5kbGUgdGV4dCBub2Rlc1xyXG5cdFx0XHR2YXIgbm9kZXM7XHJcblx0XHRcdGlmIChjYWNoZWQubm9kZXMubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdFx0aWYgKGRhdGEuJHRydXN0ZWQpIHtcclxuXHRcdFx0XHRcdG5vZGVzID0gaW5qZWN0SFRNTChwYXJlbnRFbGVtZW50LCBpbmRleCwgZGF0YSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRub2RlcyA9IFskZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGF0YSldO1xyXG5cdFx0XHRcdFx0aWYgKCFwYXJlbnRFbGVtZW50Lm5vZGVOYW1lLm1hdGNoKHZvaWRFbGVtZW50cykpIHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKG5vZGVzWzBdLCBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdIHx8IG51bGwpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhY2hlZCA9IFwic3RyaW5nIG51bWJlciBib29sZWFuXCIuaW5kZXhPZih0eXBlb2YgZGF0YSkgPiAtMSA/IG5ldyBkYXRhLmNvbnN0cnVjdG9yKGRhdGEpIDogZGF0YTtcclxuXHRcdFx0XHRjYWNoZWQubm9kZXMgPSBub2Rlc1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGNhY2hlZC52YWx1ZU9mKCkgIT09IGRhdGEudmFsdWVPZigpIHx8IHNob3VsZFJlYXR0YWNoID09PSB0cnVlKSB7XHJcblx0XHRcdFx0bm9kZXMgPSBjYWNoZWQubm9kZXM7XHJcblx0XHRcdFx0aWYgKCFlZGl0YWJsZSB8fCBlZGl0YWJsZSAhPT0gJGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHtcclxuXHRcdFx0XHRcdGlmIChkYXRhLiR0cnVzdGVkKSB7XHJcblx0XHRcdFx0XHRcdGNsZWFyKG5vZGVzLCBjYWNoZWQpO1xyXG5cdFx0XHRcdFx0XHRub2RlcyA9IGluamVjdEhUTUwocGFyZW50RWxlbWVudCwgaW5kZXgsIGRhdGEpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly9jb3JuZXIgY2FzZTogcmVwbGFjaW5nIHRoZSBub2RlVmFsdWUgb2YgYSB0ZXh0IG5vZGUgdGhhdCBpcyBhIGNoaWxkIG9mIGEgdGV4dGFyZWEvY29udGVudGVkaXRhYmxlIGRvZXNuJ3Qgd29ya1xyXG5cdFx0XHRcdFx0XHQvL3dlIG5lZWQgdG8gdXBkYXRlIHRoZSB2YWx1ZSBwcm9wZXJ0eSBvZiB0aGUgcGFyZW50IHRleHRhcmVhIG9yIHRoZSBpbm5lckhUTUwgb2YgdGhlIGNvbnRlbnRlZGl0YWJsZSBlbGVtZW50IGluc3RlYWRcclxuXHRcdFx0XHRcdFx0aWYgKHBhcmVudFRhZyA9PT0gXCJ0ZXh0YXJlYVwiKSBwYXJlbnRFbGVtZW50LnZhbHVlID0gZGF0YTtcclxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoZWRpdGFibGUpIGVkaXRhYmxlLmlubmVySFRNTCA9IGRhdGE7XHJcblx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChub2Rlc1swXS5ub2RlVHlwZSA9PT0gMSB8fCBub2Rlcy5sZW5ndGggPiAxKSB7IC8vd2FzIGEgdHJ1c3RlZCBzdHJpbmdcclxuXHRcdFx0XHRcdFx0XHRcdGNsZWFyKGNhY2hlZC5ub2RlcywgY2FjaGVkKTtcclxuXHRcdFx0XHRcdFx0XHRcdG5vZGVzID0gWyRkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkYXRhKV1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0cGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUobm9kZXNbMF0sIHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF0gfHwgbnVsbCk7XHJcblx0XHRcdFx0XHRcdFx0bm9kZXNbMF0ubm9kZVZhbHVlID0gZGF0YVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhY2hlZCA9IG5ldyBkYXRhLmNvbnN0cnVjdG9yKGRhdGEpO1xyXG5cdFx0XHRcdGNhY2hlZC5ub2RlcyA9IG5vZGVzXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBjYWNoZWQubm9kZXMuaW50YWN0ID0gdHJ1ZVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBjYWNoZWRcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNvcnRDaGFuZ2VzKGEsIGIpIHtcclxuXHRcdHJldHVybiBhLmFjdGlvbiAtIGIuYWN0aW9uIHx8IGEuaW5kZXggLSBiLmluZGV4O1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0QXR0cmlidXRlcyhub2RlLCB0YWcsIGRhdGFBdHRycywgY2FjaGVkQXR0cnMsIG5hbWVzcGFjZSkge1xyXG5cdFx0Zm9yICh2YXIgYXR0ck5hbWUgaW4gZGF0YUF0dHJzKSB7XHJcblx0XHRcdHZhciBkYXRhQXR0ciA9IGRhdGFBdHRyc1thdHRyTmFtZV07XHJcblx0XHRcdHZhciBjYWNoZWRBdHRyID0gY2FjaGVkQXR0cnNbYXR0ck5hbWVdO1xyXG5cdFx0XHRpZiAoIShhdHRyTmFtZSBpbiBjYWNoZWRBdHRycykgfHwgKGNhY2hlZEF0dHIgIT09IGRhdGFBdHRyKSkge1xyXG5cdFx0XHRcdGNhY2hlZEF0dHJzW2F0dHJOYW1lXSA9IGRhdGFBdHRyO1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHQvL2Bjb25maWdgIGlzbid0IGEgcmVhbCBhdHRyaWJ1dGVzLCBzbyBpZ25vcmUgaXRcclxuXHRcdFx0XHRcdGlmIChhdHRyTmFtZSA9PT0gXCJjb25maWdcIiB8fCBhdHRyTmFtZSA9PSBcImtleVwiKSBjb250aW51ZTtcclxuXHRcdFx0XHRcdC8vaG9vayBldmVudCBoYW5kbGVycyB0byB0aGUgYXV0by1yZWRyYXdpbmcgc3lzdGVtXHJcblx0XHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGF0YUF0dHIgPT09IEZVTkNUSU9OICYmIGF0dHJOYW1lLmluZGV4T2YoXCJvblwiKSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHRub2RlW2F0dHJOYW1lXSA9IGF1dG9yZWRyYXcoZGF0YUF0dHIsIG5vZGUpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvL2hhbmRsZSBgc3R5bGU6IHsuLi59YFxyXG5cdFx0XHRcdFx0ZWxzZSBpZiAoYXR0ck5hbWUgPT09IFwic3R5bGVcIiAmJiBkYXRhQXR0ciAhPSBudWxsICYmIHR5cGUuY2FsbChkYXRhQXR0cikgPT09IE9CSkVDVCkge1xyXG5cdFx0XHRcdFx0XHRmb3IgKHZhciBydWxlIGluIGRhdGFBdHRyKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGNhY2hlZEF0dHIgPT0gbnVsbCB8fCBjYWNoZWRBdHRyW3J1bGVdICE9PSBkYXRhQXR0cltydWxlXSkgbm9kZS5zdHlsZVtydWxlXSA9IGRhdGFBdHRyW3J1bGVdXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgcnVsZSBpbiBjYWNoZWRBdHRyKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCEocnVsZSBpbiBkYXRhQXR0cikpIG5vZGUuc3R5bGVbcnVsZV0gPSBcIlwiXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vaGFuZGxlIFNWR1xyXG5cdFx0XHRcdFx0ZWxzZSBpZiAobmFtZXNwYWNlICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGF0dHJOYW1lID09PSBcImhyZWZcIikgbm9kZS5zZXRBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiwgXCJocmVmXCIsIGRhdGFBdHRyKTtcclxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoYXR0ck5hbWUgPT09IFwiY2xhc3NOYW1lXCIpIG5vZGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgZGF0YUF0dHIpO1xyXG5cdFx0XHRcdFx0XHRlbHNlIG5vZGUuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCBkYXRhQXR0cilcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vaGFuZGxlIGNhc2VzIHRoYXQgYXJlIHByb3BlcnRpZXMgKGJ1dCBpZ25vcmUgY2FzZXMgd2hlcmUgd2Ugc2hvdWxkIHVzZSBzZXRBdHRyaWJ1dGUgaW5zdGVhZClcclxuXHRcdFx0XHRcdC8vLSBsaXN0IGFuZCBmb3JtIGFyZSB0eXBpY2FsbHkgdXNlZCBhcyBzdHJpbmdzLCBidXQgYXJlIERPTSBlbGVtZW50IHJlZmVyZW5jZXMgaW4ganNcclxuXHRcdFx0XHRcdC8vLSB3aGVuIHVzaW5nIENTUyBzZWxlY3RvcnMgKGUuZy4gYG0oXCJbc3R5bGU9JyddXCIpYCksIHN0eWxlIGlzIHVzZWQgYXMgYSBzdHJpbmcsIGJ1dCBpdCdzIGFuIG9iamVjdCBpbiBqc1xyXG5cdFx0XHRcdFx0ZWxzZSBpZiAoYXR0ck5hbWUgaW4gbm9kZSAmJiAhKGF0dHJOYW1lID09PSBcImxpc3RcIiB8fCBhdHRyTmFtZSA9PT0gXCJzdHlsZVwiIHx8IGF0dHJOYW1lID09PSBcImZvcm1cIiB8fCBhdHRyTmFtZSA9PT0gXCJ0eXBlXCIgfHwgYXR0ck5hbWUgPT09IFwid2lkdGhcIiB8fCBhdHRyTmFtZSA9PT0gXCJoZWlnaHRcIikpIHtcclxuXHRcdFx0XHRcdFx0Ly8jMzQ4IGRvbid0IHNldCB0aGUgdmFsdWUgaWYgbm90IG5lZWRlZCBvdGhlcndpc2UgY3Vyc29yIHBsYWNlbWVudCBicmVha3MgaW4gQ2hyb21lXHJcblx0XHRcdFx0XHRcdGlmICh0YWcgIT09IFwiaW5wdXRcIiB8fCBub2RlW2F0dHJOYW1lXSAhPT0gZGF0YUF0dHIpIG5vZGVbYXR0ck5hbWVdID0gZGF0YUF0dHJcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Ugbm9kZS5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGRhdGFBdHRyKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXRjaCAoZSkge1xyXG5cdFx0XHRcdFx0Ly9zd2FsbG93IElFJ3MgaW52YWxpZCBhcmd1bWVudCBlcnJvcnMgdG8gbWltaWMgSFRNTCdzIGZhbGxiYWNrLXRvLWRvaW5nLW5vdGhpbmctb24taW52YWxpZC1hdHRyaWJ1dGVzIGJlaGF2aW9yXHJcblx0XHRcdFx0XHRpZiAoZS5tZXNzYWdlLmluZGV4T2YoXCJJbnZhbGlkIGFyZ3VtZW50XCIpIDwgMCkgdGhyb3cgZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQvLyMzNDggZGF0YUF0dHIgbWF5IG5vdCBiZSBhIHN0cmluZywgc28gdXNlIGxvb3NlIGNvbXBhcmlzb24gKGRvdWJsZSBlcXVhbCkgaW5zdGVhZCBvZiBzdHJpY3QgKHRyaXBsZSBlcXVhbClcclxuXHRcdFx0ZWxzZSBpZiAoYXR0ck5hbWUgPT09IFwidmFsdWVcIiAmJiB0YWcgPT09IFwiaW5wdXRcIiAmJiBub2RlLnZhbHVlICE9IGRhdGFBdHRyKSB7XHJcblx0XHRcdFx0bm9kZS52YWx1ZSA9IGRhdGFBdHRyXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBjYWNoZWRBdHRycztcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNsZWFyKG5vZGVzLCBjYWNoZWQpIHtcclxuXHRcdGZvciAodmFyIGkgPSBub2Rlcy5sZW5ndGggLSAxOyBpID4gLTE7IGktLSkge1xyXG5cdFx0XHRpZiAobm9kZXNbaV0gJiYgbm9kZXNbaV0ucGFyZW50Tm9kZSkge1xyXG5cdFx0XHRcdHRyeSB7bm9kZXNbaV0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2Rlc1tpXSl9XHJcblx0XHRcdFx0Y2F0Y2ggKGUpIHt9IC8vaWdub3JlIGlmIHRoaXMgZmFpbHMgZHVlIHRvIG9yZGVyIG9mIGV2ZW50cyAoc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjE5MjYwODMvZmFpbGVkLXRvLWV4ZWN1dGUtcmVtb3ZlY2hpbGQtb24tbm9kZSlcclxuXHRcdFx0XHRjYWNoZWQgPSBbXS5jb25jYXQoY2FjaGVkKTtcclxuXHRcdFx0XHRpZiAoY2FjaGVkW2ldKSB1bmxvYWQoY2FjaGVkW2ldKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAobm9kZXMubGVuZ3RoICE9IDApIG5vZGVzLmxlbmd0aCA9IDA7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiB1bmxvYWQoY2FjaGVkKSB7XHJcblx0XHRpZiAoY2FjaGVkLmNvbmZpZ0NvbnRleHQgJiYgdHlwZW9mIGNhY2hlZC5jb25maWdDb250ZXh0Lm9udW5sb2FkID09PSBGVU5DVElPTikge1xyXG5cdFx0XHRjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCgpO1xyXG5cdFx0XHRjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCA9IG51bGxcclxuXHRcdH1cclxuXHRcdGlmIChjYWNoZWQuY29udHJvbGxlcnMpIHtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGNvbnRyb2xsZXI7IGNvbnRyb2xsZXIgPSBjYWNoZWQuY29udHJvbGxlcnNbaV07IGkrKykge1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgY29udHJvbGxlci5vbnVubG9hZCA9PT0gRlVOQ1RJT04pIGNvbnRyb2xsZXIub251bmxvYWQoe3ByZXZlbnREZWZhdWx0OiBub29wfSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChjYWNoZWQuY2hpbGRyZW4pIHtcclxuXHRcdFx0aWYgKHR5cGUuY2FsbChjYWNoZWQuY2hpbGRyZW4pID09PSBBUlJBWSkge1xyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwLCBjaGlsZDsgY2hpbGQgPSBjYWNoZWQuY2hpbGRyZW5baV07IGkrKykgdW5sb2FkKGNoaWxkKVxyXG5cdFx0XHR9IGVsc2UgaWYgKGNhY2hlZC5jaGlsZHJlbi50YWcpIHtcclxuXHRcdFx0XHR1bmxvYWQoY2FjaGVkLmNoaWxkcmVuKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gaW5qZWN0SFRNTChwYXJlbnRFbGVtZW50LCBpbmRleCwgZGF0YSkge1xyXG5cdFx0dmFyIG5leHRTaWJsaW5nID0gcGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2luZGV4XTtcclxuXHRcdGlmIChuZXh0U2libGluZykge1xyXG5cdFx0XHR2YXIgaXNFbGVtZW50ID0gbmV4dFNpYmxpbmcubm9kZVR5cGUgIT0gMTtcclxuXHRcdFx0dmFyIHBsYWNlaG9sZGVyID0gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG5cdFx0XHRpZiAoaXNFbGVtZW50KSB7XHJcblx0XHRcdFx0cGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUocGxhY2Vob2xkZXIsIG5leHRTaWJsaW5nIHx8IG51bGwpO1xyXG5cdFx0XHRcdHBsYWNlaG9sZGVyLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWJlZ2luXCIsIGRhdGEpO1xyXG5cdFx0XHRcdHBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQocGxhY2Vob2xkZXIpXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bmV4dFNpYmxpbmcuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlYmVnaW5cIiwgZGF0YSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHBhcmVudEVsZW1lbnQuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlZW5kXCIsIGRhdGEpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBub2RlcyA9IFtdO1xyXG5cclxuXHRcdHdoaWxlIChwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdICE9PSBuZXh0U2libGluZykge1xyXG5cdFx0XHRub2Rlcy5wdXNoKHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF0pO1xyXG5cdFx0XHRpbmRleCsrXHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbm9kZXM7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBhdXRvcmVkcmF3KGNhbGxiYWNrLCBvYmplY3QpIHtcclxuXHRcdHJldHVybiBmdW5jdGlvbihlKSB7XHJcblx0XHRcdGUgPSBlIHx8IGV2ZW50O1xyXG5cdFx0XHRtLnJlZHJhdy5zdHJhdGVneShcImRpZmZcIik7XHJcblx0XHRcdG0uc3RhcnRDb21wdXRhdGlvbigpO1xyXG5cdFx0XHR0cnkge3JldHVybiBjYWxsYmFjay5jYWxsKG9iamVjdCwgZSl9XHJcblx0XHRcdGZpbmFsbHkge1xyXG5cdFx0XHRcdGVuZEZpcnN0Q29tcHV0YXRpb24oKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgaHRtbDtcclxuXHR2YXIgZG9jdW1lbnROb2RlID0ge1xyXG5cdFx0YXBwZW5kQ2hpbGQ6IGZ1bmN0aW9uKG5vZGUpIHtcclxuXHRcdFx0aWYgKGh0bWwgPT09IHVuZGVmaW5lZCkgaHRtbCA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaHRtbFwiKTtcclxuXHRcdFx0aWYgKCRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgJGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAhPT0gbm9kZSkge1xyXG5cdFx0XHRcdCRkb2N1bWVudC5yZXBsYWNlQ2hpbGQobm9kZSwgJGRvY3VtZW50LmRvY3VtZW50RWxlbWVudClcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlICRkb2N1bWVudC5hcHBlbmRDaGlsZChub2RlKTtcclxuXHRcdFx0dGhpcy5jaGlsZE5vZGVzID0gJGRvY3VtZW50LmNoaWxkTm9kZXNcclxuXHRcdH0sXHJcblx0XHRpbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKG5vZGUpIHtcclxuXHRcdFx0dGhpcy5hcHBlbmRDaGlsZChub2RlKVxyXG5cdFx0fSxcclxuXHRcdGNoaWxkTm9kZXM6IFtdXHJcblx0fTtcclxuXHJcblx0dmFyIG5vZGVDYWNoZSA9IFtdLFxyXG5cdFx0Y2VsbENhY2hlID0ge307XHJcblxyXG5cdG0ucmVuZGVyID0gZnVuY3Rpb24ocm9vdCwgY2VsbCwgZm9yY2VSZWNyZWF0aW9uKSB7XHJcblx0XHR2YXIgY29uZmlncyA9IFtdO1xyXG5cdFx0aWYgKCFyb290KSB0aHJvdyBuZXcgRXJyb3IoXCJFbnN1cmUgdGhlIERPTSBlbGVtZW50IGJlaW5nIHBhc3NlZCB0byBtLnJvdXRlL20ubW91bnQvbS5yZW5kZXIgaXMgbm90IHVuZGVmaW5lZC5cIik7XHJcblx0XHR2YXIgaWQgPSBnZXRDZWxsQ2FjaGVLZXkocm9vdCk7XHJcblx0XHR2YXIgaXNEb2N1bWVudFJvb3QgPSByb290ID09PSAkZG9jdW1lbnQ7XHJcblx0XHR2YXIgbm9kZSA9IGlzRG9jdW1lbnRSb290IHx8IHJvb3QgPT09ICRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgPyBkb2N1bWVudE5vZGUgOiByb290O1xyXG5cdFx0aWYgKGlzRG9jdW1lbnRSb290ICYmIGNlbGwudGFnICE9IFwiaHRtbFwiKSBjZWxsID0ge3RhZzogXCJodG1sXCIsIGF0dHJzOiB7fSwgY2hpbGRyZW46IGNlbGx9O1xyXG5cdFx0aWYgKGNlbGxDYWNoZVtpZF0gPT09IHVuZGVmaW5lZCkgY2xlYXIobm9kZS5jaGlsZE5vZGVzKTtcclxuXHRcdGlmIChmb3JjZVJlY3JlYXRpb24gPT09IHRydWUpIHJlc2V0KHJvb3QpO1xyXG5cdFx0Y2VsbENhY2hlW2lkXSA9IGJ1aWxkKG5vZGUsIG51bGwsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBjZWxsLCBjZWxsQ2FjaGVbaWRdLCBmYWxzZSwgMCwgbnVsbCwgdW5kZWZpbmVkLCBjb25maWdzKTtcclxuXHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBjb25maWdzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSBjb25maWdzW2ldKClcclxuXHR9O1xyXG5cclxuXHRmdW5jdGlvbiBnZXRDZWxsQ2FjaGVLZXkoZWxlbWVudCkge1xyXG5cdFx0dmFyIGluZGV4ID0gbm9kZUNhY2hlLmluZGV4T2YoZWxlbWVudCk7XHJcblx0XHRyZXR1cm4gaW5kZXggPCAwID8gbm9kZUNhY2hlLnB1c2goZWxlbWVudCkgLSAxIDogaW5kZXhcclxuXHR9XHJcblxyXG5cdG0udHJ1c3QgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0dmFsdWUgPSBuZXcgU3RyaW5nKHZhbHVlKTtcclxuXHRcdHZhbHVlLiR0cnVzdGVkID0gdHJ1ZTtcclxuXHRcdHJldHVybiB2YWx1ZVxyXG5cdH07XHJcblxyXG5cdGZ1bmN0aW9uIGdldHRlcnNldHRlcihzdG9yZSkge1xyXG5cdFx0dmFyIHByb3AgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGgpIHN0b3JlID0gYXJndW1lbnRzWzBdO1xyXG5cdFx0XHRyZXR1cm4gc3RvcmVcclxuXHRcdH07XHJcblxyXG5cdFx0cHJvcC50b0pTT04gPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIHN0b3JlXHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiBwcm9wXHJcblx0fVxyXG5cclxuXHRtLnByb3AgPSBmdW5jdGlvbiAoc3RvcmUpIHtcclxuXHRcdC8vbm90ZTogdXNpbmcgbm9uLXN0cmljdCBlcXVhbGl0eSBjaGVjayBoZXJlIGJlY2F1c2Ugd2UncmUgY2hlY2tpbmcgaWYgc3RvcmUgaXMgbnVsbCBPUiB1bmRlZmluZWRcclxuXHRcdGlmICgoKHN0b3JlICE9IG51bGwgJiYgdHlwZS5jYWxsKHN0b3JlKSA9PT0gT0JKRUNUKSB8fCB0eXBlb2Ygc3RvcmUgPT09IEZVTkNUSU9OKSAmJiB0eXBlb2Ygc3RvcmUudGhlbiA9PT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0cmV0dXJuIHByb3BpZnkoc3RvcmUpXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGdldHRlcnNldHRlcihzdG9yZSlcclxuXHR9O1xyXG5cclxuXHR2YXIgcm9vdHMgPSBbXSxcclxuXHRcdGNvbXBvbmVudHMgPSBbXSxcclxuXHRcdGNvbnRyb2xsZXJzID0gW10sXHJcblx0XHRsYXN0UmVkcmF3SWQgPSBudWxsLFxyXG5cdFx0bGFzdFJlZHJhd0NhbGxUaW1lID0gMCxcclxuXHRcdGNvbXB1dGVQcmVSZWRyYXdIb29rID0gbnVsbCxcclxuXHRcdGNvbXB1dGVQb3N0UmVkcmF3SG9vayA9IG51bGwsXHJcblx0XHRwcmV2ZW50ZWQgPSBmYWxzZSxcclxuXHRcdHRvcENvbXBvbmVudCxcclxuXHRcdHVubG9hZGVycyA9IFtdO1xyXG5cclxuXHR2YXIgRlJBTUVfQlVER0VUID0gMTY7IC8vNjAgZnJhbWVzIHBlciBzZWNvbmQgPSAxIGNhbGwgcGVyIDE2IG1zXHJcblxyXG5cdGZ1bmN0aW9uIHBhcmFtZXRlcml6ZShjb21wb25lbnQsIGFyZ3MpIHtcclxuXHRcdHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiAoY29tcG9uZW50LmNvbnRyb2xsZXIgfHwgbm9vcCkuYXBwbHkodGhpcywgYXJncykgfHwgdGhpc1xyXG5cdFx0fVxyXG5cdFx0dmFyIHZpZXcgPSBmdW5jdGlvbihjdHJsKSB7XHJcblx0XHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkgYXJncyA9IGFyZ3MuY29uY2F0KFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSlcclxuXHRcdFx0cmV0dXJuIGNvbXBvbmVudC52aWV3LmFwcGx5KGNvbXBvbmVudCwgYXJncyA/IFtjdHJsXS5jb25jYXQoYXJncykgOiBbY3RybF0pXHJcblx0XHR9XHJcblx0XHR2aWV3LiRvcmlnaW5hbCA9IGNvbXBvbmVudC52aWV3XHJcblx0XHR2YXIgb3V0cHV0ID0ge2NvbnRyb2xsZXI6IGNvbnRyb2xsZXIsIHZpZXc6IHZpZXd9XHJcblx0XHRpZiAoYXJnc1swXSAmJiBhcmdzWzBdLmtleSAhPSBudWxsKSBvdXRwdXQuYXR0cnMgPSB7a2V5OiBhcmdzWzBdLmtleX1cclxuXHRcdHJldHVybiBvdXRwdXRcclxuXHR9XHJcblxyXG5cdG0uY29tcG9uZW50ID0gZnVuY3Rpb24oY29tcG9uZW50KSB7XHJcblx0XHRyZXR1cm4gcGFyYW1ldGVyaXplKGNvbXBvbmVudCwgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKVxyXG5cdH1cclxuXHJcblx0bS5tb3VudCA9IG0ubW9kdWxlID0gZnVuY3Rpb24ocm9vdCwgY29tcG9uZW50KSB7XHJcblx0XHRpZiAoIXJvb3QpIHRocm93IG5ldyBFcnJvcihcIlBsZWFzZSBlbnN1cmUgdGhlIERPTSBlbGVtZW50IGV4aXN0cyBiZWZvcmUgcmVuZGVyaW5nIGEgdGVtcGxhdGUgaW50byBpdC5cIik7XHJcblx0XHR2YXIgaW5kZXggPSByb290cy5pbmRleE9mKHJvb3QpO1xyXG5cdFx0aWYgKGluZGV4IDwgMCkgaW5kZXggPSByb290cy5sZW5ndGg7XHJcblxyXG5cdFx0dmFyIGlzUHJldmVudGVkID0gZmFsc2U7XHJcblx0XHR2YXIgZXZlbnQgPSB7cHJldmVudERlZmF1bHQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpc1ByZXZlbnRlZCA9IHRydWU7XHJcblx0XHRcdGNvbXB1dGVQcmVSZWRyYXdIb29rID0gY29tcHV0ZVBvc3RSZWRyYXdIb29rID0gbnVsbDtcclxuXHRcdH19O1xyXG5cdFx0Zm9yICh2YXIgaSA9IDAsIHVubG9hZGVyOyB1bmxvYWRlciA9IHVubG9hZGVyc1tpXTsgaSsrKSB7XHJcblx0XHRcdHVubG9hZGVyLmhhbmRsZXIuY2FsbCh1bmxvYWRlci5jb250cm9sbGVyLCBldmVudClcclxuXHRcdFx0dW5sb2FkZXIuY29udHJvbGxlci5vbnVubG9hZCA9IG51bGxcclxuXHRcdH1cclxuXHRcdGlmIChpc1ByZXZlbnRlZCkge1xyXG5cdFx0XHRmb3IgKHZhciBpID0gMCwgdW5sb2FkZXI7IHVubG9hZGVyID0gdW5sb2FkZXJzW2ldOyBpKyspIHVubG9hZGVyLmNvbnRyb2xsZXIub251bmxvYWQgPSB1bmxvYWRlci5oYW5kbGVyXHJcblx0XHR9XHJcblx0XHRlbHNlIHVubG9hZGVycyA9IFtdXHJcblxyXG5cdFx0aWYgKGNvbnRyb2xsZXJzW2luZGV4XSAmJiB0eXBlb2YgY29udHJvbGxlcnNbaW5kZXhdLm9udW5sb2FkID09PSBGVU5DVElPTikge1xyXG5cdFx0XHRjb250cm9sbGVyc1tpbmRleF0ub251bmxvYWQoZXZlbnQpXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCFpc1ByZXZlbnRlZCkge1xyXG5cdFx0XHRtLnJlZHJhdy5zdHJhdGVneShcImFsbFwiKTtcclxuXHRcdFx0bS5zdGFydENvbXB1dGF0aW9uKCk7XHJcblx0XHRcdHJvb3RzW2luZGV4XSA9IHJvb3Q7XHJcblx0XHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID4gMikgY29tcG9uZW50ID0gc3ViY29tcG9uZW50KGNvbXBvbmVudCwgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpKVxyXG5cdFx0XHR2YXIgY3VycmVudENvbXBvbmVudCA9IHRvcENvbXBvbmVudCA9IGNvbXBvbmVudCA9IGNvbXBvbmVudCB8fCB7Y29udHJvbGxlcjogZnVuY3Rpb24oKSB7fX07XHJcblx0XHRcdHZhciBjb25zdHJ1Y3RvciA9IGNvbXBvbmVudC5jb250cm9sbGVyIHx8IG5vb3BcclxuXHRcdFx0dmFyIGNvbnRyb2xsZXIgPSBuZXcgY29uc3RydWN0b3I7XHJcblx0XHRcdC8vY29udHJvbGxlcnMgbWF5IGNhbGwgbS5tb3VudCByZWN1cnNpdmVseSAodmlhIG0ucm91dGUgcmVkaXJlY3RzLCBmb3IgZXhhbXBsZSlcclxuXHRcdFx0Ly90aGlzIGNvbmRpdGlvbmFsIGVuc3VyZXMgb25seSB0aGUgbGFzdCByZWN1cnNpdmUgbS5tb3VudCBjYWxsIGlzIGFwcGxpZWRcclxuXHRcdFx0aWYgKGN1cnJlbnRDb21wb25lbnQgPT09IHRvcENvbXBvbmVudCkge1xyXG5cdFx0XHRcdGNvbnRyb2xsZXJzW2luZGV4XSA9IGNvbnRyb2xsZXI7XHJcblx0XHRcdFx0Y29tcG9uZW50c1tpbmRleF0gPSBjb21wb25lbnRcclxuXHRcdFx0fVxyXG5cdFx0XHRlbmRGaXJzdENvbXB1dGF0aW9uKCk7XHJcblx0XHRcdHJldHVybiBjb250cm9sbGVyc1tpbmRleF1cclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHR2YXIgcmVkcmF3aW5nID0gZmFsc2U7XHJcblxyXG5cdG0ucmVkcmF3ID0gZnVuY3Rpb24gKGZvcmNlKSB7XHJcblx0XHRpZiAocmVkcmF3aW5nKSByZXR1cm5cclxuXHRcdHJlZHJhd2luZyA9IHRydWVcclxuXHRcdC8vbGFzdFJlZHJhd0lkIGlzIGEgcG9zaXRpdmUgbnVtYmVyIGlmIGEgc2Vjb25kIHJlZHJhdyBpcyByZXF1ZXN0ZWQgYmVmb3JlIHRoZSBuZXh0IGFuaW1hdGlvbiBmcmFtZVxyXG5cdFx0Ly9sYXN0UmVkcmF3SUQgaXMgbnVsbCBpZiBpdCdzIHRoZSBmaXJzdCByZWRyYXcgYW5kIG5vdCBhbiBldmVudCBoYW5kbGVyXHJcblx0XHRpZiAobGFzdFJlZHJhd0lkICYmIGZvcmNlICE9PSB0cnVlKSB7XHJcblx0XHRcdC8vd2hlbiBzZXRUaW1lb3V0OiBvbmx5IHJlc2NoZWR1bGUgcmVkcmF3IGlmIHRpbWUgYmV0d2VlbiBub3cgYW5kIHByZXZpb3VzIHJlZHJhdyBpcyBiaWdnZXIgdGhhbiBhIGZyYW1lLCBvdGhlcndpc2Uga2VlcCBjdXJyZW50bHkgc2NoZWR1bGVkIHRpbWVvdXRcclxuXHRcdFx0Ly93aGVuIHJBRjogYWx3YXlzIHJlc2NoZWR1bGUgcmVkcmF3XHJcblx0XHRcdGlmICgkcmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IG5ldyBEYXRlIC0gbGFzdFJlZHJhd0NhbGxUaW1lID4gRlJBTUVfQlVER0VUKSB7XHJcblx0XHRcdFx0aWYgKGxhc3RSZWRyYXdJZCA+IDApICRjYW5jZWxBbmltYXRpb25GcmFtZShsYXN0UmVkcmF3SWQpO1xyXG5cdFx0XHRcdGxhc3RSZWRyYXdJZCA9ICRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVkcmF3LCBGUkFNRV9CVURHRVQpXHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJlZHJhdygpO1xyXG5cdFx0XHRsYXN0UmVkcmF3SWQgPSAkcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRsYXN0UmVkcmF3SWQgPSBudWxsO1xyXG5cdFx0XHR9LCBGUkFNRV9CVURHRVQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJlZHJhd2luZyA9IGZhbHNlO1xyXG5cdH07XHJcblxyXG5cdG0ucmVkcmF3LnN0cmF0ZWd5ID0gbS5wcm9wKCk7XHJcblxyXG5cdGZ1bmN0aW9uIHJlZHJhdygpIHtcclxuXHRcdGlmIChjb21wdXRlUHJlUmVkcmF3SG9vaykge1xyXG5cdFx0XHRjb21wdXRlUHJlUmVkcmF3SG9vaygpXHJcblx0XHRcdGNvbXB1dGVQcmVSZWRyYXdIb29rID0gbnVsbFxyXG5cdFx0fVxyXG5cdFx0Zm9yICh2YXIgaSA9IDAsIHJvb3Q7IHJvb3QgPSByb290c1tpXTsgaSsrKSB7XHJcblx0XHRcdGlmIChjb250cm9sbGVyc1tpXSkge1xyXG5cdFx0XHRcdHZhciBhcmdzID0gY29tcG9uZW50c1tpXS5jb250cm9sbGVyICYmIGNvbXBvbmVudHNbaV0uY29udHJvbGxlci4kJGFyZ3MgPyBbY29udHJvbGxlcnNbaV1dLmNvbmNhdChjb21wb25lbnRzW2ldLmNvbnRyb2xsZXIuJCRhcmdzKSA6IFtjb250cm9sbGVyc1tpXV1cclxuXHRcdFx0XHRtLnJlbmRlcihyb290LCBjb21wb25lbnRzW2ldLnZpZXcgPyBjb21wb25lbnRzW2ldLnZpZXcoY29udHJvbGxlcnNbaV0sIGFyZ3MpIDogXCJcIilcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly9hZnRlciByZW5kZXJpbmcgd2l0aGluIGEgcm91dGVkIGNvbnRleHQsIHdlIG5lZWQgdG8gc2Nyb2xsIGJhY2sgdG8gdGhlIHRvcCwgYW5kIGZldGNoIHRoZSBkb2N1bWVudCB0aXRsZSBmb3IgaGlzdG9yeS5wdXNoU3RhdGVcclxuXHRcdGlmIChjb21wdXRlUG9zdFJlZHJhd0hvb2spIHtcclxuXHRcdFx0Y29tcHV0ZVBvc3RSZWRyYXdIb29rKCk7XHJcblx0XHRcdGNvbXB1dGVQb3N0UmVkcmF3SG9vayA9IG51bGxcclxuXHRcdH1cclxuXHRcdGxhc3RSZWRyYXdJZCA9IG51bGw7XHJcblx0XHRsYXN0UmVkcmF3Q2FsbFRpbWUgPSBuZXcgRGF0ZTtcclxuXHRcdG0ucmVkcmF3LnN0cmF0ZWd5KFwiZGlmZlwiKVxyXG5cdH1cclxuXHJcblx0dmFyIHBlbmRpbmdSZXF1ZXN0cyA9IDA7XHJcblx0bS5zdGFydENvbXB1dGF0aW9uID0gZnVuY3Rpb24oKSB7cGVuZGluZ1JlcXVlc3RzKyt9O1xyXG5cclxuXHRtLmVuZENvbXB1dGF0aW9uID0gZnVuY3Rpb24oKSB7XHJcblx0XHRwZW5kaW5nUmVxdWVzdHMgPSBNYXRoLm1heChwZW5kaW5nUmVxdWVzdHMgLSAxLCAwKTtcclxuXHRcdGlmIChwZW5kaW5nUmVxdWVzdHMgPT09IDApIG0ucmVkcmF3KClcclxuXHR9O1xyXG5cclxuXHR2YXIgZW5kRmlyc3RDb21wdXRhdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYgKG0ucmVkcmF3LnN0cmF0ZWd5KCkgPT0gXCJub25lXCIpIHtcclxuXHRcdFx0cGVuZGluZ1JlcXVlc3RzLS1cclxuXHRcdFx0bS5yZWRyYXcuc3RyYXRlZ3koXCJkaWZmXCIpXHJcblx0XHR9XHJcblx0XHRlbHNlIG0uZW5kQ29tcHV0YXRpb24oKTtcclxuXHR9XHJcblxyXG5cdG0ud2l0aEF0dHIgPSBmdW5jdGlvbihwcm9wLCB3aXRoQXR0ckNhbGxiYWNrKSB7XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRlID0gZSB8fCBldmVudDtcclxuXHRcdFx0dmFyIGN1cnJlbnRUYXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQgfHwgdGhpcztcclxuXHRcdFx0d2l0aEF0dHJDYWxsYmFjayhwcm9wIGluIGN1cnJlbnRUYXJnZXQgPyBjdXJyZW50VGFyZ2V0W3Byb3BdIDogY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUocHJvcCkpXHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly9yb3V0aW5nXHJcblx0dmFyIG1vZGVzID0ge3BhdGhuYW1lOiBcIlwiLCBoYXNoOiBcIiNcIiwgc2VhcmNoOiBcIj9cIn07XHJcblx0dmFyIHJlZGlyZWN0ID0gbm9vcCxcclxuXHRcdHJvdXRlUGFyYW1zLFxyXG5cdFx0Y3VycmVudFJvdXRlLFxyXG5cdFx0aXNEZWZhdWx0Um91dGUgPSBmYWxzZTtcclxuXHJcblx0bS5yb3V0ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly9tLnJvdXRlKClcclxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gY3VycmVudFJvdXRlO1xyXG5cdFx0Ly9tLnJvdXRlKGVsLCBkZWZhdWx0Um91dGUsIHJvdXRlcylcclxuXHRcdGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMgJiYgdHlwZS5jYWxsKGFyZ3VtZW50c1sxXSkgPT09IFNUUklORykge1xyXG5cdFx0XHR2YXIgcm9vdCA9IGFyZ3VtZW50c1swXSwgZGVmYXVsdFJvdXRlID0gYXJndW1lbnRzWzFdLCByb3V0ZXIgPSBhcmd1bWVudHNbMl07XHJcblx0XHRcdHJlZGlyZWN0ID0gZnVuY3Rpb24oc291cmNlKSB7XHJcblx0XHRcdFx0dmFyIHBhdGggPSBjdXJyZW50Um91dGUgPSBub3JtYWxpemVSb3V0ZShzb3VyY2UpO1xyXG5cdFx0XHRcdGlmICghcm91dGVCeVZhbHVlKHJvb3QsIHJvdXRlciwgcGF0aCkpIHtcclxuXHRcdFx0XHRcdGlmIChpc0RlZmF1bHRSb3V0ZSkgdGhyb3cgbmV3IEVycm9yKFwiRW5zdXJlIHRoZSBkZWZhdWx0IHJvdXRlIG1hdGNoZXMgb25lIG9mIHRoZSByb3V0ZXMgZGVmaW5lZCBpbiBtLnJvdXRlXCIpXHJcblx0XHRcdFx0XHRpc0RlZmF1bHRSb3V0ZSA9IHRydWVcclxuXHRcdFx0XHRcdG0ucm91dGUoZGVmYXVsdFJvdXRlLCB0cnVlKVxyXG5cdFx0XHRcdFx0aXNEZWZhdWx0Um91dGUgPSBmYWxzZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0dmFyIGxpc3RlbmVyID0gbS5yb3V0ZS5tb2RlID09PSBcImhhc2hcIiA/IFwib25oYXNoY2hhbmdlXCIgOiBcIm9ucG9wc3RhdGVcIjtcclxuXHRcdFx0d2luZG93W2xpc3RlbmVyXSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBwYXRoID0gJGxvY2F0aW9uW20ucm91dGUubW9kZV1cclxuXHRcdFx0XHRpZiAobS5yb3V0ZS5tb2RlID09PSBcInBhdGhuYW1lXCIpIHBhdGggKz0gJGxvY2F0aW9uLnNlYXJjaFxyXG5cdFx0XHRcdGlmIChjdXJyZW50Um91dGUgIT0gbm9ybWFsaXplUm91dGUocGF0aCkpIHtcclxuXHRcdFx0XHRcdHJlZGlyZWN0KHBhdGgpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHRjb21wdXRlUHJlUmVkcmF3SG9vayA9IHNldFNjcm9sbDtcclxuXHRcdFx0d2luZG93W2xpc3RlbmVyXSgpXHJcblx0XHR9XHJcblx0XHQvL2NvbmZpZzogbS5yb3V0ZVxyXG5cdFx0ZWxzZSBpZiAoYXJndW1lbnRzWzBdLmFkZEV2ZW50TGlzdGVuZXIgfHwgYXJndW1lbnRzWzBdLmF0dGFjaEV2ZW50KSB7XHJcblx0XHRcdHZhciBlbGVtZW50ID0gYXJndW1lbnRzWzBdO1xyXG5cdFx0XHR2YXIgaXNJbml0aWFsaXplZCA9IGFyZ3VtZW50c1sxXTtcclxuXHRcdFx0dmFyIGNvbnRleHQgPSBhcmd1bWVudHNbMl07XHJcblx0XHRcdHZhciB2ZG9tID0gYXJndW1lbnRzWzNdO1xyXG5cdFx0XHRlbGVtZW50LmhyZWYgPSAobS5yb3V0ZS5tb2RlICE9PSAncGF0aG5hbWUnID8gJGxvY2F0aW9uLnBhdGhuYW1lIDogJycpICsgbW9kZXNbbS5yb3V0ZS5tb2RlXSArIHZkb20uYXR0cnMuaHJlZjtcclxuXHRcdFx0aWYgKGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xyXG5cdFx0XHRcdGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJvdXRlVW5vYnRydXNpdmUpO1xyXG5cdFx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJvdXRlVW5vYnRydXNpdmUpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0ZWxlbWVudC5kZXRhY2hFdmVudChcIm9uY2xpY2tcIiwgcm91dGVVbm9idHJ1c2l2ZSk7XHJcblx0XHRcdFx0ZWxlbWVudC5hdHRhY2hFdmVudChcIm9uY2xpY2tcIiwgcm91dGVVbm9idHJ1c2l2ZSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly9tLnJvdXRlKHJvdXRlLCBwYXJhbXMsIHNob3VsZFJlcGxhY2VIaXN0b3J5RW50cnkpXHJcblx0XHRlbHNlIGlmICh0eXBlLmNhbGwoYXJndW1lbnRzWzBdKSA9PT0gU1RSSU5HKSB7XHJcblx0XHRcdHZhciBvbGRSb3V0ZSA9IGN1cnJlbnRSb3V0ZTtcclxuXHRcdFx0Y3VycmVudFJvdXRlID0gYXJndW1lbnRzWzBdO1xyXG5cdFx0XHR2YXIgYXJncyA9IGFyZ3VtZW50c1sxXSB8fCB7fVxyXG5cdFx0XHR2YXIgcXVlcnlJbmRleCA9IGN1cnJlbnRSb3V0ZS5pbmRleE9mKFwiP1wiKVxyXG5cdFx0XHR2YXIgcGFyYW1zID0gcXVlcnlJbmRleCA+IC0xID8gcGFyc2VRdWVyeVN0cmluZyhjdXJyZW50Um91dGUuc2xpY2UocXVlcnlJbmRleCArIDEpKSA6IHt9XHJcblx0XHRcdGZvciAodmFyIGkgaW4gYXJncykgcGFyYW1zW2ldID0gYXJnc1tpXVxyXG5cdFx0XHR2YXIgcXVlcnlzdHJpbmcgPSBidWlsZFF1ZXJ5U3RyaW5nKHBhcmFtcylcclxuXHRcdFx0dmFyIGN1cnJlbnRQYXRoID0gcXVlcnlJbmRleCA+IC0xID8gY3VycmVudFJvdXRlLnNsaWNlKDAsIHF1ZXJ5SW5kZXgpIDogY3VycmVudFJvdXRlXHJcblx0XHRcdGlmIChxdWVyeXN0cmluZykgY3VycmVudFJvdXRlID0gY3VycmVudFBhdGggKyAoY3VycmVudFBhdGguaW5kZXhPZihcIj9cIikgPT09IC0xID8gXCI/XCIgOiBcIiZcIikgKyBxdWVyeXN0cmluZztcclxuXHJcblx0XHRcdHZhciBzaG91bGRSZXBsYWNlSGlzdG9yeUVudHJ5ID0gKGFyZ3VtZW50cy5sZW5ndGggPT09IDMgPyBhcmd1bWVudHNbMl0gOiBhcmd1bWVudHNbMV0pID09PSB0cnVlIHx8IG9sZFJvdXRlID09PSBhcmd1bWVudHNbMF07XHJcblxyXG5cdFx0XHRpZiAod2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKSB7XHJcblx0XHRcdFx0Y29tcHV0ZVByZVJlZHJhd0hvb2sgPSBzZXRTY3JvbGxcclxuXHRcdFx0XHRjb21wdXRlUG9zdFJlZHJhd0hvb2sgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHdpbmRvdy5oaXN0b3J5W3Nob3VsZFJlcGxhY2VIaXN0b3J5RW50cnkgPyBcInJlcGxhY2VTdGF0ZVwiIDogXCJwdXNoU3RhdGVcIl0obnVsbCwgJGRvY3VtZW50LnRpdGxlLCBtb2Rlc1ttLnJvdXRlLm1vZGVdICsgY3VycmVudFJvdXRlKTtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdHJlZGlyZWN0KG1vZGVzW20ucm91dGUubW9kZV0gKyBjdXJyZW50Um91dGUpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0JGxvY2F0aW9uW20ucm91dGUubW9kZV0gPSBjdXJyZW50Um91dGVcclxuXHRcdFx0XHRyZWRpcmVjdChtb2Rlc1ttLnJvdXRlLm1vZGVdICsgY3VycmVudFJvdXRlKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0bS5yb3V0ZS5wYXJhbSA9IGZ1bmN0aW9uKGtleSkge1xyXG5cdFx0aWYgKCFyb3V0ZVBhcmFtcykgdGhyb3cgbmV3IEVycm9yKFwiWW91IG11c3QgY2FsbCBtLnJvdXRlKGVsZW1lbnQsIGRlZmF1bHRSb3V0ZSwgcm91dGVzKSBiZWZvcmUgY2FsbGluZyBtLnJvdXRlLnBhcmFtKClcIilcclxuXHRcdHJldHVybiByb3V0ZVBhcmFtc1trZXldXHJcblx0fTtcclxuXHJcblx0bS5yb3V0ZS5tb2RlID0gXCJzZWFyY2hcIjtcclxuXHJcblx0ZnVuY3Rpb24gbm9ybWFsaXplUm91dGUocm91dGUpIHtcclxuXHRcdHJldHVybiByb3V0ZS5zbGljZShtb2Rlc1ttLnJvdXRlLm1vZGVdLmxlbmd0aClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHJvdXRlQnlWYWx1ZShyb290LCByb3V0ZXIsIHBhdGgpIHtcclxuXHRcdHJvdXRlUGFyYW1zID0ge307XHJcblxyXG5cdFx0dmFyIHF1ZXJ5U3RhcnQgPSBwYXRoLmluZGV4T2YoXCI/XCIpO1xyXG5cdFx0aWYgKHF1ZXJ5U3RhcnQgIT09IC0xKSB7XHJcblx0XHRcdHJvdXRlUGFyYW1zID0gcGFyc2VRdWVyeVN0cmluZyhwYXRoLnN1YnN0cihxdWVyeVN0YXJ0ICsgMSwgcGF0aC5sZW5ndGgpKTtcclxuXHRcdFx0cGF0aCA9IHBhdGguc3Vic3RyKDAsIHF1ZXJ5U3RhcnQpXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gR2V0IGFsbCByb3V0ZXMgYW5kIGNoZWNrIGlmIHRoZXJlJ3NcclxuXHRcdC8vIGFuIGV4YWN0IG1hdGNoIGZvciB0aGUgY3VycmVudCBwYXRoXHJcblx0XHR2YXIga2V5cyA9IE9iamVjdC5rZXlzKHJvdXRlcik7XHJcblx0XHR2YXIgaW5kZXggPSBrZXlzLmluZGV4T2YocGF0aCk7XHJcblx0XHRpZihpbmRleCAhPT0gLTEpe1xyXG5cdFx0XHRtLm1vdW50KHJvb3QsIHJvdXRlcltrZXlzIFtpbmRleF1dKTtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yICh2YXIgcm91dGUgaW4gcm91dGVyKSB7XHJcblx0XHRcdGlmIChyb3V0ZSA9PT0gcGF0aCkge1xyXG5cdFx0XHRcdG0ubW91bnQocm9vdCwgcm91dGVyW3JvdXRlXSk7XHJcblx0XHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIG1hdGNoZXIgPSBuZXcgUmVnRXhwKFwiXlwiICsgcm91dGUucmVwbGFjZSgvOlteXFwvXSs/XFwuezN9L2csIFwiKC4qPylcIikucmVwbGFjZSgvOlteXFwvXSsvZywgXCIoW15cXFxcL10rKVwiKSArIFwiXFwvPyRcIik7XHJcblxyXG5cdFx0XHRpZiAobWF0Y2hlci50ZXN0KHBhdGgpKSB7XHJcblx0XHRcdFx0cGF0aC5yZXBsYWNlKG1hdGNoZXIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0dmFyIGtleXMgPSByb3V0ZS5tYXRjaCgvOlteXFwvXSsvZykgfHwgW107XHJcblx0XHRcdFx0XHR2YXIgdmFsdWVzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEsIC0yKTtcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBrZXlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSByb3V0ZVBhcmFtc1trZXlzW2ldLnJlcGxhY2UoLzp8XFwuL2csIFwiXCIpXSA9IGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZXNbaV0pXHJcblx0XHRcdFx0XHRtLm1vdW50KHJvb3QsIHJvdXRlcltyb3V0ZV0pXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcm91dGVVbm9idHJ1c2l2ZShlKSB7XHJcblx0XHRlID0gZSB8fCBldmVudDtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5tZXRhS2V5IHx8IGUud2hpY2ggPT09IDIpIHJldHVybjtcclxuXHRcdGlmIChlLnByZXZlbnREZWZhdWx0KSBlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRlbHNlIGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcclxuXHRcdHZhciBjdXJyZW50VGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0IHx8IGUuc3JjRWxlbWVudDtcclxuXHRcdHZhciBhcmdzID0gbS5yb3V0ZS5tb2RlID09PSBcInBhdGhuYW1lXCIgJiYgY3VycmVudFRhcmdldC5zZWFyY2ggPyBwYXJzZVF1ZXJ5U3RyaW5nKGN1cnJlbnRUYXJnZXQuc2VhcmNoLnNsaWNlKDEpKSA6IHt9O1xyXG5cdFx0d2hpbGUgKGN1cnJlbnRUYXJnZXQgJiYgY3VycmVudFRhcmdldC5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpICE9IFwiQVwiKSBjdXJyZW50VGFyZ2V0ID0gY3VycmVudFRhcmdldC5wYXJlbnROb2RlXHJcblx0XHRtLnJvdXRlKGN1cnJlbnRUYXJnZXRbbS5yb3V0ZS5tb2RlXS5zbGljZShtb2Rlc1ttLnJvdXRlLm1vZGVdLmxlbmd0aCksIGFyZ3MpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRTY3JvbGwoKSB7XHJcblx0XHRpZiAobS5yb3V0ZS5tb2RlICE9IFwiaGFzaFwiICYmICRsb2NhdGlvbi5oYXNoKSAkbG9jYXRpb24uaGFzaCA9ICRsb2NhdGlvbi5oYXNoO1xyXG5cdFx0ZWxzZSB3aW5kb3cuc2Nyb2xsVG8oMCwgMClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGJ1aWxkUXVlcnlTdHJpbmcob2JqZWN0LCBwcmVmaXgpIHtcclxuXHRcdHZhciBkdXBsaWNhdGVzID0ge31cclxuXHRcdHZhciBzdHIgPSBbXVxyXG5cdFx0Zm9yICh2YXIgcHJvcCBpbiBvYmplY3QpIHtcclxuXHRcdFx0dmFyIGtleSA9IHByZWZpeCA/IHByZWZpeCArIFwiW1wiICsgcHJvcCArIFwiXVwiIDogcHJvcFxyXG5cdFx0XHR2YXIgdmFsdWUgPSBvYmplY3RbcHJvcF1cclxuXHRcdFx0dmFyIHZhbHVlVHlwZSA9IHR5cGUuY2FsbCh2YWx1ZSlcclxuXHRcdFx0dmFyIHBhaXIgPSAodmFsdWUgPT09IG51bGwpID8gZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgOlxyXG5cdFx0XHRcdHZhbHVlVHlwZSA9PT0gT0JKRUNUID8gYnVpbGRRdWVyeVN0cmluZyh2YWx1ZSwga2V5KSA6XHJcblx0XHRcdFx0dmFsdWVUeXBlID09PSBBUlJBWSA/IHZhbHVlLnJlZHVjZShmdW5jdGlvbihtZW1vLCBpdGVtKSB7XHJcblx0XHRcdFx0XHRpZiAoIWR1cGxpY2F0ZXNba2V5XSkgZHVwbGljYXRlc1trZXldID0ge31cclxuXHRcdFx0XHRcdGlmICghZHVwbGljYXRlc1trZXldW2l0ZW1dKSB7XHJcblx0XHRcdFx0XHRcdGR1cGxpY2F0ZXNba2V5XVtpdGVtXSA9IHRydWVcclxuXHRcdFx0XHRcdFx0cmV0dXJuIG1lbW8uY29uY2F0KGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQoaXRlbSkpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm4gbWVtb1xyXG5cdFx0XHRcdH0sIFtdKS5qb2luKFwiJlwiKSA6XHJcblx0XHRcdFx0ZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSlcclxuXHRcdFx0aWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHN0ci5wdXNoKHBhaXIpXHJcblx0XHR9XHJcblx0XHRyZXR1cm4gc3RyLmpvaW4oXCImXCIpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBwYXJzZVF1ZXJ5U3RyaW5nKHN0cikge1xyXG5cdFx0aWYgKHN0ci5jaGFyQXQoMCkgPT09IFwiP1wiKSBzdHIgPSBzdHIuc3Vic3RyaW5nKDEpO1xyXG5cclxuXHRcdHZhciBwYWlycyA9IHN0ci5zcGxpdChcIiZcIiksIHBhcmFtcyA9IHt9O1xyXG5cdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IHBhaXJzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdHZhciBwYWlyID0gcGFpcnNbaV0uc3BsaXQoXCI9XCIpO1xyXG5cdFx0XHR2YXIga2V5ID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhaXJbMF0pXHJcblx0XHRcdHZhciB2YWx1ZSA9IHBhaXIubGVuZ3RoID09IDIgPyBkZWNvZGVVUklDb21wb25lbnQocGFpclsxXSkgOiBudWxsXHJcblx0XHRcdGlmIChwYXJhbXNba2V5XSAhPSBudWxsKSB7XHJcblx0XHRcdFx0aWYgKHR5cGUuY2FsbChwYXJhbXNba2V5XSkgIT09IEFSUkFZKSBwYXJhbXNba2V5XSA9IFtwYXJhbXNba2V5XV1cclxuXHRcdFx0XHRwYXJhbXNba2V5XS5wdXNoKHZhbHVlKVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHBhcmFtc1trZXldID0gdmFsdWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBwYXJhbXM7XHJcblx0fVxyXG5cclxuXHRtLnJvdXRlLmJ1aWxkUXVlcnlTdHJpbmcgPSBidWlsZFF1ZXJ5U3RyaW5nO1xyXG5cdG0ucm91dGUucGFyc2VRdWVyeVN0cmluZyA9IHBhcnNlUXVlcnlTdHJpbmc7XHJcblxyXG5cdGZ1bmN0aW9uIHJlc2V0KHJvb3QpIHtcclxuXHRcdHZhciBjYWNoZUtleSA9IGdldENlbGxDYWNoZUtleShyb290KTtcclxuXHRcdGNsZWFyKHJvb3QuY2hpbGROb2RlcywgY2VsbENhY2hlW2NhY2hlS2V5XSk7XHJcblx0XHRjZWxsQ2FjaGVbY2FjaGVLZXldID0gdW5kZWZpbmVkXHJcblx0fVxyXG5cclxuXHRtLmRlZmVycmVkID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIGRlZmVycmVkID0gbmV3IERlZmVycmVkKCk7XHJcblx0XHRkZWZlcnJlZC5wcm9taXNlID0gcHJvcGlmeShkZWZlcnJlZC5wcm9taXNlKTtcclxuXHRcdHJldHVybiBkZWZlcnJlZFxyXG5cdH07XHJcblxyXG5cdGZ1bmN0aW9uIHByb3BpZnkocHJvbWlzZSwgaW5pdGlhbFZhbHVlKSB7XHJcblx0XHR2YXIgcHJvcCA9IG0ucHJvcChpbml0aWFsVmFsdWUpO1xyXG5cdFx0cHJvbWlzZS50aGVuKHByb3ApO1xyXG5cdFx0cHJvcC50aGVuID0gZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRcdHJldHVybiBwcm9waWZ5KHByb21pc2UudGhlbihyZXNvbHZlLCByZWplY3QpLCBpbml0aWFsVmFsdWUpXHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuIHByb3A7XHJcblx0fVxyXG5cclxuXHQvL1Byb21pei5taXRocmlsLmpzIHwgWm9sbWVpc3RlciB8IE1JVFxyXG5cdC8vYSBtb2RpZmllZCB2ZXJzaW9uIG9mIFByb21pei5qcywgd2hpY2ggZG9lcyBub3QgY29uZm9ybSB0byBQcm9taXNlcy9BKyBmb3IgdHdvIHJlYXNvbnM6XHJcblx0Ly8xKSBgdGhlbmAgY2FsbGJhY2tzIGFyZSBjYWxsZWQgc3luY2hyb25vdXNseSAoYmVjYXVzZSBzZXRUaW1lb3V0IGlzIHRvbyBzbG93LCBhbmQgdGhlIHNldEltbWVkaWF0ZSBwb2x5ZmlsbCBpcyB0b28gYmlnXHJcblx0Ly8yKSB0aHJvd2luZyBzdWJjbGFzc2VzIG9mIEVycm9yIGNhdXNlIHRoZSBlcnJvciB0byBiZSBidWJibGVkIHVwIGluc3RlYWQgb2YgdHJpZ2dlcmluZyByZWplY3Rpb24gKGJlY2F1c2UgdGhlIHNwZWMgZG9lcyBub3QgYWNjb3VudCBmb3IgdGhlIGltcG9ydGFudCB1c2UgY2FzZSBvZiBkZWZhdWx0IGJyb3dzZXIgZXJyb3IgaGFuZGxpbmcsIGkuZS4gbWVzc2FnZSB3LyBsaW5lIG51bWJlcilcclxuXHRmdW5jdGlvbiBEZWZlcnJlZChzdWNjZXNzQ2FsbGJhY2ssIGZhaWx1cmVDYWxsYmFjaykge1xyXG5cdFx0dmFyIFJFU09MVklORyA9IDEsIFJFSkVDVElORyA9IDIsIFJFU09MVkVEID0gMywgUkVKRUNURUQgPSA0O1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzLCBzdGF0ZSA9IDAsIHByb21pc2VWYWx1ZSA9IDAsIG5leHQgPSBbXTtcclxuXHJcblx0XHRzZWxmW1wicHJvbWlzZVwiXSA9IHt9O1xyXG5cclxuXHRcdHNlbGZbXCJyZXNvbHZlXCJdID0gZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdFx0aWYgKCFzdGF0ZSkge1xyXG5cdFx0XHRcdHByb21pc2VWYWx1ZSA9IHZhbHVlO1xyXG5cdFx0XHRcdHN0YXRlID0gUkVTT0xWSU5HO1xyXG5cclxuXHRcdFx0XHRmaXJlKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9O1xyXG5cclxuXHRcdHNlbGZbXCJyZWplY3RcIl0gPSBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRpZiAoIXN0YXRlKSB7XHJcblx0XHRcdFx0cHJvbWlzZVZhbHVlID0gdmFsdWU7XHJcblx0XHRcdFx0c3RhdGUgPSBSRUpFQ1RJTkc7XHJcblxyXG5cdFx0XHRcdGZpcmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH07XHJcblxyXG5cdFx0c2VsZi5wcm9taXNlW1widGhlblwiXSA9IGZ1bmN0aW9uKHN1Y2Nlc3NDYWxsYmFjaywgZmFpbHVyZUNhbGxiYWNrKSB7XHJcblx0XHRcdHZhciBkZWZlcnJlZCA9IG5ldyBEZWZlcnJlZChzdWNjZXNzQ2FsbGJhY2ssIGZhaWx1cmVDYWxsYmFjayk7XHJcblx0XHRcdGlmIChzdGF0ZSA9PT0gUkVTT0xWRUQpIHtcclxuXHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHByb21pc2VWYWx1ZSlcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChzdGF0ZSA9PT0gUkVKRUNURUQpIHtcclxuXHRcdFx0XHRkZWZlcnJlZC5yZWplY3QocHJvbWlzZVZhbHVlKVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdG5leHQucHVzaChkZWZlcnJlZClcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZVxyXG5cdFx0fTtcclxuXHJcblx0XHRmdW5jdGlvbiBmaW5pc2godHlwZSkge1xyXG5cdFx0XHRzdGF0ZSA9IHR5cGUgfHwgUkVKRUNURUQ7XHJcblx0XHRcdG5leHQubWFwKGZ1bmN0aW9uKGRlZmVycmVkKSB7XHJcblx0XHRcdFx0c3RhdGUgPT09IFJFU09MVkVEICYmIGRlZmVycmVkLnJlc29sdmUocHJvbWlzZVZhbHVlKSB8fCBkZWZlcnJlZC5yZWplY3QocHJvbWlzZVZhbHVlKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gdGhlbm5hYmxlKHRoZW4sIHN1Y2Nlc3NDYWxsYmFjaywgZmFpbHVyZUNhbGxiYWNrLCBub3RUaGVubmFibGVDYWxsYmFjaykge1xyXG5cdFx0XHRpZiAoKChwcm9taXNlVmFsdWUgIT0gbnVsbCAmJiB0eXBlLmNhbGwocHJvbWlzZVZhbHVlKSA9PT0gT0JKRUNUKSB8fCB0eXBlb2YgcHJvbWlzZVZhbHVlID09PSBGVU5DVElPTikgJiYgdHlwZW9mIHRoZW4gPT09IEZVTkNUSU9OKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdC8vIGNvdW50IHByb3RlY3RzIGFnYWluc3QgYWJ1c2UgY2FsbHMgZnJvbSBzcGVjIGNoZWNrZXJcclxuXHRcdFx0XHRcdHZhciBjb3VudCA9IDA7XHJcblx0XHRcdFx0XHR0aGVuLmNhbGwocHJvbWlzZVZhbHVlLCBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoY291bnQrKykgcmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSB2YWx1ZTtcclxuXHRcdFx0XHRcdFx0c3VjY2Vzc0NhbGxiYWNrKCk7XHJcblx0XHRcdFx0XHR9LCBmdW5jdGlvbiAodmFsdWUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGNvdW50KyspIHJldHVybjtcclxuXHRcdFx0XHRcdFx0cHJvbWlzZVZhbHVlID0gdmFsdWU7XHJcblx0XHRcdFx0XHRcdGZhaWx1cmVDYWxsYmFjaygpO1xyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdFx0XHRtLmRlZmVycmVkLm9uZXJyb3IoZSk7XHJcblx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSBlO1xyXG5cdFx0XHRcdFx0ZmFpbHVyZUNhbGxiYWNrKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG5vdFRoZW5uYWJsZUNhbGxiYWNrKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBmaXJlKCkge1xyXG5cdFx0XHQvLyBjaGVjayBpZiBpdCdzIGEgdGhlbmFibGVcclxuXHRcdFx0dmFyIHRoZW47XHJcblxyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHRoZW4gPSBwcm9taXNlVmFsdWUgJiYgcHJvbWlzZVZhbHVlLnRoZW5cclxuXHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdG0uZGVmZXJyZWQub25lcnJvcihlKTtcclxuXHRcdFx0XHRwcm9taXNlVmFsdWUgPSBlO1xyXG5cdFx0XHRcdHN0YXRlID0gUkVKRUNUSU5HO1xyXG5cdFx0XHRcdHJldHVybiBmaXJlKClcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhlbm5hYmxlKHRoZW4sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHN0YXRlID0gUkVTT0xWSU5HO1xyXG5cdFx0XHRcdGZpcmUoKVxyXG5cdFx0XHR9LCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRzdGF0ZSA9IFJFSkVDVElORztcclxuXHRcdFx0XHRmaXJlKClcclxuXHRcdFx0fSwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdGlmIChzdGF0ZSA9PT0gUkVTT0xWSU5HICYmIHR5cGVvZiBzdWNjZXNzQ2FsbGJhY2sgPT09IEZVTkNUSU9OKSB7XHJcblx0XHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IHN1Y2Nlc3NDYWxsYmFjayhwcm9taXNlVmFsdWUpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChzdGF0ZSA9PT0gUkVKRUNUSU5HICYmIHR5cGVvZiBmYWlsdXJlQ2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSBmYWlsdXJlQ2FsbGJhY2socHJvbWlzZVZhbHVlKTtcclxuXHRcdFx0XHRcdFx0c3RhdGUgPSBSRVNPTFZJTkc7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdFx0bS5kZWZlcnJlZC5vbmVycm9yKGUpO1xyXG5cdFx0XHRcdFx0cHJvbWlzZVZhbHVlID0gZTtcclxuXHRcdFx0XHRcdHJldHVybiBmaW5pc2goKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChwcm9taXNlVmFsdWUgPT09IHNlbGYpIHtcclxuXHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IFR5cGVFcnJvcigpO1xyXG5cdFx0XHRcdFx0ZmluaXNoKCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRoZW5uYWJsZSh0aGVuLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRcdGZpbmlzaChSRVNPTFZFRCk7XHJcblx0XHRcdFx0XHR9LCBmaW5pc2gsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdFx0ZmluaXNoKHN0YXRlID09PSBSRVNPTFZJTkcgJiYgUkVTT0xWRUQpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cdH1cclxuXHRtLmRlZmVycmVkLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XHJcblx0XHRpZiAodHlwZS5jYWxsKGUpID09PSBcIltvYmplY3QgRXJyb3JdXCIgJiYgIWUuY29uc3RydWN0b3IudG9TdHJpbmcoKS5tYXRjaCgvIEVycm9yLykpIHRocm93IGU7XHJcblx0fTtcclxuXHJcblx0bS5zeW5jID0gZnVuY3Rpb24oYXJncykge1xyXG5cdFx0dmFyIG1ldGhvZCA9IFwicmVzb2x2ZVwiO1xyXG5cdFx0ZnVuY3Rpb24gc3luY2hyb25pemVyKHBvcywgcmVzb2x2ZWQpIHtcclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRcdFx0cmVzdWx0c1twb3NdID0gdmFsdWU7XHJcblx0XHRcdFx0aWYgKCFyZXNvbHZlZCkgbWV0aG9kID0gXCJyZWplY3RcIjtcclxuXHRcdFx0XHRpZiAoLS1vdXRzdGFuZGluZyA9PT0gMCkge1xyXG5cdFx0XHRcdFx0ZGVmZXJyZWQucHJvbWlzZShyZXN1bHRzKTtcclxuXHRcdFx0XHRcdGRlZmVycmVkW21ldGhvZF0ocmVzdWx0cylcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIHZhbHVlXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR2YXIgZGVmZXJyZWQgPSBtLmRlZmVycmVkKCk7XHJcblx0XHR2YXIgb3V0c3RhbmRpbmcgPSBhcmdzLmxlbmd0aDtcclxuXHRcdHZhciByZXN1bHRzID0gbmV3IEFycmF5KG91dHN0YW5kaW5nKTtcclxuXHRcdGlmIChhcmdzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0YXJnc1tpXS50aGVuKHN5bmNocm9uaXplcihpLCB0cnVlKSwgc3luY2hyb25pemVyKGksIGZhbHNlKSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBkZWZlcnJlZC5yZXNvbHZlKFtdKTtcclxuXHJcblx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZVxyXG5cdH07XHJcblxyXG5cdGZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7XHJcblx0XHRyZXR1cm4gdmFsdWU7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBhamF4KG9wdGlvbnMpIHtcclxuXHRcdGlmIChvcHRpb25zLmRhdGFUeXBlICYmIG9wdGlvbnMuZGF0YVR5cGUudG9Mb3dlckNhc2UoKSA9PT0gXCJqc29ucFwiKSB7XHJcblx0XHRcdHZhciBjYWxsYmFja0tleSA9IFwibWl0aHJpbF9jYWxsYmFja19cIiArIG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgXCJfXCIgKyAoTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMWUxNikpLnRvU3RyaW5nKDM2KTtcclxuXHRcdFx0dmFyIHNjcmlwdCA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xyXG5cclxuXHRcdFx0d2luZG93W2NhbGxiYWNrS2V5XSA9IGZ1bmN0aW9uKHJlc3ApIHtcclxuXHRcdFx0XHRzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xyXG5cdFx0XHRcdG9wdGlvbnMub25sb2FkKHtcclxuXHRcdFx0XHRcdHR5cGU6IFwibG9hZFwiLFxyXG5cdFx0XHRcdFx0dGFyZ2V0OiB7XHJcblx0XHRcdFx0XHRcdHJlc3BvbnNlVGV4dDogcmVzcFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHdpbmRvd1tjYWxsYmFja0tleV0gPSB1bmRlZmluZWRcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHNjcmlwdC5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XHJcblxyXG5cdFx0XHRcdG9wdGlvbnMub25lcnJvcih7XHJcblx0XHRcdFx0XHR0eXBlOiBcImVycm9yXCIsXHJcblx0XHRcdFx0XHR0YXJnZXQ6IHtcclxuXHRcdFx0XHRcdFx0c3RhdHVzOiA1MDAsXHJcblx0XHRcdFx0XHRcdHJlc3BvbnNlVGV4dDogSlNPTi5zdHJpbmdpZnkoe2Vycm9yOiBcIkVycm9yIG1ha2luZyBqc29ucCByZXF1ZXN0XCJ9KVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHdpbmRvd1tjYWxsYmFja0tleV0gPSB1bmRlZmluZWQ7XHJcblxyXG5cdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0c2NyaXB0Lm9ubG9hZCA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHNjcmlwdC5zcmMgPSBvcHRpb25zLnVybFxyXG5cdFx0XHRcdCsgKG9wdGlvbnMudXJsLmluZGV4T2YoXCI/XCIpID4gMCA/IFwiJlwiIDogXCI/XCIpXHJcblx0XHRcdFx0KyAob3B0aW9ucy5jYWxsYmFja0tleSA/IG9wdGlvbnMuY2FsbGJhY2tLZXkgOiBcImNhbGxiYWNrXCIpXHJcblx0XHRcdFx0KyBcIj1cIiArIGNhbGxiYWNrS2V5XHJcblx0XHRcdFx0KyBcIiZcIiArIGJ1aWxkUXVlcnlTdHJpbmcob3B0aW9ucy5kYXRhIHx8IHt9KTtcclxuXHRcdFx0JGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIHhociA9IG5ldyB3aW5kb3cuWE1MSHR0cFJlcXVlc3Q7XHJcblx0XHRcdHhoci5vcGVuKG9wdGlvbnMubWV0aG9kLCBvcHRpb25zLnVybCwgdHJ1ZSwgb3B0aW9ucy51c2VyLCBvcHRpb25zLnBhc3N3b3JkKTtcclxuXHRcdFx0eGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xyXG5cdFx0XHRcdFx0aWYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCAzMDApIG9wdGlvbnMub25sb2FkKHt0eXBlOiBcImxvYWRcIiwgdGFyZ2V0OiB4aHJ9KTtcclxuXHRcdFx0XHRcdGVsc2Ugb3B0aW9ucy5vbmVycm9yKHt0eXBlOiBcImVycm9yXCIsIHRhcmdldDogeGhyfSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdGlmIChvcHRpb25zLnNlcmlhbGl6ZSA9PT0gSlNPTi5zdHJpbmdpZnkgJiYgb3B0aW9ucy5kYXRhICYmIG9wdGlvbnMubWV0aG9kICE9PSBcIkdFVFwiKSB7XHJcblx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIpXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKG9wdGlvbnMuZGVzZXJpYWxpemUgPT09IEpTT04ucGFyc2UpIHtcclxuXHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkFjY2VwdFwiLCBcImFwcGxpY2F0aW9uL2pzb24sIHRleHQvKlwiKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodHlwZW9mIG9wdGlvbnMuY29uZmlnID09PSBGVU5DVElPTikge1xyXG5cdFx0XHRcdHZhciBtYXliZVhociA9IG9wdGlvbnMuY29uZmlnKHhociwgb3B0aW9ucyk7XHJcblx0XHRcdFx0aWYgKG1heWJlWGhyICE9IG51bGwpIHhociA9IG1heWJlWGhyXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBkYXRhID0gb3B0aW9ucy5tZXRob2QgPT09IFwiR0VUXCIgfHwgIW9wdGlvbnMuZGF0YSA/IFwiXCIgOiBvcHRpb25zLmRhdGFcclxuXHRcdFx0aWYgKGRhdGEgJiYgKHR5cGUuY2FsbChkYXRhKSAhPSBTVFJJTkcgJiYgZGF0YS5jb25zdHJ1Y3RvciAhPSB3aW5kb3cuRm9ybURhdGEpKSB7XHJcblx0XHRcdFx0dGhyb3cgXCJSZXF1ZXN0IGRhdGEgc2hvdWxkIGJlIGVpdGhlciBiZSBhIHN0cmluZyBvciBGb3JtRGF0YS4gQ2hlY2sgdGhlIGBzZXJpYWxpemVgIG9wdGlvbiBpbiBgbS5yZXF1ZXN0YFwiO1xyXG5cdFx0XHR9XHJcblx0XHRcdHhoci5zZW5kKGRhdGEpO1xyXG5cdFx0XHRyZXR1cm4geGhyO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYmluZERhdGEoeGhyT3B0aW9ucywgZGF0YSwgc2VyaWFsaXplKSB7XHJcblx0XHRpZiAoeGhyT3B0aW9ucy5tZXRob2QgPT09IFwiR0VUXCIgJiYgeGhyT3B0aW9ucy5kYXRhVHlwZSAhPSBcImpzb25wXCIpIHtcclxuXHRcdFx0dmFyIHByZWZpeCA9IHhock9wdGlvbnMudXJsLmluZGV4T2YoXCI/XCIpIDwgMCA/IFwiP1wiIDogXCImXCI7XHJcblx0XHRcdHZhciBxdWVyeXN0cmluZyA9IGJ1aWxkUXVlcnlTdHJpbmcoZGF0YSk7XHJcblx0XHRcdHhock9wdGlvbnMudXJsID0geGhyT3B0aW9ucy51cmwgKyAocXVlcnlzdHJpbmcgPyBwcmVmaXggKyBxdWVyeXN0cmluZyA6IFwiXCIpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB4aHJPcHRpb25zLmRhdGEgPSBzZXJpYWxpemUoZGF0YSk7XHJcblx0XHRyZXR1cm4geGhyT3B0aW9ucztcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHBhcmFtZXRlcml6ZVVybCh1cmwsIGRhdGEpIHtcclxuXHRcdHZhciB0b2tlbnMgPSB1cmwubWF0Y2goLzpbYS16XVxcdysvZ2kpO1xyXG5cdFx0aWYgKHRva2VucyAmJiBkYXRhKSB7XHJcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0dmFyIGtleSA9IHRva2Vuc1tpXS5zbGljZSgxKTtcclxuXHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSh0b2tlbnNbaV0sIGRhdGFba2V5XSk7XHJcblx0XHRcdFx0ZGVsZXRlIGRhdGFba2V5XTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHVybDtcclxuXHR9XHJcblxyXG5cdG0ucmVxdWVzdCA9IGZ1bmN0aW9uKHhock9wdGlvbnMpIHtcclxuXHRcdGlmICh4aHJPcHRpb25zLmJhY2tncm91bmQgIT09IHRydWUpIG0uc3RhcnRDb21wdXRhdGlvbigpO1xyXG5cdFx0dmFyIGRlZmVycmVkID0gbmV3IERlZmVycmVkKCk7XHJcblx0XHR2YXIgaXNKU09OUCA9IHhock9wdGlvbnMuZGF0YVR5cGUgJiYgeGhyT3B0aW9ucy5kYXRhVHlwZS50b0xvd2VyQ2FzZSgpID09PSBcImpzb25wXCI7XHJcblx0XHR2YXIgc2VyaWFsaXplID0geGhyT3B0aW9ucy5zZXJpYWxpemUgPSBpc0pTT05QID8gaWRlbnRpdHkgOiB4aHJPcHRpb25zLnNlcmlhbGl6ZSB8fCBKU09OLnN0cmluZ2lmeTtcclxuXHRcdHZhciBkZXNlcmlhbGl6ZSA9IHhock9wdGlvbnMuZGVzZXJpYWxpemUgPSBpc0pTT05QID8gaWRlbnRpdHkgOiB4aHJPcHRpb25zLmRlc2VyaWFsaXplIHx8IEpTT04ucGFyc2U7XHJcblx0XHR2YXIgZXh0cmFjdCA9IGlzSlNPTlAgPyBmdW5jdGlvbihqc29ucCkge3JldHVybiBqc29ucC5yZXNwb25zZVRleHR9IDogeGhyT3B0aW9ucy5leHRyYWN0IHx8IGZ1bmN0aW9uKHhocikge1xyXG5cdFx0XHRyZXR1cm4geGhyLnJlc3BvbnNlVGV4dC5sZW5ndGggPT09IDAgJiYgZGVzZXJpYWxpemUgPT09IEpTT04ucGFyc2UgPyBudWxsIDogeGhyLnJlc3BvbnNlVGV4dFxyXG5cdFx0fTtcclxuXHRcdHhock9wdGlvbnMubWV0aG9kID0gKHhock9wdGlvbnMubWV0aG9kIHx8ICdHRVQnKS50b1VwcGVyQ2FzZSgpO1xyXG5cdFx0eGhyT3B0aW9ucy51cmwgPSBwYXJhbWV0ZXJpemVVcmwoeGhyT3B0aW9ucy51cmwsIHhock9wdGlvbnMuZGF0YSk7XHJcblx0XHR4aHJPcHRpb25zID0gYmluZERhdGEoeGhyT3B0aW9ucywgeGhyT3B0aW9ucy5kYXRhLCBzZXJpYWxpemUpO1xyXG5cdFx0eGhyT3B0aW9ucy5vbmxvYWQgPSB4aHJPcHRpb25zLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0ZSA9IGUgfHwgZXZlbnQ7XHJcblx0XHRcdFx0dmFyIHVud3JhcCA9IChlLnR5cGUgPT09IFwibG9hZFwiID8geGhyT3B0aW9ucy51bndyYXBTdWNjZXNzIDogeGhyT3B0aW9ucy51bndyYXBFcnJvcikgfHwgaWRlbnRpdHk7XHJcblx0XHRcdFx0dmFyIHJlc3BvbnNlID0gdW53cmFwKGRlc2VyaWFsaXplKGV4dHJhY3QoZS50YXJnZXQsIHhock9wdGlvbnMpKSwgZS50YXJnZXQpO1xyXG5cdFx0XHRcdGlmIChlLnR5cGUgPT09IFwibG9hZFwiKSB7XHJcblx0XHRcdFx0XHRpZiAodHlwZS5jYWxsKHJlc3BvbnNlKSA9PT0gQVJSQVkgJiYgeGhyT3B0aW9ucy50eXBlKSB7XHJcblx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uc2UubGVuZ3RoOyBpKyspIHJlc3BvbnNlW2ldID0gbmV3IHhock9wdGlvbnMudHlwZShyZXNwb25zZVtpXSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2UgaWYgKHhock9wdGlvbnMudHlwZSkgcmVzcG9uc2UgPSBuZXcgeGhyT3B0aW9ucy50eXBlKHJlc3BvbnNlKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRkZWZlcnJlZFtlLnR5cGUgPT09IFwibG9hZFwiID8gXCJyZXNvbHZlXCIgOiBcInJlamVjdFwiXShyZXNwb25zZSlcclxuXHRcdFx0fVxyXG5cdFx0XHRjYXRjaCAoZSkge1xyXG5cdFx0XHRcdG0uZGVmZXJyZWQub25lcnJvcihlKTtcclxuXHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZSlcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoeGhyT3B0aW9ucy5iYWNrZ3JvdW5kICE9PSB0cnVlKSBtLmVuZENvbXB1dGF0aW9uKClcclxuXHRcdH07XHJcblx0XHRhamF4KHhock9wdGlvbnMpO1xyXG5cdFx0ZGVmZXJyZWQucHJvbWlzZSA9IHByb3BpZnkoZGVmZXJyZWQucHJvbWlzZSwgeGhyT3B0aW9ucy5pbml0aWFsVmFsdWUpO1xyXG5cdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2VcclxuXHR9O1xyXG5cclxuXHQvL3Rlc3RpbmcgQVBJXHJcblx0bS5kZXBzID0gZnVuY3Rpb24obW9jaykge1xyXG5cdFx0aW5pdGlhbGl6ZSh3aW5kb3cgPSBtb2NrIHx8IHdpbmRvdyk7XHJcblx0XHRyZXR1cm4gd2luZG93O1xyXG5cdH07XHJcblxyXG5cdC8vZm9yIGludGVybmFsIHRlc3Rpbmcgb25seSwgZG8gbm90IHVzZSBgbS5kZXBzLmZhY3RvcnlgXHJcblx0bS5kZXBzLmZhY3RvcnkgPSBhcHA7XHJcblxyXG5cdHJldHVybiBtO1xyXG59KSh0eXBlb2Ygd2luZG93ICE9IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSk7XHJcblxyXG5pZiAodHlwZW9mIG1vZHVsZSAhPSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZSAhPT0gbnVsbCAmJiBtb2R1bGUuZXhwb3J0cykgbW9kdWxlLmV4cG9ydHMgPSBtO1xyXG5lbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkgZGVmaW5lKGZ1bmN0aW9uKCkge3JldHVybiBtfSk7XHJcbiIsIi8qKlxyXG4gKiBQdWJTdWIuanMgLSBKYXZhc2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHRoZSBQdWJsaXNoL1N1YnNjcmliZSBwYXR0ZXJuLlxyXG4gKiBAdmVyc2lvbiAwLjAuNlxyXG4gKiBAaG9tZXBhZ2UgaHR0cHM6Ly9naXRodWIuY29tL2dlb3JhcGJveC9QdWJTdWJcclxuICogQGF1dGhvciBHZW9yZ2UgUmFwdGlzIChodHRwczovL2dpdGh1Yi5jb20vZ2VvcmFwYm94KVxyXG4gKlxyXG4gKiBUaGUgTUlUIExpY2Vuc2UgKE1JVClcclxuICpcclxuICogQ29weXJpZ2h0IChjKSAyMDE0IEdlb3JnZSBSYXB0aXNcclxuICpcclxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXHJcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcclxuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxyXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcclxuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcclxuICpcclxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXHJcbiAqIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXHJcbiAqXHJcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXHJcbiAqIFNPRlRXQVJFLlxyXG4gKi9cclxuKGZ1bmN0aW9uIChuYW1lLCBjb250ZXh0LCBkZWZpbml0aW9uKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XHJcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKCk7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgICAgIGRlZmluZShkZWZpbml0aW9uKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29udGV4dFtuYW1lXSA9IGRlZmluaXRpb24oKTtcclxuICAgIH1cclxufSgnUHViU3ViJywgdGhpcywgZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBQdWJTdWIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy50b3BpY3MgPSB7fTsgICAgLy8gU3RvcmFnZSBmb3IgdG9waWNzIHRoYXQgY2FuIGJlIGJyb2FkY2FzdCBvciBsaXN0ZW5lZCB0by5cclxuICAgICAgICB0aGlzLnN1YlVpZCA9IC0xOyAgICAvLyBBIHRvcGljIGlkZW50aWZpZXIuXHJcbiAgICB9LFxyXG4gICAgcHJvdG8gPSBQdWJTdWIucHJvdG90eXBlO1xyXG5cclxuICAgIC8qKlxyXG5cdCAqIEFsaWFzIGEgbWV0aG9kIHdoaWxlIGtlZXBpbmcgdGhlIGNvbnRleHQgY29ycmVjdCxcclxuXHQgKiB0byBhbGxvdyBmb3Igb3ZlcndyaXRpbmcgb2YgdGFyZ2V0IG1ldGhvZC5cclxuXHQgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZuIFRoZSBuYW1lIG9mIHRoZSB0YXJnZXQgbWV0aG9kLlxyXG5cdCAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgYWxpYXNlZCBtZXRob2QuXHJcblx0ICovXHJcbiAgICBmdW5jdGlvbiBhbGlhcyhmbikge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBjbG9zdXJlICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXNbZm5dLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFN1YnNjcmliZSB0byBldmVudHMgb2YgaW50ZXJlc3Qgd2l0aCBhIHNwZWNpZmljIHRvcGljIG5hbWUgYW5kIGFcclxuICAgICAqIGNhbGxiYWNrIGZ1bmN0aW9uLCB0byBiZSBleGVjdXRlZCB3aGVuIHRoZSB0b3BpYy9ldmVudCBpcyBvYnNlcnZlZC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdG9waWMge1N0cmluZ30gVGhlIHRvcGljIG5hbWUuXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sge0Z1bmN0aW9ufSBDYWxsYmFjayBmdW5jdGlvbiB0byBleGVjdXRlIG9uIGV2ZW50LlxyXG5cdCAqIEBwYXJhbSBvbmNlIHtCb29sZWFufSBDaGVja3MgaWYgZXZlbnQgd2lsbCBiZSB0cmlnZ2VyZWQgb25seSBvbmUgdGltZSAob3B0aW9uYWwpLlxyXG4gICAgICogQHJldHVybiBudW1iZXIgdG9rZW5cclxuICAgICAqL1xyXG4gICAgcHJvdG8uc3Vic2NyaWJlID0gZnVuY3Rpb24gKHRvcGljLCBjYWxsYmFjaywgb25jZSkge1xyXG4gICAgICAgIHZhciB0b2tlbiA9ICh0aGlzLnN1YlVpZCArPSAxKSxcclxuICAgICAgICAgICAgb2JqID0ge307XHJcblxyXG4gICAgICAgIGlmICghdGhpcy50b3BpY3NbdG9waWNdKSB7XHJcbiAgICAgICAgICAgIHRoaXMudG9waWNzW3RvcGljXSA9IFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb2JqLnRva2VuID0gdG9rZW47XHJcbiAgICAgICAgb2JqLmNhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICAgICAgb2JqLm9uY2UgPSAhIW9uY2U7XHJcblxyXG4gICAgICAgIHRoaXMudG9waWNzW3RvcGljXS5wdXNoKG9iaik7XHJcblxyXG4gICAgICAgIHJldHVybiB0b2tlbjtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcblx0ICogU3Vic2NyaWJlIHRvIGV2ZW50cyBvZiBpbnRlcmVzdCBzZXR0aW5nIGEgZmxhZ1xyXG5cdCAqIGluZGljYXRpbmcgdGhlIGV2ZW50IHdpbGwgYmUgcHVibGlzaGVkIG9ubHkgb25lIHRpbWUuXHJcblx0ICpcclxuXHQgKiBAcGFyYW0gdG9waWMge1N0cmluZ30gVGhlIHRvcGljIG5hbWUuXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sge0Z1bmN0aW9ufSBDYWxsYmFjayBmdW5jdGlvbiB0byBleGVjdXRlIG9uIGV2ZW50LlxyXG5cdCAqL1xyXG4gICAgcHJvdG8uc3Vic2NyaWJlT25jZSA9IGZ1bmN0aW9uICh0b3BpYywgY2FsbGJhY2spIHtcclxuICAgICAgICB0aGlzLnN1YnNjcmliZSh0b3BpYywgY2FsbGJhY2ssIHRydWUpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFB1Ymxpc2ggb3IgYnJvYWRjYXN0IGV2ZW50cyBvZiBpbnRlcmVzdCB3aXRoIGEgc3BlY2lmaWNcclxuICAgICAqIHRvcGljIG5hbWUgYW5kIGFyZ3VtZW50cyBzdWNoIGFzIHRoZSBkYXRhIHRvIHBhc3MgYWxvbmcuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHRvcGljIHtTdHJpbmd9IFRoZSB0b3BpYyBuYW1lLlxyXG4gICAgICogQHBhcmFtIGFyZ3Mge09iamVjdCB8fCBBcnJheX0gVGhlIGRhdGEgdG8gYmUgcGFzc2VkLlxyXG4gICAgICogQHJldHVybiBib29sIGZhbHNlIGlmIHRvcGljIGRvZXMgbm90IGV4aXN0LlxyXG4gICAgICogQHJldHVybiBib29sIHRydWUgaWYgdG9waWMgZXhpc3RzIGFuZCBldmVudCBpcyBwdWJsaXNoZWQuXHJcbiAgICAgKi9cclxuICAgIHByb3RvLnB1Ymxpc2ggPSBmdW5jdGlvbiAodG9waWMsIGFyZ3MpIHtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXHJcbiAgICAgICAgICAgIHN1YnNjcmliZXJzLFxyXG4gICAgICAgICAgICBsZW47XHJcblxyXG4gICAgICAgIGlmICghdGhpcy50b3BpY3NbdG9waWNdKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzdWJzY3JpYmVycyA9IHRoYXQudG9waWNzW3RvcGljXTtcclxuICAgICAgICAgICAgbGVuID0gc3Vic2NyaWJlcnMgPyBzdWJzY3JpYmVycy5sZW5ndGggOiAwO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKGxlbikge1xyXG4gICAgICAgICAgICAgICAgbGVuIC09IDE7XHJcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyc1tsZW5dLmNhbGxiYWNrKHRvcGljLCBhcmdzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBVbnN1YnNjcmliZSBmcm9tIGV2ZW50IGJhc2VkIG9uIHRva2VuaXplZCByZWZlcmVuY2UsXHJcbiAgICAgICAgICAgICAgICAvLyBpZiBzdWJzY3JpYmVyJ3MgcHJvcGVydHkgb25jZSBpcyBzZXQgdG8gdHJ1ZS5cclxuICAgICAgICAgICAgICAgIGlmIChzdWJzY3JpYmVyc1tsZW5dLm9uY2UgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LnVuc3Vic2NyaWJlKHN1YnNjcmliZXJzW2xlbl0udG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgMCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFVuc3Vic2NyaWJlIGZyb20gYSBzcGVjaWZpYyB0b3BpYywgYmFzZWQgb24gIHRoZSB0b3BpYyBuYW1lLFxyXG4gICAgICogb3IgYmFzZWQgb24gYSB0b2tlbml6ZWQgcmVmZXJlbmNlIHRvIHRoZSBzdWJzY3JpcHRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHQge1N0cmluZyB8fCBPYmplY3R9IFRvcGljIG5hbWUgb3Igc3Vic2NyaXB0aW9uIHJlZmVyZW5lY2UuXHJcbiAgICAgKiBAcmV0dXJuIGJvb2wgZmFsc2UgaWYgYXJndW1lbnQgcGFzc2VkIGRvZXMgbm90IG1hdGNoIGEgc3Vic2NyaWJlZCBldmVudC5cclxuICAgICAqL1xyXG4gICAgcHJvdG8udW5zdWJzY3JpYmUgPSBmdW5jdGlvbiAodCkge1xyXG4gICAgICAgIHZhciBwcm9wLFxyXG4gICAgICAgICAgICBsZW4sXHJcbiAgICAgICAgICAgIHRmID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGZvciAocHJvcCBpbiB0aGlzLnRvcGljcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50b3BpY3MuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRvcGljc1twcm9wXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxlbiA9IHRoaXMudG9waWNzW3Byb3BdLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGxlbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZW4gLT0gMTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIHQgaXMgYSB0b2tlbml6ZWQgcmVmZXJlbmNlIHRvIHRoZSBzdWJzY3JpcHRpb24uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZXMgb25lIHN1YnNjcmlwdGlvbiBmcm9tIHRoZSBhcnJheS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudG9waWNzW3Byb3BdW2xlbl0udG9rZW4gPT09IHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9waWNzW3Byb3BdLnNwbGljZShsZW4sIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIHQgaXMgdGhlIGV2ZW50IHR5cGUuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZXMgYWxsIHRoZSBzdWJzY3JpcHRpb25zIHRoYXQgbWF0Y2ggdGhlIGV2ZW50IHR5cGUuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wID09PSB0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvcGljc1twcm9wXS5zcGxpY2UobGVuLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRmID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRmID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuXHQgKiBQcm9taXNlcy9BKyBpbXBsZW1lbnRhdGlvbi5cclxuXHQgKi9cclxuICAgIHByb3RvLmFQbHVzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBTdGF0ZSxcclxuICAgICAgICAgICAgQXBsdXMgPSB7fTtcclxuXHJcbiAgICAgICAgU3RhdGUgPSB7XHJcbiAgICAgICAgICAgIFBFTkRJTkc6IDAsXHJcbiAgICAgICAgICAgIEZVTEZJTExFRDogMSxcclxuICAgICAgICAgICAgUkVKRUNURUQ6IDJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBTZXQgZGVmYXVsdCBzdGF0ZS5cclxuICAgICAgICBBcGx1cy5zdGF0ZSA9IFN0YXRlLlBFTkRJTkc7XHJcblxyXG4gICAgICAgIC8qKlxyXG5cdFx0ICogQ2hhbmdlcyB0aGUgc3RhdGUgb2YgYSBwcm9taXNlLlxyXG5cdFx0ICogQHBhcmFtIHtOdW1iZXJ9IHN0YXRlIFRoZSBzdGF0ZSBvZiB0aGUgcHJvbWlzZS5cclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcnxPYmplY3R9IHZhbHVlIFRoZSB2YWx1ZSAob3IgcmVhc29uKSB3ZSBnZXQgd2hlbiB0aGUgc3RhdGUgY2hhbmdlcy5cclxuXHRcdCAqL1xyXG4gICAgICAgIEFwbHVzLmNoYW5nZVN0YXRlID0gZnVuY3Rpb24gKHN0YXRlLCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAvLyBDYXRjaCBjaGFuZ2luZyB0byBzYW1lIHN0YXRlIChwZXJoYXBzIHRyeWluZyB0byBjaGFuZ2UgdGhlIHZhbHVlKS5cclxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IHN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhblxcJ3QgdHJhbnNpdGlvbiB0byBzYW1lIHN0YXRlOiAnICsgc3RhdGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBUcnlpbmcgdG8gY2hhbmdlIG91dCBvZiBmdWxmaWxsZWQgb3IgcmVqZWN0ZWQgc3RhdGUuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlID09PSBTdGF0ZS5GVUxGSUxMRUQgfHwgdGhpcy5zdGF0ZSA9PT0gU3RhdGUuUkVKRUNURUQpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2FuXFwndCB0cmFuc2l0aW9uIGZyb20gY3VycmVudCBzdGF0ZTogJyArIHN0YXRlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gSWYgc2Vjb25kIGFyZ3VtZW50IGlzbid0IGdpdmVuIGF0IGFsbCAoUGFzc2luZyB1bmRlZmluZWQgaXMgYWxsb3dlZCkuXHJcbiAgICAgICAgICAgIGlmIChzdGF0ZSA9PT0gU3RhdGUuRlVMRklMTEVEICYmIGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyYW5zaXRpb24gdG8gZnVsZmlsbGVkIG11c3QgaGF2ZSBhIG5vbiBudWxsIHZhbHVlJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIElmIGEgbnVsbCByZWFzb24gaXMgcGFzc2VkIGluLlxyXG4gICAgICAgICAgICAvLyBOT1RFOiBVc2UgZG91YmxlIGVxdWFsaXR5IGluc3RlYWQgb2YgdHJpcHBsZSB0byBjaGVjayBmb3IgYm90aCBudWxsIGFuZCB1bmRlZmluZWQuXHJcbiAgICAgICAgICAgIGlmIChzdGF0ZSA9PT0gU3RhdGUuUkVKRUNURUQgJiYgdmFsdWUgPT0gbnVsbCkgeyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVHJhbnNpdGlvbiB0byByZWplY3RlZCBtdXN0IGhhdmUgYSBub24gbnVsbCByZWFzb24nKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlOyAvLyBDaGFuZ2Ugc3RhdGUuXHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTsgLy8gQ2hhbmdlIHRoZSB2YWx1ZS5cclxuICAgICAgICAgICAgdGhpcy5yZXNvbHZlKCk7ICAgICAvLyBSZXNvbHZlIHRoZSBwcm9taXNlLlxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcblx0XHQgKiBGdWxmaWxscyBhIHByb21pc2UuXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ8T2JqZWN0fSB2YWx1ZVxyXG5cdFx0ICovXHJcbiAgICAgICAgQXBsdXMuZnVsZmlsbCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZVN0YXRlKFN0YXRlLkZVTEZJTExFRCwgdmFsdWUpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG5cdFx0ICogUmVqZWN0cyBhIHByb21pc2UuXHJcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gcmVhc29uXHJcblx0XHQgKi9cclxuICAgICAgICBBcGx1cy5yZWplY3QgPSBmdW5jdGlvbiAocmVhc29uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlU3RhdGUoU3RhdGUuUkVKRUNURUQsIHJlYXNvbik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIHtGdW5jdGlvbn0gb25GdWxmaWxsZWQgVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgaWYgcHJvbWlzZSBpcyBmdWxmaWxsZWQuXHJcblx0XHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvblJlamVjdGVkIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0byBleGVjdXRlIGlmIHByb21pc2UgaXMgcmVqZWN0ZWQuXHJcblx0XHQgKiBAcmV0dXJucyB7T2JqZWN0fSBwcm9taXNlIFJldHVybiB0aGUgcHJvbWlzZSBvYmplY3QgdG8gYWxsb3cgY2hhaW5pbmcuXHJcblx0XHQgKi9cclxuICAgICAgICBBcGx1cy50aGVuID0gZnVuY3Rpb24gKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XHJcbiAgICAgICAgICAgIC8vIEluaXRpYWxpemUgYXJyYXkgdG8gc3RvcmUgdGhlXHJcbiAgICAgICAgICAgIC8vIGZ1bmN0aW9ucyB0byBleGVjdXRlIGxhdGVyIG9uLlxyXG4gICAgICAgICAgICB0aGlzLmNhY2hlID0gdGhpcy5jYWNoZSB8fCBbXTtcclxuXHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gT2JqZWN0LmNyZWF0ZShBcGx1cyksXHJcbiAgICAgICAgICAgICAgICB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYXN5bmMoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5jYWNoZS5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBmdWxmaWxsOiB0eXBlb2Ygb25GdWxmaWxsZWQgPT09ICdmdW5jdGlvbicgJiYgb25GdWxmaWxsZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0OiB0eXBlb2Ygb25SZWplY3RlZCA9PT0gJ2Z1bmN0aW9uJyAmJiBvblJlamVjdGVkLFxyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2U6IHByb21pc2VcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoYXQucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9LCA1KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG5cdFx0ICogUmVzb2x2ZXMgdGhlIHByb21pc2UuXHJcblx0XHQgKiBAcmV0dXJucyB7Qm9vbGVhbn0gUmV0dXJucyBmYWxzZSBpZiBzdGF0ZSBpcyBwZW5kaW5nLlxyXG5cdFx0ICovXHJcbiAgICAgICAgQXBsdXMucmVzb2x2ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8gRmlyc3QgY2hlY2sgaWYgcGVuZGluZy4uLlxyXG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gU3RhdGUuUEVORElORykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgb2JqLFxyXG4gICAgICAgICAgICAgICAgZm47XHJcblxyXG4gICAgICAgICAgICAvLyBmb3IgZWFjaCAndGhlbicuXHJcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLmNhY2hlICYmIHRoaXMuY2FjaGUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBvYmogPSB0aGlzLmNhY2hlLnNoaWZ0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBhcHByb3ByaWF0ZSBmdW5jdGlvbiBiYXNlZCBvbiBzdGF0ZS5cclxuICAgICAgICAgICAgICAgIGZuID0gdGhpcy5zdGF0ZSA9PT0gU3RhdGUuRlVMRklMTEVEID8gb2JqLmZ1bGZpbGwgOiBvYmoucmVqZWN0O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmoucHJvbWlzZS5jaGFuZ2VTdGF0ZSh0aGlzLnN0YXRlLCB0aGlzLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRnVsZmlsbCBwcm9taXNlIHdpdGggdmFsdWUgb3IgcmVqZWN0IHdpdGggZXJyb3IuXHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gZm4odGhpcy52YWx1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBEZWFsIHdpdGggdGhlIHByb21pc2UgcmV0dXJuZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmoucHJvbWlzZS5jaGFuZ2VTdGF0ZShTdGF0ZS5GVUxGSUxMRUQsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmoucHJvbWlzZS5jaGFuZ2VTdGF0ZShTdGF0ZS5SRUpFQ1RFRCwgcmVhc29uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRGVhbCB3aXRoIG90aGVyIHZhbHVlIHJldHVybmVkLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnByb21pc2UuY2hhbmdlU3RhdGUoU3RhdGUuRlVMRklMTEVELCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmoucHJvbWlzZS5jaGFuZ2VTdGF0ZShTdGF0ZS5SRUpFQ1RFRCwgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG5cdFx0ICogRXhlY3V0ZXMgYSBmdW5jdGlvbiBhc3luY2hyb25vdXNseS5cclxuXHRcdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGV4ZWN1dGUuXHJcblx0XHQgKi9cclxuICAgICAgICBBcGx1cy5hc3luYyA9IGZ1bmN0aW9uIChmdW5jLCBkZWxheSkge1xyXG4gICAgICAgICAgICBkZWxheSA9IHR5cGVvZiBkZWxheSA9PT0gJ3VuZGVmaW5lZCcgPyA1IDogZGVsYXk7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuYywgZGVsYXkpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBPYmplY3QuY3JlYXRlKEFwbHVzKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBbGlhcyBmb3IgcHVibGljIG1ldGhvZHMuXHJcbiAgICAgKiBzdWJzY3JpYmUgICAgIC0+IG9uXHJcbiAgICAgKiBzdWJzY3JpYmVPbmNlIC0+IG9uY2VcclxuICAgICAqIHB1Ymxpc2ggICAgICAgLT4gdHJpZ2dlclxyXG4gICAgICogdW5zdWJzY3JpYmUgICAtPiBvZmZcclxuICAgICAqIGFQbHVzICAgICAgICAgLT4gd2hlblxyXG4gICAgICovXHJcbiAgICBwcm90by5vbiA9IGFsaWFzKCdzdWJzY3JpYmUnKTtcclxuICAgIHByb3RvLm9uY2UgPSBhbGlhcygnc3Vic2NyaWJlT25jZScpO1xyXG4gICAgcHJvdG8udHJpZ2dlciA9IGFsaWFzKCdwdWJsaXNoJyk7XHJcbiAgICBwcm90by5vZmYgPSBhbGlhcygndW5zdWJzY3JpYmUnKTtcclxuICAgIHByb3RvLndoZW4gPSBhbGlhcygnYVBsdXMnKTtcclxuXHJcbiAgICByZXR1cm4gUHViU3ViO1xyXG59KSk7XHJcbiIsIi8qKlxuICogUm91dGVyIG1vZHVsZVxuICogUHJvdmlkZXMgcm91dGluZyB0byBhcHBsaWNhdGlvbiBlbmhhbmNlZCB3aXRoIGFuaW1hdGlvbnMgYW5kXG4gKiBhIHJvdXRlciB3cmFwcGVyIGdpdmluZyB1cyB0aGUgYWJpbGl0eSBmb3IgY3VzdG9tIGFjcnRpb24gd2hlbiByb3V0ZSBjaGFuZ2VzLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoZG9jKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGFuaW1hdG9yID0gcmVxdWlyZSgnLi91dGlscy9hbmltYXRvcicpLFxuXHRcdGRvbSA9IHJlcXVpcmUoJy4vdXRpbHMvZG9tJyksXG5cdFx0b2JqID0gcmVxdWlyZSgnLi91dGlscy9vYmplY3RzJyk7XG5cbiAgICB2YXIgZW5hYmxlQW5pbWF0aW9ucyA9IHRydWUsXG5cdFx0YW5pbWF0aW9uRXZlbnQgPSBkb20ud2hpY2hBbmltYXRpb25FdmVudCgpLFxuICAgICAgICBhbmltYXRlID0gYW5pbWF0aW9uRXZlbnQgJiYgZW5hYmxlQW5pbWF0aW9ucyA/XG4gICAgICAgICAgICBhbmltYXRvcihwYWdlSW4sIHBhZ2VPdXQsIHRydWUsIGZhbHNlKSA6XG4gICAgICAgICAgICBmdW5jdGlvbiAobXlNb2R1bGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbXlNb2R1bGU7XG4gICAgICAgICAgICB9LFxuICAgICAgICBhbmltYXRpb25DbGFzczsgLy8gSG9sZHMgdGhlIGNsYXNzIHJlc3BvbnNpYmxlIGZvciBhbmltYXRpb24uXG5cbiAgICAvKipcbiAgICAgKiBBbmltYXRlcyBwYWdlIGluIHZpZXcuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGVsIFRoZSBwYWdlIHZpZXcuXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgRnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgYWZ0ZXIgdHJhbnNpdGlvbiBlbmRzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHBhZ2VJbihlbCwgY2FsbGJhY2spIHtcbiAgICAgICAgLy8gT3ZlcnJpZGUgY2FsbGJhY2sgZnVuY3Rpb24gb2YgYW5pbWF0b3IuXG4gICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG5leHQgPSBlbC5uZXh0RWxlbWVudFNpYmxpbmc7XG5cbiAgICAgICAgICAgIGRvYy5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ25vLWFjdGlvbnMnKTtcbiAgICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoYW5pbWF0aW9uRXZlbnQsIGNhbGxiYWNrLCBmYWxzZSk7XG4gICAgICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobmV4dCk7XG4gICAgICAgICAgICAgICAgbmV4dCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgYW5pbWF0aW9uQ2xhc3MgJiYgZWwuY2xhc3NMaXN0LmFkZChhbmltYXRpb25DbGFzcyk7XG4gICAgICAgIGRvYy5ib2R5LmNsYXNzTGlzdC5hZGQoJ25vLWFjdGlvbnMnKTtcbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihhbmltYXRpb25FdmVudCwgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbmltYXRlcyBwYWdlIG91dCBvZiB2aWV3LlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbCBUaGUgcGFnZSB2aWV3LlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIEZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIGFmdGVyIHRyYW5zaXRpb24gZW5kcy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwYWdlT3V0KGVsLCBjYWxsYmFjaykge1xuICAgICAgICAvLyBPdmVycmlkZSBjYWxsYmFjayBmdW5jdGlvbiBvZiBhbmltYXRvci5cbiAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGFuaW1hdGlvbkV2ZW50LCBjYWxsYmFjaywgZmFsc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ3BhZ2Utb3V0Jyk7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoYW5pbWF0aW9uRXZlbnQsIGNhbGxiYWNrLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2ltcGxlIFJvdXRlciB3cmFwcGVyLCB0byBoYW5kbGUgZ2VuZXJpYyB0YXNrcywgd2hlbiByb3V0ZSBjaGFuZ2VzLlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvTW9kdWxlIFRoZSBtb2R1bGUgdG8gYmUgcHJvdmlkZWQgZm9yIHRoZSBzcGVjaWZpYyByb3V0ZS5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdIERlZmF1bHQgb3B0aW9ucyB0byBiZSBwcm92aWRlZCBmb3IgZWFjaCByb3V0ZS4gQ2FuIGJlIG92ZXJyaWRlbiBieSB1c2VyLlxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9XG4gICAgICovXG4gICAgZnVuY3Rpb24gcm91dGVyKG9Nb2R1bGUsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgbmFtZTogJycsXG4gICAgICAgICAgICBhbmltQ2xhc3M6ICcnXG4gICAgICAgIH07XG4gICAgICAgIG9wdGlvbnMgPSBvYmouZXh0ZW5kKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgICAgIGRlZmF1bHRzID0gbnVsbDtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbkNsYXNzID0gb3B0aW9ucy5hbmltQ2xhc3M7XG5cbiAgICAgICAgICAgICAgICAvLyBTZXQgYSBkZWZhdWx0IG5hbWUgZm9yIGVhY2ggcm91dGUsIGlmIG9uZSBpcyBub3QgcHJvdmlkZWQuXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5uYW1lID0gb3B0aW9ucy5uYW1lIHx8IG0ucm91dGUoKS5yZXBsYWNlKC9cXC8vZywgJycpO1xuXG4gICAgICAgICAgICAgICAgLy8gU2V0IGFuIGF0dHJpYnV0ZSB0byBib2R5LCB0byB1c2UgaXQgZm9yIERPTSBtYW5pcHVsYXRpb24gYW5kIHN0eWxpbmcuXG4gICAgICAgICAgICAgICAgZG9jLmJvZHkuc2V0QXR0cmlidXRlKCdkYXRhLXBhZ2UtbmFtZScsIG9wdGlvbnMubmFtZSk7XG5cbiAgICAgICAgICAgICAgICAvLyBSZXR1cm4gdGhlIG1vZHVsZSdzIGNvbnRyb2xsZXIgaWYgYXZhaWxhYmxlLCBlbHNlIHVuZGVmaW5lZC5cbiAgICAgICAgICAgICAgICByZXR1cm4gb01vZHVsZS5jb250cm9sbGVyID8gbmV3IG9Nb2R1bGUuY29udHJvbGxlcigpIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZpZXc6IGFuaW1hdGUob01vZHVsZSkudmlld1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIENvbmZpZ3VyZSByb3V0aW5nIG1vZGUuXG4gICAgbS5yb3V0ZS5tb2RlID0gJ2hhc2gnO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXRpYWxpemUgYXBwbGljYXRpb24ncyByb3V0ZXIuXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYWdlc1xuICAgICAgICAgKi9cbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKHBhZ2VzKSB7XG4gICAgICAgICAgICAvLyBEZWZpbmUgYXBwbGljYXRpb24ncyByb3V0ZXMuXG4gICAgICAgICAgICBtLnJvdXRlKGRvYy5xdWVyeVNlbGVjdG9yKCdtLXZpZXcnKSwgJy9kYXNoYm9hcmQnLCB7XG4gICAgICAgICAgICAgICAgJy9kYXNoYm9hcmQnOiByb3V0ZXIocGFnZXMuZGFzaGJvYXJkLCB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdkYXNoYm9hcmQnLFxuICAgICAgICAgICAgICAgICAgICBhbmltQ2xhc3M6ICdwdC1zbGlkZS10dGInXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgJy9kYXNoYm9hcmQvOnVzZXJOYW1lJzogcm91dGVyKHBhZ2VzLmRhc2hib2FyZCwge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnZGFzaGJvYXJkJyxcbiAgICAgICAgICAgICAgICAgICAgYW5pbUNsYXNzOiAncHQtc2xpZGUtdHRiJ1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICcvdXNlcnByb2ZpbGUvOnVzZXJOYW1lJzogcm91dGVyKHBhZ2VzLnVzZXJwcm9maWxlLCB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICd1c2VycHJvZmlsZScsXG4gICAgICAgICAgICAgICAgICAgIGFuaW1DbGFzczogJ3B0LXNsaWRlLXJ0bCdcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAnL2Fib3V0Jzogcm91dGVyKHBhZ2VzLmFib3V0LCB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdhYm91dCcsXG4gICAgICAgICAgICAgICAgICAgIGFuaW1DbGFzczogJ3B0LXNsaWRlLXJ0bCdcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAnL2NvbnRhY3RzJzogcm91dGVyKHBhZ2VzLmNvbnRhY3RzLCB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb250YWN0cycsXG4gICAgICAgICAgICAgICAgICAgIGFuaW1DbGFzczogJ3B0LXNsaWRlLXJ0bCdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufShkb2N1bWVudCkpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBhbmltYXRpbmcgPSBmYWxzZTsgLy8gRmxhZyB0byBpbmRpY2F0ZSB3aGVuIGFuaW1hdGlvbiBpcyBpbiBwcm9ncmVzcy5cclxuXHJcbiAgICAvKipcclxuICAgICAqIERlZmluZSBhbiBhbmltYXRvciBjb25zaXN0aW5nIG9mIG9wdGlvbmFsIGluY29taW5nIGFuZCBvdXRnb2luZyBhbmltYXRpb25zLlxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gaW5jb21pbmdcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IG91dGdvaW5nXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGFsd2F5c0FuaW1hdGUgRmFsc2UgdW5sZXNzIHNwZWNpZmllZCBhcyB0cnVlOiBmYWxzZSBtZWFucyBhbiBpbmNvbWluZyBhbmltYXRpb24gd2lsbCBvbmx5IHRyaWdnZXIgaWYgYW4gb3V0Z29pbmcgYW5pbWF0aW9uIGlzIGFsc28gaW4gcHJvZ3Jlc3MuXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGRvbnRDbG9uZSBGb3JjaW5nIGRvbnRDbG9uZSB0byB0cnVlIG1lYW5zIHRoZSBvdXR3YXJkIGFuaW1hdGlvbiB3aWxsIHVzZSB0aGUgb3JpZ2luYWwgZWxlbWVudCByYXRoZXIgdGhhbiBhIGNsb25lLiBUaGlzIGNvdWxkIGltcHJvdmUgcGVyZm9ybWFuY2UgYnkgcmVjeWNsaW5nIGVsZW1lbnRzLCBidXQgY2FuIGxlYWQgdG8gdHJvdWJsZTogY2xvbmVzIGhhdmUgdGhlIGFkdmFudGFnZSBvZiBiZWluZyBzdHJpcHBlZCBvZiBhbGwgZXZlbnQgbGlzdGVuZXJzLlxyXG4gICAgICogQHJldHVybnMge2Z1bmN0aW9ufSBhbmltYXRvclxyXG4gICAgICovXHJcbiAgICB2YXIgYW5pbWF0b3IgPSBmdW5jdGlvbiAoaW5jb21pbmcsIG91dGdvaW5nLCBhbHdheXNBbmltYXRlLCBkb250Q2xvbmUpIHtcclxuICAgICAgICAvLyBUaGUgcmVzdWx0aW5nIGFuaW1hdG9yIGNhbiBiZSBhcHBsaWVkIHRvIGFueSBudW1iZXIgb2YgY29tcG9uZW50c1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBhbmltYXRlKHgsIHksIHopIHtcclxuICAgICAgICAgICAgdmFyIGNvbmZpZyxcclxuICAgICAgICAgICAgICAgIHBhcmVudCxcclxuICAgICAgICAgICAgICAgIG5leHQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoeC5ub2RlVHlwZSkgeyAvLyBXaGVuIHVzZWQgYXMgYSBjb25maWcgZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgIHJldHVybiBhbmltYXRpb25Db25maWcoeCwgeSwgeik7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoeC5hdHRycykgeyAvLyBXaGVuIHBhc3NlZCBhIHZpcnR1YWwgRE9NIG5vZGUgKHRoZSBvdXRwdXQgb2YgbSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBiaW5kQ29uZmlnVG8oeCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoeC52aWV3KSB7IC8vIFdoZW4gYXBwbGllZCB0byBhIE1pdGhyaWwgbW9kdWxlIC8gY29tcG9uZW50XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IHguY29udHJvbGxlciB8fCBub29wLFxyXG4gICAgICAgICAgICAgICAgICAgIHZpZXc6IGZ1bmN0aW9uIGFuaW1hdGVkVmlldyAoY3RybCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmluZENvbmZpZ1RvKHgudmlldyhjdHJsKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gYmluZENvbmZpZ1RvKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbmZpZyA9IG5vZGUuYXR0cnMuY29uZmlnO1xyXG4gICAgICAgICAgICAgICAgbm9kZS5hdHRycy5jb25maWcgPSBhbmltYXRpb25Db25maWc7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gYW5pbWF0aW9uQ29uZmlnKGVsLCBpbml0LCBjb250ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb3V0cHV0LFxyXG4gICAgICAgICAgICAgICAgICAgIG9udW5sb2FkO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjb25maWcpIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgPSBjb25maWcoZWwsIGluaXQsIGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSByb290IGVsZW1lbnQgYWxyZWFkeSBoYXMgYSBjb25maWcsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaXQgbWF5IGFsc28gaGF2ZSBhbiBvbnVubG9hZCB3aGljaCB3ZSBzaG91bGQgdGFrZSBjYXJlIHRvIHByZXNlcnZlLlxyXG4gICAgICAgICAgICAgICAgICAgIG9udW5sb2FkID0gY29udGV4dC5vbnVubG9hZDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWluaXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5jb21pbmcgJiYgYWx3YXlzQW5pbWF0ZSB8fCBhbmltYXRpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5jb21pbmcoZWwsIG5vb3AsIGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5vbnVubG9hZCA9IG91dGdvaW5nID8gb251bmxvYWQgPyBmdW5jdGlvbiBvbnVubG9hZFdyYXBwZXIoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlYXJkb3duKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9udW5sb2FkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSA6IHRlYXJkb3duIDogb251bmxvYWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IGVsLnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dCA9IGVsLm5leHRTaWJsaW5nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gdGVhcmRvd24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluc2VydGlvbiA9IGRvbnRDbG9uZSA/IGVsIDogZWwuY2xvbmVOb2RlKHRydWUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2UgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dCAmJiBwYXJlbnQgJiYgbmV4dC5wYXJlbnROb2RlID09PSBwYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlID0gbmV4dDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGluZyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gcmVzZXRBbmltYXRpb25GbGFnICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUoaW5zZXJ0aW9uLCByZWZlcmVuY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIG91dGdvaW5nKGluc2VydGlvbiwgZnVuY3Rpb24gZGVzdHJveSAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnQuY29udGFpbnMoaW5zZXJ0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKGluc2VydGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LCBjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIG5vb3AoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJzMnKTtcclxuICAgIH1cclxuICAgIHJldHVybiBhbmltYXRvcjtcclxufSgpKTtcclxuIiwiLyoqXHJcbiAqIERPTSB1dGlsaXRpZXMuXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoZG9jKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgLyoqXHJcblx0ICogRGV0ZWN0cyB0aGUgc3VwcG9ydGVkIHByb3BlcnR5IG5hbWUgZm9yIHRoZSBcInRyYW5zaXRpb25lbmRcIiBldmVudC4gKHRyYW5zaXRpb24pXHJcblx0ICogQHJldHVybnMge3N0cmluZ30gVGhlIHN1cHBvcnRlZCBwcm9wZXJ0eSBuYW1lLlxyXG5cdCAqL1xyXG4gICAgZnVuY3Rpb24gd2hpY2hUcmFuc2l0aW9uRXZlbnQoKSB7XHJcbiAgICAgICAgdmFyIGtleSxcclxuICAgICAgICAgICAgZWwgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2JyksXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgJ3RyYW5zaXRpb24nOiAndHJhbnNpdGlvbmVuZCcsXHJcbiAgICAgICAgICAgICAgICAnT1RyYW5zaXRpb24nOiAnb1RyYW5zaXRpb25FbmQnLFxyXG4gICAgICAgICAgICAgICAgJ01velRyYW5zaXRpb24nOiAndHJhbnNpdGlvbmVuZCcsXHJcbiAgICAgICAgICAgICAgICAnV2Via2l0VHJhbnNpdGlvbic6ICd3ZWJraXRUcmFuc2l0aW9uRW5kJ1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICBmb3IgKGtleSBpbiB0cmFuc2l0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAodHJhbnNpdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVsLnN0eWxlW2tleV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJhbnNpdGlvbnNba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuXHQgKiBEZXRlY3RzIHRoZSBzdXBwb3J0ZWQgcHJvcGVydHkgbmFtZSBmb3IgdGhlIFwiYW5pbWF0aW9uZW5kXCIgZXZlbnQuIChrZXlmcmFtZXMpXHJcblx0ICogQHJldHVybnMge3N0cmluZ30gVGhlIHN1cHBvcnRlZCBwcm9wZXJ0eSBuYW1lLlxyXG5cdCAqL1xyXG4gICAgZnVuY3Rpb24gd2hpY2hBbmltYXRpb25FdmVudCgpIHtcclxuICAgICAgICB2YXIga2V5LFxyXG4gICAgICAgICAgICBlbCA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuICAgICAgICAgICAgYW5pbWF0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICdhbmltYXRpb24nOiAnYW5pbWF0aW9uZW5kJyxcclxuICAgICAgICAgICAgICAgICdPQW5pbWF0aW9uJzogJ29BbmltYXRpb25FbmQnLFxyXG4gICAgICAgICAgICAgICAgJ01vekFuaW1hdGlvbic6ICdhbmltYXRpb25lbmQnLFxyXG4gICAgICAgICAgICAgICAgJ1dlYmtpdEFuaW1hdGlvbic6ICd3ZWJraXRBbmltYXRpb25FbmQnXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIGZvciAoa2V5IGluIGFuaW1hdGlvbnMpIHtcclxuICAgICAgICAgICAgaWYgKGFuaW1hdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVsLnN0eWxlW2tleV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uc1trZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG5cdCAqIERldGVjdHMgaWYgYSBkZXZpY2UgaXMgdG91Y2ggZW5hYmxlZC5cclxuXHQgKi9cclxuICAgIGZ1bmN0aW9uIGlzVG91Y2hEZXZpY2UoKSB7XHJcbiAgICAgICAgdmFyIHVhID0gbmF2aWdhdG9yLnVzZXJBZ2VudDtcclxuICAgICAgICByZXR1cm4gJ29udG91Y2hzdGFydCcgaW4gZG9jLmRvY3VtZW50RWxlbWVudCB8fFxyXG4gICAgICAgICAgICB1YS5pbmRleE9mKCdpUGFkJykgIT09IC0xIHx8XHJcbiAgICAgICAgICAgIHVhLmluZGV4T2YoJ2lQaG9uZScpICE9PSAtMTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHdoaWNoVHJhbnNpdGlvbkV2ZW50OiB3aGljaFRyYW5zaXRpb25FdmVudCxcclxuICAgICAgICB3aGljaEFuaW1hdGlvbkV2ZW50OiB3aGljaEFuaW1hdGlvbkV2ZW50LFxyXG4gICAgICAgIGlzVG91Y2hEZXZpY2U6IGlzVG91Y2hEZXZpY2VcclxuICAgIH07XHJcbn0oZG9jdW1lbnQpKTtcclxuIiwiLyoqXHJcbiAqIE9iamVjdHMgdXRpbGl0aWVzLlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWVyZ2VzIChkZWVwIGNvcHkpIHRoZSBjb250ZW50cyBvZiB0d28gb3IgbW9yZSBvYmplY3RzIHRvZ2V0aGVyIGludG8gdGhlIGZpcnN0IG9iamVjdC5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXQgVGhlIG9iamVjdCB0byBleHRlbmQuIEl0IHdpbGwgcmVjZWl2ZSB0aGUgbmV3IHByb3BlcnRpZXMuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0MSBBbiBvYmplY3QgY29udGFpbmluZyBhZGRpdGlvbmFsIHByb3BlcnRpZXMgdG8gbWVyZ2UgaW4uXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0TiBBZGRpdGlvbmFsIG9iamVjdHMgY29udGFpbmluZyBwcm9wZXJ0aWVzIHRvIG1lcmdlIGluLlxyXG4gICAgICogQHVzZSBleHRlbmQoe30sIG9iajEsIG9iak4pXHJcbiAgICAqL1xyXG4gICAgZnVuY3Rpb24gZXh0ZW5kKCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAxLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gYXJndW1lbnRzW2ldKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzW2ldLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzW2ldW2tleV0gJiYgYXJndW1lbnRzW2ldW2tleV0uY29uc3RydWN0b3IgJiYgYXJndW1lbnRzW2ldW2tleV0uY29uc3RydWN0b3IgPT09IE9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHNbMF1ba2V5XSA9IGFyZ3VtZW50c1swXVtrZXldIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBleHRlbmQoYXJndW1lbnRzWzBdW2tleV0sIGFyZ3VtZW50c1tpXVtrZXldKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHNbMF1ba2V5XSA9IGFyZ3VtZW50c1tpXVtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJndW1lbnRzWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZXh0ZW5kOiBleHRlbmRcclxuICAgIH07XHJcbn0oKSk7XHJcbiJdfQ==
