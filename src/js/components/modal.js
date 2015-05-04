/**
 * Modal component.
 * @returns {object} The modal module.
 */
module.exports = (function () {
    'use strict';

    var modal = {};

    modal.visible = m.prop(false);

    modal.view = function (header, body, footer) {
        return modal.visible() ?
            m('div.modal', { config: modal.vm.fadeIn }, [
                m('div.modal-dialog', [
                    m('div.modal-content', [
                        m('div.modal-header', [
                            m('a.close', {onclick: modal.visible.bind(this, false)}, m.trust('&times;')),
                            header && header()
                        ]),
                        m('div.modal-body', body && body()),
                        footer && footer()
                    ])
                ])
            ]) :
            '';
    };

    modal.vm = {
        fadeIn: function (element) {
            setTimeout(function () {
                element.classList.add('fadein');
            }, 0);
        }
    };

    return modal;
}());