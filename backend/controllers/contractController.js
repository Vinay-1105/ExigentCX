import { supabaseAdmin } from "../utils/supabaseAdmin.js";
import { createNotification } from "../utils/createNotification.js";

// helper to format date (e.g. "Jun 15, 2026")
function getFormattedDate() {
  const now = new Date();
  return now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

// Helper to look up user profiles to obtain user_ids for notifications
async function getUserIds(companyEmail, expertEmail) {
  let companyUserId = null;
  let expertUserId = null;

  try {
    if (companyEmail) {
      const { data: company } = await supabaseAdmin
        .from("company_applications")
        .select("user_id")
        .eq("admin_email", companyEmail)
        .maybeSingle();
      companyUserId = company?.user_id;
    }

    if (expertEmail) {
      const { data: expert } = await supabaseAdmin
        .from("expert_applications")
        .select("user_id")
        .eq("email", expertEmail)
        .maybeSingle();
      expertUserId = expert?.user_id;
    }
  } catch (err) {
    console.error("Error fetching user IDs for contract notifications:", err);
  }

  return { companyUserId, expertUserId };
}

// ================= GET CONTRACTS =================
export const getContracts = async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email) {
      return res.status(400).json({ error: "Email not found in token" });
    }

    // Fetch contracts matching either user's email
    const { data: contracts, error } = await supabaseAdmin
      .from("contracts")
      .select("*")
      .or(`company_email.eq.${email},expert_email.eq.${email}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching contracts:", error);
      return res.status(500).json({ error: "Failed to fetch contracts" });
    }

    res.json(contracts || []);
  } catch (err) {
    console.error("getContracts error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ================= SIGN CONTRACT =================
export const signContract = async (req, res) => {
  try {
    const email = req.user?.email;
    const { id } = req.params;
    const { signatureText } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email not found in token" });
    }
    if (!id) {
      return res.status(400).json({ error: "Contract ID is required" });
    }
    if (!signatureText || !signatureText.trim()) {
      return res.status(400).json({ error: "Signature text is required" });
    }

    // 1. Fetch current contract
    const { data: contract, error: fetchError } = await supabaseAdmin
      .from("contracts")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !contract) {
      console.error("Error fetching contract to sign:", fetchError);
      return res.status(404).json({ error: "Contract not found" });
    }

    // 2. Validate user identity
    const isExpert = contract.expert_email.toLowerCase() === email.toLowerCase();
    const isCompany = contract.company_email.toLowerCase() === email.toLowerCase();

    if (!isExpert && !isCompany) {
      return res.status(403).json({ error: "Unauthorized: You are not a party to this contract" });
    }

    // 3. Build update payload
    const updateData = {};
    if (isExpert) {
      updateData.signed_by_expert = true;
      updateData.signature_expert = signatureText;
    }
    if (isCompany) {
      updateData.signed_by_company = true;
      updateData.signature_company = signatureText;
    }

    // Check if fully signed
    const isFullySigned = 
      (isExpert && contract.signed_by_company) || 
      (isCompany && contract.signed_by_expert) || 
      (contract.signed_by_expert && contract.signed_by_company);

    if (isFullySigned) {
      updateData.status = "Signed";
      updateData.signed_date = getFormattedDate();
    } else {
      updateData.status = "Pending Signature";
    }

    // 4. Update DB
    const { data: updatedContract, error: updateError } = await supabaseAdmin
      .from("contracts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Error signing contract:", updateError);
      return res.status(500).json({ error: "Failed to apply signature to database" });
    }

    // 5. Send Platform Notifications
    const { companyUserId, expertUserId } = await getUserIds(contract.company_email, contract.expert_email);
    
    const notificationType = "contract";
    const metaPayload = { contractId: contract.id };

    if (isExpert) {
      // Notify Company that Expert signed
      if (companyUserId) {
        await createNotification(
          companyUserId,
          "Contract Signed by Expert",
          `Expert signed the "${contract.title}". Awaiting your signature.`,
          notificationType,
          { ...metaPayload, targetRole: "company" }
        );
      }
    }

    if (isCompany) {
      // Notify Expert that Company signed
      if (expertUserId) {
        await createNotification(
          expertUserId,
          "Contract Signed by Client",
          `Client signed the "${contract.title}". Awaiting your signature.`,
          notificationType,
          { ...metaPayload, targetRole: "expert" }
        );
      }
    }

    // If fully executed, notify both parties
    if (isFullySigned) {
      if (companyUserId) {
        await createNotification(
          companyUserId,
          "Contract Fully Executed",
          `Your agreement "${contract.title}" is now fully signed and active.`,
          notificationType,
          { ...metaPayload, targetRole: "company" }
        );
      }
      if (expertUserId) {
        await createNotification(
          expertUserId,
          "Contract Fully Executed",
          `Your agreement "${contract.title}" is now fully signed and active.`,
          notificationType,
          { ...metaPayload, targetRole: "expert" }
        );
      }
    }

    res.json(updatedContract);
  } catch (err) {
    console.error("signContract error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
