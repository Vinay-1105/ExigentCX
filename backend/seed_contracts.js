import { supabaseAdmin } from "./utils/supabaseAdmin.js";

const demoContracts = [
  // Demo Company & Experts
  {
    title: 'Engagement Agreement — Interim CFO',
    type: 'Engagement Agreement',
    status: 'Pending Signature',
    expert_email: 'david@example.com',
    expert_name: 'David Chen',
    expert_title: 'Interim CFO',
    expert_avatar: 'https://i.pravatar.cc/150?u=david',
    company_email: 'demo@cxo.com',
    company_name: 'Acme Corp',
    company_logo: 'AC',
    logo_color: 'from-[#134e40] to-[#0eb59a]',
    value: '₹18,00,000',
    duration: '6 months',
    start_date: 'Feb 1, 2025',
    end_date: 'Jul 31, 2025',
    created_date: 'Jan 28, 2025',
    expires_at: 'Feb 3, 2025',
    signed_by_expert: true,
    signed_by_company: false,
    signature_expert: 'David Chen',
    signature_company: null,
    signed_date: null,
    generated_by: 'ExigentCX Platform',
    pages: 8,
    file_size: '1.2 MB',
    urgency: 'high'
  },
  {
    title: 'Non-Disclosure Agreement — David Chen',
    type: 'NDA',
    status: 'Signed',
    expert_email: 'david@example.com',
    expert_name: 'David Chen',
    expert_title: 'Interim CFO',
    expert_avatar: 'https://i.pravatar.cc/150?u=david',
    company_email: 'demo@cxo.com',
    company_name: 'Acme Corp',
    company_logo: 'AC',
    logo_color: 'from-[#134e40] to-[#0eb59a]',
    value: '—',
    duration: '2 years',
    start_date: 'Feb 1, 2025',
    end_date: 'Feb 1, 2027',
    created_date: 'Jan 28, 2025',
    expires_at: null,
    signed_by_expert: true,
    signed_by_company: true,
    signature_expert: 'David Chen',
    signature_company: 'Acme Corp',
    signed_date: 'Feb 1, 2025',
    generated_by: 'ExigentCX Platform',
    pages: 4,
    file_size: '0.6 MB',
    urgency: null
  },
  {
    title: 'Engagement Agreement — Fractional CMO',
    type: 'Engagement Agreement',
    status: 'Signed',
    expert_email: 'sarah@example.com',
    expert_name: 'Sarah Jenkins',
    expert_title: 'Fractional CMO',
    expert_avatar: 'https://i.pravatar.cc/150?u=sarah',
    company_email: 'demo@cxo.com',
    company_name: 'BrandScale Pvt Ltd',
    company_logo: 'BS',
    logo_color: 'from-emerald-700 to-teal-500',
    value: '₹9,00,000',
    duration: '3 months',
    start_date: 'Mar 1, 2025',
    end_date: 'May 31, 2025',
    created_date: 'Feb 25, 2025',
    expires_at: null,
    signed_by_expert: true,
    signed_by_company: true,
    signature_expert: 'Sarah Jenkins',
    signature_company: 'Acme Corp',
    signed_date: 'Feb 28, 2025',
    generated_by: 'ExigentCX Platform',
    pages: 8,
    file_size: '1.1 MB',
    urgency: null
  },
  {
    title: 'Non-Disclosure Agreement — Sarah Jenkins',
    type: 'NDA',
    status: 'Signed',
    expert_email: 'sarah@example.com',
    expert_name: 'Sarah Jenkins',
    expert_title: 'Fractional CMO',
    expert_avatar: 'https://i.pravatar.cc/150?u=sarah',
    company_email: 'demo@cxo.com',
    company_name: 'BrandScale Pvt Ltd',
    company_logo: 'BS',
    logo_color: 'from-emerald-700 to-teal-500',
    value: '—',
    duration: '2 years',
    start_date: 'Feb 28, 2025',
    end_date: 'Feb 28, 2027',
    created_date: 'Feb 25, 2025',
    expires_at: null,
    signed_by_expert: true,
    signed_by_company: true,
    signature_expert: 'Sarah Jenkins',
    signature_company: 'Acme Corp',
    signed_date: 'Feb 28, 2025',
    generated_by: 'ExigentCX Platform',
    pages: 4,
    file_size: '0.6 MB',
    urgency: null
  },
  {
    title: 'Engagement Agreement — VP Engineering',
    type: 'Engagement Agreement',
    status: 'Under Review',
    expert_email: 'priya@example.com',
    expert_name: 'Priya Patel',
    expert_title: 'Fractional VP Engineering',
    expert_avatar: 'https://i.pravatar.cc/150?u=priya',
    company_email: 'demo@cxo.com',
    company_name: 'TechScale Ventures',
    company_logo: 'TV',
    logo_color: 'from-blue-700 to-blue-500',
    value: '₹7,20,000',
    duration: '4 months',
    start_date: 'May 1, 2025',
    end_date: 'Aug 31, 2025',
    created_date: 'Apr 20, 2025',
    expires_at: 'Apr 30, 2025',
    signed_by_expert: false,
    signed_by_company: false,
    signature_expert: null,
    signature_company: null,
    signed_date: null,
    generated_by: 'ExigentCX Platform',
    pages: 8,
    file_size: '1.0 MB',
    urgency: 'medium'
  },
  {
    title: 'Advisory Agreement — Interim COO',
    type: 'Advisory Agreement',
    status: 'Expired',
    expert_email: 'marcus@example.com',
    expert_name: 'Marcus Johnson',
    expert_title: 'Interim COO',
    expert_avatar: 'https://i.pravatar.cc/150?u=marcus',
    company_email: 'demo@cxo.com',
    company_name: 'OpsCo Industries',
    company_logo: 'OI',
    logo_color: 'from-gray-600 to-gray-400',
    value: '₹4,50,000',
    duration: '3 months',
    start_date: 'Nov 1, 2024',
    end_date: 'Jan 31, 2025',
    created_date: 'Oct 28, 2024',
    expires_at: 'Oct 30, 2024',
    signed_by_expert: false,
    signed_by_company: false,
    signature_expert: null,
    signature_company: null,
    signed_date: null,
    generated_by: 'ExigentCX Platform',
    pages: 6,
    file_size: '0.9 MB',
    urgency: null
  },

  // Registered User (suytripathi05@gmail.com) as Company & Expert
  {
    title: 'Engagement Agreement — Lead AI Engineer',
    type: 'Engagement Agreement',
    status: 'Pending Signature',
    expert_email: 'suytripathi05@gmail.com',
    expert_name: 'Suyash Tripathi',
    expert_title: 'Lead AI Engineer',
    expert_avatar: 'https://i.pravatar.cc/150?u=suyash',
    company_email: 'suytripathi05@gmail.com',
    company_name: 'fjknj',
    company_logo: 'FK',
    logo_color: 'from-emerald-700 to-teal-500',
    value: '₹10,00,000',
    duration: '6 months',
    start_date: 'Jul 1, 2026',
    end_date: 'Dec 31, 2026',
    created_date: 'Jun 13, 2026',
    expires_at: 'Jun 20, 2026',
    signed_by_expert: true,
    signed_by_company: false,
    signature_expert: 'Suyash Tripathi',
    signature_company: null,
    signed_date: null,
    generated_by: 'ExigentCX Platform',
    pages: 8,
    file_size: '1.4 MB',
    urgency: 'high'
  },
  {
    title: 'Non-Disclosure Agreement — Suyash Tripathi',
    type: 'NDA',
    status: 'Signed',
    expert_email: 'suytripathi05@gmail.com',
    expert_name: 'Suyash Tripathi',
    expert_title: 'Lead AI Engineer',
    expert_avatar: 'https://i.pravatar.cc/150?u=suyash',
    company_email: 'suytripathi05@gmail.com',
    company_name: 'fjknj',
    company_logo: 'FK',
    logo_color: 'from-emerald-700 to-teal-500',
    value: '—',
    duration: '2 years',
    start_date: 'Jun 13, 2026',
    end_date: 'Jun 13, 2028',
    created_date: 'Jun 13, 2026',
    expires_at: null,
    signed_by_expert: true,
    signed_by_company: true,
    signature_expert: 'Suyash Tripathi',
    signature_company: 'fjknj',
    signed_date: 'Jun 13, 2026',
    generated_by: 'ExigentCX Platform',
    pages: 4,
    file_size: '0.6 MB',
    urgency: null
  },
  {
    title: 'Advisory Agreement — Fractional CTO',
    type: 'Advisory Agreement',
    status: 'Under Review',
    expert_email: 'suytripathi05@gmail.com',
    expert_name: 'Suyash Tripathi',
    expert_title: 'Lead AI Engineer',
    expert_avatar: 'https://i.pravatar.cc/150?u=suyash',
    company_email: 'suytripathi05@gmail.com',
    company_name: 'fjknj',
    company_logo: 'FK',
    logo_color: 'from-[#134e40] to-slate-600',
    value: '₹5,00,000',
    duration: '3 months',
    start_date: 'Aug 1, 2026',
    end_date: 'Oct 31, 2026',
    created_date: 'Jun 14, 2026',
    expires_at: 'Jun 25, 2026',
    signed_by_expert: false,
    signed_by_company: false,
    signature_expert: null,
    signature_company: null,
    signed_date: null,
    generated_by: 'ExigentCX Platform',
    pages: 6,
    file_size: '0.8 MB',
    urgency: null
  }
];

async function seed() {
  console.log("=== SEEDING CONTRACTS TABLE ===");
  try {
    // Check connection/table existence
    const { error: checkError } = await supabaseAdmin
      .from("contracts")
      .select("id")
      .limit(1);

    if (checkError) {
      console.error("Error connecting to 'contracts' table. Have you run the SQL migration schema in the Supabase editor first?");
      console.error("Details:", checkError.message);
      return;
    }

    // Clean existing
    console.log("Deleting existing contract rows...");
    const { error: deleteError } = await supabaseAdmin
      .from("contracts")
      .delete()
      .neq("title", ""); // deletes all

    if (deleteError) {
      console.error("Error cleaning contracts table:", deleteError.message);
      return;
    }

    // Insert new
    console.log(`Inserting ${demoContracts.length} contract records...`);
    const { data, error: insertError } = await supabaseAdmin
      .from("contracts")
      .insert(demoContracts)
      .select();

    if (insertError) {
      console.error("Error inserting mock contracts:", insertError.message);
      return;
    }

    console.log("Seeding complete! Mapped row count:", data.length);
  } catch (err) {
    console.error("Seed failed with exception:", err);
  }
}

seed();
