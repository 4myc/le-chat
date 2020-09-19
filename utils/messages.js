// Message Formatting

const moment = require('moment');

// Message formatting
function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('llll'),
    }
}

// Export message formatting to server
module.exports = formatMessage;