import { supabase } from "@/services/supabaseClient";

export default async (req, res) => {


    const {data, error} = await supabase
        .from("sports")
        .select("*")
        .order('id', { ascending: false });

    res.status(200).json({ data });


}