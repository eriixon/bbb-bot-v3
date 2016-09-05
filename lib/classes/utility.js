
const request = require('request');

let rs = require('../constants/sentences');
let rw = require('../constants/words');
let fba = require('../api/fbapi');
let constants = require('../constants/constants');

class Utilities {

    // Response for reserved words 
    check (recipientID, key) {

        switch (key) {
            case 'WELCOME':
            case 'SOME':
            case 'HELP':
                fba.sendTextMessage(recipientID, rs[key]);
                break;
            case 'STOP':
                point.endSession = true;
                fba.sendTextMessage(recipientID, rs[key]);
                break;
        };
    };

    // Start topic for conversation
    startConversation(recipientID, callback) {
        let greetings;
        request({
        url: `https://graph.facebook.com/v2.7/${recipientID}`,
        qs: { access_token: constants.PAGE_ACCESS_TOKEN },
        method: 'GET'
        }, function (error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        } else {
            let name = JSON.parse(body);
            greetings = {
            recipient: { id: recipientID }, 
            message: { text: `Hello ${name.first_name} ${name.last_name}! I can help you to find businesses in North America.` },
            };
        };
        callback(greetings);
        });
    };

    // Send search initial menu
    searchMenu(recipientID) {

        let messageData = {
            recipient: { id: recipientID },
            message: {
                attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "How would you like to search?",
                    buttons: [
                    { type: "postback", title: "By City and State", payload: "SEARCH_BY_STATE" },
                    { type: "postback", title: "By ZIP Code", payload: "SEARCH_BY_ZIP" },
                    { type: "postback", title: "My Location (Mobile)", payload: "USER_LOCATION" }
                    ]
            }}}
        };
        fba.sendMessage(messageData);
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

        let messageData = {
        recipient: { id: userID },
        message: { text: "Which city did you mean?", quick_replies: quickReplies}
        };
        fba.sendMessage(messageData);
    };

};

module.exports = new Utilities;
