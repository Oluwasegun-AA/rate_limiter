import { Mail, ResponseHandler, statusCodes } from '../helpers';


class Mails {
  static async sendMail(req, res) {
    const {email: userEmail } = req.user
    const {message, subject, email } = req.body
    const messageConstruct = {
      from: userEmail,
      to: email,
      subject: subject,
      text: message,
    };
    Mail.sendMail(messageConstruct);
    return ResponseHandler.success(
      res,
      statusCodes.success,
      'Mail Sent Successfully',
    );
  }
}

export default Mails;
