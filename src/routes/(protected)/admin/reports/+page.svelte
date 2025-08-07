<!-- src/routes/(protected)/admin/reports/+page.svelte -->
<script lang="ts">
  import DateFilterForm from '$lib/components/DateFilterForm.svelte';
  import PerformanceReportTable from '$lib/components/PerformanceReportTable.svelte';
  import { goto } from '$app/navigation';

  export let data;

  // Reactive assignments to keep local state in sync with server data
  $: startDate = data.startDate;
  $: endDate = data.endDate;
  $: reportData = data.reportData || [];

  // This function now just handles navigation. The data loading is done in +page.server.ts
  function handleFilter(event: any) {
    const { startDate, endDate } = event.detail;
    goto(`/admin/reports?start=${startDate}&end=${endDate}`);
  }
</script>

<!-- UI SECTION (COMPLETELY REWRITTEN) -->
<div class="space-y-6">
  <h1 class="text-2xl font-bold text-gray-900">Agent Performance Report</h1>

  <DateFilterForm
    {startDate}
    {endDate}
    on:filter={handleFilter}
  />

  <PerformanceReportTable {reportData} />
</div>