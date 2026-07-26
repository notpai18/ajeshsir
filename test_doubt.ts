import { config } from 'dotenv';
config();

import { submitDoubt } from './src/services/doubtsService.ts';

async function test() {
  console.log("Testing submitDoubt...");
  try {
    const doubt = await submitDoubt({
      name: 'Test Student',
      email: 'test@portal.in',
      subject: 'Physical Chemistry',
      topic: 'Test Topic',
      question: '<strong>Test Doubt</strong><br/>This is a test doubt from the script.',
      status: 'pending'
    });
    console.log("SUCCESS! Inserted doubt:", doubt);
  } catch (err) {
    console.error("FAILED!", err);
  }
}

test();
