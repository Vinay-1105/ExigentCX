import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, "data");

async function readJsonFile(filename) {
  const filePath = path.join(dataDir, filename);
  const content = await fs.readFile(filePath, "utf-8");
  return JSON.parse(content);
}

async function writeJsonFile(filename, data) {
  const filePath = path.join(dataDir, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

async function setup() {
  try {
    const engagements = await readJsonFile("engagements.json");
    const milestones = await readJsonFile("milestones.json");

    // Check if engagement for registered email already exists
    const hasEngagement = engagements.some(e => e.company_email === "suytripathi05@gmail.com");
    if (hasEngagement) {
      console.log("Engagement for 'suytripathi05@gmail.com' already exists.");
      return;
    }

    // Add new engagement
    const newEngagement = {
      id: "3",
      requirement_id: "req-3",
      company_email: "suytripathi05@gmail.com",
      company_name: "fjknj",
      expert_id: "f3dce899-be25-4713-91fe-bad6f103e591",
      expert_name: "Suyash Tripathi",
      expert_avatar: "https://i.pravatar.cc/150?u=suyash",
      title: "Registered Escrow Payout Engagement",
      status: "Active",
      total_budget: 1000000,
      created_at: new Date().toISOString()
    };
    engagements.push(newEngagement);

    // Add new milestones
    const newMilestones = [
      {
        id: "m-3-1",
        engagement_id: "3",
        title: "Deliverable Discovery",
        desc: "Discovery session and roadmap planning",
        amount: 400000,
        status: "completed",
        paymentStatus: "released",
        due_date: "Jun 10, 2026",
        completed_date: "Jun 10, 2026",
        deliverables: []
      },
      {
        id: "m-3-2",
        engagement_id: "3",
        title: "Milestone Deliverable Submission",
        desc: "Complete research phase and document submission",
        amount: 300000,
        status: "in_progress",
        paymentStatus: "in_escrow",
        due_date: "Jun 20, 2026",
        completed_date: null,
        deliverables: []
      },
      {
        id: "m-3-3",
        engagement_id: "3",
        title: "Final Phase Support",
        desc: "Final phase wrap-up and handoff",
        amount: 300000,
        status: "upcoming",
        paymentStatus: "locked",
        due_date: "Jul 31, 2026",
        completed_date: null,
        deliverables: []
      }
    ];
    milestones.push(...newMilestones);

    await writeJsonFile("engagements.json", engagements);
    await writeJsonFile("milestones.json", milestones);

    console.log("Registered engagement and milestones successfully added!");
  } catch (err) {
    console.error("Setup failed:", err);
  }
}

setup();
