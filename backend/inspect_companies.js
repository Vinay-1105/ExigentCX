import { supabaseAdmin } from './utils/supabaseAdmin.js';

async function checkDbCompanies() {
  console.log("=== DB company_applications ROWS ===");
  try {
    const { data: companies, error: err1 } = await supabaseAdmin
      .from("company_applications")
      .select("id, company_name, admin_email, status");

    if (err1) {
      console.error("Error fetching companies:", err1);
    } else {
      console.log(`Found ${companies.length} rows in company_applications:`);
      console.log(JSON.stringify(companies, null, 2));
    }

    const { data: { users }, error: err2 } = await supabaseAdmin.auth.admin.listUsers();
    if (err2) {
      console.error("Error listing auth users:", err2);
    } else {
      console.log("Auth users count:", users.length);
      console.log("Emails of Auth users:", users.map(u => u.email));
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

checkDbCompanies();
