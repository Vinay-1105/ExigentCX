import { supabaseAdmin } from "../utils/supabaseAdmin.js";

async function run() {
  const { data, error } = await supabaseAdmin.from("company_applications").select("admin_email, company_name");
  if (error) {
    console.error("Error fetching company applications:", error);
  } else {
    console.log("Company emails registered:", data);
  }
}

run();
