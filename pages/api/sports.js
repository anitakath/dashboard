/*import { supabase } from "@/services/supabaseClient";

export default async (req, res) => {


    const {data, error} = await supabase
        .from("sports")
        .select("*")
        .order('id', { ascending: false });

    res.status(200).json({ data });


}*/

/*
import { supabase } from "@/services/supabaseClient";

export default async (req, res) => {
  const { userId } = req.query; 

  // Hier kannst du die userId verwenden, um spezifische Daten zu laden
  const { data, error } = await supabase
    .from("sports")
    .select("*")
    .order("id", { ascending: false });

  res.status(200).json({ data });
};*/


import { supabase } from "@/services/supabaseClient";

export default async (req, res) => {
  const { userId } = req.query; 

  const { data, error } = await supabase
    .from("sports")
    .select("*")
    .eq("userId", userId)
    .order("id", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ data });
};