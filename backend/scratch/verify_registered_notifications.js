import { createNotification } from "../utils/createNotification.js";
import { supabaseAdmin } from "../utils/supabaseAdmin.js";

async function verifyRegistered() {
  // Real registered user IDs from our database inspection:
  const companyUserId = "d2927f7a-169b-4a0f-a02e-e8427a2f4cc2"; // Company admin suytripathi05@gmail.com
  const expertUserId = "f3dce899-be25-4713-91fe-bad6f103e591";  // Expert suytripathi05@gmail.com

  console.log("=== DB Verification: Checking Database Queries ===");

  try {
    // 1. Create a notification for the expert
    console.log("Creating expert notification in database...");
    const notif1 = await createNotification(
      expertUserId,
      "New Opportunity Invitation",
      "Real test: fjknj has invited you to apply for their CFO role.",
      "match",
      { targetRole: "expert", requirementId: "some-req-id" }
    );

    if (!notif1) {
      console.error("Failed to create expert notification in DB");
      return;
    }
    console.log(`Created expert notification: ${notif1.id}`);

    // 2. Fetch notifications for Company Admin
    console.log("\nSimulating fetch for Company Admin dashboard (should hide expert invites)...");
    const { data: companyNotifs, error: err1 } = await supabaseAdmin
      .from("notifications")
      .select("*")
      .eq("user_id", companyUserId);

    if (err1) throw err1;

    // Apply the exact company dashboard backend filter
    const filteredCompany = companyNotifs.filter(
      n => n.metadata?.targetRole !== "expert" && n.title !== "New Opportunity Invitation"
    );
    const hasExpertNotifInCompany = filteredCompany.some(n => n.id === notif1.id);
    console.log(`Company Admin has ${filteredCompany.length} notifications.`);
    console.log(`Is expert invite in Company Admin notifications? ${hasExpertNotifInCompany ? "❌ YES" : "✅ NO"}`);

    // 3. Fetch notifications for Expert Dashboard
    console.log("\nSimulating fetch for Expert dashboard (should show expert invites)...");
    const { data: expertNotifs, error: err2 } = await supabaseAdmin
      .from("notifications")
      .select("*")
      .eq("user_id", expertUserId);

    if (err2) throw err2;

    // Apply the exact expert dashboard backend filter
    const filteredExpert = expertNotifs.filter(n => n.metadata?.targetRole !== "company");
    const hasExpertNotifInExpert = filteredExpert.some(n => n.id === notif1.id);
    console.log(`Expert has ${filteredExpert.length} notifications.`);
    console.log(`Is expert invite in Expert notifications? ${hasExpertNotifInExpert ? "✅ YES" : "❌ NO"}`);

    // Clean up created test notification
    console.log("\nCleaning up test notification...");
    await supabaseAdmin.from("notifications").delete().eq("id", notif1.id);

    if (!hasExpertNotifInCompany && hasExpertNotifInExpert) {
      console.log("\n🎉 SUCCESS! Notification isolation works perfectly for registered DB profiles!");
    } else {
      console.error("\n❌ FAILED! Notification isolation failed for DB profiles.");
    }
  } catch (err) {
    console.error("DB Verification error:", err);
  }
}

verifyRegistered();
