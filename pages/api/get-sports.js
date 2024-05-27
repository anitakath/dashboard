

export default function handler(req, res) {
  const sports = [
    {
      name: "Figure Skating",
      entries: [
        { date: "2022-10-01", title: "great-practice", entry: "Had a great practice session today." },
        { date: "2022-10-02", title: "jumps-and-spins", entry: "Worked on my jumps and spins." },
      ],
    },
    {
      name: "Poledance",
      entries: [
        { date: "2022-10-01", title: "routines", entry: "Learned a new routine." },
        { date: "2022-10-03", title:"strengh", entry: "Practiced strength exercises." },
      ],
    },
    {
      name: "Yoga",
      entries: [
        { date: "2022-10-02", title: "relaxing", entry: "Relaxed with a yoga session." },
        { date: "2022-10-04", title: "breathing", entry: "Focused on breathing exercises." },
      ],
    },
  ];

  res.status(200).json({ sports });
}

/*
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  const { data: sports, error } = await supabase.from('sports').select('*');

  if (error) {
    return res.status(500).json({ error: 'An error occurred while fetching sports data.' });
  }

  res.status(200).json({ sports });
}
*/