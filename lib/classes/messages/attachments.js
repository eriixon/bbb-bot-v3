let rs = require('../../constants/sentences');
let fba = require('../../api/fbapi');
let gm = require('../../api/gmapi');

class Attachments {

    handlerAttachments(session, attachments) {

             gm.findCityState(attachments, function(cityState){
                 if (cityState){
                    session.context.city = cityState.city;
                    session.context.state = cityState.state;
                    session.context.name = true;
                    fba.sendTextMessage(session.fbid, `Location: ${session.context.city}, ${states[session.context.state]} `);
                    fba.sendTextMessage(session.fbid, rs.NAME);
                 } else fba.sendTextMessage(session.fbid, rs.BAD_ATTACH)
             });
    }
}

module.exports = new Attachments;