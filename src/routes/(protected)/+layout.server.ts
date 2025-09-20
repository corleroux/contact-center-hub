// src/routes/(protected)/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase, getSession } }) => {
  const session = await getSession();

  if (!session) {
    throw redirect(303, '/login');
  }

  // Fetch user roles (existing code)
  const { data: userRolesData } = await supabase
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', session.user.id);
  const userRoles = userRolesData?.map(role => role.roles.name) || [];

  // --- NEW ---
  // Fetch today's scheduled callbacks for the logged-in agent
  const { data: todaysCallbacks } = await supabase
    .rpc('get_todays_callbacks', { agent_id_input: session.user.id });
  // --- END NEW ---

  // Pass all data to the layout and its pages
  return {
    session,
    userRoles,
    todaysCallbacks: todaysCallbacks || [], // Ensure we always pass an array
  };
};