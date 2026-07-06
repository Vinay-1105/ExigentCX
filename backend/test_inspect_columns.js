import { supabaseAdmin } from './utils/supabaseAdmin.js';

async function checkColumns() {
  console.log("=== INSPECTING COLUMNS ===");
  try {
    const { data, error } = await supabaseAdmin
      .from("expert_applications")
      .select("*")
      .limit(1);
    
    if (error) {
      console.error("Error:", error);
    } else if (data && data.length > 0) {
      console.log("Column Names:", Object.keys(data[0]));
    } else {
      console.log("No data returned from expert_applications.");
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

checkColumns();
