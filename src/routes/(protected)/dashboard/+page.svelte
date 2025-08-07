<!-- src/routes/(protected)/dashboard/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import AgentControls from '$lib/components/AgentControls.svelte';
  import LeadDisplayCard from '$lib/components/LeadDisplayCard.svelte';
  import { twilioVoiceStore } from '$lib/stores/twilioVoiceStore';

  const voiceState = twilioVoiceStore;

  type Lead = {
    id: string; phone_number: string; first_name: string;
    last_name: string; status: string;
  };

  let currentLead: Lead | null = null;
  let isLoading = false;
  let statusMessage = 'Initializing communication device...';
  let smsSent = false;

  // --- NEW: A single computed variable for the entire UI disabled state ---
  $: isUIDisabled = isLoading || !$voiceState.isReady || $voiceState.onCall;

  onMount(() => {
    twilioVoiceStore.initDevice();
  });

  $: {
    if ($voiceState.error) {
      statusMessage = `Error: ${$voiceState.error}`;
    } else if ($voiceState.onCall) {
      statusMessage = 'On call...';
    } else if (currentLead) {
      statusMessage = 'Lead acquired. Ready to dial.';
    } else if ($voiceState.isReady) {
      statusMessage = 'Device ready. Click "Get Next Lead" to begin.';
    }
  }

  const getNextLead = async () => {
    isLoading = true;
    smsSent = false;
    currentLead = null;
    const response = await fetch('/api/agent/get-next-lead', { method: 'POST' });
    if (response.ok) {
      currentLead = await response.json();
    } else {
      statusMessage = `Error: ${(await response.json()).message}`;
    }
    isLoading = false;
  };

  const handleSendSms = async () => {
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
    if (response.ok) {
      statusMessage = `Success! SMS has been sent.`;
      smsSent = true;
      if (currentLead) currentLead.status = 'Converted';
    } else {
      statusMessage = `Error: ${result.message}`;
    }
    isLoading = false;
  };

  const handleDial = () => {
    if (!currentLead) return;
    twilioVoiceStore.makeCall(currentLead.phone_number);
  };

  const handleHangUp = () => {
    twilioVoiceStore.hangUp();
  };
</script>

<!-- UI SECTION (UPDATED) -->
<div class="space-y-4">
    <div>
        <h1 class="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
        <p class="mt-1 text-sm text-gray-500">{statusMessage}</p>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="lg:col-span-1">
            <!-- --- CORRECTED USAGE --- -->
            <AgentControls
                isLoading={isLoading}
                disabled={isUIDisabled}
                on:getnextlead={getNextLead}
            />
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
             <!-- --- CORRECTED USAGE --- -->
            <LeadDisplayCard
                lead={currentLead}
                isLoading={isUIDisabled}
                {smsSent}
                on:dial={handleDial}
                on:sendsms={handleSendSms}
            />
        </div>
    </div>
</div>