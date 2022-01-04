const mailer = require('nodemailer');

class MailService {

    constructor() {
        this.transporter = mailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            }
        })
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Please, confirm your registration',
            text: '',
            html: `
                <div>
                    <h1>To confirm your account, enter this link:</h1>
                    <a href="${link}">Click here</a>
                </div>
            `
        });
    }

}

module.exports = new MailService();