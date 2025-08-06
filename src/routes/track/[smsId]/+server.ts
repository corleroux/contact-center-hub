// src/routes/track/[smsId]/+server.ts
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// IMPORTANT: Replace this with your actual WhatsApp group invite link
const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/YourInviteCodeHere';

export const GET: RequestHandler = async ({ params, locals: { supabase } }) => {
  const { smsId } = params;

  if (!smsId) {
    // If no ID is provided, just go to the default group link
    throw redirect(307, WHATSAPP_GROUP_URL);
  }

  // Record the conversion event in our database
  await supabase.from('conversion_events').insert({
    sms_log_id: smsId,
  });

  // Now that we've logged the click, redirect the user to WhatsApp
  throw redirect(307, WHATSAPP_GROUP_URL);
};