import { supabaseAdmin } from "../utils/supabaseAdmin.js";

async function run() {
  const { data, error } = await supabaseAdmin.from("company_requirements").select("*").limit(1);
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Company requirements structure:", data);
  }
}

run();
