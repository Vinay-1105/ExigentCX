import { supabaseAdmin } from "../utils/supabaseAdmin.js";

async function run() {
  const requirementId = "cc3d7c00-66d9-4bd4-809f-ee7d4482fedc"; // CFO, CMO, COO Requirement ID
  const expertEmail = "suytripathi05@gmail.com";

  console.log("=== STARTING RESET ===");

  // 1. Find and delete contracts
  console.log("Looking for contracts related to expert email...");
  const { data: contracts, error: fetchContractErr } = await supabaseAdmin
    .from("contracts")
    .select("id, title")
    .eq("expert_email", expertEmail);

  if (fetchContractErr) {
    console.error("Error fetching contracts:", fetchContractErr);
  } else if (contracts && contracts.length > 0) {
    const contractIds = contracts.map(c => c.id);
    console.log(`Found ${contracts.length} contracts to delete:`, contracts.map(c => c.title));
    
    const { error: deleteContractsErr } = await supabaseAdmin
      .from("contracts")
      .delete()
      .in("id", contractIds);

    if (deleteContractsErr) {
      console.error("Error deleting contracts:", deleteContractsErr);
    } else {
      console.log("Successfully deleted contracts.");
    }
  } else {
    console.log("No contracts found to delete.");
  }

  // 2. Find and delete invitations (notifications of type 'match')
  console.log("Looking for invitations (type: 'match') related to the registered expert...");
  const { data: notifications, error: fetchNotifErr } = await supabaseAdmin
    .from("notifications")
    .select("id, user_id")
    .eq("type", "match")
    .eq("user_id", "f3dce899-be25-4713-91fe-bad6f103e591");

  if (fetchNotifErr) {
    console.error("Error fetching notifications:", fetchNotifErr);
  } else if (notifications && notifications.length > 0) {
    const notifIds = notifications.map(n => n.id);
    console.log(`Found ${notifications.length} invitations to delete.`);

    const { error: deleteNotifsErr } = await supabaseAdmin
      .from("notifications")
      .delete()
      .in("id", notifIds);

    if (deleteNotifsErr) {
      console.error("Error deleting notifications:", deleteNotifsErr);
    } else {
      console.log("Successfully deleted invitations.");
    }
  } else {
    console.log("No invitations found for the registered expert.");
  }

  // 3. Delete general contract/signing notifications
  console.log("Cleaning up other contract signing notifications...");
  const { data: signNotifs } = await supabaseAdmin
    .from("notifications")
    .select("id")
    .or("title.eq.Contract Signed by Expert,title.eq.Contract Signed by Client,title.eq.Contract Fully Executed");

  if (signNotifs && signNotifs.length > 0) {
    const ids = signNotifs.map(n => n.id);
    const { error: deleteSignNotifsErr } = await supabaseAdmin
      .from("notifications")
      .delete()
      .in("id", ids);

    if (deleteSignNotifsErr) {
      console.error("Error deleting sign notifications:", deleteSignNotifsErr);
    } else {
      console.log(`Successfully deleted ${ids.length} contract notifications.`);
    }
  } else {
    console.log("No contract notifications found.");
  }

  console.log("=== RESET COMPLETED ===");
}

run();
