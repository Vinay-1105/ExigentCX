import { supabaseAdmin } from './utils/supabaseAdmin.js';

async function run() {
  try {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
      console.error('Error fetching auth users:', error);
    } else {
      console.log('auth.users length:', users.length);
      if (users.length > 0) {
         console.log('users Sample:', JSON.stringify(users.map(u => ({ id: u.id, email: u.email, user_metadata: u.user_metadata, app_metadata: u.app_metadata })), null, 2));
      }
    }
  } catch(e) { console.error(e) }
}

run();
