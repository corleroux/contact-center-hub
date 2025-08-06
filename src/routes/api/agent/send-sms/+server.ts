// src/routes/api/agent/send-sms/+server.ts
import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';
import Twilio from 'twilio';

// This is the base URL of our deployed application.
// For local testing, it's our localhost address.
// For production, you must change this to your Vercel URL.
const BASE_URL = env.APP_BASE_URL;

export async function POST({ request, locals: { getSession } }) {
  const session = await getSession();
  if (!session) {
    return json({ message: 'Not authenticated' }, { status: 401 });
  }

  let { leadId, leadPhoneNumber } = await request.json();
  if (!leadId || !leadPhoneNumber) {
    return json({ message: 'Lead ID and phone number are required' }, { status: 400 });
  }

  // Use the Admin client to interact with the database securely
  const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  // 1. Log the SMS record to our database to get a unique ID
  const { data: smsLog, error: logError } = await supabaseAdmin
    .from('sms_logs')
    .insert({
      lead_id: leadId,
      agent_id: session.user.id,
      unique_link_url: 'pending', // Placeholder
    })
    .select()
    .single();

  if (logError || !smsLog) {
    console.error('Error creating SMS log:', logError);
    return json({ message: 'Could not create SMS log' }, { status: 500 });
  }

  // 2. Construct the unique trackable link using the new smsLog.id
  const uniqueLink = `${BASE_URL}/track/${smsLog.id}`;

  // 3. Update the sms_log record with the real link
  await supabaseAdmin
    .from('sms_logs')
    .update({ unique_link_url: uniqueLink })
    .eq('id', smsLog.id);

  // 4. Send the SMS via Twilio
  const twilioClient = Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
  const messageBody = `Hello! Please join our WhatsApp group with this link: ${uniqueLink}`;

  try {
    if(env.DEV_MODE == 'true') {
        leadPhoneNumber = env.TWILIO_TEST_PHONE_NUMBER;
    }
    await twilioClient.messages.create({
      body: messageBody,
      from: env.TWILIO_PHONE_NUMBER,
      to: leadPhoneNumber,
    });
  } catch (twilioError: any) {
    console.error('Twilio Error:', twilioError);
    return json({ message: `Failed to send SMS: ${twilioError.message}` }, { status: 500 });
  }

  // 5. Finally, update the lead's status to 'Converted'
  await supabaseAdmin
    .from('leads')
    .update({ status: 'Converted' })
    .eq('id', leadId);

  return json({ message: 'SMS sent successfully!' });
}