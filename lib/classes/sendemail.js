'use strict';
let nodemailer = require('nodemailer');
let sendmailTransport = require('nodemailer-sendmail-transport');
var transport = nodemailer.createTransport( sendMailTransport({}));

class SendEmail {

    sendingEmail(){
        var params = {
        from: 'my.account@gmail.com', 
        to: 'radkovsn@gmail.com', 
        subject: 'Hi, body!',
        text: 'Let\'s read some articles on Web Creation'
        };

        transport.sendMail(params, function (err, res) {
        if (err) {
            console.error(err);
        }
        });
    }
}
module.exports = new SendEmail();