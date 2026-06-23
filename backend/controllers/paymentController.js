import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { createNotification } from "../utils/createNotification.js";
import { supabaseAdmin } from "../utils/supabaseAdmin.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, "../data");

// Helper to safely read JSON files
async function readJsonFile(filename) {
  const filePath = path.join(dataDir, filename);
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return [];
  }
}

// Helper to safely write JSON files
async function writeJsonFile(filename, data) {
  const filePath = path.join(dataDir, filename);
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
  }
}

// Helper to format currency
function formatCurrency(num) {
  return "₹" + num.toLocaleString("en-IN");
}

// Helper to get current Date/Time strings
function getCurrentDateTime() {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });
  return { date: dateStr, time: timeStr };
}

// Helper to look up user from Supabase applications tables by email
async function getProfileByEmail(email) {
  const { data: company } = await supabaseAdmin
    .from("company_applications")
    .select("id, company_name, user_id")
    .eq("admin_email", email)
    .maybeSingle();

  const { data: expert } = await supabaseAdmin
    .from("expert_applications")
    .select("id, full_name, user_id")
    .eq("email", email)
    .maybeSingle();

  return { company, expert };
}

// Helper to resolve valid UUIDs for expert and company to avoid DB type mismatches in notifications
async function resolveUserIdsForNotification(engagement, reqUser) {
  let expertUserId = null;
  let companyUserId = null;

  // 1. Resolve Company User ID
  if (engagement.company_email) {
    const { data: companyProfile } = await supabaseAdmin
      .from("company_applications")
      .select("user_id")
      .eq("admin_email", engagement.company_email)
      .maybeSingle();
    companyUserId = companyProfile?.user_id;
  }
  if (!companyUserId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(companyUserId)) {
    companyUserId = reqUser?.id; // fallback
  }
  if (!companyUserId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(companyUserId)) {
    companyUserId = "00000000-0000-0000-0000-000000000000";
  }

  // 2. Resolve Expert User ID
  if (engagement.expert_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(engagement.expert_id)) {
    expertUserId = engagement.expert_id;
  } else {
    const { data: experts } = await supabaseAdmin
      .from("expert_applications")
      .select("user_id")
      .limit(1);
    expertUserId = experts?.[0]?.user_id;
  }
  if (!expertUserId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(expertUserId)) {
    expertUserId = reqUser?.id; // fallback
  }
  if (!expertUserId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(expertUserId)) {
    expertUserId = "00000000-0000-0000-0000-000000000000";
  }

  return { expertUserId, companyUserId };
}

// ================= GET PAYMENT SUMMARY =================
export const getPaymentSummary = async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email) {
      return res.status(400).json({ error: "Email not found in token" });
    }

    const { company, expert } = await getProfileByEmail(email);
    const engagements = await readJsonFile("engagements.json");
    const milestones = await readJsonFile("milestones.json");
    const transactions = await readJsonFile("escrow_transactions.json");

    // Filter engagements based on role
    let filteredEngagements = [];
    if (email === "demo@cxo.com" || company) {
      filteredEngagements = engagements.filter(
        e => e.company_email.toLowerCase() === email.toLowerCase()
      );
    } else if (expert) {
      filteredEngagements = engagements.filter(
        e => e.expert_name.toLowerCase() === expert.full_name.toLowerCase()
      );
    } else {
      // Fallback: show all for debugging/development
      filteredEngagements = engagements;
    }

    const engagementIds = filteredEngagements.map(e => e.id);
    const filteredMilestones = milestones.filter(m => engagementIds.includes(m.engagement_id));
    const filteredTransactions = transactions.filter(t => 
      t.engagement_id && engagementIds.includes(t.engagement_id) && t.status === "Completed"
    );

    let totalBalanceNum = 0;
    let totalSpentNum = 0;
    let pendingReleaseNum = 0;
    let totalEngagementValueNum = 0;

    filteredTransactions.forEach(t => {
      if (t.type === "escrow_add") {
        totalBalanceNum += t.amountNum;
      } else if (t.type === "milestone_release") {
        totalBalanceNum += t.amountNum; // amountNum is negative for releases
        totalSpentNum += Math.abs(t.amountNum);
      }
    });

    filteredMilestones.forEach(m => {
      totalEngagementValueNum += m.amount;
      if (m.paymentStatus === "in_escrow" && m.status === "pending_approval") {
        pendingReleaseNum += m.amount;
      }
    });

    res.json({
      totalBalance: formatCurrency(totalBalanceNum),
      totalBalanceNum,
      totalSpent: formatCurrency(totalSpentNum),
      totalSpentNum,
      pendingRelease: formatCurrency(pendingReleaseNum),
      pendingReleaseNum,
      totalEngagementValue: formatCurrency(totalEngagementValueNum),
      totalEngagementValueNum
    });
  } catch (err) {
    console.error("getPaymentSummary error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ================= GET TRANSACTIONS =================
export const getTransactions = async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email) {
      return res.status(400).json({ error: "Email not found in token" });
    }

    const { company, expert } = await getProfileByEmail(email);
    const transactions = await readJsonFile("escrow_transactions.json");
    const engagements = await readJsonFile("engagements.json");

    // Filter engagements to get relevant transaction IDs
    let filteredEngagements = [];
    if (email === "demo@cxo.com" || company) {
      filteredEngagements = engagements.filter(
        e => e.company_email.toLowerCase() === email.toLowerCase()
      );
    } else if (expert) {
      filteredEngagements = engagements.filter(
        e => e.expert_name.toLowerCase() === expert.full_name.toLowerCase()
      );
    } else {
      filteredEngagements = engagements;
    }

    const engagementIds = new Set(filteredEngagements.map(e => e.id));
    
    // Filter transactions linked to user's engagements
    const filteredTransactions = transactions.filter(tx => 
      tx.engagement_id && engagementIds.has(tx.engagement_id)
    );

    res.json(filteredTransactions);
  } catch (err) {
    console.error("getTransactions error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ================= GET INVOICES =================
export const getInvoices = async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email) {
      return res.status(400).json({ error: "Email not found in token" });
    }

    const { company, expert } = await getProfileByEmail(email);
    const invoices = await readJsonFile("invoices.json");
    const engagements = await readJsonFile("engagements.json");

    let filteredEngagements = [];
    if (email === "demo@cxo.com" || company) {
      filteredEngagements = engagements.filter(
        e => e.company_email.toLowerCase() === email.toLowerCase()
      );
    } else if (expert) {
      filteredEngagements = engagements.filter(
        e => e.expert_name.toLowerCase() === expert.full_name.toLowerCase()
      );
    } else {
      filteredEngagements = engagements;
    }

    const engagementIds = new Set(filteredEngagements.map(e => e.id));
    const filteredInvoices = invoices.filter(inv => 
      inv.engagement_id === "—" || (inv.engagement_id && engagementIds.has(inv.engagement_id))
    );

    res.json(filteredInvoices);
  } catch (err) {
    console.error("getInvoices error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ================= GET ESCROWS (ENGAGEMENT WALLETS) =================
export const getEscrows = async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email) {
      return res.status(400).json({ error: "Email not found in token" });
    }

    const { company, expert } = await getProfileByEmail(email);
    const engagements = await readJsonFile("engagements.json");
    const milestones = await readJsonFile("milestones.json");
    const transactions = await readJsonFile("escrow_transactions.json");

    let filteredEngagements = [];
    if (email === "demo@cxo.com" || company) {
      filteredEngagements = engagements.filter(
        e => e.company_email.toLowerCase() === email.toLowerCase()
      );
    } else if (expert) {
      filteredEngagements = engagements.filter(
        e => e.expert_name.toLowerCase() === expert.full_name.toLowerCase()
      );
    } else {
      filteredEngagements = engagements;
    }

    const escrowAccounts = [];

    for (const eng of filteredEngagements) {
      const engMilestones = milestones.filter(m => m.engagement_id === eng.id);
      const engTransactions = transactions.filter(t => t.engagement_id === eng.id && t.status === "Completed");
      
      let balanceNum = 0;
      let releasedNum = 0;
      let pendingMilestone = "None";
      let pendingMilestoneId = null;

      engTransactions.forEach(t => {
        if (t.type === "escrow_add") {
          balanceNum += t.amountNum;
        } else if (t.type === "milestone_release") {
          balanceNum += t.amountNum; // negative
          releasedNum += Math.abs(t.amountNum);
        }
      });

      let pendingMilestoneAmountVal = 0;
      let pendingMilestoneStatusVal = "None";
      engMilestones.forEach(m => {
        if (m.paymentStatus === "in_escrow") {
          if (pendingMilestone === "None" || m.status === "pending_approval" || m.status === "pending_admin_release") {
            pendingMilestone = m.title;
            pendingMilestoneId = m.id;
            pendingMilestoneAmountVal = m.amount;
            pendingMilestoneStatusVal = m.status;
          }
        }
      });

      const completedCount = engMilestones.filter(m => m.status === "completed").length;
      const progress = engMilestones.length > 0
        ? Math.round((completedCount / engMilestones.length) * 100)
        : 0;

      escrowAccounts.push({
        id: eng.id,
        engagement: eng.title,
        expert: eng.expert_name,
        expertAvatar: eng.expert_avatar,
        company: eng.company_name || "Acme Corp.",
        companyLogo: eng.company_name ? eng.company_name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() : "AC",
        logoColor: eng.company_name === "TechScale Ventures" ? "from-emerald-700 to-teal-500" : "from-[#134e40] to-[#0eb59a]",
        monthlyRate: eng.monthly_rate || "₹3L/mo",
        balance: formatCurrency(balanceNum),
        balanceNum,
        status: eng.status,
        progress,
        pendingMilestone,
        pendingMilestoneId,
        pendingMilestoneAmount: formatCurrency(pendingMilestoneAmountVal),
        pendingMilestoneAmountNum: pendingMilestoneAmountVal,
        pendingMilestoneStatus: pendingMilestoneStatusVal,
        totalValue: formatCurrency(eng.total_budget),
        released: formatCurrency(releasedNum),
        milestones: engMilestones.map(m => ({
          id: m.id,
          title: m.title,
          desc: m.desc || "",
          dueDate: m.due_date,
          completedDate: m.completed_date,
          status: m.status,
          payment: formatCurrency(m.amount),
          paymentStatus: m.paymentStatus,
          deliverables: m.deliverables || []
        }))
      });
    }

    res.json(escrowAccounts);
  } catch (err) {
    console.error("getEscrows error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ================= CREATE ESCROW / DEPOSIT FUNDS =================
export const createEscrow = async (req, res) => {
  try {
    const email = req.user?.email;
    const { engagementId, amount, paymentMethod, milestoneId } = req.body;

    if (!engagementId || !amount) {
      return res.status(400).json({ error: "Engagement ID and amount are required" });
    }

    const engagements = await readJsonFile("engagements.json");
    const engagement = engagements.find(e => e.id === engagementId);
    if (!engagement) {
      return res.status(404).json({ error: "Engagement not found" });
    }

    // Load milestones and transactions
    const milestones = await readJsonFile("milestones.json");
    const transactions = await readJsonFile("escrow_transactions.json");
    const invoices = await readJsonFile("invoices.json");

    let targetMilestone = null;
    if (milestoneId) {
      targetMilestone = milestones.find(m => m.id === milestoneId && m.engagement_id === engagementId);
      if (targetMilestone && targetMilestone.paymentStatus !== "locked") {
        return res.status(400).json({ error: `Milestone "${targetMilestone.title}" is already funded or released` });
      }
    } else {
      // Find the first milestone that is locked
      targetMilestone = milestones.find(m => m.engagement_id === engagementId && m.paymentStatus === "locked");
    }

    // Update milestone status if targetMilestone exists
    if (targetMilestone) {
      targetMilestone.paymentStatus = "in_escrow";
      if (targetMilestone.status === "upcoming") {
        targetMilestone.status = "in_progress";
      }
    }

    // Record transaction
    const txId = "TXN-" + Math.floor(100 + Math.random() * 900) + "-2026";
    const { date, time } = getCurrentDateTime();
    const amountVal = parseFloat(amount) || (targetMilestone ? targetMilestone.amount : 0);

    if (amountVal <= 0) {
      return res.status(400).json({ error: "Amount must be greater than zero" });
    }

    const description = targetMilestone 
      ? `Funds Added to Escrow — ${targetMilestone.title}` 
      : `General Deposit to Escrow Wallet`;

    const newTx = {
      id: txId,
      type: "escrow_add",
      description,
      engagement: engagement.title,
      engagement_id: engagementId,
      expert: engagement.expert_name,
      expertAvatar: engagement.expert_avatar,
      amount: "+" + formatCurrency(amountVal),
      amountNum: amountVal,
      date,
      time,
      status: "Completed",
      method: paymentMethod || "Net Banking",
      txRef: txId,
      created_at: new Date().toISOString()
    };

    transactions.unshift(newTx);

    // Record invoice change
    const newInvoice = {
      id: "INV-" + Math.floor(2000 + Math.random() * 8000),
      title: targetMilestone ? `${targetMilestone.title} - Funded` : "Escrow Wallet Deposit",
      engagement: engagement.title,
      engagement_id: engagementId,
      expert: engagement.expert_name,
      expertAvatar: engagement.expert_avatar,
      amount: formatCurrency(amountVal),
      amountNum: amountVal,
      date,
      dueDate: date,
      status: targetMilestone ? "Pending" : "Paid",
      type: targetMilestone ? "Milestone Invoice" : "Wallet Deposit Invoice"
    };
    invoices.unshift(newInvoice);

    // Save changes
    await writeJsonFile("milestones.json", milestones);
    await writeJsonFile("escrow_transactions.json", transactions);
    await writeJsonFile("invoices.json", invoices);

    // ── NOTIFICATIONS LOGIC ──
    const { expertUserId, companyUserId } = await resolveUserIdsForNotification(engagement, req.user);

    if (expertUserId) {
      const msg = targetMilestone
        ? `Funds of ${formatCurrency(amountVal)} have been added to escrow for milestone: "${targetMilestone.title}". You can proceed with work.`
        : `General deposit of ${formatCurrency(amountVal)} has been added to the escrow wallet for your engagement "${engagement.title}".`;
      await createNotification(
        expertUserId,
        "Escrow Funded",
        msg,
        "payment",
        targetMilestone
          ? { engagementId, milestoneId: targetMilestone.id, targetRole: "expert" }
          : { engagementId, targetRole: "expert" }
      );
    }

    if (companyUserId) {
      const msg = targetMilestone
        ? `Successfully deposited ${formatCurrency(amountVal)} in escrow for milestone "${targetMilestone.title}".`
        : `Successfully deposited general funds of ${formatCurrency(amountVal)} to the escrow wallet for engagement "${engagement.title}".`;
      await createNotification(
        companyUserId,
        "Funds Deposited to Escrow",
        msg,
        "payment",
        targetMilestone
          ? { engagementId, milestoneId: targetMilestone.id, targetRole: "company" }
          : { engagementId, targetRole: "company" }
      );
    }

    res.json({ success: true, milestone: targetMilestone, transaction: newTx });
  } catch (err) {
    console.error("createEscrow error:", err);
    res.status(500).json({ error: "Failed to fund escrow account" });
  }
};

// ================= REQUEST ESCROW RELEASE =================
export const requestReleaseEscrow = async (req, res) => {
  try {
    const { engagementId, milestoneId } = req.body;

    if (!engagementId || !milestoneId) {
      return res.status(400).json({ error: "Engagement ID and Milestone ID are required" });
    }

    const milestones = await readJsonFile("milestones.json");
    const milestone = milestones.find(m => m.id === milestoneId && m.engagement_id === engagementId);

    if (!milestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    if (milestone.paymentStatus !== "in_escrow") {
      return res.status(400).json({ error: "Milestone is not funded or already released" });
    }

    // Set milestone status to pending_admin_release
    milestone.status = "pending_admin_release";

    await writeJsonFile("milestones.json", milestones);

    res.json({ success: true, milestone });
  } catch (err) {
    console.error("requestReleaseEscrow error:", err);
    res.status(500).json({ error: "Failed to request milestone release" });
  }
};

// ================= RELEASE ESCROW TO EXPERT =================
export const releaseEscrow = async (req, res) => {
  try {
    const email = req.user?.email;
    const { engagementId, milestoneId } = req.body;

    if (!engagementId || !milestoneId) {
      return res.status(400).json({ error: "Engagement ID and Milestone ID are required" });
    }

    const engagements = await readJsonFile("engagements.json");
    const engagement = engagements.find(e => e.id === engagementId);
    if (!engagement) {
      return res.status(404).json({ error: "Engagement not found" });
    }

    const milestones = await readJsonFile("milestones.json");
    const milestone = milestones.find(m => m.id === milestoneId && m.engagement_id === engagementId);

    if (!milestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    if (milestone.paymentStatus !== "in_escrow") {
      return res.status(400).json({ error: "Milestone is not funded or already released" });
    }

    // Release funds
    milestone.paymentStatus = "released";
    milestone.status = "completed";
    const { date, time } = getCurrentDateTime();
    milestone.completed_date = date;

    // Save transactions & invoices
    const transactions = await readJsonFile("escrow_transactions.json");
    const invoices = await readJsonFile("invoices.json");

    // Add release transaction
    const txId = "TXN-" + Math.floor(100 + Math.random() * 900) + "-2026";
    const releaseTx = {
      id: txId,
      type: "milestone_release",
      description: `Milestone Payment — ${milestone.title}`,
      engagement: engagement.title,
      engagement_id: engagementId,
      expert: engagement.expert_name,
      expertAvatar: engagement.expert_avatar,
      amount: "-" + formatCurrency(milestone.amount),
      amountNum: -milestone.amount,
      date,
      time,
      status: "Completed",
      method: "Escrow Release",
      txRef: txId,
      created_at: new Date().toISOString()
    };
    transactions.unshift(releaseTx);

    // Deduct 10% platform fee and add fee transaction
    const feeVal = milestone.amount * 0.1;
    const feeTxId = txId + "-fee";
    const feeTx = {
      id: feeTxId,
      type: "platform_fee",
      description: `Platform Fee — ${milestone.title}`,
      engagement: engagement.title,
      engagement_id: engagementId,
      expert: "—",
      expertAvatar: null,
      amount: "-" + formatCurrency(feeVal),
      amountNum: -feeVal,
      date,
      time,
      status: "Completed",
      method: "Auto-debit",
      txRef: feeTxId,
      created_at: new Date().toISOString()
    };
    transactions.unshift(feeTx);

    // Update corresponding invoice to paid
    const invoiceTitle = `${milestone.title}`;
    const invoice = invoices.find(inv => 
      inv.engagement_id === engagementId && 
      (inv.title.includes(milestone.title) || invoiceTitle.includes(inv.title))
    );
    if (invoice) {
      invoice.status = "Paid";
      invoice.date = date;
    } else {
      // Create a paid invoice if not found
      invoices.unshift({
        id: "INV-" + Math.floor(2000 + Math.random() * 8000),
        title: milestone.title,
        engagement: engagement.title,
        engagement_id: engagementId,
        expert: engagement.expert_name,
        expertAvatar: engagement.expert_avatar,
        amount: formatCurrency(milestone.amount),
        amountNum: milestone.amount,
        date,
        dueDate: date,
        status: "Paid",
        type: "Milestone Invoice"
      });
    }

    await writeJsonFile("milestones.json", milestones);
    await writeJsonFile("escrow_transactions.json", transactions);
    await writeJsonFile("invoices.json", invoices);

    // ── NOTIFICATIONS LOGIC ──
    const { expertUserId, companyUserId } = await resolveUserIdsForNotification(engagement, req.user);

    if (expertUserId) {
      await createNotification(
        expertUserId,
        "Payment Released from Escrow",
        `Congratulations! Acme Corp has approved milestone "${milestone.title}" and released ${formatCurrency(milestone.amount)} from escrow to your wallet (minus 10% platform fee).`,
        "payment",
        { engagementId, milestoneId, targetRole: "expert" }
      );
    }

    if (companyUserId) {
      await createNotification(
        companyUserId,
        "Escrow Release Approved",
        `Released ${formatCurrency(milestone.amount)} from escrow for milestone "${milestone.title}" to ${engagement.expert_name}.`,
        "payment",
        { engagementId, milestoneId, targetRole: "company" }
      );
    }

    res.json({ success: true, milestone, transaction: releaseTx });
  } catch (err) {
    console.error("releaseEscrow error:", err);
    res.status(500).json({ error: "Failed to release escrow funds" });
  }
};

// ================= SUBMIT MILESTONE DELIVERABLE =================
export const submitMilestone = async (req, res) => {
  try {
    const { engagementId, milestoneId, note } = req.body;

    if (!engagementId || !milestoneId) {
      return res.status(400).json({ error: "Engagement ID and Milestone ID are required" });
    }

    const milestones = await readJsonFile("milestones.json");
    const milestone = milestones.find(m => m.id === milestoneId && m.engagement_id === engagementId);

    if (!milestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    if (milestone.status !== "in_progress") {
      return res.status(400).json({ error: `Milestone is in status "${milestone.status}" and cannot be submitted` });
    }

    // Update status to pending_approval (which means submitted, awaiting company approval)
    milestone.status = "pending_approval";
    
    // Add mockup deliverables if empty
    if (!milestone.deliverables || milestone.deliverables.length === 0) {
      milestone.deliverables = [
        { name: "Deliverable_Document.pdf", size: "2.4 MB", type: "pdf" }
      ];
    }

    await writeJsonFile("milestones.json", milestones);

    // Create a notification for the company
    const engagements = await readJsonFile("engagements.json");
    const engagement = engagements.find(e => e.id === engagementId);
    if (engagement) {
      const { companyUserId } = await resolveUserIdsForNotification(engagement, req.user);
      if (companyUserId) {
        await createNotification(
          companyUserId,
          "Milestone Submitted for Approval",
          `Expert ${engagement.expert_name} has submitted deliverables for milestone "${milestone.title}". Please review and approve.`,
          "payment",
          { engagementId, milestoneId, targetRole: "company" }
        );
      }
    }

    res.json({ success: true, milestone });
  } catch (err) {
    console.error("submitMilestone error:", err);
    res.status(500).json({ error: "Failed to submit milestone deliverable" });
  }
};

// ================= GET ENGAGEMENT DETAILS FOR WORKSPACE =================
export const getEngagementDetails = async (req, res) => {
  try {
    const { engagementId } = req.params;
    const email = req.user?.email;

    if (!engagementId) {
      return res.status(400).json({ error: "Engagement ID is required" });
    }

    const engagements = await readJsonFile("engagements.json");
    const eng = engagements.find(e => e.id === engagementId);
    if (!eng) {
      return res.status(404).json({ error: "Engagement not found" });
    }

    const allMilestones = await readJsonFile("milestones.json");
    const allTransactions = await readJsonFile("escrow_transactions.json");

    // Filter milestones for this engagement
    const engMilestones = allMilestones.filter(m => m.engagement_id === engagementId);
    const engTransactions = allTransactions.filter(t => t.engagement_id === engagementId);

    // Compute stats
    let escrowBalanceNum = 0;
    let spentNum = 0;
    let completedCount = 0;

    const completedTx = engTransactions.filter(t => t.status === "Completed");
    completedTx.forEach(t => {
      if (t.type === "escrow_add") {
        escrowBalanceNum += t.amountNum;
      } else if (t.type === "milestone_release") {
        escrowBalanceNum += t.amountNum; // negative
        spentNum += Math.abs(t.amountNum);
      }
    });

    engMilestones.forEach(m => {
      if (m.status === "completed") {
        completedCount++;
      }
    });

    const progress = engMilestones.length > 0 
      ? Math.round((completedCount / engMilestones.length) * 100) 
      : 0;

    // Get next milestone in progress or pending approval
    const nextMs = engMilestones.find(m => m.status === "in_progress" || m.status === "pending_approval") 
      || engMilestones.find(m => m.status === "upcoming")
      || { title: "None" };

    // Format expert role
    const expertTitle = eng.title.includes("Funding") ? "Interim CFO" : "Interim Consultant";

    const workspaceEngagement = {
      id: eng.id,
      title: eng.title,
      company: eng.company_name || "Acme Corp.",
      companyLogo: eng.company_name ? eng.company_name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() : "AC",
      logoColor: eng.company_name === "TechScale Ventures" ? "from-emerald-700 to-teal-500" : "from-[#134e40] to-[#0eb59a]",
      status: eng.status === "Active" ? "IN PROGRESS" : eng.status.toUpperCase(),
      statusColor: eng.status === "Active" 
        ? "text-blue-600 bg-blue-50 border-blue-200" 
        : "text-emerald-600 bg-emerald-50 border-emerald-200",
      expert: {
        id: eng.expert_id,
        name: eng.expert_name,
        title: expertTitle,
        avatar: eng.expert_avatar,
        rating: 5.0,
        exRole: "Ex-CFO / Executive Leader",
      },
      type: "Interim",
      startDate: "1 Feb 2025",
      endDate: "31 Jul 2025",
      duration: "6 months",
      commitment: "40 hrs/wk",
      budget: eng.monthly_rate || "₹3L/mo",
      monthlyRate: eng.monthly_rate || "₹3L/mo",
      totalValue: formatCurrency(eng.total_budget),
      escrowBalance: formatCurrency(escrowBalanceNum),
      spent: formatCurrency(spentNum),
      progress,
      nextMilestone: nextMs.title,
      daysLeft: 87,
      pmContact: "Riya Sharma",
      pmEmail: "riya@cxoconnect.com"
    };

    // Map milestones to frontend format
    const mappedMilestones = engMilestones.map(m => ({
      id: m.id,
      title: m.title,
      desc: m.desc || "",
      dueDate: m.due_date,
      completedDate: m.completed_date,
      status: m.status, // completed, pending_approval, in_progress, upcoming
      payment: formatCurrency(m.amount),
      paymentStatus: m.paymentStatus, // released, in_escrow, locked
      deliverables: m.deliverables || []
    }));

    // Map payments to frontend format
    const mappedPayments = engMilestones.map((m, idx) => {
      const relatedTx = engTransactions.find(t => t.type === "milestone_release" && t.description.includes(m.title));
      return {
        id: idx + 1,
        dbMilestoneId: m.id,
        milestone: m.title,
        amount: formatCurrency(m.amount),
        date: m.completed_date || "—",
        status: m.paymentStatus, // released, in_escrow, locked
        txId: relatedTx ? relatedTx.txRef : "—"
      };
    });

    res.json({
      engagement: workspaceEngagement,
      milestones: mappedMilestones,
      payments: mappedPayments
    });
  } catch (err) {
    console.error("getEngagementDetails error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

