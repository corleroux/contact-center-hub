// src/routes/api/agent/get-token/+server.ts
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import twilio from 'twilio';

const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

export async function GET({ locals: { getSession } }) {
  const session = await getSession();
  if (!session) {
    return json({ message: 'Not authenticated' }, { status: 401 });
  }

  // This identity can be anything unique to the user, like their email or ID.
  // It identifies this specific browser "device".
  const identity = session.user.email;

  // Create a new Access Token
  const accessToken = new AccessToken(
    env.TWILIO_ACCOUNT_SID,
    env.TWILIO_API_KEY_SID,
    env.TWILIO_API_KEY_SECRET,
    { identity: identity }
  );


  // Create a "grant" for the Voice service
  const voiceAppSid = (env.DEV_MODE === "On") ? env.TWILIO_APP_SID_LOCAL : env.TWILIO_APP_SID;
  const voiceGrant = new VoiceGrant({
    // The TwiML App SID tells Twilio which app to use for outgoing calls
    outgoingApplicationSid: voiceAppSid,
    // We can also allow incoming calls to this identity if we build that later
    incomingAllow: true,
  });

  // Add the grant to the token
  accessToken.addGrant(voiceGrant);

  // Serialize the token to a JWT and send it to the client
  return json({ token: accessToken.toJwt() });
}