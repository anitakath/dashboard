import { supabase } from "@/services/supabaseClient";
import { createClient } from "@supabase/supabase-js";


export default async function handler(req, res) {

  console.log('Moincito')

  console.log("📩 API request received:", req.method);


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


  switch (req.method) {
    case "POST":
      // 1. send an object to the table
      const { data: insertData, error: insertError } = await supabaseServerClient
        .from("sports_planned")
        .insert([req.body]);

      if (insertError) {
        return res.status(400).json({ error: insertError.message });
      }
      return res.status(200).json({ data: insertData });

      case "GET":
        // 2. fetch all entries for a specific userId and year
        const { userId, year } = req.query;
  
        if (!userId || !year) {
          return res.status(400).json({ error: "Missing userId or year parameter" });
        }
  
        const startOfYear = `${year}-01-01T00:00:00+00:00`;
        const endOfYear = `${year}-12-31T23:59:59+00:00`;
  
        const { data: getData, error: getError } = await supabaseServerClient
          .from("sports_planned")
          .select("*")
          .eq("userId", userId) // ← hier muss der Spaltenname exakt stimmen!
          .gte("created_at", startOfYear)
          .lte("created_at", endOfYear);
  
        if (getError) {
          console.error("Supabase GET error:", getError);
          return res.status(400).json({ error: getError.message });
        }
  
        return res.status(200).json({ data: getData });  

    case "DELETE":
      // 3. delete the object in the table that corresponds to the specified parameter
      const { entryId } = req.body;

      console.log(entryId)

      const { data: deleteData, error: deleteError } = await supabaseServerClient
        .from("sports_planned")
        .delete()
        .eq("entryId", entryId);

      if (deleteError) {
        return res.status(400).json({ error: deleteError.message });
      }
      return res.status(200).json({ data: deleteData });

      case "PUT":
        try {
          const { id, ...updateFields } = req.body;
      
          console.log("🔄 PUT request received");
          console.log("🔎 Updating entry with ID:", id);
          console.log("🛠 Update fields:", updateFields);
      
          if (!id) {
            return res.status(400).json({ error: "Missing ID for update." });
          }
      
          const { data: updatedData, error: updateError } = await supabaseServerClient
            .from("sports_planned")
            .update(updateFields)
            .eq("id", id)
            .select();
      
          if (updateError) {
            console.error("❌ Update error:", updateError.message);
            return res.status(400).json({ error: updateError.message });
          }
      
          console.log("✅ Update successful:", updatedData);
          return res.status(200).json({ data: updatedData });
        } catch (error) {
          console.error("❗ Unexpected error during PUT:", error.message);
          return res.status(500).json({ error: "Internal server error." });
        }
      
  }
}
