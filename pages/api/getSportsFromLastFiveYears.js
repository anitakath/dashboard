
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

    console.log('MOIN')

    const { id, years } = req.body;

    console.log(id)

    try {

   
      const idDate = new Date(id);
      const month = String(idDate.getUTCMonth() + 1).padStart(2, '0');
      const day = String(idDate.getUTCDate()).padStart(2, '0');
    
      // Baue aus jedem Jahr ein Datum wie "2021-07-08"
      const dateStrings = years.map(y => `${y}-${month}-${day}`);
    
      // Finde das kleinste dieser Datumswerte
      const startDate = new Date(Math.min(...dateStrings.map(date => new Date(date).getTime()))).toISOString();
    
      console.log('Startdate aus id-Monat-Tag + Jahren:');
      console.log(startDate);

 
      console.log('Start dateee')
      console.log(startDate)

     

        // Erzeuge Ziel-Daten im Format "YYYY-MM-DD"
        const targetDates = years.map(year => `${year}-${month}-${day}`);

        // Baue OR-Query für Supabase
        const conditions = targetDates.map(date => `TO_CHAR(created_at, 'YYYY-MM-DD') = '${date}'`).join(' OR ');

  
  
  
      const { data, error } = await supabaseServerClient
        .from('sports')
        .select('*')
        .gte('created_at', startDate);
        //.or(conditions);
      
       
  
        console.log(data)
  
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Supabase query failed' });
      }
      console.log(data)
  
      return res.status(200).json({ data });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Server error' });
    }
  
  }


 
}
