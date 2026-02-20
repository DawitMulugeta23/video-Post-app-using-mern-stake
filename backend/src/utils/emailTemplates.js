// Email templates for different purposes
const emailTemplates = {
  welcome: (username, verificationUrl) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f7; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; }
        .content { padding: 40px 30px; }
        .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 5px; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to VideoPost!</h1>
        </div>
        <div class="content">
          <h2>Hello ${username},</h2>
          <p>Thank you for registering! Please verify your email address to activate your account.</p>
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email</a>
          </div>
          <p>This link will expire in 24 hours.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} VideoPost. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  passwordReset: (username, resetUrl) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f7; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; }
        .content { padding: 40px 30px; }
        .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #ffffff; text-decoration: none; border-radius: 5px; }
        .warning { background-color: #fff3cd; border: 1px solid #ffeeba; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hello ${username},</h2>
          <p>We received a request to reset your password.</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          <div class="warning">
            This link will expire in 10 minutes.
          </div>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} VideoPost. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  passwordChanged: (username) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f7; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 30px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; }
        .content { padding: 40px 30px; text-align: center; }
        .success-icon { font-size: 48px; margin-bottom: 20px; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Changed Successfully</h1>
        </div>
        <div class="content">
          <div class="success-icon">✅</div>
          <h2>Hello ${username},</h2>
          <p>Your password has been successfully changed.</p>
          <p>If you didn't make this change, please contact support immediately.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} VideoPost. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  emailVerified: (username) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f7; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); padding: 30px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; }
        .content { padding: 40px 30px; text-align: center; }
        .success-icon { font-size: 48px; margin-bottom: 20px; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Email Verified!</h1>
        </div>
        <div class="content">
          <div class="success-icon">🎉</div>
          <h2>Congratulations ${username}!</h2>
          <p>Your email has been successfully verified. You can now enjoy all features of VideoPost.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} VideoPost. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
};

// Helper function to send templated emails - FIXED VERSION
const sendTemplatedEmail = async (emailFunction, { to, template, data }) => {
  let subject, html;
  
  switch (template) {
    case 'welcome':
      subject = 'Welcome to VideoPost - Verify Your Email';
      html = emailTemplates.welcome(data.username, data.verificationUrl);
      break;
    case 'passwordReset':
      subject = 'Password Reset Request - VideoPost';
      html = emailTemplates.passwordReset(data.username, data.resetUrl);
      break;
    case 'passwordChanged':
      subject = 'Your Password Has Been Changed - VideoPost';
      html = emailTemplates.passwordChanged(data.username);
      break;
    case 'emailVerified':
      subject = 'Email Verified Successfully - VideoPost';
      html = emailTemplates.emailVerified(data.username);
      break;
    default:
      throw new Error('Invalid email template');
  }
  
  // Call the email function directly
  return await emailFunction({
    email: to,
    subject,
    html,
  });
};

module.exports = { 
  emailTemplates, 
  sendTemplatedEmail 
};