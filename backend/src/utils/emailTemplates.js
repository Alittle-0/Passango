const baseStyles = `
    body {
        font-family: 'Arial', sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
    }
    .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
        text-align: center;
        padding: 20px 0;
        border-bottom: 2px solid #4CAF50;
    }
    .logo {
        max-width: 150px;
        height: auto;
    }
    .content {
        padding: 20px 0;
    }
    .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #4CAF50;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        margin: 20px 0;
        font-weight: bold;
    }
    .footer {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #eee;
        font-size: 12px;
        color: #666;
        text-align: center;
    }
    .warning {
        color: #ff0000;
        font-weight: bold;
        background-color: #fff3f3;
        padding: 10px;
        border-radius: 4px;
        margin: 10px 0;
    }
    .info-box {
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 4px;
        margin: 10px 0;
    }
    .device-info {
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 4px;
        margin: 10px 0;
    }
    .device-info ul {
        margin: 0;
        padding-left: 20px;
    }
    .device-info li {
        margin-bottom: 5px;
    }
`;

export const passwordResetTemplate = (resetUrl, userName) => `
    <!DOCTYPE html>
    <html>
    <head>
        <style>${baseStyles}</style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="D:/finalpassango3.0/passango/public/images/LOGO.png" alt="PassanGo Logo" class="logo">
                <h1>Password Reset Request</h1>
            </div>
            <div class="content">
                <p>Hello ${userName},</p>
                <p>We received a request to reset your password for your PassanGo account.</p>
                <p>Click the button below to reset your password:</p>
                <div style="text-align: center;">
                    <a href="${resetUrl}" class="button">Reset Password</a>
                </div>
                <div class="info-box">
                    <p><strong>Important:</strong> This link will expire in 1 hour.</p>
                    <p>If you didn't request this password reset, please ignore this email or contact our support team immediately.</p>
                </div>
            </div>
            <div class="footer">
                <p>This is an automated message, please do not reply to this email.</p>
                <p>© ${new Date().getFullYear()} PassanGo. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
`;

export const passwordChangedTemplate = (userName, deviceInfo) => `
    <!DOCTYPE html>
    <html>
    <head>
        <style>${baseStyles}</style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://passango.com/logo.png" alt="PassanGo Logo" class="logo">
                <h1>Password Changed Successfully</h1>
            </div>
            <div class="content">
                <p>Hello ${userName},</p>
                <p>Your PassanGo account password has been successfully changed.</p>
                <div class="device-info">
                    <p><strong>Change Details:</strong></p>
                    <ul>
                        <li>Time: ${deviceInfo.time}</li>
                        <li>Device: ${deviceInfo.browser} on ${deviceInfo.os}</li>
                        <li>Location: ${deviceInfo.location}</li>
                    </ul>
                </div>
                <div class="warning">
                    <p>If you did not make this change, please contact our support team immediately.</p>
                </div>
            </div>
            <div class="footer">
                <p>This is an automated message, please do not reply to this email.</p>
                <p>© ${new Date().getFullYear()} PassanGo. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
`;

export const suspiciousActivityTemplate = (userName, deviceInfo) => `
    <!DOCTYPE html>
    <html>
    <head>
        <style>${baseStyles}</style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://passango.com/logo.png" alt="PassanGo Logo" class="logo">
                <h1>Suspicious Activity Detected</h1>
            </div>
            <div class="content">
                <p>Hello ${userName},</p>
                <div class="warning">
                    <p>We detected unusual activity on your PassanGo account.</p>
                </div>
                <div class="device-info">
                    <p><strong>Activity Details:</strong></p>
                    <ul>
                        <li>Browser: ${deviceInfo.browser}</li>
                        <li>Operating System: ${deviceInfo.os}</li>
                        <li>Location: ${deviceInfo.location}</li>
                        <li>Time: ${deviceInfo.time}</li>
                    </ul>
                </div>
                <p>If this was you, you can ignore this email.</p>
                <p>If you did not perform this action, please secure your account immediately by:</p>
                <ol>
                    <li>Changing your password</li>
                    <li>Enabling two-factor authentication</li>
                    <li>Reviewing your recent activity</li>
                </ol>
            </div>
            <div class="footer">
                <p>This is an automated message, please do not reply to this email.</p>
                <p>© ${new Date().getFullYear()} PassanGo. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
`;

export const welcomeTemplate = (userName) => `
    <!DOCTYPE html>
    <html>
    <head>
        <style>${baseStyles}</style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://passango.com/logo.png" alt="PassanGo Logo" class="logo">
                <h1>Welcome to PassanGo!</h1>
            </div>
            <div class="content">
                <p>Hello ${userName},</p>
                <p>Thank you for joining PassanGo, your musical creativity platform!</p>
                <p>We're excited to have you on board. Here's what you can do next:</p>
                <ul>
                    <li>Complete your profile</li>
                    <li>Explore our music sheet library</li>
                    <li>Start creating your own compositions</li>
                    <li>Connect with other musicians</li>
                </ul>
                <div style="text-align: center;">
                    <a href="https://passango.com/getting-started" class="button">Get Started</a>
                </div>
            </div>
            <div class="footer">
                <p>This is an automated message, please do not reply to this email.</p>
                <p>© ${new Date().getFullYear()} PassanGo. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
`;

export const accountDeletionTemplate = (userName) => `
    <!DOCTYPE html>
    <html>
    <head>
        <style>${baseStyles}</style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://passango.com/logo.png" alt="PassanGo Logo" class="logo">
                <h1>Account Deletion Confirmation</h1>
            </div>
            <div class="content">
                <p>Hello ${userName},</p>
                <p>We're sorry to see you go. Your PassanGo account has been successfully deleted.</p>
                <div class="info-box">
                    <p><strong>Important:</strong> All your data has been permanently removed from our systems.</p>
                    <p>If you didn't request this deletion, please contact our support team immediately.</p>
                </div>
                <p>If you change your mind, you can create a new account at any time.</p>
            </div>
            <div class="footer">
                <p>This is an automated message, please do not reply to this email.</p>
                <p>© ${new Date().getFullYear()} PassanGo. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
`;

export const verificationCodeTemplate = (userName, code) => `
    <!DOCTYPE html>
    <html>
    <head>
        <style>${baseStyles}</style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://passango.com/logo.png" alt="PassanGo Logo" class="logo">
                <h1>Password Reset Verification</h1>
            </div>
            <div class="content">
                <p>Hello ${userName},</p>
                <p>We received a request to reset your password for your PassanGo account.</p>
                <div class="info-box">
                    <p><strong>Your verification code is:</strong></p>
                    <div style="text-align: center; font-size: 32px; letter-spacing: 5px; margin: 20px 0; font-weight: bold; color: #4CAF50;">
                        ${code}
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                </div>
                <p>If you didn't request this password reset, please ignore this email or contact our support team immediately.</p>
            </div>
            <div class="footer">
                <p>This is an automated message, please do not reply to this email.</p>
                <p>© ${new Date().getFullYear()} PassanGo. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
`; 