import { supabaseAdmin } from "../utils/supabaseAdmin.js";

async function run() {
  const { data, error } = await supabaseAdmin
    .from("expert_applications")
    .select("id, full_name, email, user_id")
    .eq("full_name", "Suyash Tripathi")
    .maybeSingle();

  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Expert info:", data);
  }
}

run();
