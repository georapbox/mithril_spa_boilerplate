/**
 * Modal component.
 * @returns {object} The modal module.
 */
module.exports = (function () {
    'use strict';

	/**
	 * Creates a modal instance.
	 * @constructor
	 */
	function Modal() {
		var that = this;
		var modalConfig = function (element) {
			setTimeout(function () {
				element.classList.add('fadein');
			}, 50);

			element.addEventListener('click', hideModal, false);

			function hideModal(e) {
				if (e.target.classList.contains('modal')) {
					element.removeEventListener('click', hideModal, false);
					m.startComputation();
					that.hide();
					m.endComputation();
				}
			}
		};

		// Getter / Setter for modal's visibility status.
		this.visible = m.prop(false);

		// The modal's view.
		this.view = function (opts) {
			return this.visible() ?
				m('.modal', { config: modalConfig }, [
					m('.modal-dialog', [
						m('.modal-content', [
							opts.header ? m('.modal-header', [
								m('a.close', {
									onclick: this.hide.bind(this)
								}, m.trust('&times;')),
								opts.header()
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
	};

	proto.hide = function () {
		this.visible = m.prop(false);
	};

	proto.isVisible = function () {
		return this.visible();
	};

    return Modal;
}());