<!-- src/lib/components/LeadDisplayCard.svelte -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    // Define the shape of a lead for type safety
    type Lead = {
      id: string;
      phone_number: string;
      first_name: string;
      last_name: string;
      status: string;
    };
  
    // Props to receive data and state from the parent
    export let lead: Lead | null = null;
    export let isLoading: boolean = false;
    export let smsSent: boolean = false;
  
    const dispatch = createEventDispatcher();
  </script>
  
  <div class="rounded-lg border bg-white p-6 shadow-sm">
    <h2 class="text-lg font-semibold text-gray-800">Current Lead Information</h2>
    {#if lead}
      <div class="mt-4 space-y-2">
        <p><strong>Name:</strong> {lead.first_name} {lead.last_name}</p>
        <p><strong>Phone:</strong> {lead.phone_number}</p>
        <p>
          <strong>Status:</strong>
          <span class="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            {lead.status}
          </span>
        </p>
      </div>
      <div class="mt-6 flex space-x-4 border-t pt-6">
        <button
          on:click={() => dispatch('dial')}
          disabled={isLoading}
          class="flex-1 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50"
        >
          Dial Customer
        </button>
        <button
          on:click={() => dispatch('sendsms')}
          disabled={isLoading || smsSent}
          class="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-400"
        >
          {smsSent ? 'SMS Sent ✔' : 'Send WhatsApp Link'}
        </button>
      </div>
    {:else}
      <div class="mt-4 rounded-md border-2 border-dashed border-gray-300 p-8 text-center">
        <p class="text-gray-500">No active lead.</p>
        <p class="text-sm text-gray-400">Please use the controls to get the next lead.</p>
      </div>
    {/if}
  </div>