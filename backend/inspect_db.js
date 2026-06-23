import { supabaseAdmin } from "./utils/supabaseAdmin.js";

async function run() {
  const { data, error } = await supabaseAdmin.rpc("get_tables");
  if (error) {
    // If RPC doesn't exist, execute a direct SQL query or inspect via standard tables
    console.log("RPC get_tables failed. Trying direct query...");
    const { data: queryData, error: queryError } = await supabaseAdmin
      .from("notifications")
      .select("*")
      .limit(1);
    
    if (queryError) {
      console.error("Error reading notifications table:", queryError);
    } else {
      console.log("Successfully read notifications table, it exists.");
    }
  } else {
    console.log("Tables list:", data);
  }

  // Check what tables actually exist by trying to query the standard ones and a potential 'invitations' table
  const testTables = ["company_applications", "company_requirements", "expert_applications", "notifications", "contracts", "invitations"];
  for (const t of testTables) {
    const { error: err } = await supabaseAdmin.from(t).select("*").limit(0);
    if (err) {
      console.log(`Table '${t}' DOES NOT exist or error: ${err.message}`);
    } else {
      console.log(`Table '${t}' EXISTS!`);
    }
  }
}

run();
