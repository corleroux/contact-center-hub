<!-- src/lib/components/dashboard/agent/CallControls.svelte -->
<script lang="ts">
    export let onCall: boolean;
    export let disabled: boolean;
  
    // Placeholder for call timer
    let callDuration = '00:00';
  </script>
  
  <div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
    {#if onCall}
      <!-- In-Call Controls -->
      <div class="flex flex-col items-center">
        <p class="text-2xl font-mono text-gray-800">{callDuration}</p>
        <p class="text-sm text-gray-500 mb-4">In Call</p>
        <div class="grid grid-cols-3 gap-2 w-full mb-4">
          <button class="p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors" title="Mute (coming soon)">
            <!-- Mute Icon Placeholder -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clip-rule="evenodd" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l-4-4m0 4l4-4" /></svg>
          </button>
          <button class="p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors" title="Keypad (coming soon)">
            <!-- Keypad Icon Placeholder -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <button class="p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors" title="Transfer (coming soon)">
             <!-- Transfer Icon Placeholder -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>
        <button
          on:click
          class="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700"
        >
          Hang Up
        </button>
      </div>
    {:else}
      <!-- Idle State Control -->
      <button
        on:click
        {disabled}
        class="w-full rounded-md bg-indigo-600 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Get Next Lead & Start Call
      </button>
    {/if}
  </div>