import { supabaseAdmin } from './utils/supabaseAdmin.js';

async function checkDbRequirements() {
  console.log("=== DB company_requirements ROWS ===");
  try {
    const { data, error } = await supabaseAdmin
      .from("company_requirements")
      .select("id, role_title, company_email, status");

    if (error) {
      console.error("Error fetching requirements:", error);
    } else {
      console.log(`Found ${data.length} rows in company_requirements:`);
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

checkDbRequirements();
