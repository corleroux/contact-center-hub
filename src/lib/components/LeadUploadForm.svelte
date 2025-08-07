<!-- src/lib/components/LeadUploadForm.svelte -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    export let isLoading = false;
    export let feedbackMessage = '';
  
    let fileInput: HTMLInputElement;
    const dispatch = createEventDispatcher();
  
    const handleUpload = () => {
      const file = fileInput.files?.[0];
      if (file && !isLoading) {
        dispatch('upload', { file });
      }
    };
  </script>
  
  <div class="rounded-lg border bg-white p-6 shadow-sm">
    <h2 class="text-lg font-semibold text-gray-800">Upload New Leads</h2>
    <p class="mt-1 text-sm text-gray-600">
      Upload a CSV file with the columns: <strong>phone_number, first_name, last_name</strong>.
    </p>
    <form class="mt-4 flex items-start gap-4" on:submit|preventDefault={handleUpload}>
      <div class="flex-grow">
          <label for="file-upload" class="sr-only">Choose file</label>
          <input
            id="file-upload"
            type="file"
            bind:this={fileInput}
            accept=".csv"
            required
            class="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
          />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Upload'}
      </button>
    </form>
    {#if feedbackMessage}
      <p class="mt-3 text-sm text-gray-600">{feedbackMessage}</p>
    {/if}
  </div>