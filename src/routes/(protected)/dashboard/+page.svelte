<script lang="ts">
  import AgentControls from '$lib/components/AgentControls.svelte';
  import LeadDisplayCard from '$lib/components/LeadDisplayCard.svelte';

  // Define the Lead type again for this page's logic
  type Lead = {
    id: string; phone_number: string; first_name: string;
    last_name: string; status: string;
  };

  let currentLead: Lead | null = null;
  let isLoading = false;
  let statusMessage = 'Click "Get Next Lead" to begin.';
  let smsSent = false;

  // --- LOGIC FUNCTIONS (UNCHANGED CORE LOGIC) ---

  const getNextLead = async () => {
    isLoading = true;
    smsSent = false;
    statusMessage = 'Searching for next lead...';
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
    if (!currentLead) return;
    isLoading = true;
    statusMessage = `Sending SMS to ${currentLead.phone_number}...`;

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
      if (currentLead) currentLead.status = 'Converted'; // Update status visually
    } else {
      statusMessage = `Error: ${result.message}`;
    }
  };

  const handleDial = () => {
    if (!currentLead) return;
    // In a real integration, this would use a WebRTC library or trigger a softphone
    console.log(`Dialing ${currentLead.phone_number}...`);
    statusMessage = `Dialing ${currentLead.phone_number}...`;
  };
</script>

<!-- UI SECTION (COMPLETELY REWRITTEN) -->
<div class="space-y-4">
    <div>
        <h1 class="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
        <p class="mt-1 text-sm text-gray-500">{statusMessage}</p>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Left Panel for Controls -->
        <div class="lg:col-span-1">
            <AgentControls {isLoading} on:getnextlead={getNextLead} />
        </div>

        <!-- Right Panel for Lead Info -->
        <div class="lg:col-span-2">
            <LeadDisplayCard
                lead={currentLead}
                {isLoading}
                {smsSent}
                on:dial={handleDial}
                on:sendsms={handleSendSms}
            />
        </div>
    </div>
</div>