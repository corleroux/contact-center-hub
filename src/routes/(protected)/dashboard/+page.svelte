<!-- src/routes/(protected)/dashboard/+page.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  // We will create these new components in the next steps
  // import AgentControls from '$lib/components/AgentControls.svelte';
  import LeadDisplayCard from '$lib/components/LeadDisplayCard.svelte';
  import { twilioVoiceStore } from '$lib/stores/twilioVoiceStore';
  import SidebarNav from '$lib/components/layout/SidebarNav.svelte';
  import CallControls from '$lib/components/dashboard/agent/CallControls.svelte';
  import AgentMetrics from '$lib/components/dashboard/agent/AgentMetrics.svelte';
  import DispositionPanel from '$lib/components/dashboard/agent/DispositionPanel.svelte';
  import FooterActions from '$lib/components/layout/FooterActions.svelte';
  import CallScript from '$lib/components/dashboard/agent/CallScript.svelte';
  import TipsSection from '$lib/components/dashboard/agent/TipsSection.svelte';
  import TodaysCallbacks from '$lib/components/dashboard/agent/TodaysCallbacks.svelte';

  const voiceState = twilioVoiceStore;

  type Lead = {
    id: string; phone_number: string; first_name: string;
    last_name: string; status: string;
  };

  let currentLead: Lead | null = null;
  let isLoading = false;
  let statusMessage = 'Initializing communication device...';
  let smsSent = false;

  $: isUIDisabled = isLoading || !$voiceState.isReady || $voiceState.onCall;
  $: todaysCallbacks = $page.data.todaysCallbacks || [];

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

  // Add this new function inside the <script> tag
  const handleGetAndDial = async () => {
      await getNextLead();
      // The getNextLead function sets the currentLead, so we add a check here.
      if (currentLead) {
          handleDial();
      }
  };

// src/routes/(protected)/dashboard/+page.svelte

const handleDisposition = async (event: CustomEvent) => {
    if (!currentLead) return;

    isLoading = true; // Use loading state to disable UI
    statusMessage = "Saving disposition...";

    const response = await fetch('/api/agent/disposition-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            leadId: currentLead.id,
            ...event.detail // Pass outcome, notes, followUpDate
        })
    });

    if (response.ok) {
        statusMessage = 'Disposition saved. Ready for next lead.';
        currentLead = null; // Clear the lead from the UI
    } else {
        const errorData = await response.json();
        statusMessage = `Error: ${errorData.message}`;
    }
    isLoading = false;
};
</script>

<!-- NEW TAILWIND CSS LAYOUT -->
<div class="h-full w-full bg-gray-50 grid grid-rows-[1fr_auto] grid-cols-12 gap-6 p-6">

<!-- 1. Left Sidebar Navigation -->
<aside class="col-span-2 bg-white rounded-lg border border-gray-200 p-4">
  <SidebarNav />
  <TodaysCallbacks callbacks={todaysCallbacks} />
</aside>

<!-- 2. Main Interaction Panel -->
<main class="col-span-7 flex flex-col gap-6">
  <LeadDisplayCard
      lead={currentLead}
  />
  <!-- These components only show when a lead is active -->
  {#if currentLead}
    <CallScript />
    <TipsSection />
    <DispositionPanel on:submit={handleDisposition} />
  {/if}
</main>

<!-- 3. Right Sidebar Controls -->
<aside class="col-span-3 flex flex-col gap-6">
    <CallControls
      onCall={$voiceState.onCall}
      disabled={isUIDisabled}
      on:click={ $voiceState.onCall ? handleHangUp : handleGetAndDial }
    />
    <AgentMetrics />
  </aside>

      
  <!-- 4. Footer Actions -->
  <footer class="col-span-12 bg-white rounded-lg border border-gray-200 p-4 flex items-center">
    <FooterActions
      disabled={!currentLead || isUIDisabled}
      {smsSent}
      on:sendsms={handleSendSms}
    />
  </footer>

</div>