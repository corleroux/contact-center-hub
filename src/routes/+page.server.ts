// src/routes/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { getSession } }) => {
  const session = await getSession();

  if (session) {
    // User is logged in, redirect to their dashboard
    throw redirect(303, '/dashboard');
  } else {
    // User is not logged in, redirect to the login page
    throw redirect(303, '/login');
  }
};