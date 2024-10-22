// pages/api/deleteSport.js
import { supabase } from "@/services/supabaseClient";


export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { sportName, userId } = req.body;

    try {
      const { data, error } = await supabase
        .from("sports")
        .delete()
        .match({ name: sportName, userId });

      if (error) throw error;

      return res.status(200).json({ message: "Erfolgreich gelöscht", data });
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
      return res.status(500).json({ error: "Fehler beim Löschen" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
