// src/routes/api/agent/get-next-lead/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals: { supabase, getSession } }) => {
  const session = await getSession();

  if (!session) {
    return json({ message: 'Not authenticated.' }, { status: 401 });
  }

  const agentId = session.user.id;

  // Call the database function we created
  const { data: lead, error } = await supabase
    .rpc('get_and_lock_next_lead', { agent_id_input: agentId });

  if (error) {
    console.error('Error getting next lead:', error);
    return json({ message: 'Database error while fetching lead.' }, { status: 500 });
  }

  // The function returns an array; we want the first (and only) element
  const singleLead = Array.isArray(lead) ? lead[0] : null;

  if (!singleLead) {
    return json({ message: 'No new leads available.' }, { status: 404 });
  }

  return json(singleLead);
};