/**
 * function sends the transcript 
 * 
var log = "thank you for calling T-Mobile this is Patrick\nhello I am having issues with Cellular Connection here in Austin\nokay let me check the service that is over there\nall right so after checking it appears Austin is all right are you getting any signal on your phone or do\nyou have no bars at all I have none at all\nall right did you check that cellular data is turned on in your settings I have checked and there's on\nall right then you you'll have to bring your phone into a local T-Mobile store to get it fixed\nall right thank you\nyou're welcome have a nice day\n";
emailTranscript("10/25/18", log, "ningchen227@gmail.com");

 */
var nodemailer = require('nodemailer');

function emailTranscript(transcriptDate, log, email) {
    var emailer = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hacktobercustomerservice@gmail.com',
            pass: 'Hacktober2018'
        }
    });
    var emailOpt = {
        from: 'hacktobercustomerservice@gmail.com',
        to: email,
        subject: 'Your call to T-Mobile on ' + transcriptDate,
        html: "<html>" +
            "<img style='width:25%;height:25%;' src='https://images.techhive.com/images/article/2014/08/tmobile_logo-100369081-large.jpg'></img>" +
            "<p style='font-family:Verdana, Geneva, Tahoma, sans-serif; font-size:14px;'>Thank you for calling T-Mobile! We appreciate your business. Here is a transcription of your conversation with us at " + transcriptDate + ": </p>" +
            "<p style='font-family:Verdana, Geneva, Tahoma, sans-serif; font-size:12px;'>" + log + "</p>" +
            "</html>"
    };
    emailer.sendMail(emailOpt, function (error, info) {
        if (error) {
            console.log(error);
            return false;
        } else {
            console.log('Email sent: ' + info.response);
            return true;
        }
    });
}

module.exports = {
    emailTranscript
}