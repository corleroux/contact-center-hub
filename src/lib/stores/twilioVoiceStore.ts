// src/lib/stores/twilioVoiceStore.ts
import { writable, get } from 'svelte/store';
import { Device } from '@twilio/voice-sdk';

type VoiceStoreState = {
  isReady: boolean;
  onCall: boolean;
  error: string | null;
  device: Device | null;
  connection: any | null;
};

const store = writable<VoiceStoreState>({
  isReady: false,
  onCall: false,
  error: null,
  device: null,
  connection: null,
});
const { subscribe, set } = store;

// --- Actions ---

const initDevice = async () => {
  try {
    const response = await fetch('/api/agent/get-token');
    if (!response.ok) {
        throw new Error('Failed to fetch token');
    }
    const { token } = await response.json();

    const device = new Device(token, {
      logLevel: 1,
      codecPreferences: ['opus', 'pcmu'],
    });

    const setReadyState = () => {
        const currentState = get(store);
        if (!currentState.isReady) { // Prevent this from running multiple times
            console.log('Twilio device is registered, setting store state...');
            set({ ...currentState, isReady: true, device });
        }
    };

    // --- START OF MODIFIED SECTION ---
    // Listen for the 'registered' event, which we see in the logs.
    device.on('registered', setReadyState);
    // --- END OF MODIFIED SECTION ---


    device.on('error', (error) => {
      console.error('Twilio Device Error:', error);
      const currentState = get(store);
      set({ ...currentState, error: error.message, isReady: false }); // Also set ready to false on error
    });

    device.on('connect', (connection) => {
      const currentState = get(store);
      set({ ...currentState, onCall: true, connection });
    });

    device.on('disconnect', () => {
      const currentState = get(store);
      set({ ...currentState, onCall: false, connection: null });
    });

    await device.register();

    // --- NEW: Defensive check for race conditions ---
    // If the device is already registered by the time we get here,
    // manually call our ready state function.
    if (device.status() === 'registered') {
        setReadyState();
    }

  } catch (err: any) {
    console.error(err);
    const currentState = get(store);
    set({ ...currentState, error: 'Could not fetch token and initialize device.' });
  }
};

const makeCall = async (phoneNumber: string) => {
  const currentState = get(store);
  if (!currentState.device) {
    console.error("Device not initialized.");
    return;
  }
  currentState.device.connect({ params: { To: phoneNumber } });
};

const hangUp = () => {
  const currentState = get(store);
  if (currentState.device) {
    currentState.device.disconnectAll();
  }
  set({ ...currentState, onCall: false });
};

export const twilioVoiceStore = {
  subscribe,
  initDevice,
  makeCall,
  hangUp,
};