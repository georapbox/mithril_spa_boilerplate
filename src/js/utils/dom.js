/**
 * DOM utilities.
 */
app.utils.dom = (function (doc) {
    /**
     * Responsible to find the appropriate "transitionend" event supported by each browser.
     * If event is found, the event name is returned, else undefined.
     * @returns {string} The supported event name
     */
    function whichTransitionEvent() {
        var t,
            el = document.createElement('div'),
            transitions = {
                'transition': 'transitionend',
                'OTransition': 'oTransitionEnd',
                'MozTransition': 'transitionend',
                'WebkitTransition': 'webkitTransitionEnd'
            };

        for (t in transitions){
            if (transitions.hasOwnProperty(t)) {
                if (el.style[t] !== undefined) {
                    el = null;
                    return transitions[t];
                }
            }
        }
    }

    return {
        whichTransitionEvent: whichTransitionEvent
    };
}(document));
