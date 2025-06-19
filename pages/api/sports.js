
//api/sports.js
import { createClient } from "@supabase/supabase-js";

export default async (req, res) => {

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
    const { data, error } = await supabaseServerClient.from("sports").insert([
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
    const { userId, year } = req.query;

    // Sicherstellen, dass das Jahr als Ganzzahl vorliegt
    const parsedYear = parseInt(year, 10);

    // Erstelle Start- und Enddatum des Jahres
    const startDate = `${parsedYear}-01-01T00:00:00.000Z`;
    const endDate = `${parsedYear + 1}-01-01T00:00:00.000Z`;


    const { data, error } = await supabaseServerClient

      .from("sports")
      .select("*")
      .eq("userId", userId)
      .gte("created_at", startDate)
      .lt("created_at", endDate)
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
