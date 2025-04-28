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

      console.log(entryId)

      const { data: deleteData, error: deleteError } = await supabase
        .from("sports_planned")
        .delete()
        .eq("entryId", entryId);

      if (deleteError) {
        return res.status(400).json({ error: deleteError.message });
      }
      return res.status(200).json({ data: deleteData });

    case "PUT": // Neue Methode zum Aktualisieren eines Eintrags
      console.log("Received PUT request with body:", req.body);
     
      const { id, ...updateFields } = req.body; // Extrahiere id und die restlichen Felder
      const { data: updateData, error: updateError } = await supabase
        .from("sports_planned")
        .update(updateFields)
        .eq("id", id); // Hier wird angenommen, dass 'id' der Primärschlüssel ist

      if (updateError) {
        return res.status(400).json({ error: updateError.message });
      }
      return res.status(200).json({ data: updateData });

    default:
    res.setHeader("Access-Control-Allow-Origin", "*"); // Erlaube alle Ursprünge (oder spezifische Domains)
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE"
    );
    res.setHeader("Allow", ["POST", "GET", "DELETE", "PUT"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
