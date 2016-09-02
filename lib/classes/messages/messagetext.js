
let utl = require('../utility');
let validator = require('./validator');
let rs = require('../../constants/sentences');
let rw = require('../../constants/words');
let states = require('../../constants/states');
let fba = require('../../api/fbapi');
let bbb = require('../../api/bbbapi');


class MessageText {

    handlerMessageText(session, messageText) {

        let condition = false;
        let point = session.context;
        let selectedLocation = false;
        let userID = session.fbid;
        messageText = messageText.trim();

        if (!point.userLoc && !point.state && !point.zip) condition = "TRY_AGAIN";
        if (rw[messageText]) condition = 'WORD';
        if (typeof (point.zip) === "boolean") condition = 'ZIP';
        if (typeof (point.state) === "boolean") condition = 'STATE';
        if (typeof (point.city) === "boolean") condition = 'CITY';
        if (typeof (point.name) === "boolean") condition = 'NAME';

        switch (condition) {
            case "TRY_AGAIN":
                utl.check(userID, "HELP");
                break;
            case 'WORD':
                utl.check(userID, rw[messageText]);
                break;
            case 'ZIP':
                if (validator.validateZip(messageText)) {
                    point.zip = validator.validateZip(messageText);
                    point.name = true;
                    fba.sendTextMessage(userID, rs.NAME);
                }
                else fba.sendTextMessage(userID, rs.BAD_INPUT);
                break;
            case 'STATE':
                if (validator.validateState(messageText)) {
                    point.state = validator.validateState(messageText);
                    point.city = true;
                    fba.sendTextMessage(userID, `Selected state: ${states[point.state]}`);
                    fba.sendTextMessage(userID, rs.CITY);
                }
                else fba.sendTextMessage(userID, rs.BAD_INPUT);
                break;
            case 'CITY':
                if (point.foundCity) {
                    point.city = messageText;
                    point.name = true;
                    fba.sendTextMessage(userID, `Selected : ${states[point.state]} ${point.city}`);
                    fba.sendTextMessage(userID, rs.NAME);
                } else {
                    validator.validateCity(messageText, session);
                }
                break;
            case 'NAME':
                point.name = messageText;
                // point.endSession = true;
                fba.sendTextMessage(userID, rs.SEARCH);
                // Send data to BBB API and show response
                bbb.createList(session, messageData => {
                    if (!messageData.message.text) {
                        point.endSession = true;
                    } else {
                        point.name = true;
                    }
                    fba.sendMessage(messageData).then(function () {
                        if (session.context.endSession === true) {
                            fba.sendTextMessage(session.fbid, rs.THANK)
                        }
                    })
                });
                break;
        }
    };
};

module.exports = new MessageText;