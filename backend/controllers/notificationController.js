import { supabaseAdmin } from "../utils/supabaseAdmin.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, "../data");
const jsonPath = path.join(dataDir, "notifications.json");

async function readJsonNotifications() {
  try {
    const content = await fs.readFile(jsonPath, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    return [];
  }
}

async function writeJsonNotifications(data) {
  try {
    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing notifications.json:", err);
  }
}

// Fetch notifications for the logged-in user
export const getNotifications = async (req, res) => {
  const userId = req.user?.id;
  const role = req.query.role || req.headers["x-user-role"];

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  if (userId === "00000000-0000-0000-0000-000000000000" || userId.startsWith("00000000-0000-0000-0000-")) {
    const list = await readJsonNotifications();
    
    // Filter by specific user ID, or generic mock ID
    let userFiltered = list.filter(n => n.user_id === userId || n.user_id === "00000000-0000-0000-0000-000000000000");

    // Filter by role if specified, or if mock ID maps to a role
    const activeRole = role || 
      (userId === "00000000-0000-0000-0000-000000000001" ? "company" : 
       userId === "00000000-0000-0000-0000-000000000002" ? "expert" : null);

    if (activeRole === "company") {
      userFiltered = userFiltered.filter(n => n.metadata?.targetRole !== "expert" && n.title !== "New Opportunity Invitation");
    } else if (activeRole === "expert") {
      userFiltered = userFiltered.filter(n => n.metadata?.targetRole !== "company");
    }

    return res.json(userFiltered);
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error query from Supabase:", error);
      throw error;
    }
    
    let filteredData = data || [];
    if (role === "company") {
      filteredData = filteredData.filter(n => n.metadata?.targetRole !== "expert" && n.title !== "New Opportunity Invitation");
    } else if (role === "expert") {
      filteredData = filteredData.filter(n => n.metadata?.targetRole !== "company");
    }

    res.json(filteredData);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to retrieve notifications" });
  }
};

// Mark a specific notification as read
export const markAsRead = async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId || !id) {
    return res.status(400).json({ error: "User ID and notification ID are required" });
  }

  if (userId === "00000000-0000-0000-0000-000000000000" || userId.startsWith("00000000-0000-0000-0000-")) {
    try {
      const list = await readJsonNotifications();
      let updatedNotif = null;
      const updatedList = list.map(n => {
        if (n.id === id) {
          updatedNotif = { ...n, is_read: true };
          return updatedNotif;
        }
        return n;
      });
      await writeJsonNotifications(updatedList);
      return res.json({ success: true, notification: updatedNotif });
    } catch (err) {
      console.error("Error marking local notification as read:", err);
      return res.status(500).json({ error: "Failed to update notification status" });
    }
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id)
      .eq("user_id", userId)
      .select();

    if (error) throw error;
    res.json({ success: true, notification: data ? data[0] : null });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Failed to update notification status" });
  }
};

// Mark all notifications as read for the current user
export const markAllAsRead = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  if (userId === "00000000-0000-0000-0000-000000000000" || userId.startsWith("00000000-0000-0000-0000-")) {
    try {
      const list = await readJsonNotifications();
      let count = 0;
      const updatedList = list.map(n => {
        const isMatch = n.user_id === userId || 
          (n.user_id === "00000000-0000-0000-0000-000000000000" && 
            ((userId === "00000000-0000-0000-0000-000000000001" && n.metadata?.targetRole !== "expert" && n.title !== "New Opportunity Invitation") ||
             (userId === "00000000-0000-0000-0000-000000000002" && n.metadata?.targetRole !== "company") ||
             (userId === "00000000-0000-0000-0000-000000000000")));
             
        if (isMatch && !n.is_read) {
          count++;
          return { ...n, is_read: true };
        }
        return n;
      });
      await writeJsonNotifications(updatedList);
      return res.json({ success: true, count });
    } catch (err) {
      console.error("Error marking all local notifications as read:", err);
      return res.status(500).json({ error: "Failed to update notifications" });
    }
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .select();

    if (error) throw error;
    res.json({ success: true, count: data ? data.length : 0 });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ error: "Failed to update notifications" });
  }
};
