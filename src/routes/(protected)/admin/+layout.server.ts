// src/routes/(protected)/admin/+layout.server.ts
import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase, getSession } }) => {
  const session = await getSession();

  // Our base protected layout already handles this, but it's good practice
  if (!session) {
    throw redirect(303, '/login');
  }

  // Fetch the user's roles from our database
  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', session.user.id);

  // Check if the user has the 'Admin' role
  const isAdmin = userRoles?.some(role => role.roles.name === 'Admin');

  if (!isAdmin) {
    // If not an admin, show a 403 Forbidden error
    throw error(403, 'Forbidden: You do not have access to this page.');
  }

  return { session };
};