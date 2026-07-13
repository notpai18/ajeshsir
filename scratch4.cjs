const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://qmldrssvbakgpdwmtirg.supabase.co', 'sb_publishable_IdmShADvlcjNTVnMAtN_hw_GeLZGd8C');

async function test() {
  const payload = {
    name: 'Test Debugger',
    email: 'test@portal.in',
    subject: 'Organic Chemistry',
    question: 'Test question to see what insert returns',
    is_answered: false
  };

  const { data, error } = await supabase
    .from('doubts')
    .insert(payload)
    .select()
    .single();
    
  console.log("INSERT RESULT:", JSON.stringify({ data, error }, null, 2));
}

test();
