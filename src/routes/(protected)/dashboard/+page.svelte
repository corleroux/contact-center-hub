<!-- src/routes/(protected)/dashboard/+page.svelte -->
<script lang="ts">
    import { page } from '$app/stores';
	import { env } from '$env/dynamic/private';
  
    // Type definition for our lead object
    type Lead = {
      lead_id: string;
      phone_number: string;
      first_name: string;
      last_name: string;
      status: string;
    };
  
    let currentLead: Lead | null = null;
    let isLoading = false;
    let statusMessage = 'Click "Get Next Lead" to begin.';
    let smsSent = false;
  
    const getNextLead = async () => {
      isLoading = true;
      smsSent = false; // Reset SMS status for the new lead
      statusMessage = 'Searching for next lead...';
      currentLead = null;
  
      const response = await fetch('/api/agent/get-next-lead', {
        method: 'POST'
      });
  
      isLoading = false;
  
      if (response.ok) {
        const leadData = await response.json();
        currentLead = leadData;
        statusMessage = 'Lead acquired. Ready to dial.';
      } else {
        const errorData = await response.json();
        statusMessage = `Error: ${errorData.message}`;
      }
    };
  
    const handleSendSms = async () => {
        if (!currentLead) return;

        isLoading = true; // Use the loading state to disable buttons
        statusMessage = `Sending SMS to ${currentLead.phone_number}...`;
        let leadPhoneNumber = currentLead.phone_number

        if(env.DEV_MODE == 'On') {
            leadPhoneNumber = env.TWILIO_TEST_PHONE_NUMBER;
        }

        console.log('Sending SMS to:', leadPhoneNumber)
        const response = await fetch('/api/agent/send-sms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                leadId: currentLead.lead_id,
                leadPhoneNumber: leadPhoneNumber
            })
        });

        const result = await response.json();

        if (response.ok) {
            statusMessage = `Success! SMS has been sent.`;
            smsSent = true;
            // Optionally, clear the lead card or automatically fetch the next one
            // For now, we'll just show the success state.
        } else {
            statusMessage = `Error: ${result.message}`;
        }
        isLoading = false;
    };

     const handleDial = () => {
      if (!currentLead) return;
      // We will integrate Twilio for this in a later task
      console.log(`Dialing ${currentLead.phone_number}...`);
      statusMessage = `Dialing ${currentLead.phone_number}...`;
    };
  </script>
  
  <h1>Agent Dashboard</h1>
  <p class="status-message">{statusMessage}</p>
  
  <div class="workspace">
      <div class="controls-panel">
          <h2>Controls</h2>
          <button on:click={getNextLead} disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Get Next Lead'}
          </button>
      </div>
  
      <div class="lead-display-card">
          <h2>Current Lead Information</h2>
          {#if currentLead}
              <div class="lead-details">
                  <p><strong>Name:</strong> {currentLead.first_name} {currentLead.last_name}</p>
                  <p><strong>Phone:</strong> {currentLead.phone_number}</p>
                  <p><strong>Status:</strong> <span class="status-tag">{currentLead.status}</span></p>
              </div>
              <div class="actions">
                <button class="dial-button" on:click={handleDial} disabled={isLoading}>Dial Customer</button>
                <button class="sms-button" on:click={handleSendSms} disabled={smsSent || isLoading}>
                    {smsSent ? 'SMS Sent ✔' : 'Send WhatsApp Link'}
                </button>
              </div>
          {:else}
              <p>No active lead. Please click "Get Next Lead".</p>
          {/if}
      </div>
  </div>
  
  <style>
    .status-message {
      margin-bottom: 1.5rem;
      font-style: italic;
      color: #555;
    }
    .workspace {
      display: grid;
      grid-template-columns: 250px 1fr;
      gap: 2rem;
    }
    .controls-panel, .lead-display-card {
      border: 1px solid #eee;
      border-radius: 8px;
      padding: 1.5rem;
    }
    .lead-details p {
      font-size: 1.2rem;
      margin: 0.5rem 0;
    }
    .status-tag {
      background-color: #ffc107;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-weight: bold;
    }
    .actions {
      margin-top: 1.5rem;
      display: flex;
      gap: 1rem;
    }
    .dial-button, .sms-button {
      padding: 0.8rem 1.5rem;
      font-size: 1rem;
      border: none;
      border-radius: 5px;
      color: white;
      cursor: pointer;
    }
    .dial-button { background-color: #28a745; }
    .sms-button { background-color: #007bff; }
    .sms-button:disabled { background-color: #6c757d; }
  </style>