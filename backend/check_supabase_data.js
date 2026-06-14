import { supabaseAdmin } from "./utils/supabaseAdmin.js";

async function checkData() {
  try {
    const { data: companies, error: compError } = await supabaseAdmin
      .from("company_applications")
      .select("id, company_name, admin_email, user_id, status");
    
    if (compError) throw compError;
    
    const { data: experts, error: expError } = await supabaseAdmin
      .from("expert_applications")
      .select("id, full_name, email, user_id, status");
      
    if (expError) throw expError;
    
    console.log("\n=== REGISTERED COMPANIES ===");
    console.log(JSON.stringify(companies, null, 2));
    
    console.log("\n=== REGISTERED EXPERTS ===");
    console.log(JSON.stringify(experts, null, 2));
    
  } catch (err) {
    console.error("Error fetching Supabase data:", err);
  }
}

checkData();
