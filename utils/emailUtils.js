const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yashveemavani@gmail.com', 
    pass: 'cohs hlwa hmte tvqu', 
  },
});

/**
 * Sends an email with the given details.
 * @param {String} to - Recipient email address.
 * @param {String} subject - Email subject.
 * @param {String} text - Plain text content of the email.
 * @param {String} html - HTML content of the email.
 */
const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: 'yashveemavani@gmail.com', // Sender email
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error;
  }
};

module.exports = { sendEmail };