// src/lib/stores/twilioVoiceStore.ts
import { writable } from 'svelte/store';
import { Device } from '@twilio/voice-sdk';

// Define the shape of our store's state
type VoiceStoreState = {
  isReady: boolean;
  onCall: boolean;
  error: string | null;
  device: Device | null;
  connection: any | null;
};

// Create the writable store with an initial state
const { subscribe, set, update } = writable<VoiceStoreState>({
  isReady: false,
  onCall: false,
  error: null,
  device: null,
  connection: null,
});

// --- Actions ---

const initDevice = async () => {
  try {
    const response = await fetch('/api/agent/get-token');
    const { token } = await response.json();

    const device = new Device(token, {
      logLevel: 1, // Use 1 for info, 0 for debug
      codecPreferences: ['opus', 'pcmu'],
    });

    device.on('ready', () => {
      console.log('Twilio device is ready, updating store...');
      update(state => ({ ...state, isReady: true, device }));
    });

    device.on('error', (error) => {
      console.error('Twilio Device Error:', error);
      update(state => ({ ...state, error: error.message }));
    });

    device.on('connect', (connection) => {
      update(state => ({ ...state, onCall: true, connection }));
    });

    device.on('disconnect', () => {
      update(state => ({ ...state, onCall: false, connection: null }));
    });

    device.register();

  } catch (err: any) {
    console.error(err);
    update(state => ({ ...state, error: 'Could not fetch token and initialize device.' }));
  }
};

const makeCall = async (phoneNumber: string) => {
  update(state => {
    if (!state.device) {
      console.error("Device not initialized.");
      return state;
    }
    state.device.connect({ params: { To: phoneNumber } });
    return state;
  });
};

const hangUp = () => {
  update(state => {
    if (state.device) {
      state.device.disconnectAll();
    }
    return { ...state, onCall: false };
  });
};

// Export the store and actions
export const twilioVoiceStore = {
  subscribe,
  initDevice,
  makeCall,
  hangUp,
};