const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    // Define email options
    const mailOptions = {
      from: `"VideoPost" <${process.env.EMAIL_FROM || 'noreply@videopost.com'}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail }; // Export as an object with sendEmail property