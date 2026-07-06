import { supabaseAdmin } from './utils/supabaseAdmin.js';
import { 
  syncExpertEmbedding, 
  syncRequirementEmbedding, 
  computeKeywordMatchScore, 
  cosineSimilarity 
} from "./utils/matchmaker.js";

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
  let budgetStr = "Negotiable";
  if (req.budget_min && req.budget_max) {
    budgetStr = `₹${(req.budget_min / 100000).toFixed(0)}L - ₹${(req.budget_max / 100000).toFixed(0)}L/mo`;
  } else if (req.budget_min) {
    budgetStr = `₹${(req.budget_min / 100000).toFixed(0)}L+/mo`;
  }

  const initials = company.company_name
    ? company.company_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "CO";

  const logoColors = [
    "from-teal-700 to-teal-500",
    "from-[#134e40] to-[#0eb59a]"
  ];
  const logoColor = logoColors[idx % logoColors.length];

  const type = req.engagement_type
    ? req.engagement_type.charAt(0).toUpperCase() + req.engagement_type.slice(1)
    : "Fractional";

  const urgency = req.urgency
    ? req.urgency.charAt(0).toUpperCase() + req.urgency.slice(1)
    : "Planned";

  const budgetNum = req.budget_min || 0;
  const match = matchScore !== undefined ? matchScore : (80 + (idx % 19));
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
    applicants: 2,
    verified: true,
  };
};

async function simulate(email) {
  console.log(`=== SIMULATING FOR ${email} ===`);
  try {
    const { data: expert } = await supabaseAdmin
      .from("expert_applications")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    console.log("Found Expert profile?", expert ? "YES" : "NO");

    const { data: requirements } = await supabaseAdmin
      .from("company_requirements")
      .select("*")
      .eq("status", "Active");

    const { data: companies } = await supabaseAdmin
      .from("company_applications")
      .select("*");

    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
    const authenticatedEmails = new Set(users.map(u => u.email ? u.email.toLowerCase().trim() : "").filter(Boolean));

    const companyMap = new Map();
    companies.forEach(c => {
      if (c.admin_email) {
        companyMap.set(c.admin_email.toLowerCase().trim(), c);
      }
    });

    const opportunities = [];
    for (let idx = 0; idx < requirements.length; idx++) {
      const reqItem = requirements[idx];
      const companyEmail = reqItem.company_email ? reqItem.company_email.toLowerCase().trim() : "";
      const company = companyMap.get(companyEmail);

      console.log(`Checking reqItem: "${reqItem.role_title}", companyEmail: "${companyEmail}"`);
      console.log(`  - Company found in company_applications?`, company ? "YES" : "NO");
      console.log(`  - Company email authenticated?`, authenticatedEmails.has(companyEmail) ? "YES" : "NO");

      if (company && authenticatedEmails.has(companyEmail)) {
        let matchScore = 85;
        opportunities.push(mapDbOpportunity(reqItem, company, idx, matchScore));
      }
    }

    console.log("opportunities count returned:", opportunities.length);
    console.log("Returned Opportunities:", JSON.stringify(opportunities, null, 2));
  } catch(e) {
    console.error(e);
  }
}

simulate("suytripathi05@gmail.com");
