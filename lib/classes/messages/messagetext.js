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
        messageText = messageText.trim();

        if (!point.userLoc && !point.state && !point.zip) condition = "TRY_AGAIN";
        if (typeof (point.zip) === "boolean") condition = 'ZIP';
        if (typeof (point.state) === "boolean") condition = 'STATE';
        if (typeof (point.city) === "boolean") condition = 'CITY';
        if (typeof (point.name) === "boolean") condition = 'NAME';
        // Looking for specific words
        if (stn[messageText.toUpperCase()]) condition = 'WORD';

        switch (condition) {
            case "TRY_AGAIN":
                fba.sendTextMessage(session.fbid, stn['HELP']);
                break;
            case 'WORD':
                if (stn[messageText.toUpperCase()] == stn['STOP']) point.endSession = true;
                fba.sendTextMessage(session.fbid, stn[messageText.toUpperCase()]);
                break;
            case 'ZIP':
                if (validator.validateZip(messageText)) {
                    point.zip = validator.validateZip(messageText);
                    console.log (`Current ZIP is ${point.zip}`);
                    point.name = true;
                    fba.sendTextMessage(session.fbid, stn.NAME);
                } else fba.sendTextMessage(session.fbid, stn.BAD_INPUT);
                break;
            case 'STATE':
                if (validator.validateState(messageText)) {
                    point.state = validator.validateState(messageText);
                    console.log (`Current state/province is ${point.state}`);
                    point.city = true;
                    fba.sendTextMessage(session.fbid,`Selected state: ${states[point.state]}`).then(function(){ fba.sendTextMessage(session.fbid, stn.CITY)});
                } else fba.sendTextMessage(session.fbid, stn.BAD_INPUT);
                break;
            case 'CITY':
                if (point.foundCity) {
                    point.city = messageText;
                    console.log (`Current city is ${point.city}`);
                    point.name = true;
                    fba.sendTextMessage(session.fbid, `Location: ${states[point.state]} ${point.city}`).then(function(){fba.sendTextMessage(session.fbid, stn.NAME)});
                } else validator.validateCity(messageText, session);
                break;
            case 'NAME':
                point.name = messageText;
                fba.sendTextMessage(session.fbid, stn.LOADING);
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