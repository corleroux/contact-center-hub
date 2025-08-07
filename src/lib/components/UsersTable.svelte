<!-- src/lib/components/UsersTable.svelte -->
<script lang="ts">
    export let users: any[] = [];
  </script>
  
  <div class="rounded-lg border bg-white shadow-sm">
    <div class="p-6">
      <h2 class="text-lg font-semibold text-gray-800">Existing Users</h2>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Full Name</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Role(s)</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          {#if users.length > 0}
              {#each users as user}
                <tr>
                  <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{user.full_name}</td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{user.email}</td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{user.user_roles.map((r: any) => r.roles.name).join(', ')}</td>
                </tr>
              {/each}
          {:else}
              <tr>
                  <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500">No users found.</td>
              </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </div>