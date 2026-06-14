import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendDir = "c:/Users/Suyash/CXO/backend";
const dataDir = path.resolve(backendDir, "data");

async function readJsonFile(filename) {
  const filePath = path.join(dataDir, filename);
  const content = await fs.readFile(filePath, "utf-8");
  return JSON.parse(content);
}

async function writeJsonFile(filename, data) {
  const filePath = path.join(dataDir, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

async function runVerification() {
  console.log("\n=== STARTING FULL END-TO-END ESCROW PAYOUT FLOW VERIFICATION ===\n");
  
  // 1. Reset database state for clean test run
  console.log("1. Resetting database state...");
  const milestones = await readJsonFile("milestones.json");
  const transactions = await readJsonFile("escrow_transactions.json");
  
  const m3 = milestones.find(m => m.id === "m-3");
  if (!m3) {
    console.error("Error: Milestone m-3 not found!");
    return;
  }
  
  // Put m-3 back in progress and funded in escrow
  m3.status = "in_progress";
  m3.paymentStatus = "in_escrow";
  m3.completed_date = null;
  m3.deliverables = [];
  
  // Remove any previous transaction/logs for m-3 release to keep numbers exact
  const cleanedTx = transactions.filter(t => 
    !(t.description.includes("Investor Deck & Data Room") && t.type === "milestone_release") &&
    !(t.description.includes("Investor Deck & Data Room") && t.type === "platform_fee")
  );
  
  await writeJsonFile("milestones.json", milestones);
  await writeJsonFile("escrow_transactions.json", cleanedTx);
  console.log("Database successfully prepared. Milestone m-3 reset to 'in_progress' & 'in_escrow'.");

  // 2. Fetch Initial Payment Summary
  console.log("\n2. Fetching initial payment summary...");
  const sumRes1 = await fetch("http://localhost:5000/api/payments/summary", {
    headers: { "Authorization": "Bearer demo-token" }
  });
  const sum1 = await sumRes1.json();
  console.log("Initial Summary:", JSON.stringify(sum1, null, 2));
  
  // 3. Expert Submits Deliverable for Milestone m-3
  console.log("\n3. Expert submitting deliverable for milestone m-3...");
  const submitRes = await fetch("http://localhost:5000/api/payments/milestone/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer demo-token"
    },
    body: JSON.stringify({
      engagementId: "1",
      milestoneId: "m-3",
      note: "Investor deck and data room files completed."
    })
  });
  
  if (!submitRes.ok) {
    console.error("Expert submission failed:", await submitRes.text());
    return;
  }
  
  const submitData = await submitRes.json();
  console.log("Submission response success:", submitData.success);
  
  // Check status in DB
  const dbMilestonesAfterSubmit = await readJsonFile("milestones.json");
  const m3AfterSubmit = dbMilestonesAfterSubmit.find(m => m.id === "m-3");
  console.log("Milestone status in database after submit:", m3AfterSubmit.status);
  if (m3AfterSubmit.status !== "pending_approval") {
    console.error("Assertion failed: status should be pending_approval");
    return;
  }

  // 4. Company Approves Milestone and Requests Release
  console.log("\n4. Company approving milestone and requesting release...");
  const approveRes = await fetch("http://localhost:5000/api/payments/escrow/request-release", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer demo-token"
    },
    body: JSON.stringify({
      engagementId: "1",
      milestoneId: "m-3"
    })
  });

  if (!approveRes.ok) {
    console.error("Company approval failed:", await approveRes.text());
    return;
  }

  const approveData = await approveRes.json();
  console.log("Approval response success:", approveData.success);

  // Check status in DB
  const dbMilestonesAfterApprove = await readJsonFile("milestones.json");
  const m3AfterApprove = dbMilestonesAfterApprove.find(m => m.id === "m-3");
  console.log("Milestone status in database after company approval:", m3AfterApprove.status);
  if (m3AfterApprove.status !== "pending_admin_release") {
    console.error("Assertion failed: status should be pending_admin_release");
    return;
  }

  // 5. Admin Authorizes Final Escrow Payout Release
  console.log("\n5. Admin authorizing final payout release...");
  const releaseRes = await fetch("http://localhost:5000/api/payments/escrow/release", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer demo-token"
    },
    body: JSON.stringify({
      engagementId: "1",
      milestoneId: "m-3"
    })
  });

  if (!releaseRes.ok) {
    console.error("Admin release failed:", await releaseRes.text());
    return;
  }

  const releaseData = await releaseRes.json();
  console.log("Release response success:", releaseData.success);

  // Check status in DB
  const dbMilestonesAfterRelease = await readJsonFile("milestones.json");
  const m3AfterRelease = dbMilestonesAfterRelease.find(m => m.id === "m-3");
  console.log("Milestone status in database after release:", m3AfterRelease.status);
  console.log("Milestone paymentStatus in database after release:", m3AfterRelease.paymentStatus);
  if (m3AfterRelease.status !== "completed" || m3AfterRelease.paymentStatus !== "released") {
    console.error("Assertion failed: status should be completed and paymentStatus should be released");
    return;
  }

  // 6. Fetch Final Payment Summary to verify earnings update
  console.log("\n6. Fetching final payment summary...");
  const sumRes2 = await fetch("http://localhost:5000/api/payments/summary", {
    headers: { "Authorization": "Bearer demo-token" }
  });
  const sum2 = await sumRes2.json();
  console.log("Final Summary:", JSON.stringify(sum2, null, 2));

  // Verification math
  const initialSpent = sum1.totalSpentNum;
  const finalSpent = sum2.totalSpentNum;
  const diffSpent = finalSpent - initialSpent;
  console.log(`Initial Total Spent/Earned: ${sum1.totalSpent}`);
  console.log(`Final Total Spent/Earned: ${sum2.totalSpent}`);
  console.log(`Difference: ₹${diffSpent.toLocaleString("en-IN")} (Expected: +₹2,50,000)`);

  if (diffSpent === 250000) {
    console.log("\n=== FULL END-TO-END ESCROW PAYOUT FLOW VERIFICATION PASSED SUCCESSFULLY ===");
  } else {
    console.error("\n=== FULL VERIFICATION FAILED: Earnings did not update correctly ===");
  }
}

runVerification();
