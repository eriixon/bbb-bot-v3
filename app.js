'use strict';

const bodyParser = require('body-parser'),
      config = require('config'),
      crypto = require('crypto'),
      express = require('express');

let app = express();
let constants = require('./lib/constants/constants');
let sessions = require('./lib/classes/sessions');
let fbc = require('./lib/classes/fbconfig');
let bm = require('./lib/classes/botmanager');

const currentSessions = {};

app.set('port', process.env.PORT || 8000);
app.use(bodyParser.json({ verify: verifyRequestSignature }));
app.use(express.static('public'));

if (!(constants.APP_SECRET && constants.VALIDATION_TOKEN && constants.PAGE_ACCESS_TOKEN && constants.SERVER_URL)) {
  console.error("Missing config values"); 
  process.exit(1)
};

/*
 * Configuration of the bot for the first visit
 */

// Welcome Configuration
fbc.welcome();


// SETUP WEBHOOK
app.get('/webhook', function (req, res) {
  if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === constants.VALIDATION_TOKEN) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  };
}
);

// FACEBOOK WEBHOOK
app.post('/webhook', function (req, res) {
  let data = req.body;

  // Make sure this is a page subscription
  if (data.object == 'page') {
    data.entry.forEach(function (pageEntry) {
      let pageID = pageEntry.id;
      let senderID = pageEntry.messaging[0].sender.id;
      let sessionID = sessions.findOrCreateSession(senderID, currentSessions);

      if (senderID != pageID) {
        pageEntry.messaging.forEach(messagingEvent => {
          
          bm.manageEvent(messagingEvent, currentSessions[sessionID], (updatedSession) => {
            currentSessions[sessionID] = updatedSession;            
            if (currentSessions[sessionID].context.endSession) delete currentSessions[sessionID];
          });
          
      })};
    });
    res.sendStatus(200);
  };
});


// VERIFICATION OF CALLBACKS
function verifyRequestSignature(req, res, buf) {
  let signature = req.headers["x-hub-signature"];

  if (!signature) {
    // For testing, let's log an error. In production, you should throw an error.
    console.error("Couldn't validate the signature.");
  } else {
    let elements = signature.split('=');
    let method = elements[0];
    let signatureHash = elements[1];
    let expectedHash = crypto.createHmac('sha1', constants.APP_SECRET).update(buf).digest('hex');

    if (signatureHash != expectedHash) throw new Error("Couldn't validate the request signature.");
    
  }
};

// START SERVER
app.listen(app.get('port'), () => console.log('Facebook bot app is running on port', app.get('port')));


