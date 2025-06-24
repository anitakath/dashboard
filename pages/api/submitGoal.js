// pages/api/submitGoal.js
import { supabase } from "../../utils/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { id, title, description, target_date, created_at } = req.body;

  if (!id || !title || !target_date || !created_at) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { error } = await supabase.from("sports_goals").insert([
    { id, title, description, target_date, created_at },
  ]);

  if (error) {
    console.error("Insert error:", error.message);
    return res.status(500).json({ error: "Database insert failed" });
  }

  return res.status(200).json({ message: "Goal successfully saved" });
}
