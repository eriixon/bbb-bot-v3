
var nodemailer = require('nodemailer');


class SendEmail {
    

    sendingEmail(){
     
        var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'bbbmessanger@gmail.com',
                    pass: 'bbb130916'
                }
            });

        var params = {
        from: '"FB Finder" <bbbmessanger@gmail.com>', 
        to: 'radkovsn@gmail.com', 
        subject: 'Business Data Notification',
        text: 'Let\'s read some articles on Web Creation',
        // html: '<b>Hello world </b>' // html body 
        };

        transporter.sendMail(params, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
    }
}
module.exports = new SendEmail();