<!-- src/lib/components/layout/FooterActions.svelte -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    export let disabled: boolean;
    export let smsSent: boolean;
  
    const dispatch = createEventDispatcher();
  
    function sendSms() {
      dispatch('sendsms');
    }
  </script>
  
  <div class="flex items-center justify-between w-full">
    <div>
      <h3 class="text-sm font-medium text-gray-500">Agent Workflow Triggers</h3>
    </div>
    <div class="flex items-center gap-x-3">
      <!-- These buttons are placeholders for future functionality -->
      <!-- <button
        {disabled}
        class="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        Update CRM
      </button> -->
      <button
        {disabled}
        class="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        Transfer
      </button>
  
      <!-- This is our primary action button -->
      <!-- <button
        on:click={sendSms}
        disabled={disabled || smsSent}
        class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {#if smsSent}
          SMS Sent ✔
        {:else}
          Send SMS
        {/if}
      </button> -->
    </div>
  </div>