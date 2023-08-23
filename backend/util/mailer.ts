import nodemailer from "nodemailer";
import aws from "aws-sdk";

const SES_CONFIG = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_SES_REGION || "us-east-1",
};

aws.config.update(SES_CONFIG);

const AWS_SES = new aws.SES({
  apiVersion: "2010-12-01",
});

const transporter = nodemailer.createTransport({
  SES: AWS_SES,
});

export const createVerificationEmail = (verificationLink: string) => `
  <h1>Welcome to My Application</h1>
  <p>Thank you for signing up! Please verify your email by clicking the link below:</p>
  <a href="${verificationLink}" target="_blank">Verify Email</a>
  <p>If you did not request this, please ignore this email.</p>
`;

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    await transporter.sendMail({
      from: "orchtin9@gmail.com",
      to: to,
      subject: subject,
      html: text,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
