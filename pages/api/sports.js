

import { supabase } from "@/services/supabaseClient";

export default async (req, res) => {
  if (req.method === "POST") {
    const {
      entryId,
      name,
      title,
      entry,
      label,
      userId,
      entryPath,
      duration,
      icon,
      created_at,
      provider
    } = req.body;

    // Füge den neuen Sport zur Supabase-Datenbank hinzu
    const { data, error } = await supabase.from("sports").insert([
      {
        entryId,
        name,
        title,
        entry,
        label,
        userId,
        entryPath,
        duration,
        icon,
        created_at,
        provider
      },
    ]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ data });
  }

  // Handle GET requests (optional)
  if (req.method === "GET") {
    const { userId } = req.query;
    const { data, error } = await supabase
      .from("sports")
      .select("*")
      .eq("userId", userId)
      .order("id", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ data });
  }

  // Handle unsupported methods
  res.setHeader("Allow", ["POST", "GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
};
