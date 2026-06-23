import { supabaseAdmin } from "../utils/supabaseAdmin.js";

async function run() {
  const { data, error } = await supabaseAdmin.from("notifications").select("*").limit(5);
  if (error) {
    console.error("Error reading notifications:", error);
  } else {
    console.log("Notification rows:", data);
  }
}

run();
