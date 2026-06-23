import { supabaseAdmin } from "../utils/supabaseAdmin.js";
import { 
  syncExpertEmbedding, 
  syncRequirementEmbedding, 
  computeKeywordMatchScore, 
  cosineSimilarity 
} from "../utils/matchmaker.js";
import { createNotification } from "../utils/createNotification.js";

// ================= GET COMPANY PROFILE =================
export const getCompanyProfile = async (req, res) => {
  try {
    const email = req.user.email; // Extracted from Supabase JWT by requireAuth middleware

    if (!email) {
      return res.status(400).json({ error: "Email not found in token" });
    }

    const { data, error } = await supabaseAdmin
      .from("company_applications")
      .select("*")
      .eq("admin_email", email)
      .single();

    if (error && error.code !== "PGRST116") { // Ignore 'no rows returned' error if not found, but it throws PGRST116 for .single()
      console.error("Error fetching company profile:", error);
      return res.status(500).json({ error: "Failed to fetch company profile" });
    }

    if (!data) {
      return res.status(404).json({ error: "Company profile not found" });
    }

    res.json(data);
  } catch (err) {
    console.error("getCompanyProfile error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ================= GET TEAM MEMBERS =================
export const getTeamMembers = async (req, res) => {
  try {
    const email = req.user.email;
    if (!email) {
      return res.status(400).json({ error: "Email not found in token" });
    }

    const { data, error } = await supabaseAdmin
      .from("company_applications")
      .select("admin_name, admin_email")
      .eq("admin_email", email)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching team members:", error);
      return res.status(500).json({ error: "Failed to fetch team members" });
    }

    if (!data) {
      return res.status(404).json({ error: "Company profile not found" });
    }

    // Return the admin as a single team member
    const teamMembers = [
      {
        id: 1, // Placeholder ID or generate UUID
        name: data.admin_name || "Admin",
        email: data.admin_email,
        role: "Admin",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.admin_name || "A")}&background=134e40&color=fff`,
        status: "Active",
        lastActive: "Now",
        isOwner: true
      }
    ];

    res.json(teamMembers);
  } catch (err) {
    console.error("getTeamMembers error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Helper function to map DB expert record to frontend component format
export const mapDbExpert = (expert, idx = 0, matchScore) => {
  const initials = expert.full_name
    ? expert.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "EX";

  const colors = ["bg-purple-500", "bg-blue-500", "bg-teal-600", "bg-rose-500", "bg-amber-600"];
  const color = colors[idx % colors.length];

  const gradients = [
    "from-teal-600 to-emerald-500",
    "from-blue-600 to-indigo-500",
    "from-purple-600 to-violet-500",
    "from-emerald-600 to-teal-500",
    "from-indigo-600 to-blue-500"
  ];
  const coverGradient = gradients[idx % gradients.length];

  const engagementTypesObj = (expert.engagement_types && typeof expert.engagement_types === 'object') ? expert.engagement_types : {};
  const availabilityInfo = engagementTypesObj.availability || {};
  const rateCardInfo = engagementTypesObj.rateCard || {};

  // Format budget: e.g. "₹2L - ₹3L/mo" based on expected monthly hourly_rate
  let rate = "₹2.0L/mo";
  if (rateCardInfo.fractional) {
    rate = rateCardInfo.fractional;
    if (!rate.includes('/mo')) {
      rate = `${rate}/mo`;
    }
  } else if (expert.hourly_rate) {
    const rateNum = parseInt(expert.hourly_rate);
    if (!isNaN(rateNum)) {
      if (rateNum >= 100000) {
        rate = `₹${(rateNum / 100000).toFixed(1)}L/mo`;
      } else {
        rate = `₹${rateNum.toLocaleString('en-IN')}/mo`;
      }
    }
  }

  // Construct availability string
  let availabilityStr = expert.years_experience ? `${expert.years_experience} years exp` : "Part-time";
  if (availabilityInfo.hoursPerWeek) {
    availabilityStr = `${availabilityInfo.hoursPerWeek} hrs/week`;
  } else if (availabilityInfo.status) {
    availabilityStr = availabilityInfo.status;
  }

  let availabilityType = "Part-time";
  if (engagementTypesObj["Full-time"] || engagementTypesObj["Interim"]) {
    availabilityType = "Full-time";
  } else if (engagementTypesObj["Advisory"]) {
    availabilityType = "Advisory";
  } else if (engagementTypesObj["Fractional"] || engagementTypesObj["Part-time"]) {
    availabilityType = "Part-time";
  }

  // Generate dynamic highlights
  const highlights = [];
  if (expert.current_role) {
    highlights.push(`Worked as ${expert.current_role}${expert.current_company ? ` at ${expert.current_company}` : ""}`);
  }
  if (expert.primary_domain) {
    highlights.push(`Specializes in ${expert.primary_domain}`);
  }
  if (expert.key_skills) {
    const skillsList = expert.key_skills.split(",").slice(0, 3).map(s => s.trim()).join(", ");
    highlights.push(`Expert in: ${skillsList}`);
  }
  if (expert.tools_technologies) {
    highlights.push(`Proficient with: ${expert.tools_technologies}`);
  }
  // Fill in placeholders if we have fewer than 3 highlights
  while (highlights.length < 4) {
    const fallbackHighlights = [
      "Led cross-functional teams to deliver high-impact results",
      "Managed business units scaling from early-stage to growth",
      "Expertise in designing strategic roadmaps and execution frameworks",
      "Trusted advisor to startup founders and corporate executives"
    ];
    highlights.push(fallbackHighlights[highlights.length]);
  }

  return {
    id: expert.id,
    name: expert.full_name,
    title: expert.current_role || "CXO Advisor",
    role: expert.current_role || "CXO Advisor",
    exRole: expert.headline || "Independent Consultant",
    avatar: expert.profile_url || `https://i.pravatar.cc/150?u=${expert.id}`,
    initials,
    color,
    coverGradient,
    rating: 4.9, // fallback placeholder
    reviews: 12 + (idx % 10), // fallback placeholder
    match: matchScore !== undefined ? matchScore : (90 + (idx % 9)), // fallback placeholder
    availability: availabilityStr,
    availabilityType: availabilityType,
    location: availabilityInfo.preferredMode || "Remote",
    budget: rate,
    budgetNum: parseInt(expert.hourly_rate) || 200000,
    rate: rate,
    rateCard: rateCardInfo,
    experience: expert.years_experience ? `${expert.years_experience} years` : "10+ years",
    industries: Array.isArray(expert.industries) && expert.industries.length > 0
      ? expert.industries
      : ["SaaS", "Fintech", "Consumer Tech"],
    skills: expert.key_skills ? expert.key_skills.split(",").map(s => s.trim()) : [],
    experiences: expert.experience_history || [],
    education: expert.education_history || [],
    roles: [expert.current_role || "CXO Advisor"],
    engagementTypes: (() => {
      const active = Object.keys(engagementTypesObj).filter(k => k !== 'availability' && k !== 'rateCard' && engagementTypesObj[k]);
      if (active.length > 0) return active;
      return ["Fractional", "Advisory"];
    })(),
    verified: true,
    topExpert: idx % 3 === 0,
    responseTime: "< 2 hours",
    bio: expert.services_offered || expert.headline || "Premium CXO Advisor.",
    completedEngagements: 4 + (idx % 5),
    linkedIn: expert.linkedin || "https://linkedin.com",
    github: expert.github || "",
    languages: ["English", "Hindi"],
    timezone: availabilityInfo.timezone || "IST (UTC+5:30)",
    highlights,
    email: expert.email,
    user_id: expert.user_id
  };
};

// ================= GET REGISTERED EXPERTS =================
export const getRegisteredExperts = async (req, res) => {
  try {
    const companyEmail = req.user.email;
    let selectedReq = null;

    // Check if query param requirementId is provided, or get the latest active requirement
    const requirementId = req.query.requirementId;
    if (requirementId) {
      const { data } = await supabaseAdmin
        .from("company_requirements")
        .select("*")
        .eq("id", requirementId)
        .maybeSingle();
      selectedReq = data;
    } else if (companyEmail) {
      const { data } = await supabaseAdmin
        .from("company_requirements")
        .select("*")
        .eq("company_email", companyEmail)
        .eq("status", "Active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      selectedReq = data;
    }

    if (selectedReq && !selectedReq.embedding) {
      selectedReq.embedding = await syncRequirementEmbedding(selectedReq.id, selectedReq);
    }

    const { data: rawExperts, error } = await supabaseAdmin
      .from("expert_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching registered experts:", error);
      return res.status(500).json({ error: "Failed to fetch experts" });
    }

    // Map DB fields and calculate match score
    const mappedExperts = [];
    for (let idx = 0; idx < rawExperts.length; idx++) {
      const expert = rawExperts[idx];
      let matchScore;

      if (selectedReq) {
        let expertEmbedding = expert.embedding;
        if (!expertEmbedding) {
          expertEmbedding = await syncExpertEmbedding(expert.id, expert);
        }

        if (expertEmbedding && selectedReq.embedding) {
          const similarity = cosineSimilarity(expertEmbedding, selectedReq.embedding);
          matchScore = Math.round(60 + Math.max(0, Math.min(1, (similarity - 0.4) / 0.45)) * 38);
        } else {
          matchScore = computeKeywordMatchScore(expert, selectedReq);
        }
      }

      mappedExperts.push(mapDbExpert(expert, idx, matchScore));
    }

    res.json(mappedExperts);
  } catch (err) {
    console.error("getRegisteredExperts error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ================= GET REGISTERED EXPERT BY ID =================
export const getRegisteredExpertById = async (req, res) => {
  try {
    const { expertId } = req.params;
    const companyEmail = req.user.email;

    if (!expertId) {
      return res.status(400).json({ error: "Expert ID is required" });
    }

    const { data: expert, error } = await supabaseAdmin
      .from("expert_applications")
      .select("*")
      .eq("id", expertId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching registered expert by ID:", error);
      return res.status(500).json({ error: "Failed to fetch expert details" });
    }

    if (!expert) {
      return res.status(404).json({ error: "Expert not found" });
    }

    let selectedReq = null;
    const requirementId = req.query.requirementId;
    if (requirementId) {
      const { data } = await supabaseAdmin
        .from("company_requirements")
        .select("*")
        .eq("id", requirementId)
        .maybeSingle();
      selectedReq = data;
    } else if (companyEmail) {
      const { data } = await supabaseAdmin
        .from("company_requirements")
        .select("*")
        .eq("company_email", companyEmail)
        .eq("status", "Active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      selectedReq = data;
    }

    let matchScore;
    if (selectedReq) {
      if (!selectedReq.embedding) {
        selectedReq.embedding = await syncRequirementEmbedding(selectedReq.id, selectedReq);
      }
      let expertEmbedding = expert.embedding;
      if (!expertEmbedding) {
        expertEmbedding = await syncExpertEmbedding(expert.id, expert);
      }

      if (expertEmbedding && selectedReq.embedding) {
        const similarity = cosineSimilarity(expertEmbedding, selectedReq.embedding);
        matchScore = Math.round(60 + Math.max(0, Math.min(1, (similarity - 0.4) / 0.45)) * 38);
      } else {
        matchScore = computeKeywordMatchScore(expert, selectedReq);
      }
    }

    const mapped = mapDbExpert(expert, 0, matchScore);
    res.json(mapped);
  } catch (err) {
    console.error("getRegisteredExpertById error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ================= GET COMPANY REQUIREMENTS =================
export const getCompanyRequirements = async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email) {
      return res.status(400).json({ error: "Email not found in token" });
    }

    const { data, error } = await supabaseAdmin
      .from("company_requirements")
      .select("*")
      .eq("company_email", email)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching company requirements:", error);
      return res.status(500).json({ error: "Failed to fetch requirements" });
    }

    // Map to simple structure expected by selector dropdowns
    const mapped = data.map(dbReq => ({
      id: dbReq.id,
      title: dbReq.role_title || 'Untitled Requirement',
      status: dbReq.status || 'Draft'
    }));

    res.json(mapped);
  } catch (err) {
    console.error("getCompanyRequirements error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ================= SEND INVITATION =================
export const sendInvitation = async (req, res) => {
  try {
    const companyEmail = req.user?.email;
    const { expertId, requirementId, note } = req.body;

    if (!expertId || !requirementId) {
      return res.status(400).json({ error: "expertId and requirementId are required" });
    }

    // 1. Fetch company profile to get company name
    const { data: company, error: companyErr } = await supabaseAdmin
      .from("company_applications")
      .select("company_name, user_id")
      .eq("admin_email", companyEmail)
      .maybeSingle();

    if (companyErr) {
      console.error("Error fetching company application for invite:", companyErr);
    }

    // 2. Fetch expert details to get their user_id
    const { data: expert, error: expertErr } = await supabaseAdmin
      .from("expert_applications")
      .select("user_id, full_name, email")
      .eq("id", expertId)
      .maybeSingle();

    if (expertErr || !expert) {
      console.error("Error fetching expert for invite:", expertErr);
      return res.status(404).json({ error: "Expert not found" });
    }

    const expertUserId = expert.user_id;
    if (!expertUserId) {
      return res.status(400).json({ error: "Expert user_id not found" });
    }

    // 3. Fetch requirement details to get the role title
    const { data: requirement, error: reqErr } = await supabaseAdmin
      .from("company_requirements")
      .select("role_title")
      .eq("id", requirementId)
      .maybeSingle();

    if (reqErr || !requirement) {
      console.error("Error fetching requirement for invite:", reqErr);
      return res.status(404).json({ error: "Requirement not found" });
    }

    // 4. Create notification for the expert
    const title = "New Opportunity Invitation";
    const desc = `${company?.company_name || 'A company'} has invited you to apply for their "${requirement.role_title || 'CXO Advisor'}" role.`;
    const companyName = company?.company_name || "Acme Corp.";

    const notification = await createNotification(
      expertUserId,
      title,
      desc,
      "match",
      {
        requirementId,
        companyName,
        note: note || "",
        targetRole: "expert"
      }
    );

    if (!notification) {
      return res.status(500).json({ error: "Failed to create invitation notification" });
    }

    res.json({ success: true, notification });
  } catch (err) {
    console.error("sendInvitation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
