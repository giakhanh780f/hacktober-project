/**
 * function sends the transcript 
 */
var nodemailer = require('nodemailer');
emailTranscript("10/25/18", "Log file");

function emailTranscript(transcriptDate, log) {
    var emailer = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'hacktobercustomerservice@gmail.com',
          pass: 'Hacktober2018'
        }
    });
    var emailOpt = {
        from: 'hacktobercustomerservice@gmail.com',
        to: 'psoysauce@gmail.com',
        subject: 'Your call to T-Mobile on ' + transcriptDate,
        text: log
    };
    emailer.sendMail(emailOpt, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}
