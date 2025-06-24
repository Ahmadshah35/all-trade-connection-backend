const nodemailer = require("nodemailer");
async function sendMail(userData) {

  try {
    const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_MAIL,
      to: userData.email,
      subject: "Your OTP for Account Verification - All-Trade-Connection",
      text: `Your One-Time  (OTP) is ${userData.Otp}. Please use this code to verify your account. .`,
      html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Welcome to All-Trade-Connection!</h2>
                <p>Your One-Time (OTP) is:</p>
                <h1 style="color: #2e86de;">${userData.Otp}</h1>
                <p>Please enter this code in the app to verify your account.</p>
                <p><strong>Note:</strong>  Do not share it with anyone.</p>
                <br/>
                <p>Thank you,<br/>The All-Trade-Connection Team </p>
              </div>
            `,
    });
    return info;
  } catch (error) {
    console.log("error", error);
    return error;
  }
}

module.exports = {
  sendMail,
};
