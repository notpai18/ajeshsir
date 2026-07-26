import { config } from 'dotenv';
config();
import { supabase } from './src/lib/supabase.ts';

async function test() {
  await supabase.from('doubts').insert({
    name: 'Test Student Approved',
    email: 'test_approved@portal.in',
    subject: 'Physical Chemistry',
    topic: 'Test Topic',
    question: 'Test Doubt Approved',
    status: 'approved'
  });
  
  const { data } = await supabase.from('doubts').select('*').eq('email', 'test_approved@portal.in');
  console.log("Approved query:", data);
}
test();
