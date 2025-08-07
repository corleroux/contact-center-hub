<!-- src/lib/components/LeadsTable.svelte -->
<script lang="ts">
    export let leads: any[] = [];
  </script>
  
  <div class="rounded-lg border bg-white shadow-sm">
    <div class="p-6">
      <h2 class="text-lg font-semibold text-gray-800">Existing Leads</h2>
      <p class="mt-1 text-sm text-gray-600">Showing the 100 most recently added leads.</p>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Phone Number</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Last Attempt</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          {#if leads.length > 0}
            {#each leads as lead}
              <tr>
                <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{lead.phone_number}</td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{lead.first_name} {lead.last_name}</td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  <span class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    {lead.status}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {lead.last_attempted_at ? new Date(lead.last_attempted_at).toLocaleString() : 'N/A'}
                </td>
              </tr>
            {/each}
          {:else}
            <tr>
              <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">No leads found.</td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </div>