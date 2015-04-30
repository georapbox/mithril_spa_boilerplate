/**
 * Dashboard page.
 * @returns {object} The dashboard module.
 */
app.pages.dashboard = (function () {
    'use strict';

    var User = function (data) {
        this.id = m.prop(data.id);
        this.name = m.prop(data.name);
        this.username = m.prop(data.username);
    };

    User.list = function () {
        return m.request({
            method: 'GET',
            url: 'data/users.json',
            type: User
        });
    };

    User.listEven = function () {
        return m.request({
            method: 'GET',
            url: 'data/users.json',
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
        return m('div.m-page.m-page--1', [
            m('ul', [
                dashboard.vm.users.map(function (usr, idx) {
                    return m('li', [
                        m('a[href="/dashboard/' + usr.username() + '"]', { config: m.route }, usr.name())
                    ]);
                })
            ]),
            m('h2', controller.id ? ('Hello ' + controller.id) :'This is the dashboard.'),
            m('p', { style: controller.id ? 'display:block' : 'display:none'}, [
                m('a[href="/userprofile/' + controller.id + '"]', { config: m.route }, 'Read more')
            ])
        ]);
    };

    return dashboard;
}());
















