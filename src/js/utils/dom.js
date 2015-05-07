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

        for (key in transitions){
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

    return {
        whichTransitionEvent: whichTransitionEvent,
        whichAnimationEvent: whichAnimationEvent
    };
}(document));
