import { config } from 'dotenv';
config();

import { supabase } from './src/lib/supabase.ts';

async function test() {
  console.log("Testing insert without select...");
  try {
    const { error } = await supabase.from('doubts').insert({
      name: 'Test Student',
      email: 'test@portal.in',
      subject: 'Physical Chemistry',
      topic: 'Test Topic',
      question: '<strong>Test Doubt</strong><br/>This is a test doubt from the script.',
      status: 'pending'
    });
    
    if (error) {
       console.error("INSERT FAILED!", error);
    } else {
       console.log("INSERT SUCCESS!");
    }
  } catch (err) {
    console.error("CAUGHT FAILED!", err);
  }
}

test();
