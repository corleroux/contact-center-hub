<!-- src/lib/components/CreateUserForm.svelte -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    // Props for data and state
    export let roles: { id: number; name: string }[] = [];
    export let isLoading = false;
    export let feedbackMessage = '';
  
    // Internal state for the form fields
    let newUserEmail = '';
    let newUserPassword = '';
    let newUserFullName = '';
    let selectedRoleId = roles.length > 0 ? roles[0].id : null;
  
    const dispatch = createEventDispatcher();
  
    const handleSubmit = () => {
      if (!isLoading) {
        dispatch('submit', {
          email: newUserEmail,
          password: newUserPassword,
          fullName: newUserFullName,
          roleId: selectedRoleId,
        });
        // Clearing the form is now the parent's responsibility
      }
    };
  </script>
  
  <div class="rounded-lg border bg-white p-6 shadow-sm">
    <h2 class="text-lg font-semibold text-gray-800">Create New User</h2>
    <form class="mt-4" on:submit|preventDefault={handleSubmit}>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label for="fullName" class="block text-sm font-medium text-gray-700">Full Name</label>
          <input id="fullName" type="text" bind:value={newUserFullName} required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
          <select id="role" bind:value={selectedRoleId} required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            {#each roles as role}
              <option value={role.id}>{role.name}</option>
            {/each}
          </select>
        </div>
        <div class="md:col-span-2">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input id="email" type="email" bind:value={newUserEmail} required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div class="md:col-span-2">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input id="password" type="password" placeholder="Min. 6 characters" bind:value={newUserPassword} required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
      </div>
      <div class="mt-6 flex items-center justify-between">
          <button type="submit" disabled={isLoading} class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50">
              {isLoading ? 'Creating...' : 'Create User'}
          </button>
          {#if feedbackMessage}
              <p class="text-sm text-gray-600">{feedbackMessage}</p>
          {/if}
      </div>
    </form>
  </div>