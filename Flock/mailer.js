var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'theflockteam@gmail.com',
        pass: 'flockbros'
    }
});

module.exports = transporter;