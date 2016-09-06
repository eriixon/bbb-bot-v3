'use strict';

let states  = require('../../constants/states');
let stn      = require('../../constants/sentences');
let cityApi = require('../../api/cityapi');
let fba     = require('../../api/fbapi');

// This class can validate incoming data from user (names of states, cities, zip)
class LocationValidator {

    validateZip(userInput) {
        if (!isNaN(userInput) && userInput.length === 5) return userInput;
        return false;
    };

    validateState(userInput) {
        let upperInput = userInput.toUpperCase();
        for (let abbr in states) {
            if (upperInput === abbr || upperInput === states[abbr].toUpperCase()) return abbr;
        };
        return false;
    };

    validateCity(userInput, session) {
        let self = this;

        cityApi.getCities(userInput, session.context.state, cityList => {
            if (cityList.length === 0) {
                fba.sendTextMessage(session.fbid, stn.SMALL_CITY)
                session.context.foundCity = true;
            }
            else if (cityList.length  >  4) {
                fba.sendTextMessage(session.fbid, stn.MANY_CITIES)}
                else { self.createReplies(cityList, session.fbid);
            };
        });
    };

    // Create replies with cities
    createReplies (cityList, userID) {

        let quickReplies = [];
        for (var i = 0; i < cityList.length; i++) {
            let city = cityList[i];
            let obj = new Object();
            obj.content_type = "text";
            obj.title = city;
            obj.payload = city;
            quickReplies.push(obj);
        }
        quickReplies.push({content_type: "text", title: 'Other', payload: "OTHER"});
        fba.sendMessage({
            recipient: { id: userID },
            message: { text: stn.WHICH_CITY, quick_replies: quickReplies}
        });
    };
};

module.exports = new LocationValidator;

