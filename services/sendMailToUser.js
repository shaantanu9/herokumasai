const nodemailer = require('nodemailer');
//Sending mail to user
const sendMailToUser = (email,url,name)=>{
    console.log("sendMailToUser function Started ", email,url,name);
    var transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "5269c4d55deb2a",
          pass: "243224b62eb62c"
        }
      });
    const mailOptions = {
        from: 'shantanu.bombatkar@masaischool.com',
        to: email,
        subject: 'Reset Password with the link sent to your email',
        html: `
        <h1>Hello ${name}</h1>
        <p>Please Click on the link to reset your password</p>
        <a href=${url}>${url}</a>
        `
    };
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log("sendMailToUser function Failed ", err);
        } else {
            console.log("sendMailToUser function Success ", data);
        }
            
    });
}

module.exports = sendMailToUser;