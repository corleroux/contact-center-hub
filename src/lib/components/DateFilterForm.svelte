<!-- src/lib/components/DateFilterForm.svelte -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    export let startDate: string;
    export let endDate: string;
  
    const dispatch = createEventDispatcher();
  
    const handleFilter = () => {
      dispatch('filter', { startDate, endDate });
    };
  </script>
  
  <div class="rounded-lg border bg-gray-50 p-6 shadow-sm">
    <h2 class="text-lg font-semibold text-gray-800">Filter by Date</h2>
    <form class="mt-4 flex flex-wrap items-end gap-4" on:submit|preventDefault={handleFilter}>
      <div class="flex-grow">
        <label for="start-date" class="block text-sm font-medium text-gray-700">Start Date</label>
        <input id="start-date" type="date" bind:value={startDate} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
      </div>
      <div class="flex-grow">
        <label for="end-date" class="block text-sm font-medium text-gray-700">End Date</label>
        <input id="end-date" type="date" bind:value={endDate} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
      </div>
      <div class="pt-5">
          <button type="submit" class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
              Apply Filter
          </button>
      </div>
    </form>
  </div>