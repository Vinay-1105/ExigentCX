import { supabaseAdmin } from "./utils/supabaseAdmin.js";

async function inspectTable(name) {
  const { data, error } = await supabaseAdmin.from(name).select("*").limit(1);
  if (error) {
    console.error(`Error inspecting ${name}:`, error.message);
  } else if (data && data.length > 0) {
    console.log(`Table '${name}' columns:`, Object.keys(data[0]));
    console.log(`Table '${name}' row sample:`, data[0]);
  } else {
    console.log(`Table '${name}' exists but has 0 rows.`);
  }
}

async function run() {
  const tables = ["company_applications", "company_requirements", "expert_applications", "notifications"];
  for (const t of tables) {
    await inspectTable(t);
  }
}

run();
