import { supabaseAdmin } from "../utils/supabaseAdmin.js";

async function run() {
  const baseUrl = "http://localhost:5001";
  const headersExpert = {
    "Authorization": "Bearer real-expert-token",
    "Content-Type": "application/json"
  };

  const expertEmail = "suytripathi05@gmail.com";

  // Create a dummy contract for testing
  console.log("=== STEP 1: Inserting dummy contract ===");
  const dummyContract = {
    title: "Test Agreement",
    type: "Advisory Agreement",
    status: "Pending Signature",
    expert_email: expertEmail,
    expert_name: "Suyash Tripathi",
    expert_title: "CXO Advisor",
    company_email: "demo@cxo.com",
    company_name: "Acme Corp",
    company_logo: "AC",
    logo_color: "from-[#134e40] to-[#0eb59a]",
    value: "₹3,00,000",
    duration: "6 months",
    signed_by_expert: false,
    signed_by_company: false,
    signature_expert: null,
    signature_company: null,
    signed_date: null
  };

  const { data: inserted, error: insertErr } = await supabaseAdmin
    .from("contracts")
    .insert([dummyContract])
    .select()
    .single();

  if (insertErr || !inserted) {
    console.error("Failed to insert dummy contract:", insertErr);
    return;
  }
  const contractId = inserted.id;
  console.log(`Inserted contract ID: ${contractId}`);

  try {
    console.log("\n=== STEP 2: Calling Sign Contract API ===");
    const signRes = await fetch(`${baseUrl}/api/contracts/${contractId}/sign`, {
      method: "POST",
      headers: headersExpert,
      body: JSON.stringify({
        signatureText: "Suyash Tripathi"
      })
    });

    if (!signRes.ok) {
      console.error("Failed to sign contract:", signRes.status, await signRes.text());
      return;
    }

    const signResult = await signRes.json();
    console.log("Sign API response status details:");
    console.log(`- signed_by_expert: ${signResult.signed_by_expert}`);
    console.log(`- signature_expert: ${signResult.signature_expert}`);
    console.log(`- status: ${signResult.status}`);

    if (signResult.signed_by_expert && signResult.signature_expert === "Suyash Tripathi") {
      console.log("✅ Contract successfully signed via API!");
    } else {
      console.error("❌ Sign result did not match expectations.");
    }

  } catch (err) {
    console.error("Error during signing verification:", err);
  } finally {
    console.log("\n=== STEP 3: Cleaning up dummy contract ===");
    const { error: deleteErr } = await supabaseAdmin
      .from("contracts")
      .delete()
      .eq("id", contractId);
    
    if (deleteErr) {
      console.error("Failed to delete dummy contract:", deleteErr);
    } else {
      console.log("Cleaned up dummy contract.");
    }

    // Clean up notifications generated as side-effects
    const { data: sideNotifs } = await supabaseAdmin
      .from("notifications")
      .select("id")
      .or("title.eq.Contract Signed by Expert,title.eq.Contract Fully Executed");

    if (sideNotifs && sideNotifs.length > 0) {
      const ids = sideNotifs.map(n => n.id);
      await supabaseAdmin.from("notifications").delete().in("id", ids);
      console.log(`Cleaned up ${ids.length} side-effect notifications.`);
    }
  }
}

run();
