// src/routes/(protected)/admin/users/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  // Fetch all users and their assigned roles
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select(`
      id,
      full_name,
      email,
      user_roles (
        roles (
          name
        )
      )
    `);

  // Fetch all available roles
  const { data: roles, error: rolesError } = await supabase
    .from('roles')
    .select('*');

  if (usersError || rolesError) {
    console.error("Error fetching user data:", usersError || rolesError);
    return { users: [], roles: [] };
  }

  return { users, roles };
};