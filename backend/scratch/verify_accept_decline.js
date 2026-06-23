import { createNotification } from "../utils/createNotification.js";
import { supabaseAdmin } from "../utils/supabaseAdmin.js";

async function run() {
  const baseUrl = "http://localhost:5000";
  const headersCompany = {
    "Authorization": "Bearer company-token",
    "Content-Type": "application/json"
  };
  const headersExpert = {
    "Authorization": "Bearer expert-token",
    "Content-Type": "application/json"
  };

  console.log("=== STEP 1: Creating a test invitation notification ===");
  // Create an invitation notification in backend mock database
  const invitationNotif = await createNotification(
    "00000000-0000-0000-0000-000000000002", // expert mock ID
    "New Opportunity Invitation",
    "Acme Corp has invited you to apply for their 'Interim CFO' role.",
    "match",
    {
      requirementId: "f2ea7fec-23e9-459b-a25a-386baa478a81", // interim cfo requirement
      companyName: "Acme Corp",
      note: "Hi, let's connect!",
      targetRole: "expert"
    }
  );

  if (!invitationNotif) {
    console.error("Failed to create test invitation notification.");
    return;
  }
  console.log(`Created invitation notification: ${invitationNotif.id}`);

  try {
    console.log("\n=== STEP 2: Calling accept API endpoint as Expert ===");
    const acceptRes = await fetch(`${baseUrl}/api/expert/invitations/${invitationNotif.id}/accept`, {
      method: "POST",
      headers: headersExpert
    });

    if (!acceptRes.ok) {
      console.error("Failed to accept invitation:", acceptRes.status, await acceptRes.text());
      return;
    }

    const acceptResult = await acceptRes.json();
    console.log("Accept API response:", acceptResult);

    if (acceptResult.success && acceptResult.contract) {
      console.log("✅ Invitation accepted and draft contract created!");
      const contractId = acceptResult.contract.id;
      console.log(`Contract ID: ${contractId}`);

      console.log("\n=== STEP 3: Verify the contract exists in DB ===");
      const { data: contract, error: contractErr } = await supabaseAdmin
        .from("contracts")
        .select("*")
        .eq("id", contractId)
        .maybeSingle();

      if (contractErr || !contract) {
        console.error("❌ Contract not found in DB or error:", contractErr);
      } else {
        console.log("✅ Contract found in DB details:");
        console.log(`- Title: ${contract.title}`);
        console.log(`- Company: ${contract.company_name} (${contract.company_email})`);
        console.log(`- Expert: ${contract.expert_name} (${contract.expert_email})`);
        console.log(`- Status: ${contract.status}`);
      }

      console.log("\n=== STEP 4: Clean up test contract and notifications ===");
      await supabaseAdmin.from("contracts").delete().eq("id", contractId);
      console.log("Deleted test contract.");
    } else {
      console.error("❌ Invitation accept response did not indicate success.");
    }
  } catch (err) {
    console.error("Error during accept/decline testing:", err);
  } finally {
    // Clean up local mock notification
    console.log("Cleaning up mock notifications...");
    const jsonPath = "../backend/data/notifications.json";
    try {
      const fs = await import("fs/promises");
      const list = JSON.parse(await fs.readFile(new URL("../data/notifications.json", import.meta.url), "utf-8"));
      const filteredList = list.filter(n => n.id !== invitationNotif.id && n.title !== "Invitation Accepted");
      await fs.writeFile(new URL("../data/notifications.json", import.meta.url), JSON.stringify(filteredList, null, 2), "utf-8");
      console.log("Cleaned up mock notifications from JSON.");
    } catch (cleanErr) {
      console.error("Failed to clean mock JSON notifications:", cleanErr);
    }
  }
}

run();
