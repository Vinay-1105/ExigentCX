import fs from "fs/promises";

const logPath = "C:/Users/Suyash/.gemini/antigravity-ide/brain/7bf0e90d-80af-4c5e-a41f-24c394169ce0/.system_generated/logs/transcript_full.jsonl";

async function run() {
  try {
    const content = await fs.readFile(logPath, "utf-8");
    const lines = content.split("\n");
    for (const line of lines) {
      if (!line.trim()) continue;
      const step = JSON.parse(line);
      
      // Check if it's a browser console logs step
      if (step.tool_calls) {
        for (const tc of step.tool_calls) {
          if (tc.name === "capture_browser_console_logs" || tc.name === "browser_subagent") {
            console.log(`\n=== STEP ${step.step_index}: ${tc.name} ===`);
            console.log("Arguments:", JSON.stringify(tc.args, null, 2));
            console.log("Status:", step.status);
          }
        }
      }
      
      if (step.type === "PLANNER_RESPONSE" || step.type === "SUBAGENT_REPORT" || step.source === "SYSTEM") {
        if (step.content && (step.content.includes("console") || step.content.includes("Console") || step.content.includes("log") || step.content.includes("Log"))) {
          if (step.content.includes("Level:") || step.content.includes("Text:") || step.content.includes("Source:")) {
            console.log(`\n=== STEP ${step.step_index} Content ===`);
            console.log(step.content);
          }
        }
      }
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
