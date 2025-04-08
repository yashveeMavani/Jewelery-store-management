const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'yashveemavani@gmail.com', 
    pass: 'cohs hlwa hmte tvqu', 
  },
});

/**
 * Send an email with optional attachments.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} text - Email body text.
 * @param {Array} attachments - Array of attachment objects.
 */
async function sendEmail(to, subject, text, attachments = []) {
  try {
    const mailOptions = {
      from: 'yashveemavani@gmail.com', 
      to,
      subject,
      text,
      attachments,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

module.exports = { sendEmail };