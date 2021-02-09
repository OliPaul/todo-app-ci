const bugsnagConfig = require('./heroku_bugsnag_config.json');
const Bugsnag = require('@bugsnag/js')

module.exports = {
    init: function(){

        const bugsnag = Bugsnag.start(bugsnagConfig.apikey);
        return bugsnag;
    }
}