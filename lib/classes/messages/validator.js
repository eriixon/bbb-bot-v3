
'use strict';

let states  = require('../../constants/states');
let rs      = require('../../constants/sentences');
let cityApi = require('../../api/cityapi');
let fba     = require('../../api/fbapi');
let utl     = require ('../utility');

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

        cityApi.getCities(userInput, session.context.state, cityList => {
            if (cityList.length === 0) {
                fba.sendTextMessage(session.fbid, rs.SMALL_CITY)
                session.context.foundCity = true;
            }
            else if (cityList.length  >  4) {
                fba.sendTextMessage(session.fbid, rs.MANY_CITIES)}
                else { utl.createReplies(cityList, session.fbid);
            };
        });
    };

};

module.exports = new LocationValidator;

