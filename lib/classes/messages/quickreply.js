let rs = require('../../constants/sentences');
let fba = require('../../api/fbapi');
let states = require('../../constants/states');



class QuickReplies {

    handlerReply (session, quickreply) {
        if(quickreply) {
        if (quickreply.payload == "OTHER"){
            fba.sendTextMessage(session.fbid, rs.SMALL_CITY);
            session.context.foundCity = true;
        } else {
            session.context.name = true;
            session.context.city = quickreply.payload;
            fba.sendTextMessage(session.fbid, `Location: ${session.context.city}, ${states[session.context.state]} `);
            fba.sendTextMessage(session.fbid, rs.NAME);
        }} else {
            fba.sendTextMessage(session.fbid, rs.BAD_ATTACH);
        };
    };
    
}

module.exports = new QuickReplies;