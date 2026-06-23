import { supabaseAdmin } from "./supabaseAdmin.js";
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

/**
 * Creates and saves a notification in the database.
 * @param {string} userId - Target user ID (auth.users)
 * @param {string} title - Short headline
 * @param {string} description - Message body
 * @param {string} type - 'match' | 'milestone' | 'payment' | 'contract' | 'message' | 'system'
 * @param {object} metadata - Optional additional payload (e.g. redirect path)
 * @returns {object|null} - The created notification object, or null on error
 */
export const createNotification = async (userId, title, description, type, metadata = {}) => {
  if (userId === "00000000-0000-0000-0000-000000000000" || (userId && userId.startsWith("00000000-0000-0000-0000-"))) {
    try {
      const list = await readJsonNotifications();
      const newNotif = {
        id: "notif-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
        user_id: userId,
        title,
        description,
        type,
        metadata,
        is_read: false,
        created_at: new Date().toISOString()
      };
      list.unshift(newNotif);
      await writeJsonNotifications(list);
      return newNotif;
    } catch (err) {
      console.error("Error writing local notification:", err);
      return null;
    }
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("notifications")
      .insert([{ 
        user_id: userId, 
        title, 
        description, 
        type, 
        metadata 
      }])
      .select();

    if (error) {
      console.error("Failed to insert notification into database:", error);
      return null;
    }
    return data ? data[0] : null;
  } catch (error) {
    console.error("Exception in createNotification utility:", error);
    return null;
  }
};
