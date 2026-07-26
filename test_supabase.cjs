const { createClient } = require('@supabase/supabase-js');
try { createClient("undefined", "test"); } catch(e) { console.log("undefined =>", e.message); }
try { createClient("", "test"); } catch(e) { console.log("empty =>", e.message); }
