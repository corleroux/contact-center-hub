<!-- src/lib/components/AgentControls.svelte -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    export let isLoading: boolean = false;
    const dispatch = createEventDispatcher();
  </script>
  
  <div class="rounded-lg border bg-white p-6 shadow-sm">
    <h2 class="text-lg font-semibold text-gray-800">Controls</h2>
    <div class="mt-4">
      <button
        on:click={() => dispatch('getnextlead')}
        disabled={isLoading}
        class="w-full rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800 disabled:opacity-50"
      >
        {isLoading ? 'Searching...' : 'Get Next Lead'}
      </button>
    </div>
  </div>