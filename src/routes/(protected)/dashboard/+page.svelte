<!-- src/routes/(protected)/dashboard/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import AgentControls from '$lib/components/AgentControls.svelte';
  import LeadDisplayCard from '$lib/components/LeadDisplayCard.svelte';
  // --- NEW: Import the Twilio Voice Store ---
  import { twilioVoiceStore } from '$lib/stores/twilioVoiceStore';

  // Subscribe to the store to get reactive state updates
  const voiceState = twilioVoiceStore;

  type Lead = {
    id: string; phone_number: string; first_name: string;
    last_name: string; status: string;
  };

  let currentLead: Lead | null = null;
  let isLoading = false;
  let statusMessage = 'Initializing communication device...'; // Updated initial message
  let smsSent = false;

  // --- NEW: Initialize the Twilio device when the component mounts ---
  onMount(() => {
    twilioVoiceStore.initDevice();
  });

  // --- NEW: A reactive statement to update the status message based on voice state ---
  $: {
    if ($voiceState.error) {
      statusMessage = `Error: ${$voiceState.error}`;
    } else if ($voiceState.onCall) {
      statusMessage = 'On call...';
    } else if ($voiceState.isReady) {
      statusMessage = 'Device ready. Click "Get Next Lead" to begin.';
    }
  }

  const getNextLead = async () => {
    // ... (This function remains unchanged)
    isLoading = true;
    smsSent = false;
    currentLead = null;
    const response = await fetch('/api/agent/get-next-lead', { method: 'POST' });
    isLoading = false;
    if (response.ok) {
      currentLead = await response.json();
      statusMessage = 'Lead acquired. Ready to dial.';
    } else {
      statusMessage = `Error: ${(await response.json()).message}`;
    }
  };

  const handleSendSms = async () => {
    // ... (This function remains unchanged)
    if (!currentLead) return;
    isLoading = true;
    const response = await fetch('/api/agent/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leadId: currentLead.id,
        leadPhoneNumber: currentLead.phone_number
      })
    });
    const result = await response.json();
    isLoading = false;
    if (response.ok) {
      statusMessage = `Success! SMS has been sent.`;
      smsSent = true;
      if (currentLead) currentLead.status = 'Converted';
    } else {
      statusMessage = `Error: ${result.message}`;
    }
  };

  // --- UPDATED: handleDial now uses our store ---
  const handleDial = () => {
    if (!currentLead || !$voiceState.isReady) return;
    statusMessage = `Dialing ${currentLead.phone_number}...`;
    twilioVoiceStore.makeCall(currentLead.phone_number);
  };

  // --- NEW: A function to hang up the call ---
  const handleHangUp = () => {
    twilioVoiceStore.hangUp();
  };
</script>

<!-- UI SECTION -->
<div class="space-y-4">
    <div>
        <h1 class="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
        <p class="mt-1 text-sm text-gray-500">{statusMessage}</p>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="lg:col-span-1">
            <!-- --- NEW: Pass the voice ready state to controls --- -->
            <AgentControls
                isLoading={isLoading || !$voiceState.isReady}
                on:getnextlead={getNextLead}
            />
             <!-- --- NEW: Add a Hang Up button that is only visible during a call --- -->
            {#if $voiceState.onCall}
                <div class="mt-6 rounded-lg border bg-white p-6 shadow-sm">
                    <h2 class="text-lg font-semibold text-gray-800">Call Active</h2>
                    <button on:click={handleHangUp} class="mt-4 w-full rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700">
                        Hang Up
                    </button>
                </div>
            {/if}
        </div>

        <div class="lg:col-span-2">
            <!-- --- NEW: Disable dial button if voice is not ready or a call is active --- -->
            <LeadDisplayCard
                lead={currentLead}
                isLoading={isLoading || !$voiceState.isReady || $voiceState.onCall}
                {smsSent}
                on:dial={handleDial}
                on:sendsms={handleSendSms}
            />
        </div>
    </div>
</div>