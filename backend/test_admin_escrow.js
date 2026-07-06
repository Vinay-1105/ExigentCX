import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "data");

const milestonesPath = path.join(dataDir, "milestones.json");
const transactionsPath = path.join(dataDir, "escrow_transactions.json");
const invoicesPath = path.join(dataDir, "invoices.json");

const baseUrl = "http://localhost:5000";
const token = "demo-token";
const headers = {
  "Authorization": `Bearer ${token}`,
  "Content-Type": "application/json"
};

async function testAdminEscrow() {
  console.log("=== STARTING ADMIN 3RD PARTY ESCROW TEST ===");

  // Backups
  let milestonesBackup, transactionsBackup, invoicesBackup;

  try {
    // Read and backup original files
    milestonesBackup = JSON.parse(await fs.readFile(milestonesPath, "utf-8"));
    transactionsBackup = JSON.parse(await fs.readFile(transactionsPath, "utf-8"));
    invoicesBackup = JSON.parse(await fs.readFile(invoicesPath, "utf-8"));

    // Step 0: Set up milestone m-3 for testing: status = pending_approval, paymentStatus = in_escrow
    console.log("0. Adjusting m-3 state in milestones.json for test...");
    const testMilestones = JSON.parse(JSON.stringify(milestonesBackup));
    const m3 = testMilestones.find(m => m.id === "m-3");
    if (!m3) {
      throw new Error("Milestone m-3 not found in milestones.json");
    }
    m3.status = "pending_approval";
    m3.paymentStatus = "in_escrow";
    m3.completed_date = null;
    await fs.writeFile(milestonesPath, JSON.stringify(testMilestones, null, 2), "utf-8");
    console.log("   m-3 set to status: 'pending_approval', paymentStatus: 'in_escrow'");

    // Step 1: Request release for milestone m-3
    console.log("\n1. Requesting release for milestone m-3 from company...");
    let reqRes = await fetch(`${baseUrl}/api/payments/escrow/request-release`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        engagementId: "1",
        milestoneId: "m-3"
      })
    });
    if (reqRes.ok) {
      const data = await reqRes.json();
      console.log("Success! Milestone status set to:", data.milestone.status);
    } else {
      console.error("Failed to request release:", await reqRes.text());
      return;
    }

    // Step 2: Fetch escrows and verify pendingMilestoneStatus is pending_admin_release
    console.log("\n2. Fetching active escrows to verify status from admin perspective...");
    let escrowsRes = await fetch(`${baseUrl}/api/payments/escrows`, { headers });
    if (escrowsRes.ok) {
      const escrows = await escrowsRes.json();
      const eng1 = escrows.find(e => e.id === "1");
      console.log(`Engagement #ENG-1 info:`);
      console.log(`  - Title: ${eng1.engagement}`);
      console.log(`  - Pending Milestone: ${eng1.pendingMilestone}`);
      console.log(`  - Pending Milestone Status: ${eng1.pendingMilestoneStatus}`);
      console.log(`  - Pending Milestone Amount: ${eng1.pendingMilestoneAmount}`);
    } else {
      console.error("Failed to fetch escrows:", await escrowsRes.text());
      return;
    }

    // Step 3: Admin authorizes release
    console.log("\n3. Admin authorizing release of milestone m-3...");
    let releaseRes = await fetch(`${baseUrl}/api/payments/escrow/release`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        engagementId: "1",
        milestoneId: "m-3"
      })
    });
    if (releaseRes.ok) {
      const data = await releaseRes.json();
      console.log("Success! Payout transaction recorded, status:", data.milestone.status);
    } else {
      console.error("Failed to authorize release:", await releaseRes.text());
      return;
    }

    // Step 4: Verify escrow balance has been updated
    console.log("\n4. Verifying updated balance after release...");
    escrowsRes = await fetch(`${baseUrl}/api/payments/escrows`, { headers });
    if (escrowsRes.ok) {
      const escrows = await escrowsRes.json();
      const eng1 = escrows.find(e => e.id === "1");
      console.log(`Engagement #ENG-1 updated info:`);
      console.log(`  - New Escrow Balance: ${eng1.balance}`);
      console.log(`  - Total Released: ${eng1.released}`);
    }

  } catch (error) {
    console.error("Test execution failed:", error);
  } finally {
    // Step 5: Clean up milestones (Restore backup data to be database clean)
    console.log("\n5. Cleaning up database (Restoring original data files)...");
    if (milestonesBackup) {
      await fs.writeFile(milestonesPath, JSON.stringify(milestonesBackup, null, 2), "utf-8");
    }
    if (transactionsBackup) {
      await fs.writeFile(transactionsPath, JSON.stringify(transactionsBackup, null, 2), "utf-8");
    }
    if (invoicesBackup) {
      await fs.writeFile(invoicesPath, JSON.stringify(invoicesBackup, null, 2), "utf-8");
    }
    console.log("Database successfully cleaned up/restored.");
  }
}

testAdminEscrow();

