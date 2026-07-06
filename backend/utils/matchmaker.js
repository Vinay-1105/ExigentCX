import dotenv from "dotenv";
dotenv.config();
import { HfInference } from "@huggingface/inference";
import { supabaseAdmin } from "./supabaseAdmin.js";

const hfToken = process.env.VITE_HUGGINGFACE_API_KEY || process.env.HUGGINGFACE_API_KEY;
const hf = hfToken ? new HfInference(hfToken) : null;

// ================= GENERATE TEXT EMBEDDING =================
export async function generateEmbedding(text) {
  if (!hf) {
    console.warn("Hugging Face API key is not configured.");
    return null;
  }
  try {
    const response = await hf.featureExtraction({
      model: "BAAI/bge-large-en-v1.5",
      inputs: text,
    });

    if (Array.isArray(response)) {
      const flat = response.flat(Infinity);
      if (flat.length === 1024) {
        return flat;
      }
      console.warn(`Embedding length mismatch: expected 1024, got ${flat.length}`);
    }
    return null;
  } catch (err) {
    console.error("Error generating embedding from Hugging Face:", err.message);
    return null;
  }
}

// ================= COSINE SIMILARITY IN JS =================
export function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ================= CONSTRUCT TEXT REPRESENTATIONS =================

export function getExpertTextRepresentation(expert) {
  return [
    `Role: ${expert.current_role || ""}`,
    `Headline: ${expert.headline || ""}`,
    `Primary Domain: ${expert.primary_domain || ""}`,
    `Skills: ${expert.key_skills || ""}`,
    `Tools: ${expert.tools_technologies || ""}`,
    `Industries: ${Array.isArray(expert.industries) ? expert.industries.join(", ") : (expert.industries || "")}`,
    `Services: ${expert.services_offered || ""}`,
    `Experience: ${expert.years_experience ? expert.years_experience + " years" : ""}`
  ].filter(line => {
    const val = line.split(": ")[1];
    return val && val.trim() !== "";
  }).join("\n");
}

export function getRequirementTextRepresentation(req) {
  return [
    `Role Title: ${req.role_title || ""}`,
    `Engagement Type: ${req.engagement_type || ""}`,
    `Required Skills: ${Array.isArray(req.skills) ? req.skills.join(", ") : (req.skills || "")}`,
    `Preferred Industries: ${Array.isArray(req.industries) ? req.industries.join(", ") : (req.industries || "")}`,
    `Business Problems: ${req.business_problem_text || ""}`,
    `Location: ${req.location || ""}`,
    `Commitment: ${req.commitment || ""}`
  ].filter(line => {
    const val = line.split(": ")[1];
    return val && val.trim() !== "";
  }).join("\n");
}

// ================= SYNCHRONIZE EMBEDDINGS TO DB =================

export async function syncExpertEmbedding(expertId, expertData) {
  try {
    const text = getExpertTextRepresentation(expertData);
    if (!text.trim()) return null;

    const embedding = await generateEmbedding(text);
    if (embedding) {
      const { error } = await supabaseAdmin
        .from("expert_applications")
        .update({ embedding })
        .eq("id", expertId);
      
      if (error) {
        console.error(`Error updating embedding for expert ${expertId}:`, error);
      } else {
        console.log(`Successfully generated and stored embedding for expert ${expertId}`);
      }
      return embedding;
    }
  } catch (err) {
    console.error("syncExpertEmbedding error:", err);
  }
  return null;
}

export async function syncRequirementEmbedding(reqId, reqData) {
  try {
    const text = getRequirementTextRepresentation(reqData);
    if (!text.trim()) return null;

    const embedding = await generateEmbedding(text);
    if (embedding) {
      const { error } = await supabaseAdmin
        .from("company_requirements")
        .update({ embedding })
        .eq("id", reqId);
      
      if (error) {
        console.error(`Error updating embedding for requirement ${reqId}:`, error);
      } else {
        console.log(`Successfully generated and stored embedding for requirement ${reqId}`);
      }
      return embedding;
    }
  } catch (err) {
    console.error("syncRequirementEmbedding error:", err);
  }
  return null;
}

// ================= FALLBACK KEYWORD MATCHMAKING =================

export function computeKeywordMatchScore(expert, req) {
  let score = 72; // Baseline score

  // 1. Skill overlap matching
  const reqSkills = Array.isArray(req.skills) 
    ? req.skills 
    : (req.skills ? req.skills.split(",").map(s => s.trim()) : []);
  
  const expertSkills = expert.key_skills 
    ? expert.key_skills.split(",").map(s => s.trim().toLowerCase()) 
    : [];

  if (reqSkills.length > 0) {
    let matched = 0;
    reqSkills.forEach(s => {
      if (expertSkills.includes(s.toLowerCase())) {
        matched++;
      }
    });
    const skillRatio = matched / reqSkills.length;
    score += skillRatio * 18; // Up to 18 points
  }

  // 2. Domain & Role Title matching
  const title = (req.role_title || "").toLowerCase();
  const domain = (expert.primary_domain || "").toLowerCase();
  const role = (expert.current_role || "").toLowerCase();

  if (domain && title.includes(domain)) {
    score += 5;
  }
  if (role && (title.includes(role) || role.includes(title))) {
    score += 5;
  }

  // Cap score between 60% and 98%
  return Math.min(98, Math.max(60, Math.round(score)));
}
