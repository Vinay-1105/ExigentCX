import { createNotification } from "../utils/createNotification.js";
import { supabaseAdmin } from "../utils/supabaseAdmin.js";

async function run() {
  const baseUrl = "http://localhost:5001";
  const headersExpert = {
    "Authorization": "Bearer real-expert-token",
    "Content-Type": "application/json"
  };

  const expertUserId = "f3dce899-be25-4713-91fe-bad6f103e591"; // Suyash Tripathi
  const requirementId = "cc3d7c00-66d9-4bd4-809f-ee7d4482fedc"; // CFO, CMO, COO

  console.log("=== STEP 1: Creating a test invitation notification in DB ===");
  // Create an invitation notification in the real database notifications table
  const invitationNotif = await createNotification(
    expertUserId,
    "New Opportunity Invitation",
    "Test: Acme Corp has invited you to apply for their role.",
    "match",
    {
      requirementId: requirementId,
      companyName: "Acme Corp",
      note: "Hi, let's connect!",
      targetRole: "expert"
    }
  );

  if (!invitationNotif) {
    console.error("Failed to create test invitation notification in DB.");
    return;
  }
  console.log(`Created invitation notification: ${invitationNotif.id}`);

  try {
    console.log("\n=== STEP 2: Calling accept API endpoint (DB path) as Expert ===");
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
      console.log("✅ Invitation accepted and draft contract created via DB!");
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

      console.log("\n=== STEP 4: Clean up test contract ===");
      await supabaseAdmin.from("contracts").delete().eq("id", contractId);
      console.log("Deleted test contract.");
    } else {
      console.error("❌ Invitation accept response did not indicate success.");
    }
  } catch (err) {
    console.error("Error during accept/decline testing:", err);
  } finally {
    // Clean up DB notification
    console.log("Cleaning up test notification from DB...");
    const { error: deleteNotifErr } = await supabaseAdmin
      .from("notifications")
      .delete()
      .eq("id", invitationNotif.id);
    
    if (deleteNotifErr) {
      console.error("Failed to delete test notification from DB:", deleteNotifErr);
    } else {
      console.log("Cleaned up test notification.");
    }

    // Clean up notifications generated as side-effects
    const { data: contractNotifications } = await supabaseAdmin
      .from("notifications")
      .select("id")
      .eq("title", "Invitation Accepted")
      .eq("type", "contract");

    if (contractNotifications && contractNotifications.length > 0) {
      const ids = contractNotifications.map(n => n.id);
      await supabaseAdmin.from("notifications").delete().in("id", ids);
      console.log(`Cleaned up ${ids.length} side-effect notifications.`);
    }
  }
}

run();
