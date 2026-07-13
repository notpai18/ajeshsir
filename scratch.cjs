const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://qmldrssvbakgpdwmtirg.supabase.co', 'sb_publishable_IdmShADvlcjNTVnMAtN_hw_GeLZGd8C');

async function test() {
  const { data, error } = await supabase.from('doubts').select('*').order('created_at', { ascending: false }).limit(5);
  console.log(JSON.stringify({ data, error }, null, 2));
}
test();
