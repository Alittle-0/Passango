import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html, text }) => {
    // Debug logs here, after dotenv is loaded
    console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
    console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***' : undefined);

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email sending error:', error);
        throw error;
    }
}; 

//using for email 