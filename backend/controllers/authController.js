import { generateOtp } from "../utils/generateOtp.js";
import { sendOtpMail, sendMagicLinkMail } from "../utils/mailer.js";
import { supabaseAdmin } from "../utils/supabaseAdmin.js";
import jwt from "jsonwebtoken";

// 🔥 In-memory OTP store (temporary)
const otpStore = new Map();

const OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes

// ================= SEND OTP =================
export const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const otp = generateOtp();

  // Save OTP in memory
  otpStore.set(email, {
    otp,
    expiresAt: Date.now() + OTP_EXPIRY,
  });

  try {
    await sendOtpMail(email, otp);
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

// ================= CHECK COMPANY EMAIL =================
export const checkCompanyEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("company_applications")
      .select("admin_email")
      .eq("admin_email", email)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.json({ email: data.admin_email });
  } catch (err) {
    console.error("Check company email error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ================= VERIFY OTP =================
export const verifyOtp = async (req, res) => {
  const { email, otp, role } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP required" });
  }

  const record = otpStore.get(email);

  if (!record || Date.now() > record.expiresAt) {
    return res.status(400).json({ error: "OTP expired or not found" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  // ✅ Delete OTP after success
  otpStore.delete(email);

  try {
    // 🔹 Check if user exists
    let { data: user } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    // 🔹 Create user if not exists
    if (!user) {
      const { data: newUser } = await supabaseAdmin
        .from("users")
        .insert([{ email, role, is_verified: true }])
        .select()
        .single();

      user = newUser;
    }

    // 🔑 Generate JWT
    const token = jwt.sign(
      { email: user.email, userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "OTP verified",
      token,
      user,
    });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ error: "Verification failed" });
  }
};

// ================= SEND MAGIC LINK =================
export const sendMagicLink = async (req, res) => {
  const { email, redirectTo } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Generate Magic Link using Supabase Admin
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: email,
      options: {
        redirectTo: redirectTo || "http://localhost:5173/expert-dashboard"
      }
    });

    if (error) {
      console.error("Supabase generateLink error:", error);
      throw error;
    }

    const magicLink = data?.properties?.action_link;

    if (!magicLink) {
      throw new Error("Failed to extract magic link from Supabase response");
    }

    // Send the custom email using Resend
    await sendMagicLinkMail(email, magicLink);

    res.json({ message: "Magic link sent successfully" });
  } catch (err) {
    console.error("Magic link error:", err);
    res.status(500).json({ error: "Failed to send magic link" });
  }
};