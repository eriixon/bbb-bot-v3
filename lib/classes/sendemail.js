
var nodemailer = require('nodemailer');


class SendEmail {
    

    sendingEmail(){

        
        // var transporter = nodemailer.createTransport(
        //     sendMailTransport({})
        //     );
        //    var transporter = nodemailer.createTransport({
        //         service: 'Gmail',
        //         auth: {
        //             user: 'noresponse@gmail.com',
        //             pass: 'sr240880'
        //         }
        //     });

        var params = {
        from: 'radkovsn@gmail.com', 
        to: 'radkovsn@gmail.com', 
        subject: 'Hi, body!',
        text: 'Let\'s read some articles on Web Creation',
        html: '<b>Hello world </b>' // html body 
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