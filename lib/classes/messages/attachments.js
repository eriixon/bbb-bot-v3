let rs = require('../../constants/sentences');
let fba = require('../../api/fbapi');
let gm = require('../../api/gmapi');
let states = require('../../constants/states');

class Attachments {

    handlerAttachments(session, attachments) {

        if (attachments[0].payload.coordinates) {
            var coordinates = attachments[0].payload.coordinates;
            gm.findCityState(coordinates, cityState => {
                if (cityState) {
                    session.context.city = cityState.city;
                    session.context.state = cityState.state;
                    session.context.name = true;
                    let location = `Location: ${session.context.city}, ${states[session.context.state]}`;
                    console.log (`Current location is ${location}`);
                    fba.sendTextMessage(session.fbid, location).then(function(){fba.sendTextMessage(session.fbid, rs.NAME)});
                 } else fba.sendTextMessage(session.fbid, rs.BAD_LOC);
            });
        } 
        // else fba.sendTextMessage(session.fbid, rs.BAD_ATTACH);
    };
};

module.exports = new Attachments;