'use strict';
require('es6-promise').polyfill();
require('isomorphic-fetch');
let constants = require('../constants/constants');

// Facebook API request for sending messages to the bot
class CallFBApi {

 // Send message to Facebook API
  sendMessage(messageData) {

    var body = JSON.stringify(messageData)
    return fetch('https://graph.facebook.com/me/messages?access_token='+encodeURIComponent(constants.PAGE_ACCESS_TOKEN), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      })
      .then(rsp => rsp.json())
      .then(json => {
        if (json.error && json.error.message) throw new Error(json.error.message);
        return json;
      });
  };

  // Send simple text messsage
  sendTextMessage(recipientId, messageText) {
    let messageData = {
      recipient: { id: recipientId },
      message: { text: messageText, metadata: "TEXT" }
    };
    return this.sendMessage(messageData);
  };

}; 

module.exports = new CallFBApi;