<!-- src/routes/(protected)/admin/leads/+page.svelte -->
<script lang="ts">
  import LeadUploadForm from '$lib/components/LeadUploadForm.svelte';
  import LeadsTable from '$lib/components/LeadsTable.svelte';
  import { page } from '$app/stores';
  import { invalidateAll } from '$app/navigation';

  export let data;
  $: leads = data.leads || [];

  let isLoading = false;
  let feedbackMessage = '';

  const handleFileUpload = async (event: any) => {
    const { file } = event.detail;
    if (!file) {
      feedbackMessage = 'Error: Please select a file to upload.';
      return;
    }

    isLoading = true;
    feedbackMessage = 'Uploading and processing...';

    const formData = new FormData();
    formData.append('leadFile', file);

    const response = await fetch('/api/admin/upload-leads', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    isLoading = false;

    if (response.ok) {
      feedbackMessage = `Success: ${result.message}. Refreshing list...`;
      // Invalidate tells SvelteKit to re-run the load function for this page
      // to get the fresh data, which is better than a full page reload.
      await invalidateAll();
      feedbackMessage = `Success: ${result.message}. List has been updated.`;
    } else {
      feedbackMessage = `Error: ${result.message}`;
    }
  };
</script>

<!-- UI SECTION (COMPLETELY REWRITTEN) -->
<div class="space-y-6">
  <h1 class="text-2xl font-bold text-gray-900">Lead Management</h1>

  <LeadUploadForm {isLoading} {feedbackMessage} on:upload={handleFileUpload} />

  <LeadsTable {leads} />
</div>