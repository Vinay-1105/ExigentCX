import { supabaseAdmin } from './utils/supabaseAdmin.js';

async function checkRow() {
  console.log("=== INSPECTING ROW ===");
  try {
    const { data, error } = await supabaseAdmin
      .from("expert_applications")
      .select("*")
      .eq("email", "suytripathi05@gmail.com")
      .single();
    
    if (error) {
      console.error("Error fetching row:", error);
    } else {
      console.log("Row details:", JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

checkRow();
