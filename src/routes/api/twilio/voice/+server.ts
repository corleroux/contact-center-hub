// src/routes/api/twilio/voice/+server.ts
import { text } from '@sveltejs/kit';
import twilio from 'twilio';
import { env } from '$env/dynamic/private';

const { VoiceResponse } = twilio.twiml;

export async function POST({ request }) {
  const formData = await request.formData();
  const phoneNumberToDial = formData.get('To') as string;

  const response = new VoiceResponse();

  // The <Dial> verb tells Twilio to connect the current call to another number.
  const dial = response.dial({
    // This is the phone number that will show up on the customer's caller ID.
    // For the MVP, we use our single Twilio number. For the CLI rotation requirement,
    // logic would be added here to select a number from a list.
    callerId: env.TWILIO_PHONE_NUMBER,
  });

  // Dial the actual customer's phone number.
  dial.number(phoneNumberToDial);

  // Return the TwiML as an XML string.
  return text(response.toString(), {
      headers: { 'Content-Type': 'text/xml' }
  });
}