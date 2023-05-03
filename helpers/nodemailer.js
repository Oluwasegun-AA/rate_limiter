import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const { MAIL_USER, PASS, MAIL_HOST, MAIL_SERVICE } = process.env;

class Mail {
   static sendMail = async (message) => {
    const transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      service: MAIL_SERVICE,
      port: 465,
      secure: true,
      auth: {
        user: MAIL_USER,
        pass: PASS
      }
    });
    const info = await transporter.sendMail(message, (err) => {
      if (err) console.log('err', err);
    });
    return info;
  }

}

export default Mail;
