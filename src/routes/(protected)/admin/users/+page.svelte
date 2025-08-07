<!-- src/routes/(protected)/admin/users/+page.svelte -->
<script lang="ts">
  import CreateUserForm from '$lib/components/CreateUserForm.svelte';
  import UsersTable from '$lib/components/UsersTable.svelte';

  // Data from the +page.server.ts load function
  export let data;

  // Reactive statements to keep our local variables in sync with data from the server
  $: users = data.users || [];
  $: roles = data.roles || [];

  let isLoading = false;
  let feedbackMessage = '';

  // --- LOGIC FUNCTIONS ---
  const handleCreateUser = async (event: any) => {
    isLoading = true;
    feedbackMessage = 'Creating user...';
    const { email, password, fullName, roleId } = event.detail;

    const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        body: JSON.stringify({ email, password, fullName, roleId })
    });

    const result = await res.json();
    isLoading = false;

    if (res.ok) {
        feedbackMessage = `Success: ${result.message}`;
        // To refresh the list, we can re-assign the users array, which will trigger reactivity
        data.users = [...data.users, result.user];
    } else {
        feedbackMessage = `Error: ${result.message}`;
    }
  };
</script>

<!-- UI SECTION (COMPLETELY REWRITTEN) -->
<div class="space-y-6">
  <h1 class="text-2xl font-bold text-gray-900">User Management</h1>

  <CreateUserForm
    {roles}
    {isLoading}
    {feedbackMessage}
    on:submit={handleCreateUser}
  />

  <UsersTable {users} />
</div>