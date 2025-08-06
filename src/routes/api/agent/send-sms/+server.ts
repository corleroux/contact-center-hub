// src/routes/api/agent/send-sms/+server.ts
import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';
import Twilio from 'twilio';

export async function POST({ request, locals: { getSession } }) {
  const session = await getSession();
  if (!session) {
    return json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { leadId, leadPhoneNumber } = await request.json();
  if (!leadId || !leadPhoneNumber) {
    return json({ message: 'Lead ID and phone number are required' }, { status: 400 });
  }

  const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  const { data: smsLog, error: logError } = await supabaseAdmin
    .from('sms_logs')
    .insert({
      lead_id: leadId,
      agent_id: session.user.id,
      unique_link_url: 'pending',
    })
    .select()
    .single();

  if (logError || !smsLog) {
    console.error('Error creating SMS log:', logError);
    return json({ message: 'Could not create SMS log' }, { status: 500 });
  }

  const uniqueLink = `${env.APP_BASE_URL}/track/${smsLog.id}`;

  await supabaseAdmin
    .from('sms_logs')
    .update({ unique_link_url: uniqueLink })
    .eq('id', smsLog.id);

  // --- START: NEW DEV MODE LOGIC ---
  let recipientPhoneNumber: string;

  if (env.DEV_MODE === "On") {
    console.log("DEV MODE is ON. Routing SMS to test phone number.");
    recipientPhoneNumber = env.TWILIO_TEST_PHONE_NUMBER;
  } else {
    recipientPhoneNumber = leadPhoneNumber;
  }

  if (!recipientPhoneNumber) {
      return json({ message: 'Recipient phone number could not be determined. Check DEV_MODE configuration.'}, { status: 500 });
  }
  // --- END: NEW DEV MODE LOGIC ---

  const twilioClient = Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
  const messageBody = `Hello! Please join our WhatsApp group with this link: ${uniqueLink}`;

  try {
    await twilioClient.messages.create({
      body: messageBody,
      from: env.TWILIO_PHONE_NUMBER,
      // Use the determined phone number
      to: recipientPhoneNumber,
    });
  } catch (twilioError: any) {
    console.error('Twilio Error:', twilioError);
    return json({ message: `Failed to send SMS: ${twilioError.message}` }, { status: 500 });
  }

  await supabaseAdmin
    .from('leads')
    .update({ status: 'Converted' })
    .eq('id', leadId);

  return json({ message: 'SMS sent successfully!' });
}