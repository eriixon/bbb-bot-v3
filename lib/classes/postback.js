const request = require('request');

let fba = require('../api/fbapi');
let constants = require('../constants/constants');
let rs = require('../constants/sentences');
let utl = require ('./utility');

// Handler for postback coming after button click

class Postbacks {

  // Postback from FB after pushing some button

  handlePayload(event, session) {

    let text = '';
    let senderID = event.sender.id;
    let payload = event.postback.payload;
    console.log("Received postback for user %d and page %d with payload '%s' at %d", senderID, event.recipient.id, payload, event.timestamp);

    switch (payload) {

      // BUTTON Get start
      case 'GET_START':
      
        utl.startConversation(senderID, (greetings) => {
          fba.sendMessage(greetings);
          utl.searchMenu(senderID);
        });
        break;

      case 'SEARCH_BY_STATE':
        session.context = {};
        session.context.state = true;
        fba.sendTextMessage(senderID,rs.SEARCH_BY_STATE);
        break;

      case 'SEARCH_BY_ZIP':
        session.context = {};
        session.context.zip = true;
        fba.sendTextMessage(senderID,rs.SEARCH_BY_ZIP);
        break;

      case 'USER_LOCATION':
        session.context = {};
        session.context.userLoc = true;
        fba.sendTextMessage(senderID,rs.UL_WARNING);
        fba.sendTextMessage(senderID,rs.UL_SEND);
        break;
    };
  };
};

module.exports = new Postbacks;