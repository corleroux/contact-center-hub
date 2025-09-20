<!-- src/lib/components/dashboard/agent/TodaysCallbacks.svelte -->
<script lang="ts">
    type Callback = {
      id: string;
      first_name: string;
      last_name: string;
      callback_at: string; // ISO string format
    };
    export let callbacks: Callback[] = [];
  </script>
  
  <div class="mt-8">
    <h2 class="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
      Today's Callbacks ({callbacks.length})
    </h2>
    {#if callbacks.length > 0}
      <ul class="space-y-1">
        {#each callbacks as callback (callback.id)}
          <li class="p-2 rounded-md hover:bg-gray-100 cursor-pointer">
            <p class="text-sm font-medium text-gray-800">
              {callback.first_name} {callback.last_name}
            </p>
            <p class="text-xs text-gray-500">
              {new Date(callback.callback_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
            </p>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="px-2 text-sm text-gray-500">No callbacks scheduled for today.</p>
    {/if}
  </div>