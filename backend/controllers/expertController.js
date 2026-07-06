import { supabaseAdmin } from "../utils/supabaseAdmin.js";
import { 
  syncExpertEmbedding, 
  syncRequirementEmbedding, 
  computeKeywordMatchScore, 
  cosineSimilarity 
} from "../utils/matchmaker.js";
import { createNotification } from "../utils/createNotification.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// ================= GET EXPERT PROFILE =================
export const getExpertProfile = async (req, res) => {
  try {
    const email = req.user.email; // Extracted from Supabase JWT by requireAuth middleware

    if (!email) {
      return res.status(400).json({ error: "Email not found in token" });
    }

    const { data, error } = await supabaseAdmin
      .from("expert_applications")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") { // PGRST116 is code for no rows returned
      console.error("Error fetching expert profile:", error);
      return res.status(500).json({ error: "Failed to fetch expert profile" });
    }

    if (!data) {
      return res.status(404).json({ error: "Expert profile not found" });
    }

    res.json(data);
  } catch (err) {
    console.error("getExpertProfile error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ================= UPDATE / UPSERT EXPERT PROFILE =================
export const updateExpertProfile = async (req, res) => {
  try {
    const email = req.user.email;
    if (!email) {
      return res.status(400).json({ error: "Email not found in token" });
    }

    const {
      full_name,
      headline,
      primary_domain,
      years_experience,
      current_role,
      current_company,
      key_skills,
      services_offered,
      hourly_rate,
      profile_url,
      linkedin,
      github,
      work_samples,
      phone,
      portfolio_website,
      previous_experience,
      tools_technologies,
      experience_history,
      education_history,
      industries,
      engagement_types
    } = req.body;

    // Check if expert profile exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("expert_applications")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (fetchError) {
      console.error("Error checking existing profile:", fetchError);
      return res.status(500).json({ error: "Database error checking profile" });
    }

    const profileData = {
      full_name,
      headline,
      primary_domain,
      years_experience,
      current_role,
      current_company,
      key_skills,
      services_offered,
      hourly_rate,
      profile_url,
      linkedin,
      github,
      work_samples,
      phone,
      portfolio_website,
      previous_experience,
      tools_technologies,
      experience_history,
      education_history,
      industries,
      engagement_types,
      user_id: req.user.id
    };

    let result;
    if (existing) {
      // Update existing record
      const { data, error } = await supabaseAdmin
        .from("expert_applications")
        .update(profileData)
        .eq("email", email)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Insert new record
      const { data, error } = await supabaseAdmin
        .from("expert_applications")
        .insert([{ ...profileData, email }])
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }

    res.json(result);
  } catch (err) {
    console.error("updateExpertProfile error:", err);
    res.status(500).json({ error: "Failed to update expert profile" });
  }
};

// ================= GET ACTIVE OPPORTUNITIES =================
const getRelativeTimeString = (date) => {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) {
    return diffMins <= 1 ? "Just now" : `${diffMins} minutes ago`;
  } else if (diffHours < 24) {
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  } else {
    return diffDays === 1 ? "Yesterday" : `${diffDays} days ago`;
  }
};

const mapDbOpportunity = (req, company, idx, matchScore) => {
  // Budget formatting: e.g. "₹2L - ₹3L/mo"
  let budgetStr = "Negotiable";
  if (req.budget_min && req.budget_max) {
    budgetStr = `₹${(req.budget_min / 100000).toFixed(0)}L - ₹${(req.budget_max / 100000).toFixed(0)}L/mo`;
  } else if (req.budget_min) {
    budgetStr = `₹${(req.budget_min / 100000).toFixed(0)}L+/mo`;
  }

  // Logo initials
  const initials = company.company_name
    ? company.company_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "CO";

  // Brand gradient colors
  const logoColors = [
    "from-teal-700 to-teal-500",
    "from-[#134e40] to-[#0eb59a]",
    "from-[#0eb59a] to-emerald-400",
    "from-emerald-700 to-teal-500",
    "from-[#134e40] to-slate-600",
    "from-teal-800 to-[#134e40]"
  ];
  const logoColor = logoColors[idx % logoColors.length];

  // Map type (e.g. fractional -> Fractional)
  const type = req.engagement_type
    ? req.engagement_type.charAt(0).toUpperCase() + req.engagement_type.slice(1)
    : "Fractional";

  // Urgency (e.g. immediate -> Immediate)
  const urgency = req.urgency
    ? req.urgency.charAt(0).toUpperCase() + req.urgency.slice(1)
    : "Planned";

  // Budget number for filtering
  const budgetNum = req.budget_min || 0;

  // Match score (mock or basic match)
  const match = matchScore !== undefined ? matchScore : (80 + (idx % 19)); // 80% to 98%

  // Posted date formatting
  const postedDate = req.created_at
    ? getRelativeTimeString(new Date(req.created_at))
    : "Recently";

  return {
    id: req.id,
    title: req.role_title || "Untitled Opportunity",
    company: company.company_name || "Confidential",
    companySize: company.org_size ? `${company.org_size} employees` : "10-50 employees",
    industry: company.industry || "Technology",
    type: type,
    match: match,
    budget: budgetStr,
    budgetNum: budgetNum,
    commitment: req.commitment || "Flexible",
    duration: req.duration || "Flexible",
    location: req.location || "Remote",
    postedDate: postedDate,
    urgency: urgency,
    skills: req.skills || [],
    description: req.business_problem_text || "No description provided.",
    logo: initials,
    logoUrl: company.logo_url,
    logoColor: logoColor,
    status: req.status === 'Active' ? 'new' : 'normal',
    applicants: 2 + (idx % 5), // mocked count
    verified: company.status === 'Approved' || true,
  };
};

export const getOpportunities = async (req, res) => {
  try {
    const email = req.user.email; // Extracted from Supabase JWT by requireAuth middleware
    if (!email) {
      return res.status(400).json({ error: "Email not found in token" });
    }

    // 0. Fetch logged in expert profile
    const { data: expert, error: expertError } = await supabaseAdmin
      .from("expert_applications")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (expertError) {
      console.error("Error fetching expert profile for matchmaking:", expertError);
    }

    let expertEmbedding = expert?.embedding;
    if (expert && !expertEmbedding) {
      // Dynamically generate and sync the expert's embedding if missing
      expertEmbedding = await syncExpertEmbedding(expert.id, expert);
    }

    // 1. Fetch requirements with status = 'Active' (or non-draft)
    const { data: requirements, error: reqError } = await supabaseAdmin
      .from("company_requirements")
      .select("*")
      .eq("status", "Active");

    if (reqError) {
      console.error("Error fetching requirements:", reqError);
      return res.status(500).json({ error: "Failed to fetch opportunities" });
    }

    // 2. Fetch registered companies
    const { data: companies, error: compError } = await supabaseAdmin
      .from("company_applications")
      .select("*");

    if (compError) {
      console.error("Error fetching companies:", compError);
      return res.status(500).json({ error: "Failed to fetch company details" });
    }

    // 3. Fetch authenticated user emails
    const { data: { users }, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error("Error listing authenticated users:", authError);
      return res.status(500).json({ error: "Failed to fetch authenticated status" });
    }

    const authenticatedEmails = new Set(users.map(u => u.email ? u.email.toLowerCase().trim() : "").filter(Boolean));

    // 4. Map companies by email
    const companyMap = new Map();
    companies.forEach(c => {
      if (c.admin_email) {
        companyMap.set(c.admin_email.toLowerCase().trim(), c);
      }
    });

    // 5. Combine, score and filter
    const opportunities = [];
    for (let idx = 0; idx < requirements.length; idx++) {
      const reqItem = requirements[idx];
      const companyEmail = reqItem.company_email ? reqItem.company_email.toLowerCase().trim() : "";
      const company = companyMap.get(companyEmail);

      // Only include requirements where:
      // - Company exists in company_applications
      // - The company's admin email is in auth.users (signed up and authenticated)
      if (company && authenticatedEmails.has(companyEmail)) {
        let matchScore;
        
        if (expert) {
          let reqEmbedding = reqItem.embedding;
          if (!reqEmbedding) {
            reqEmbedding = await syncRequirementEmbedding(reqItem.id, reqItem);
          }

          if (expertEmbedding && reqEmbedding) {
            const similarity = cosineSimilarity(expertEmbedding, reqEmbedding);
            // Map cosine similarity [0.4, 0.85] to [60, 98] range
            matchScore = Math.round(60 + Math.max(0, Math.min(1, (similarity - 0.4) / 0.45)) * 38);
          } else {
            // Fallback keyword matching
            matchScore = computeKeywordMatchScore(expert, reqItem);
          }
        } else {
          matchScore = 80 + (idx % 19);
        }

        opportunities.push(mapDbOpportunity(reqItem, company, idx, matchScore));
      }
    }

    res.json(opportunities);
  } catch (err) {
    console.error("getOpportunities error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ================= ACCEPT INVITATION =================
export const acceptInvitation = async (req, res) => {
  try {
    const expertEmail = req.user?.email;
    const { id: notificationId } = req.params;

    if (!expertEmail) {
      return res.status(400).json({ error: "Email not found in token" });
    }

    // 1. Fetch the invitation notification
    let notification;
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const jsonPath = path.join(__dirname, "../data/notifications.json");

    if (req.user.id.startsWith("00000000-0000-0000-0000-")) {
      const list = JSON.parse(await fs.readFile(jsonPath, "utf-8"));
      notification = list.find(n => n.id === notificationId);
    } else {
      const { data, error } = await supabaseAdmin
        .from("notifications")
        .select("*")
        .eq("id", notificationId)
        .maybeSingle();
      if (error) throw error;
      notification = data;
    }

    if (!notification) {
      return res.status(404).json({ error: "Invitation notification not found" });
    }

    // Check if status is already accepted or declined
    if (notification.metadata?.status === "accepted" || notification.metadata?.status === "declined") {
      return res.status(400).json({ error: `Invitation already ${notification.metadata.status}` });
    }

    const { requirementId, companyName } = notification.metadata || {};

    if (!requirementId) {
      return res.status(400).json({ error: "requirementId not found in notification metadata" });
    }

    // 2. Fetch the requirement details to get role title & duration
    const { data: requirement, error: reqErr } = await supabaseAdmin
      .from("company_requirements")
      .select("*")
      .eq("id", requirementId)
      .maybeSingle();

    if (reqErr) {
      console.error("Error fetching requirement for accept:", reqErr);
    }

    // 3. Fetch the company profile matching requirement's company email
    const companyEmail = requirement?.company_email || "demo@cxo.com";
    const { data: company, error: companyErr } = await supabaseAdmin
      .from("company_applications")
      .select("*")
      .eq("admin_email", companyEmail)
      .maybeSingle();

    if (companyErr) {
      console.error("Error fetching company application for accept:", companyErr);
    }

    // 4. Fetch the expert's profile
    const { data: expert, error: expertErr } = await supabaseAdmin
      .from("expert_applications")
      .select("*")
      .eq("email", expertEmail)
      .maybeSingle();

    if (expertErr || !expert) {
      console.error("Error fetching expert application for accept:", expertErr);
      return res.status(404).json({ error: "Expert profile not found" });
    }

    // 5. Insert new contract
    const contractTitle = `Engagement Agreement — ${requirement?.role_title || "CXO Advisor"}`;
    const contractType = "Advisory Agreement";
    const contractValue = requirement?.compensation || "₹3,00,000";
    const contractDuration = requirement?.duration || "6 months";
    
    const createdDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    
    const start = new Date();
    start.setMonth(start.getMonth() + 1);
    start.setDate(1);
    const startDateStr = start.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    
    const end = new Date(start);
    end.setMonth(end.getMonth() + 6);
    const endDateStr = end.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

    const newContract = {
      title: contractTitle,
      type: contractType,
      status: "Pending Signature",
      expert_email: expertEmail,
      expert_name: expert.full_name || "Expert",
      expert_title: expert.headline || expert.current_role || "CXO Advisor",
      expert_avatar: expert.profile_url || "https://i.pravatar.cc/150?u=" + expert.id,
      company_email: companyEmail,
      company_name: company?.company_name || companyName || "Acme Corp",
      company_logo: company?.company_name ? company.company_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : "AC",
      logo_color: "from-[#134e40] to-[#0eb59a]",
      value: contractValue,
      duration: contractDuration,
      start_date: startDateStr,
      end_date: endDateStr,
      created_date: createdDate,
      expires_at: new Date(Date.now() + 7 * 24 * 3600 * 1000).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      signed_by_expert: false,
      signed_by_company: false,
      signature_expert: null,
      signature_company: null,
      signed_date: null
    };

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("contracts")
      .insert([newContract])
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting contract in DB:", insertError);
      throw insertError;
    }
    const savedContract = inserted;

    // 6. Update invitation notification status
    const updatedMetadata = { ...notification.metadata, status: "accepted", contractId: savedContract.id };
    if (req.user.id.startsWith("00000000-0000-0000-0000-")) {
      const list = JSON.parse(await fs.readFile(jsonPath, "utf-8"));
      const updatedList = list.map(n => n.id === notificationId ? { ...n, is_read: true, metadata: updatedMetadata } : n);
      await fs.writeFile(jsonPath, JSON.stringify(updatedList, null, 2), "utf-8");
    } else {
      await supabaseAdmin
        .from("notifications")
        .update({ is_read: true, metadata: updatedMetadata })
        .eq("id", notificationId);
    }

    // 7. Create notifications for both parties
    const companyUserId = company?.user_id || "00000000-0000-0000-0000-000000000001";
    const expertUserId = req.user.id;

    const notifTitle = "Invitation Accepted";
    const companyDesc = `Expert ${expert.full_name || "Expert"} has accepted your invitation for the "${requirement?.role_title || "CXO Advisor"}" role. A draft contract is now ready for your review.`;
    const expertDesc = `You have accepted the invitation for the "${requirement?.role_title || "CXO Advisor"}" role. A draft contract is now ready for your signature.`;

    await createNotification(
      companyUserId,
      notifTitle,
      companyDesc,
      "contract",
      { targetRole: "company", contractId: savedContract.id }
    );

    await createNotification(
      expertUserId,
      notifTitle,
      expertDesc,
      "contract",
      { targetRole: "expert", contractId: savedContract.id }
    );

    res.json({ success: true, contract: savedContract });
  } catch (err) {
    console.error("acceptInvitation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ================= DECLINE INVITATION =================
export const declineInvitation = async (req, res) => {
  try {
    const { id: notificationId } = req.params;
    const email = req.user?.email;

    if (!email) {
      return res.status(400).json({ error: "Email not found in token" });
    }

    // 1. Fetch the invitation notification
    let notification;
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const jsonPath = path.join(__dirname, "../data/notifications.json");

    if (req.user.id.startsWith("00000000-0000-0000-0000-")) {
      const list = JSON.parse(await fs.readFile(jsonPath, "utf-8"));
      notification = list.find(n => n.id === notificationId);
    } else {
      const { data, error } = await supabaseAdmin
        .from("notifications")
        .select("*")
        .eq("id", notificationId)
        .maybeSingle();
      if (error) throw error;
      notification = data;
    }

    if (!notification) {
      return res.status(404).json({ error: "Invitation notification not found" });
    }

    if (notification.metadata?.status === "accepted" || notification.metadata?.status === "declined") {
      return res.status(400).json({ error: `Invitation already ${notification.metadata.status}` });
    }

    const { requirementId } = notification.metadata || {};

    // 2. Fetch the requirement details to get role title
    const { data: requirement } = await supabaseAdmin
      .from("company_requirements")
      .select("*")
      .eq("id", requirementId)
      .maybeSingle();

    // 3. Fetch the company profile to get user_id for notification
    const companyEmail = requirement?.company_email || "demo@cxo.com";
    const { data: company } = await supabaseAdmin
      .from("company_applications")
      .select("*")
      .eq("admin_email", companyEmail)
      .maybeSingle();

    // 4. Fetch expert name
    const { data: expert } = await supabaseAdmin
      .from("expert_applications")
      .select("full_name")
      .eq("email", email)
      .maybeSingle();

    const roleTitle = requirement?.role_title || "CXO Advisor";
    const expertName = expert?.full_name || "An expert";

    // 5. Update invitation notification status to declined
    const updatedMetadata = { ...notification.metadata, status: "declined" };
    if (req.user.id.startsWith("00000000-0000-0000-0000-")) {
      const list = JSON.parse(await fs.readFile(jsonPath, "utf-8"));
      const updatedList = list.map(n => n.id === notificationId ? { ...n, is_read: true, metadata: updatedMetadata } : n);
      await fs.writeFile(jsonPath, JSON.stringify(updatedList, null, 2), "utf-8");
    } else {
      await supabaseAdmin
        .from("notifications")
        .update({ is_read: true, metadata: updatedMetadata })
        .eq("id", notificationId);
    }

    // 6. Create notification for the company admin
    const companyUserId = company?.user_id || "00000000-0000-0000-0000-000000000001";
    await createNotification(
      companyUserId,
      "Invitation Declined",
      `Expert ${expertName} has declined your invitation for the "${roleTitle}" role.`,
      "match",
      { targetRole: "company" }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("declineInvitation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

