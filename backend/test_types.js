import { supabaseAdmin } from './utils/supabaseAdmin.js';

async function checkIds() {
  console.log("=== CHECKING TABLE IDs ===");
  try {
    const { data: expert, error: err1 } = await supabaseAdmin
      .from("expert_applications")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (err1) {
      console.error("Expert ID error:", err1);
    } else {
      console.log("Expert ID Sample:", expert, "Type of ID:", typeof expert?.id);
    }

    const { data: req, error: err2 } = await supabaseAdmin
      .from("company_requirements")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (err2) {
      console.error("Requirement ID error:", err2);
    } else {
      console.log("Requirement ID Sample:", req, "Type of ID:", typeof req?.id);
    }
  } catch (err) {
    console.error("Unexpected diagnostic error:", err);
  }
}

checkIds();
