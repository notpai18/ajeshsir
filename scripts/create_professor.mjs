/**
 * create_professor.mjs
 * ─────────────────────────────────────────────────────────────
 * Creates the default professor (admin) account using the
 * Supabase Admin API (service_role key).
 *
 * Usage:
 *   node scripts/create_professor.mjs
 *
 * Prerequisites:
 *   - VITE_SUPABASE_URL must be set in .env
 *   - SUPABASE_SERVICE_ROLE_KEY must be set in .env
 *     (find it in Supabase Dashboard → Settings → API → service_role)
 *
 * The script is idempotent — safe to run multiple times.
 * If the professor account already exists it will print a notice
 * and exit cleanly without creating a duplicate.
 * ─────────────────────────────────────────────────────────────
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ── Load .env manually (no external dotenv dependency needed) ──
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env');

function loadEnv(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // .env not found — rely on real environment variables
  }
}

loadEnv(envPath);

// ── Configuration ──────────────────────────────────────────────
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Professor credentials — change these before first run!
const PROFESSOR_EMAIL    = process.env.PROFESSOR_EMAIL    || 'professor@ajeshsir.com';
const PROFESSOR_PASSWORD = process.env.PROFESSOR_PASSWORD || 'AjeshSir@2026!';
const PROFESSOR_NAME     = process.env.PROFESSOR_NAME     || 'Prof. Ajesh';

// ── Validation ─────────────────────────────────────────────────
if (!SUPABASE_URL) {
  console.error('❌  VITE_SUPABASE_URL is not set. Add it to your .env file.');
  process.exit(1);
}

if (!SERVICE_ROLE_KEY) {
  console.error([
    '❌  SUPABASE_SERVICE_ROLE_KEY is not set.',
    '',
    '   How to find it:',
    '   1. Open https://supabase.com/dashboard/project/_/settings/api',
    '   2. Copy the "service_role" secret key (NOT the anon key)',
    '   3. Add it to your .env file:',
    '      SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...',
    '',
    '   ⚠️  Never commit the service_role key to git.',
  ].join('\n'));
  process.exit(1);
}

// ── Supabase Admin Client ──────────────────────────────────────
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// ── Main ───────────────────────────────────────────────────────
async function main() {
  console.log('');
  console.log('Chemistry Educator Portal — Professor Account Setup');
  console.log('═══════════════════════════════════════════════════');
  console.log(`  Supabase URL : ${SUPABASE_URL}`);
  console.log(`  Email        : ${PROFESSOR_EMAIL}`);
  console.log(`  Display Name : ${PROFESSOR_NAME}`);
  console.log('');

  // Step 1: Check if user already exists
  const { data: existing, error: listError } =
    await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });

  if (listError) {
    console.error('❌  Failed to list existing users:', listError.message);
    process.exit(1);
  }

  const alreadyExists = existing?.users?.find(
    (u) => u.email?.toLowerCase() === PROFESSOR_EMAIL.toLowerCase()
  );

  if (alreadyExists) {
    console.log(`ℹ️   Professor account already exists (id: ${alreadyExists.id})`);
    console.log('');
    console.log('Checking profile role…');

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, display_name')
      .eq('id', alreadyExists.id)
      .single();

    if (profile) {
      console.log(`  Profile role : ${profile.role}`);
      if (profile.role !== 'professor') {
        await supabase
          .from('profiles')
          .update({ role: 'professor', display_name: PROFESSOR_NAME })
          .eq('id', alreadyExists.id);
        console.log('✅  Role upgraded to professor.');
      } else {
        console.log('✅  Profile role is already "professor". Nothing to do.');
      }
    } else {
      // Profile missing — insert it
      await supabase.from('profiles').insert({
        id: alreadyExists.id,
        role: 'professor',
        display_name: PROFESSOR_NAME,
      });
      console.log('✅  Missing profile created with professor role.');
    }

    console.log('');
    console.log('Done.');
    return;
  }

  // Step 2: Create the auth user
  console.log('Creating auth user…');
  const { data: created, error: createError } =
    await supabase.auth.admin.createUser({
      email: PROFESSOR_EMAIL,
      password: PROFESSOR_PASSWORD,
      email_confirm: true, // skip email verification
      user_metadata: {
        role: 'professor',
        display_name: PROFESSOR_NAME,
      },
    });

  if (createError) {
    console.error('❌  Failed to create auth user:', createError.message);
    process.exit(1);
  }

  const userId = created.user.id;
  console.log(`✅  Auth user created (id: ${userId})`);

  // Step 3: Upsert the profile row (the trigger should auto-create it,
  // but we upsert to be safe and ensure role = 'professor').
  console.log('Upserting profile with role = professor…');
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        role: 'professor',
        display_name: PROFESSOR_NAME,
      },
      { onConflict: 'id' }
    );

  if (profileError) {
    console.error('❌  Failed to upsert profile:', profileError.message);
    console.error('    The auth user was created. Manually set role in Supabase → Table Editor → profiles.');
    process.exit(1);
  }

  console.log('✅  Profile row upserted with role = "professor"');
  console.log('');
  console.log('═══════════════════════════════════════════════════');
  console.log('🎉  Professor account is ready!');
  console.log('');
  console.log('  Login with:');
  console.log(`    Email    : ${PROFESSOR_EMAIL}`);
  console.log(`    Password : ${PROFESSOR_PASSWORD}`);
  console.log('');
  console.log('  ⚠️  Change the password after first login.');
  console.log('═══════════════════════════════════════════════════');
  console.log('');
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
