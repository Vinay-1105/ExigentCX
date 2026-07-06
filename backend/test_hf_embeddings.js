import dotenv from "dotenv";
dotenv.config();
import { generateEmbedding } from "./utils/matchmaker.js";

async function test() {
  console.log("=== TESTING HUGGING FACE EMBEDDING ===");
  try {
    const text = "Testing Hugging Face BAAI/bge-large-en-v1.5 embedding generator.";
    console.log(`Generating embedding for text: "${text}"...`);
    const embedding = await generateEmbedding(text);
    if (embedding && Array.isArray(embedding)) {
      console.log(`Successfully generated embedding! Dimension length: ${embedding.length}`);
      if (embedding.length === 1024) {
        console.log("Success: Dimensions are exactly 1024!");
      } else {
        console.log("Warning: Dimension length is not 1024.");
      }
    } else {
      console.error("Failed to generate embedding (null returned). Check Hugging Face API Key.");
    }
  } catch (err) {
    console.error("Error during Hugging Face test:", err);
  }
}

test();
