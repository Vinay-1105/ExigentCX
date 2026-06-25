import { supabaseAdmin } from "../utils/supabaseAdmin.js";

async function run() {
  const { data: experts, error: expError } = await supabaseAdmin
    .from("expert_applications")
    .select("id, full_name, email, user_id");

  if (expError) {
    console.error("Error querying experts:", expError);
  } else {
    console.log("Experts in DB:", JSON.stringify(experts, null, 2));
  }

  const { data: reqs, error: reqsError } = await supabaseAdmin
    .from("company_requirements")
    .select("id, role_title, company_email");

  if (reqsError) {
    console.error("Error querying requirements:", reqsError);
  } else {
    console.log("Requirements in DB:", JSON.stringify(reqs, null, 2));
  }
}

run();
