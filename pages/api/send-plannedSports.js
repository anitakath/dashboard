
import { supabase } from "@/services/supabaseClient";


export default async function handler(req, res) {
  if (req.method === "POST") {
    const { data, error } = await supabase
      .from("sports_planned")
      .insert([req.body]);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ data });
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
