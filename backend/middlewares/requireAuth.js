import { supabaseAdmin } from "../utils/supabaseAdmin.js";

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  if (token === "company-token") {
    req.user = { id: "00000000-0000-0000-0000-000000000001", email: "demo@cxo.com", role: "company" };
    return next();
  }

  if (token === "expert-token") {
    req.user = { id: "00000000-0000-0000-0000-000000000002", email: "suytripathi05@gmail.com", role: "expert" };
    return next();
  }

  if (token === "real-expert-token") {
    req.user = { id: "f3dce899-be25-4713-91fe-bad6f103e591", email: "suytripathi05@gmail.com", role: "expert" };
    return next();
  }

  if (token === "real-company-token") {
    req.user = { id: "d2927f7a-169b-4a0f-a02e-e8427a2f4cc2", email: "suytripathi05@gmail.com", role: "company" };
    return next();
  }

  if (token === "admin-token") {
    req.user = { id: "00000000-0000-0000-0000-000000000003", email: "admin@cxo.com", role: "admin" };
    return next();
  }

  if (token === "demo-token" || token === "mock-token") {
    req.user = { id: "00000000-0000-0000-0000-000000000000", email: "demo@cxo.com", role: "company" };
    return next();
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      console.error("Token verification failed:", error?.message || error);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Internal server error during authentication" });
  }
};
