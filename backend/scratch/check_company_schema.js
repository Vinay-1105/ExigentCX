import { supabaseAdmin } from "../utils/supabaseAdmin.js";

async function run() {
  const { data, error } = await supabaseAdmin.from("company_applications").select("*").limit(1);
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Company application structure:", data);
  }
}

run();
