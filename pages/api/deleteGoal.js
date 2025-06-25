import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Only DELETE requests allowed' });
  }

  const { goal_id } = req.body;


  console.log(goal_id)

  if (!goal_id) {
    return res.status(400).json({ error: 'Missing goal id' });
  }

  try {
    const { error } = await supabase
      .from('sports_goals')
      .delete()
      .eq('goal_id', goal_id);

    if (error) throw error;

    return res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
