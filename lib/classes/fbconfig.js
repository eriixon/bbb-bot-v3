'use strict';

/* This class can set up the Welcome button and Persistent Menu.
 */
const request = require('request');
let constants = require('../constants/constants');
let rs = require('../constants/sentences');

// Facebook class
class FBconfig {

    welcome() {

        this.welcomeScreen();
        this.welcomeButton();
        this.createMenu();
    }

    welcomeScreen() {
        request({
            method: 'POST',
            uri: 'https://graph.facebook.com/v2.7/me/thread_settings?access_token=' + constants.PAGE_ACCESS_TOKEN,
            json: true,
            qs: {
                setting_type: 'greeting',
                greeting: { text: rs.GREETING}
            },
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) console.log(body.result);
        }
        );
    };


    // Welcome button for the first visit
    welcomeButton() {
        request({
            method: 'POST',
            uri: 'https://graph.facebook.com/v2.7/me/thread_settings?access_token=' + constants.PAGE_ACCESS_TOKEN,
            json: true,
            qs: {
                setting_type: 'call_to_actions',
                thread_state: 'new_thread',
                call_to_actions: [{ payload: 'GET_START' }]
            },
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) console.log(body.result);
        }
        );
    };

    // Persistent menu for search
    createMenu() {
        let data = {
            "setting_type": "call_to_actions",
            "thread_state": "existing_thread",
            "call_to_actions": [
                {
                    "type": "postback",
                    "title": "Search by City and State",
                    "payload": "SEARCH_BY_STATE"
                },
                {
                    "type": "postback",
                    "title": "Search by ZIP Code",
                    "payload": "SEARCH_BY_ZIP"
                },
                {
                    "type": "postback",
                    "title": "My Location (Mobile)",
                    "payload": "USER_LOCATION"
                }
            ]
        }
        request({
            url: 'https://graph.facebook.com/v2.6/me/thread_settings',
            qs: { access_token: constants.PAGE_ACCESS_TOKEN },
            method: 'POST',
            json: data
        }, function (error, response, body) {
            console.log(body.result)
        });
    };


};

module.exports = new FBconfig;