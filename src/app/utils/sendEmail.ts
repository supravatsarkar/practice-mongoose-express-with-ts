import nodemailer from "nodemailer";
import config from "../config";

const sendEmail = async (to: string, subject: string, htmlTemplate: string) => {
  const transporter = nodemailer.createTransport({
    host: config.smtp_host,
    port: Number(config.smtp_port),
    secure: config.NODE_ENV === "production", // for production value is true otherwise false
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: config.smtp_user,
      pass: config.smtp_password,
    },
  });

  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: config.smtp_sender_email, // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: subject, // plain text body
      html: htmlTemplate, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
  }
  main().catch(console.error);
};

export default sendEmail;
