<!-- src/routes/(protected)/admin/leads/+page.svelte -->
<script lang="ts">
    import { page } from '$app/stores';
    export let data; // Data from our load function
  
    let leads = data?.leads || [];
    let fileInput: HTMLInputElement;
    let feedbackMessage = '';
    let isLoading = false;
  
    const handleFileUpload = async () => {
      const file = fileInput.files?.[0];
      if (!file) {
        feedbackMessage = 'Error: Please select a file to upload.';
        return;
      }
  
      isLoading = true;
      feedbackMessage = 'Uploading and processing...';
  
      const formData = new FormData();
      formData.append('leadFile', file);
  
      // Call our dedicated API endpoint to handle the file
      const response = await fetch('/api/admin/upload-leads', {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
      isLoading = false;
  
      if (response.ok) {
        feedbackMessage = `Success: ${result.message}. Refreshing list...`;
        // Refresh the page to show the new leads
        window.location.reload();
      } else {
        feedbackMessage = `Error: ${result.message}`;
      }
    };
  </script>
  
  <h1>Lead Management</h1>
  
  <div class="card">
    <h2>Upload New Leads</h2>
    <p>Upload a CSV file with the columns: <strong>phone_number, first_name, last_name</strong>.</p>
    <form on:submit|preventDefault={handleFileUpload}>
      <input type="file" bind:this={fileInput} accept=".csv" required />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Upload Leads'}
      </button>
    </form>
     {#if feedbackMessage}
      <p class="feedback">{feedbackMessage}</p>
    {/if}
  </div>
  
  <div class="card">
      <h2>Existing Leads</h2>
      <table>
          <thead>
              <tr>
                  <th>Phone Number</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Status</th>
                  <th>Last Attempt</th>
              </tr>
          </thead>
          <tbody>
              {#each leads as lead}
                  <tr>
                      <td>{lead.phone_number}</td>
                      <td>{lead.first_name}</td>
                      <td>{lead.last_name}</td>
                      <td>{lead.status}</td>
                      <td>{lead.last_attempted_at ? new Date(lead.last_attempted_at).toLocaleString() : 'N/A'}</td>
                  </tr>
              {/each}
          </tbody>
      </table>
  </div>
  
  
  <style>
    .card { border: 1px solid #eee; border-radius: 8px; padding: 1.5rem; margin-top: 1.5rem; }
    form { display: flex; align-items: center; gap: 1rem; }
    .feedback { margin-top: 1rem; }
    table { width: 100%; border-collapse: collapse; margin-top: 1rem;}
    th, td { padding: 0.75rem; border-bottom: 1px solid #eee; text-align: left; }
  </style>