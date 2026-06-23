import { supabaseAdmin } from "../utils/supabaseAdmin.js";

async function run() {
  const { data, error } = await supabaseAdmin
    .from("company_applications")
    .select("company_name, admin_email, status");

  if (error) {
    console.error("Error querying database:", error);
  } else {
    console.log("All company applications in database:", JSON.stringify(data, null, 2));
  }
}

run();
