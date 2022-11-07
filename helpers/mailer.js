const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "alperennuroglu@hotmail.com", // generated ethereal user
        pass: "18052002", // generated ethereal password
    },
});


module.exports = transporter;