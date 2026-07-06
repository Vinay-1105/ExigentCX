import { supabaseAdmin } from "../utils/supabaseAdmin.js";

async function run() {
  console.log("=== ALL CONTRACTS ===");
  const { data: contracts, error } = await supabaseAdmin
    .from("contracts")
    .select("*");

  if (error) {
    console.error("Error fetching contracts:", error);
  } else {
    console.log(JSON.stringify(contracts, null, 2));
  }
}

run();
