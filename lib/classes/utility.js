
const request = require('request');

let rs = require('../constants/sentences');
let rw = require('../constants/words');
let fba = require('../api/fbapi');
let constants = require('../constants/constants');

class Utilities {

    // Response for reserved words 
    check (recipientID, key) {

        switch (key) {
            case 'WELCOME':
            case 'SOME':
            case 'HELP':
                fba.sendTextMessage(recipientID, rs[key]);
                break;
            case 'STOP':
                point.endSession = true;
                fba.sendTextMessage(recipientID, rs[key]);
                break;
        };
    };





};

module.exports = new Utilities;
