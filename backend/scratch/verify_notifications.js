import { createNotification } from "../utils/createNotification.js";
import { supabaseAdmin } from "../utils/supabaseAdmin.js";

async function verify() {
  const baseUrl = "http://localhost:5000";

  console.log("=== STEP 1: Verify getNotifications with Company Token ===");
  try {
    const resCompany = await fetch(`${baseUrl}/api/notifications?role=company`, {
      headers: { "Authorization": "Bearer company-token" }
    });
    if (!resCompany.ok) {
      console.error("Failed to fetch company notifications:", resCompany.status, await resCompany.text());
      return;
    }
    const notifsCompany = await resCompany.json();
    console.log(`Fetched ${notifsCompany.length} company notifications.`);

    console.log("\n=== STEP 2: Verify getNotifications with Expert Token ===");
    const resExpert = await fetch(`${baseUrl}/api/notifications?role=expert`, {
      headers: { "Authorization": "Bearer expert-token" }
    });
    if (!resExpert.ok) {
      console.error("Failed to fetch expert notifications:", resExpert.status, await resExpert.text());
      return;
    }
    const notifsExpert = await resExpert.json();
    console.log(`Fetched ${notifsExpert.length} expert notifications.`);

    console.log("\n=== STEP 3: Create a Mock Notification for Expert ===");
    const notif1 = await createNotification(
      "00000000-0000-0000-0000-000000000002", // expert mock ID
      "Test Expert Notif",
      "This should be visible on expert dashboard only.",
      "match",
      { targetRole: "expert" }
    );
    console.log("Created notification:", notif1.id);

    console.log("\n=== STEP 4: Create a Mock Notification for Company ===");
    const notif2 = await createNotification(
      "00000000-0000-0000-0000-000000000001", // company mock ID
      "Test Company Notif",
      "This should be visible on company dashboard only.",
      "payment",
      { targetRole: "company" }
    );
    console.log("Created notification:", notif2.id);

    console.log("\n=== STEP 5: Re-fetch and check isolation ===");
    const resCompAfter = await fetch(`${baseUrl}/api/notifications?role=company`, {
      headers: { "Authorization": "Bearer company-token" }
    });
    const resExpAfter = await fetch(`${baseUrl}/api/notifications?role=expert`, {
      headers: { "Authorization": "Bearer expert-token" }
    });

    const notifsCompAfter = await resCompAfter.json();
    const notifsExpAfter = await resExpAfter.json();

    const hasExpertNotifInCompany = notifsCompAfter.some(n => n.id === notif1.id);
    const hasCompanyNotifInCompany = notifsCompAfter.some(n => n.id === notif2.id);
    const hasExpertNotifInExpert = notifsExpAfter.some(n => n.id === notif1.id);
    const hasCompanyNotifInExpert = notifsExpAfter.some(n => n.id === notif2.id);

    console.log("Is Expert Notification in Company list?", hasExpertNotifInCompany ? "❌ YES" : "✅ NO");
    console.log("Is Company Notification in Company list?", hasCompanyNotifInCompany ? "✅ YES" : "❌ NO");
    console.log("Is Expert Notification in Expert list?", hasExpertNotifInExpert ? "✅ YES" : "❌ NO");
    console.log("Is Company Notification in Expert list?", hasCompanyNotifInExpert ? "❌ YES" : "✅ NO");

    if (!hasExpertNotifInCompany && hasCompanyNotifInCompany && hasExpertNotifInExpert && !hasCompanyNotifInExpert) {
      console.log("\n🎉 SUCCESS! Role separation verified successfully for mock accounts!");
    } else {
      console.error("\n❌ FAILED! Notification isolation check failed.");
    }
  } catch (err) {
    console.error("Verification error:", err);
  }
}

verify();
