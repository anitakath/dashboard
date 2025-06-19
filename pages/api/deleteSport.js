// pages/api/deleteSport.js
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {

  const supabaseServerClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 
    {
      global: {
        headers: {
          Authorization: req.headers.authorization,
        },
      },
    }
  )


  if (req.method === "DELETE") {
    const { sportName, userId } = req.body;

    try {
      const { data, error } = await supabaseServerClient
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
