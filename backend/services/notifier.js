const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport(process.env.EMAIL_SMTP_URL);

async function notify(verbose = false) {
  const mailBodyText = (process.env.EMAIL_TEXT || '').replaceAll('\\n', '\n');
  const info = await transport.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    replyTo: process.env.REPLY_TO,
    subject: process.env.EMAIL_SUBJECT,
    text: mailBodyText
  }).catch((error) => {
    console.error(error);
  });
  if (info && verbose) {
    console.log('Notification sent.', info);
  }
}

module.exports = {
  notify
};
