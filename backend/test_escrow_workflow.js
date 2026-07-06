import { createNotification } from "./utils/createNotification.js";
import { supabaseAdmin } from "./utils/supabaseAdmin.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, "./data");

async function readJsonFile(filename) {
  const filePath = path.join(dataDir, filename);
  const content = await fs.readFile(filePath, "utf-8");
  return JSON.parse(content);
}

async function runTest() {
  console.log("=== RUNNING ESCROW INTEGRATION TEST ===");

  // 1. Mock Request Context
  const mockUser = { email: "demo@cxo.com" };

  // Helper imports
  const { getPaymentSummary, getTransactions, getEscrows, createEscrow, releaseEscrow } = await import("./controllers/paymentController.js");

  // Mock res object
  const mockRes = {
    status: (code) => {
      console.log(`[Response Status] ${code}`);
      return mockRes;
    },
    json: (data) => {
      console.log("[Response JSON]", JSON.stringify(data, null, 2));
      return mockRes;
    }
  };

  // Reset m-4 to locked state for test consistency
  console.log("\n--- Resetting m-4 to locked state for testing ---");
  const milestonesReset = await readJsonFile("milestones.json");
  const m4Reset = milestonesReset.find(m => m.id === "m-4");
  if (m4Reset) {
    m4Reset.status = "in_progress";
    m4Reset.paymentStatus = "locked";
    m4Reset.completed_date = null;
    await fs.writeFile(path.join(dataDir, "milestones.json"), JSON.stringify(milestonesReset, null, 2));
    console.log("m-4 successfully reset to 'locked'.");
  }

  // 2. Fetch Initial Summary
  console.log("\n--- Initial Payment Summary ---");
  await getPaymentSummary({ user: mockUser }, mockRes);

  // 3. Fund a milestone (Escrow Create)
  console.log("\n--- Funding Milestone (m-4: Investor Outreach & Roadshow) ---");
  await createEscrow({
    user: mockUser,
    body: {
      engagementId: "1",
      amount: 300000,
      paymentMethod: "UPI",
      milestoneId: "m-4"
    }
  }, mockRes);

  // 4. Fetch updated Summary
  console.log("\n--- Updated Payment Summary (Should show funded balance) ---");
  await getPaymentSummary({ user: mockUser }, mockRes);

  // 5. Test General Deposit when no locked milestones left
  // (We will temporarily change all remaining locked milestones to in_escrow, then trigger a top-up)
  console.log("\n--- Testing General Deposit (No locked milestones left) ---");
  await createEscrow({
    user: mockUser,
    body: {
      engagementId: "1",
      amount: 50000,
      paymentMethod: "Card"
    }
  }, mockRes);

  console.log("\n--- Payment Summary after General Deposit ---");
  await getPaymentSummary({ user: mockUser }, mockRes);

  // 6. Release the milestone (Escrow Release)
  console.log("\n--- Releasing Milestone (m-4) ---");
  await releaseEscrow({
    user: mockUser,
    body: {
      engagementId: "1",
      milestoneId: "m-4"
    }
  }, mockRes);

  // 7. Fetch final Summary
  console.log("\n--- Final Payment Summary (Should show spent balance and platform fee log) ---");
  await getPaymentSummary({ user: mockUser }, mockRes);

  // 8. Check if notifications were saved in DB
  console.log("\n--- Checking notifications in Database ---");
  const { data: notifs, error } = await supabaseAdmin
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error fetching notifications:", error.message);
  } else {
    console.log("Latest Notifications generated in Database:");
    notifs.forEach(n => {
      console.log(`- Title: "${n.title}", Description: "${n.description}", Type: "${n.type}"`);
    });
  }

  // Restore milestones database to original state for clean user interaction
  console.log("\n--- Cleaning up milestones database ---");
  const milestones = await readJsonFile("milestones.json");
  const m4 = milestones.find(m => m.id === "m-4");
  if (m4) {
    m4.status = "in_progress";
    m4.paymentStatus = "locked";
    m4.completed_date = null;
    await fs.writeFile(path.join(dataDir, "milestones.json"), JSON.stringify(milestones, null, 2));
    console.log("m-4 restored to 'locked' / 'in_progress'.");
  }
}

runTest().catch(console.error);
