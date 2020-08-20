const moment = require('moment');

// Message formatting
function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a'),
    }
}

// Export message formatting to server
module.exports = formatMessage;