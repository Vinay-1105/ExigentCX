import { supabaseAdmin } from './utils/supabaseAdmin.js';

async function check() {
  console.log("=== CHECKING DB RECORDS ===");
  try {
    const { data: experts, error: expError } = await supabaseAdmin
      .from("expert_applications")
      .select("id, email, full_name, created_at");
    
    if (expError) {
      console.error("Error fetching experts:", expError);
    } else {
      console.log(`Found ${experts.length} expert applications:`);
      experts.forEach(e => console.log(` - ID: ${e.id}, Email: ${e.email}, Name: ${e.full_name}, CreatedAt: ${e.created_at}`));
    }

    const { data: companies, error: compError } = await supabaseAdmin
      .from("company_applications")
      .select("id, email, admin_email, company_name, created_at");
      
    if (compError) {
      console.error("Error fetching companies:", compError);
    } else {
      console.log(`Found ${companies.length} company applications:`);
      companies.forEach(c => console.log(` - ID: ${c.id}, Email: ${c.email}, AdminEmail: ${c.admin_email}, Name: ${c.company_name}, CreatedAt: ${c.created_at}`));
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

check();
