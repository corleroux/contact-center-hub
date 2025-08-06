// src/routes/(protected)/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { getSession } }) => {
    const session = await getSession();

  // if the user is not logged in, redirect to the login page
  if (!session) {
    throw redirect(303, '/login');
  }

  // we can pass the session down to the layout and page if needed
  return {
    session,
  };
};