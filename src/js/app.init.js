// Namespace for our application.
window.app = window.app || {
    utils: {},
    pages: {}
};


window.m = require('./lib/mithril');

require('./utils/dom');
require('./utils/objects');
require('./utils/animator');

require('./modules/dashboard');
require('./modules/userprofile');
require('./modules/about');
require('./modules/contact');

require('./app.router');

require('./modules/nav');
