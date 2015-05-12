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
