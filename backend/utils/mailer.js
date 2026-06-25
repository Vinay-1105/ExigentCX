import dotenv from "dotenv";
dotenv.config();

import { Resend } from "resend";

export const sendOtpMail = async (email, otp) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const otpDisplay = otp.toString().split('').map(digit => 
    '<span style="display: inline-block; width: 50px; height: 50px; line-height: 50px; text-align: center; background-color: #88A99E; color: #1A1A1A; border-radius: 50%; font-size: 24px; font-weight: bold; margin: 0 5px;">' + digit + '</span>'
  ).join('');

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "ExigentCX - OTP Verification",
    html: `
<div style="background-color: #F8F4EE; padding: 40px 20px; font-family: Arial, sans-serif; color: #1A1A1A;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #F8F4EE; border: 3px solid #2B2D42; padding: 40px;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="${process.env.FRONTEND_URL}/favicon.png" alt="ExigentCX" style="height: 120px; width: auto; display: inline-block;" />
    </div>
    
    <!-- Content -->
    <p style="font-size: 18px; margin-bottom: 10px; margin-top: 0;">Dear Applicant,</p>
    <p style="font-size: 18px; line-height: 1.5; margin-top: 0; margin-bottom: 30px;">
      Please use the One Time Verification code to validate your registered email ID and proceed to complete your application.
    </p>
    
    <!-- OTP Display -->
    <div style="text-align: center; margin-bottom: 30px;">
      ${otpDisplay}
    </div>
    
    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 30px; text-align: center;">
      Above OTP will remain active for 05:00 minutes only. Do not<br>share this OTP with anyone.
    </p>
    
    <p style="font-size: 16px; margin-bottom: 5px;">
      This is an auto-generated email. Do not reply to this email.
    </p>
    <p style="font-size: 16px; margin-top: 0; margin-bottom: 40px;">
      If you did not request this OTP, please connect with us immediately at <a href="mailto:support@exigentcx.com" style="color: #004AAD; font-weight: bold; text-decoration: underline;">ExigentCX</a>.
    </p>
    
    <!-- Footer -->
    <div style="margin-top: 40px;">
      <p style="font-size: 16px; margin: 0 0 5px 0;">Best regards,</p>
      <p style="font-size: 16px; margin: 0;">ExigentCX Team</p>
    </div>
  </div>
</div>
    `,
  });

  if (error) {
    throw error;
  }
  return data;
};

export const sendMagicLinkMail = async (email, magicLink) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "ExigentCX - Secure Sign In",
    html: `
<div style="background-color: #F8F4EE; padding: 40px 20px; font-family: Arial, sans-serif; color: #1A1A1A;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #F8F4EE; border: 3px solid #2B2D42; padding: 40px;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="${process.env.FRONTEND_URL}/favicon.png" alt="ExigentCX" style="height: 120px; width: auto; display: inline-block;" />
    </div>
    
    <!-- Content -->
    <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 10px; text-align: center; margin-top: 0;">Let's get you signed in</h2>
    <p style="font-size: 20px; margin-top: 0; margin-bottom: 30px; text-align: center;">
      Sign in with the secure link below :
    </p>
    
    <!-- Button -->
    <div style="text-align: center; margin-bottom: 40px;">
      <a href="${magicLink}" style="background-color: #88A99E; color: #1A1A1A; padding: 14px 40px; text-decoration: none; border-radius: 50px; font-size: 18px; display: inline-block;">Sign in to ExigentCX</a>
    </div>
    
    <p style="font-size: 16px; margin-bottom: 30px; text-align: center;">
      Above link will remain active for 10 hours only.
    </p>
    
    <p style="font-size: 16px; margin-bottom: 5px; text-align: center;">
      If you didn't request this email, you can safely ignore it.
    </p>
    <p style="font-size: 16px; margin-top: 0; margin-bottom: 40px; text-align: center;">
      If you're experiencing issues, please contact <a href="mailto:support@exigentcx.com" style="color: #004AAD; font-weight: bold; text-decoration: underline;">ExigentCX</a>.
    </p>
    
    <!-- Footer -->
    <div style="margin-top: 40px;">
      <p style="font-size: 16px; margin: 0 0 5px 0;">Best regards,</p>
      <p style="font-size: 16px; margin: 0;">ExigentCX Team</p>
    </div>
  </div>
</div>
    `,
  });

  if (error) {
    throw error;
  }
  return data;
};