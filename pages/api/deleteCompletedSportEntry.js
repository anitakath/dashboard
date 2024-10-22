import { supabase } from "@/services/supabaseClient";
export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { title, id, userId } = req.body;

    console.log(title)

    try {
      const { data, error } = await supabase
        .from("sports")
        .delete()
        .eq("title", title)
        .eq("id", id);

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      // Optional: Hier kannst du auch eine Logik hinzufügen,
      // um sicherzustellen, dass nur der Benutzer mit userId löschen kann.

      return res.status(200).json({ message: "Eintrag erfolgreich gelöscht" });
    } catch (err) {
      console.error("Error deleting entry:", err.message);
      return res.status(500).json({ message: "Interner Serverfehler" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
