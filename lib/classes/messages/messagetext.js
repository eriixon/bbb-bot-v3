'use strict';
let validator = require('./validator');
let stn = require('../../constants/sentences');
let states = require('../../constants/states');
let fba = require('../../api/fbapi');
let bbb = require('../../api/bbbapi');

// The class manage all incoming messages from users
class MessageText {

    handlerMessageText(session, messageText) {

        let condition = false;
        let point = session.context;
        let selectedLocation = false;
        let userID = session.fbid;
        messageText = messageText.trim();

        if (!point.userLoc && !point.state && !point.zip) condition = "TRY_AGAIN";
        if (stn[messageText.toUpperCase()]) condition = 'WORD';
        if (typeof (point.zip) === "boolean") condition = 'ZIP';
        if (typeof (point.state) === "boolean") condition = 'STATE';
        if (typeof (point.city) === "boolean") condition = 'CITY';
        if (typeof (point.name) === "boolean") condition = 'NAME';

        switch (condition) {
            case "TRY_AGAIN":
                fba.sendTextMessage(userID, stn[HELP])
                break;
            case 'WORD':
                if (stn[messageText.toUpperCase()] == stn[STOP]) point.endSession = true;
                fba.sendTextMessage(recipientID, stn[messageText.toUpperCase()]);
                break;
            case 'ZIP':
                if (validator.validateZip(messageText)) {
                    point.zip = validator.validateZip(messageText);
                    console.log (`Current ZIP is ${point.zip}`);
                    point.name = true;
                    fba.sendTextMessage(userID, stn.NAME);
                } else fba.sendTextMessage(userID, stn.BAD_INPUT);
                break;
            case 'STATE':
                if (validator.validateState(messageText)) {
                    point.state = validator.validateState(messageText);
                    console.log (`Current state/province is ${point.state}`);
                    point.city = true;
                    fba.sendTextMessage(userID,`Selected state: ${states[point.state]}`).then(function(){ fba.sendTextMessage(userID, stn.CITY)});
                } else fba.sendTextMessage(userID, stn.BAD_INPUT);
                break;
            case 'CITY':
                if (point.foundCity) {
                    point.city = messageText;
                    console.log (`Current city is ${point.city}`);
                    point.name = true;
                    fba.sendTextMessage(userID, `Location: ${states[point.state]} ${point.city}`).then(function(){fba.sendTextMessage(userID, stn.NAME)});
                } else validator.validateCity(messageText, session);
                break;
            case 'NAME':
                point.name = messageText;
                fba.sendTextMessage(userID, stn.LOADING);
                // Send data to BBB API and show response
                bbb.createList(session, messageData => {
                    if (!messageData.message.text) point.endSession = true;
                    else point.name = true;
                    fba.sendMessage(messageData).then(function () {
                        if (session.context.endSession === true) fba.sendTextMessage(session.fbid, stn.THANK);
                })});
            break;
    }};
};

module.exports = new MessageText;