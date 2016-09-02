'use strict';

/* This class can separate incoming event (without message from user) 
 * and show results on the screen or console
 */

let fba = require('../api/fbapi');

// Facebook class
class FBoperations {

  selectOptions(event, session) {
    if(event.read)      this.receivedMessageRead(event);
    if(event.delivery)  this.receivedDeliveryConfirmation(event);
    if(event.postback)  this.receivedPostback(event, session);
  }

// Delivery confirmation
  receivedDeliveryConfirmation(event) {
    let delivery = event.delivery;
    let messageIDs = delivery.mids;
    let watermark = delivery.watermark;

    if (messageIDs) 
    messageIDs.forEach(function (messageID) { 
      console.log("Received delivery confirmation for message ID: %s", messageID) });
      console.log("All message before %d were delivered.", watermark);
  }

// Read confirmation
  receivedMessageRead(event) {
    let watermark = event.read.watermark;
    let sequenceNumber = event.read.seq;
    console.log("Received message read event for watermark %d and sequence number %d", watermark, sequenceNumber);
  }
  
};

module.exports = new FBoperations;