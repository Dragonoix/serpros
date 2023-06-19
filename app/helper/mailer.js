
const Email = require('email-templates');
const path = require('path');

const nodemailer = require('nodemailer');




var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});


class Mailer {
    constructor() {}


    /* @Method: sendMail
    // @Description: For sendmail
    */
    async sendMailViaGmail(to, subject, tplName, locals) {
        try {

            const templateDir = path.join(__dirname, "../views/", 'email-templates', tplName + '/html')


            const email = new Email({
                message: {
                    from: process.env.FROM_EMAIL
                },
                transport: {
                    jsonTransport: true
                },
                views: {
                    root: templateDir,
                    options: {
                        extension: 'ejs'
                    }
                }
            });

            let getResponse = await email.render(templateDir, locals);


            ////////////////////////////
            var mailOptions = {
                from: process.env.FROM_EMAIL,
                to: to,
                subject: subject,
                html: getResponse
            };

            let mailsent = transporter.sendMail(mailOptions);
            return mailsent;

        }
        catch (e) {
            console.log(e.message);
            return false;
        }

    };
}
module.exports = new Mailer();