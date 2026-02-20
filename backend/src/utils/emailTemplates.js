// Email Templates for different purposes

const emailTemplates = {
  // Welcome email with verification
  welcomeEmail: (username, verificationUrl) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to VideoPost</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #f4f4f7;
          color: #51545e;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          font-size: 32px;
          margin: 0;
          font-weight: 600;
        }
        .content {
          padding: 40px 30px;
        }
        .content h2 {
          color: #333333;
          font-size: 24px;
          margin-bottom: 20px;
          font-weight: 500;
        }
        .content p {
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 20px;
          color: #666666;
        }
        .button {
          display: inline-block;
          padding: 14px 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          margin: 20px 0;
          box-shadow: 0 4px 6px rgba(102, 126, 234, 0.4);
        }
        .button:hover {
          opacity: 0.9;
        }
        .divider {
          height: 1px;
          background-color: #e9e9e9;
          margin: 30px 0;
        }
        .features {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin: 30px 0;
        }
        .feature {
          flex: 1 1 200px;
          text-align: center;
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 12px;
        }
        .feature-icon {
          font-size: 32px;
          margin-bottom: 10px;
        }
        .feature-title {
          font-weight: 600;
          color: #333333;
          margin-bottom: 5px;
        }
        .feature-description {
          font-size: 14px;
          color: #666666;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e9e9e9;
        }
        .footer p {
          font-size: 14px;
          color: #999999;
          margin: 5px 0;
        }
        .social-links {
          margin: 20px 0;
        }
        .social-links a {
          display: inline-block;
          margin: 0 10px;
          color: #667eea;
          text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
          .content {
            padding: 30px 20px;
          }
          .feature {
            flex: 1 1 100%;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎬 Welcome to VideoPost!</h1>
        </div>
        
        <div class="content">
          <h2>Hello ${username},</h2>
          
          <p>Welcome to the VideoPost community! We're thrilled to have you on board. VideoPost is your platform to share, discover, and connect through videos.</p>
          
          <p>Before you start sharing your amazing videos, please verify your email address to ensure the security of your account.</p>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">
              🔐 Verify Email Address
            </a>
          </div>
          
          <p style="font-size: 14px; color: #999999;">
            Or copy and paste this link in your browser:<br>
            <span style="color: #667eea;">${verificationUrl}</span>
          </p>
          
          <p style="font-size: 14px; color: #999999;">
            This verification link will expire in 24 hours.
          </p>
          
          <div class="divider"></div>
          
          <h3 style="margin-bottom: 20px;">✨ What you can do with VideoPost:</h3>
          
          <div class="features">
            <div class="feature">
              <div class="feature-icon">📹</div>
              <div class="feature-title">Upload Videos</div>
              <div class="feature-description">Share your stories with the world</div>
            </div>
            
            <div class="feature">
              <div class="feature-icon">🔒</div>
              <div class="feature-title">Privacy Control</div>
              <div class="feature-description">Public or private - you choose</div>
            </div>
            
            <div class="feature">
              <div class="feature-icon">❤️</div>
              <div class="feature-title">Engage</div>
              <div class="feature-description">Like and comment on videos</div>
            </div>
            
            <div class="feature">
              <div class="feature-icon">📊</div>
              <div class="feature-title">Analytics</div>
              <div class="feature-description">Track your video performance</div>
            </div>
          </div>
          
          <p style="margin-top: 30px;">
            If you didn't create an account with VideoPost, please ignore this email or 
            <a href="#" style="color: #667eea;">contact support</a>.
          </p>
        </div>
        
        <div class="footer">
          <div class="social-links">
            <a href="#">Twitter</a> • 
            <a href="#">Facebook</a> • 
            <a href="#">Instagram</a> • 
            <a href="#">YouTube</a>
          </div>
          
          <p>© ${new Date().getFullYear()} VideoPost. All rights reserved.</p>
          <p>123 Video Street, Digital City, DC 12345</p>
          <p>
            <a href="#" style="color: #999999;">Privacy Policy</a> • 
            <a href="#" style="color: #999999;">Terms of Service</a> • 
            <a href="#" style="color: #999999;">Unsubscribe</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Password reset email
  passwordResetEmail: (username, resetUrl) => `
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
          <h1>🔄 Password Reset Request</h1>
        </div>
        
        <div class="content">
          <h2>Hello ${username},</h2>
          
          <p>We received a request to reset your password for your VideoPost account. Don't worry, we've got you covered!</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" class="button">Reset My Password</a>
          </div>
          
          <div class="warning">
            ⚠️ This password reset link will expire in <strong>10 minutes</strong>.
          </div>
          
          <p>If you didn't request a password reset, please ignore this email or contact support immediately if you're concerned about your account's security.</p>
          
          <p>For your security, this request was made from:</p>
          <ul>
            <li>IP Address: [User IP]</li>
            <li>Browser: [User Browser]</li>
            <li>Time: ${new Date().toLocaleString()}</li>
          </ul>
          
          <p>If this wasn't you, please <a href="#" style="color: #f5576c;">secure your account</a> immediately.</p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} VideoPost. All rights reserved.</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Password changed confirmation
  passwordChangedEmail: (username) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f7; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 30px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; }
        .content { padding: 40px 30px; }
        .success-icon { font-size: 64px; text-align: center; margin-bottom: 20px; }
        .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: #ffffff; text-decoration: none; border-radius: 5px; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Password Changed Successfully</h1>
        </div>
        
        <div class="content">
          <div class="success-icon">🔒</div>
          
          <h2>Hello ${username},</h2>
          
          <p>Your VideoPost account password has been successfully changed.</p>
          
          <p>If you made this change, no further action is required. You can now log in with your new password.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="[LoginURL]" class="button">Log In to VideoPost</a>
          </div>
          
          <div class="warning" style="background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; border-radius: 5px;">
            ⚠️ If you DID NOT make this change, please contact support immediately!
          </div>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} VideoPost. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Email verification success
  emailVerifiedEmail: (username) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f7; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); padding: 30px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; }
        .content { padding: 40px 30px; }
        .success-icon { font-size: 64px; text-align: center; margin-bottom: 20px; }
        .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); color: #ffffff; text-decoration: none; border-radius: 5px; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 Email Verified Successfully!</h1>
        </div>
        
        <div class="content">
          <div class="success-icon">🎉</div>
          
          <h2>Congratulations ${username}!</h2>
          
          <p>Your email has been successfully verified. You can now enjoy all the features of VideoPost:</p>
          
          <ul style="margin: 20px 0;">
            <li>✅ Upload and share videos</li>
            <li>✅ Like and comment on videos</li>
            <li>✅ Create playlists</li>
            <li>✅ Connect with other creators</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="[DashboardURL]" class="button">Go to Your Dashboard</a>
          </div>
          
          <p>Start exploring and sharing your amazing content today!</p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} VideoPost. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Welcome back after long absence
  welcomeBackEmail: (username, stats) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f7; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); padding: 30px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; }
        .content { padding: 40px 30px; }
        .stats { display: flex; justify-content: space-around; margin: 30px 0; }
        .stat-box { text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px; flex: 1; margin: 0 5px; }
        .stat-number { font-size: 28px; font-weight: bold; color: #ff9a9e; }
        .stat-label { font-size: 14px; color: #666666; }
        .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); color: #ffffff; text-decoration: none; border-radius: 5px; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>👋 Welcome Back!</h1>
        </div>
        
        <div class="content">
          <h2>Hello ${username},</h2>
          
          <p>We missed you! It's been a while since you last visited VideoPost. Here's what's been happening with your content:</p>
          
          <div class="stats">
            <div class="stat-box">
              <div class="stat-number">${stats.views || 0}</div>
              <div class="stat-label">New Views</div>
            </div>
            <div class="stat-box">
              <div class="stat-number">${stats.likes || 0}</div>
              <div class="stat-label">New Likes</div>
            </div>
            <div class="stat-box">
              <div class="stat-number">${stats.comments || 0}</div>
              <div class="stat-label">New Comments</div>
            </div>
          </div>
          
          <p>Ready to share more amazing content with your audience?</p>
          
          <div style="text-align: center;">
            <a href="[UploadURL]" class="button">Upload New Video</a>
          </div>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} VideoPost. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Account deletion confirmation
  accountDeletedEmail: (username) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f7; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%); padding: 30px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; }
        .content { padding: 40px 30px; }
        .warning-icon { font-size: 64px; text-align: center; margin-bottom: 20px; }
        .feedback { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>👋 Account Deleted</h1>
        </div>
        
        <div class="content">
          <div class="warning-icon">💔</div>
          
          <h2>Goodbye ${username},</h2>
          
          <p>We're sorry to see you go. Your VideoPost account has been successfully deleted as requested.</p>
          
          <div class="feedback">
            <h3>We'd love your feedback:</h3>
            <p>Help us improve by telling us why you left:</p>
            <a href="#" style="display: block; margin: 10px 0; color: #ee9ca7;">Take a quick survey →</a>
          </div>
          
          <p>If this was a mistake, you have 30 days to restore your account:</p>
          <a href="[RestoreURL]" style="color: #ee9ca7;">Restore my account</a>
          
          <p style="margin-top: 30px;">Thank you for being part of our community. We hope to see you again someday!</p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} VideoPost. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
};

// Helper function to send templated emails
const sendTemplatedEmail = async (sendEmail, { to, template, data }) => {
  let subject, html;
  
  switch (template) {
    case 'welcome':
      subject = 'Welcome to VideoPost - Verify Your Email';
      html = emailTemplates.welcomeEmail(data.username, data.verificationUrl);
      break;
      
    case 'passwordReset':
      subject = 'Password Reset Request - VideoPost';
      html = emailTemplates.passwordResetEmail(data.username, data.resetUrl);
      break;
      
    case 'passwordChanged':
      subject = 'Your Password Has Been Changed - VideoPost';
      html = emailTemplates.passwordChangedEmail(data.username);
      break;
      
    case 'emailVerified':
      subject = 'Email Verified Successfully - VideoPost';
      html = emailTemplates.emailVerifiedEmail(data.username);
      break;
      
    case 'welcomeBack':
      subject = 'Welcome Back to VideoPost!';
      html = emailTemplates.welcomeBackEmail(data.username, data.stats);
      break;
      
    case 'accountDeleted':
      subject = 'Account Deleted - VideoPost';
      html = emailTemplates.accountDeletedEmail(data.username);
      break;
      
    default:
      throw new Error('Invalid email template');
  }
  
  return await sendEmail({
    email: to,
    subject,
    html,
  });
};

module.exports = {
  emailTemplates,
  sendTemplatedEmail,
};