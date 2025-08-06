<!-- src/routes/(protected)/admin/reports/+page.svelte -->
<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
  
    export let data; // Data from our load function
  
    let startDate = data.startDate;
    let endDate = data.endDate;
  
    const handleFilter = () => {
      // Reload the page with new query parameters for the dates
      goto(`/admin/reports?start=${startDate}&end=${endDate}`);
    };
  </script>
  
  <h1>Agent Performance Report</h1>
  
  <div class="card filter-bar">
    <h2>Filter by Date</h2>
    <form class="date-filters" on:submit|preventDefault={handleFilter}>
      <label for="start-date">Start Date</label>
      <input type="date" id="start-date" bind:value={startDate} />
      <label for="end-date">End Date</label>
      <input type="date" id="end-date" bind:value={endDate} />
      <button type="submit">Apply Filter</button>
    </form>
  </div>
  
  <div class="card">
    <h2>Report Results</h2>
    {#if data.reportData && data.reportData.length > 0}
      <table>
        <thead>
          <tr>
            <th>Agent Name</th>
            <th>SMS Sent</th>
            <th>Conversions (Clicks)</th>
            <th>Conversion Rate</th>
          </tr>
        </thead>
        <tbody>
          {#each data?.reportData as row}
            <tr>
              <td>{row.agent_name}</td>
              <td>{row.sms_sent_count}</td>
              <td>{row.total_conversions}</td>
              <td>{((row.total_conversions / row.sms_sent_count) * 100).toFixed(2)}%</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <p>No data found for the selected period. Try sending some SMS messages or adjusting the date range.</p>
    {/if}
  </div>
  
  <style>
    .card { border: 1px solid #eee; border-radius: 8px; padding: 1.5rem; margin-top: 1.5rem; }
    .filter-bar { background-color: #f8f9fa; }
    .date-filters { display: flex; align-items: center; gap: 1rem; }
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { padding: 0.75rem; border-bottom: 1px solid #eee; text-align: left; }
  </style>