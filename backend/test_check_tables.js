import { supabaseAdmin } from "./utils/supabaseAdmin.js";

async function check() {
  const tables = ["engagements", "milestones", "escrow_transactions"];
  for (const table of tables) {
    console.log(`Checking table: ${table}...`);
    const { data, error } = await supabaseAdmin.from(table).select("*").limit(1);
    if (error) {
      console.log(`Table ${table} error:`, error.message, error.code);
    } else {
      console.log(`Table ${table} exists! Data sample:`, data);
    }
  }
}

check();
