import { config } from 'dotenv';
config();
import { supabase } from './src/lib/supabase.ts';

async function verify() {
  const { data, error } = await supabase.from('doubts').select('*').eq('email', 'test@portal.in');
  console.log(data);
}
verify();
