import { supabaseAdmin } from "../utils/supabaseAdmin.js";

async function run() {
  const { data: existingCompany } = await supabaseAdmin
    .from("company_applications")
    .select("id")
    .eq("admin_email", "demo@cxo.com")
    .maybeSingle();

  if (!existingCompany) {
    console.log("Seeding demo company profile...");
    const { error } = await supabaseAdmin.from("company_applications").insert([
      {
        company_name: "Acme Corp.",
        website: "https://acme.com",
        industry: "SaaS & Tech",
        org_size: "51-200",
        org_type: "Private Company",
        tagline: "Building the future of SaaS",
        about: "Acme Corp is a leading software company specializing in innovative SaaS products.",
        status: "'approved'",
        admin_name: "John Doe",
        admin_email: "demo@cxo.com",
        email: "demo@cxo.com",
        logo_url: "",
        coi_url: "",
        cin_number: "",
        gstin: "",
        contact_number: "",
        company_age: "",
        linkedin: "",
        user_id: "00000000-0000-0000-0000-000000000000",
        founded_year: "2022"
      }
    ]);
    if (error) console.error("Error seeding company:", error);
    else console.log("Demo company profile seeded successfully.");
  } else {
    console.log("Demo company profile already exists.");
  }

  // 2. Check and seed requirements for demo@cxo.com
  const { data: existingReqs } = await supabaseAdmin
    .from("company_requirements")
    .select("id")
    .eq("company_email", "demo@cxo.com");

  if (!existingReqs || existingReqs.length === 0) {
    console.log("Seeding demo requirements...");
    const { error } = await supabaseAdmin.from("company_requirements").insert([
      {
        company_email: "demo@cxo.com",
        role_title: "Interim CFO",
        engagement_type: "Interim",
        status: "Active",
        business_problem_text: "Need a strategic financial leader to guide fundraising and financial modeling.",
        skills: ["Financial Modeling", "Fundraising", "Investor Relations"],
        industries: ["SaaS", "Fintech"]
      },
      {
        company_email: "demo@cxo.com",
        role_title: "Fractional CMO",
        engagement_type: "Fractional",
        status: "Active",
        business_problem_text: "Seeking a brand and growth marketing leader to scale B2B SaaS acquisition.",
        skills: ["Growth Marketing", "Brand Strategy", "B2B Marketing"],
        industries: ["SaaS"]
      }
    ]);
    if (error) console.error("Error seeding requirements:", error);
    else console.log("Demo requirements seeded successfully.");
  } else {
    console.log("Demo requirements already exist.");
  }
}

run();
