// src/lib/stores/twilioVoiceStore.ts
import { writable, get } from 'svelte/store'; // --- IMPORT 'get' ---
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
const { subscribe, set } = store; // --- REMOVED 'update' ---

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

    // --- START OF MODIFIED SECTION ---
    device.on('ready', () => {
      console.log('Twilio device is ready, setting store state...');
      const currentState = get(store); // Get the current state
      set({ ...currentState, isReady: true, device }); // Set the new state
    });

    device.on('error', (error) => {
      console.error('Twilio Device Error:', error);
      const currentState = get(store);
      set({ ...currentState, error: error.message });
    });

    device.on('connect', (connection) => {
      const currentState = get(store);
      set({ ...currentState, onCall: true, connection });
    });

    device.on('disconnect', () => {
      const currentState = get(store);
      set({ ...currentState, onCall: false, connection: null });
    });
    // --- END OF MODIFIED SECTION ---

    device.register();

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
  // We still need to manually set onCall to false here
  set({ ...currentState, onCall: false });
};

export const twilioVoiceStore = {
  subscribe,
  initDevice,
  makeCall,
  hangUp,
};