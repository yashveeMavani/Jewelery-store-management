const { log_error } = require("../models");
const nodemailer = require('nodemailer');

async function errorHandler(err, req, res,next) {
    console.error('Error Caught:', err.message);

    const route = req.originalUrl;
    const payload = JSON.stringify(req.body || {});
    const errorMessage = err.message || 'Unknown error occurred';

    try {
        console.log('Logging error to DB...');
        await log_error.create({
            route,
            payload,
            error_message: errorMessage,
        });
    } catch (dbError) {
        console.error('Failed to log error to DB:', dbError.message);
    }

    await sendErrorNotification(route, payload, errorMessage);

    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
    });
}

async function sendErrorNotification(route, payload, errorMessage) {
    console.log('Preparing to send email notification...');
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'yashveemavani@gmail.com',   
            pass: 'cohs hlwa hmte tvqu'  
        }
    });

    const mailOptions = {
        from: 'yashveemavani@gmail.com',
        to: 'yashveemavani@gmail.com',  
        subject: 'Jewellery Store System - Error Alert',
        html: `
            <h3>API Error Notification</h3>
            <p><strong>Route:</strong> ${route}</p>
            <p><strong>Payload:</strong> ${payload}</p>
            <p><strong>Error:</strong> ${errorMessage}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        `
    };

    try {
        console.log('Sending email...');
        await transporter.sendMail(mailOptions);
        console.log('Error email sent successfully');
    } catch (emailErr) {
        console.error('Failed to send error email:', emailErr.message);
    }
}

module.exports = errorHandler;