import { supabaseAdmin } from './utils/supabaseAdmin.js';

async function test() {
  console.log("=== TESTING VECTOR DB ===");
  try {
    const { data: testData, error } = await supabaseAdmin
      .from("expert_applications")
      .select("id, embedding")
      .limit(1);

    if (error) {
      console.error("DB Vector Column Access Failed:", error);
    } else {
      console.log("Successfully selected embedding column from expert_applications.");
      console.log("Result length:", testData.length);
      if (testData.length > 0) {
        console.log("Embedding value exists?", testData[0].embedding !== null);
      }
    }
  } catch (err) {
    console.error("Error during DB test:", err);
  }
}

test();
