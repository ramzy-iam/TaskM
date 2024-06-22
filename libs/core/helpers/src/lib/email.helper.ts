import * as nodemailer from 'nodemailer';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport/';

export class EmailHelper {
  private static instance: EmailHelper | null = null;
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  private constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT as string),
      secure: false, // true for 465, false for other ports,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  public static getInstance(): EmailHelper {
    if (EmailHelper.instance === null) {
      EmailHelper.instance = new EmailHelper();
    }
    return EmailHelper.instance;
  }

  async sendEmail({
    to,
    subject,
    html,
    attachments,
    text,
  }: Partial<nodemailer.SendMailOptions>) {
    try {
      const from = process.env.MAIL_FROM_ADDRESS;
      const mailOptions: nodemailer.SendMailOptions = {
        from,
        to,
        subject,
        html,
        attachments,
        text, // Uncomment this line if you want to include a plain text version of the email
      };

      const response = await this.transporter.sendMail(mailOptions);
      return response;
    } catch (error) {
      console.log(`Failed  to send the email, ${error}`);
      throw error;
    }
  }
}
