
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

  if (req.method === "POST") {
    const { data, error } = await supabaseServerClient
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
