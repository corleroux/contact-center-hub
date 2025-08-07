<script lang="ts">
    export let reportData: any[] = [];
  </script>
  
  <div class="rounded-lg border bg-white shadow-sm">
    <div class="p-6">
        <h2 class="text-lg font-semibold text-gray-800">Report Results</h2>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Agent Name</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">SMS Sent</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Conversions (Clicks)</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Conversion Rate</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          {#if reportData.length > 0}
            {#each reportData as row}
              <tr>
                <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{row.agent_name}</td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{row.sms_sent_count}</td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{row.total_conversions}</td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {((row.total_conversions / row.sms_sent_count) * 100 || 0).toFixed(2)}%
                </td>
              </tr>
            {/each}
          {:else}
            <tr>
              <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">No data found for the selected period.</td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </div>