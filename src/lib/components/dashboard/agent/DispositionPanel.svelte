<!-- src/lib/components/dashboard/agent/DispositionPanel.svelte -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    // Define possible outcomes for the dropdown
    const callOutcomes = [
      'Converted',
      'No Answer',
      'Call Back Later',
      'Not Interested',
      'Wrong Number',
    ];
  
    let selectedOutcome = '';
    let notes = '';
    let followUpDate: string | null = null;
  
    const dispatch = createEventDispatcher();
  
    function handleSubmit() {
      dispatch('submit', {
        outcome: selectedOutcome,
        notes: notes,
        followUpDate: followUpDate,
      });
  
      // Optionally reset the form after submission
      selectedOutcome = '';
      notes = '';
      followUpDate = null;
    }
  </script>
  
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Disposition & Notes</h3>
  
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <!-- Outcome Dropdown -->
      <div>
        <label for="outcome" class="block text-sm font-medium text-gray-700">Outcome</label>
        <select
          id="outcome"
          bind:value={selectedOutcome}
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="" disabled>Select an outcome...</option>
          {#each callOutcomes as outcome}
            <option value={outcome}>{outcome}</option>
          {/each}
        </select>
      </div>
  
      <!-- Notes Field -->
      <div>
        <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          id="notes"
          bind:value={notes}
          rows="4"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Add call notes here..."
        ></textarea>
      </div>
  
      <!-- Follow-Up Field -->
      <div>
          <label for="follow-up" class="block text-sm font-medium text-gray-700">Schedule Follow-Up</label>
          <input
              type="datetime-local"
              id="follow-up"
              bind:value={followUpDate}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
      </div>
  
      <!-- Submit Button (Optional, can be part of a larger workflow) -->
      <div class="pt-2">
          <button
              type="submit"
              class="w-full justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700"
          >
              Save Disposition
          </button>
      </div>
    </form>
  </div>