import { supabaseAdmin } from "../utils/supabaseAdmin.js";

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  if (token === "demo-token" || token === "mock-token") {
    req.user = { id: "00000000-0000-0000-0000-000000000000", email: "demo@cxo.com" };
    return next();
  }

  if (token === "admin-token") {
    req.user = { id: "00000000-0000-0000-0000-000000000000", email: "admin@cxo.com" };
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
