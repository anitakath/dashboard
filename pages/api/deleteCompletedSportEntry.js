
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
    const { title, id, userId } = req.body;
    try {
      const { data, error } = await supabaseServerClient
        .from("sports")
        .delete()
        .eq("title", title)
        .eq("id", id);

      if (error) {
        return res.status(400).json({ message: error.message });
      }

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
