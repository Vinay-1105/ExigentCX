import { supabaseAdmin } from "../utils/supabaseAdmin.js";

async function run() {
  const { data, error } = await supabaseAdmin
    .from("company_applications")
    .select("*")
    .eq("admin_email", "suytripathi05@gmail.com");

  if (error) {
    console.error("Error querying database:", error);
  } else {
    console.log("Database results for suytripathi05@gmail.com:", JSON.stringify(data, null, 2));
  }
}

run();
