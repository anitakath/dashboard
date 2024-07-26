import { supabase } from "@/services/supabaseClient";

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      // 1. send an object to the table
      const { data: insertData, error: insertError } = await supabase
        .from("sports_planned")
        .insert([req.body]);

      if (insertError) {
        return res.status(400).json({ error: insertError.message });
      }
      return res.status(200).json({ data: insertData });

      
    case "GET":
      // 2. get an object from the table
      const { data: selectData, error: selectError } = await supabase
        .from("sports_planned")
        .select("*");

      if (selectError) {
        return res.status(400).json({ error: selectError.message });
      }
      return res.status(200).json({ data: selectData });


    case "DELETE":
      // 3. delete the object in the table that corresponds to the specified parameter
      const { entryId } = req.body; 

      const { data: deleteData, error: deleteError } = await supabase
        .from("sports_planned")
        .delete()
        .eq("entryId", entryId);

      if (deleteError) {
        return res.status(400).json({ error: deleteError.message });
      }
      return res.status(200).json({ data: deleteData });

    default:
      res.setHeader("Allow", ["POST", "GET", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
