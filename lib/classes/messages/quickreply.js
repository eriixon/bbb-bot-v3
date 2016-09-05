let rs = require('../../constants/sentences');
let fba = require('../../api/fbapi');
let states = require('../../constants/states');

class QuickReplies {

    handlerReply (session, quickreply) {
        if (quickreply.payload == "OTHER"){
            session.context.foundCity = true;
            fba.sendTextMessage(session.fbid, rs.SMALL_CITY);
        } else {
            session.context.name = true;
            session.context.city = quickreply.payload;
            console.log (`Current city is ${session.context.city}`);
            let location = `Location: ${session.context.city}, ${states[session.context.state]}`;
            fba.sendTextMessage(session.fbid, location ).then(function() {fba.sendTextMessage(session.fbid, rs.NAME)});
    }};
};

module.exports = new QuickReplies;