import fs from "fs";
import readline from "readline";

async function run() {
  const fileStream = fs.createReadStream("C:/Users/Suyash/.gemini/antigravity-ide/brain/7bf0e90d-80af-4c5e-a41f-24c394169ce0/.system_generated/logs/transcript.jsonl");
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    try {
      const obj = JSON.parse(line);
      if (obj.step_index >= 1340 && obj.step_index <= 1401) {
        console.log(`\n=== STEP ${obj.step_index} (${obj.type}) ===`);
        if (obj.type === "USER_INPUT") {
          console.log(`User: ${obj.content}`);
        } else if (obj.type === "PLANNER_RESPONSE") {
          console.log(`Assistant Response:\n${obj.content}`);
          if (obj.tool_calls) {
            console.log("Tool Calls:", JSON.stringify(obj.tool_calls, null, 2));
          }
        } else if (obj.type === "SYSTEM_MESSAGE" || obj.type === "SYSTEM") {
          console.log(`System: ${obj.content}`);
        } else {
          console.log(`Type: ${obj.type}, Content: ${obj.content ? obj.content.substring(0, 300) : ''}`);
        }
      }
    } catch (e) {
      // ignore
    }
  }
}

run();
