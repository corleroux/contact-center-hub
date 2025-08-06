<!-- src/routes/(protected)/admin/users/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
  
    // Props passed from our server-side load function
    export let data;
  
    let users = data.users || [];
    let roles = data.roles || [];
  
    let newUserEmail = '';
    let newUserPassword = '';
    let newUserFullName = '';
    let selectedRoleId = roles.length > 0 ? roles[0].id : null;
    let feedbackMessage = '';
  
    const { supabase } = $page.data;
  
    const handleCreateUser = async () => {
      // We need to call a custom server function for this to have the right permissions
      const res = await fetch('/api/admin/create-user', {
          method: 'POST',
          body: JSON.stringify({
              email: newUserEmail,
              password: newUserPassword,
              fullName: newUserFullName,
              roleId: selectedRoleId
          })
      });
  
      const result = await res.json();
  
      if (res.ok) {
          feedbackMessage = `Success: ${result.message}`;
          // Refresh the user list
          users = [...users, result.user];
          // Clear form
          newUserEmail = '';
          newUserPassword = '';
          newUserFullName = '';
      } else {
          feedbackMessage = `Error: ${result.message}`;
      }
    };
  </script>
  
  <h1>User Management</h1>
  
  <!-- Create User Form -->
  <div class="card">
    <h2>Create New User</h2>
    <form on:submit|preventDefault={handleCreateUser}>
      <div class="form-grid">
        <label for="fullName">Full Name</label>
        <input id="fullName" type="text" bind:value={newUserFullName} required />
  
        <label for="email">Email</label>
        <input id="email" type="email" bind:value={newUserEmail} required />
  
        <label for="password">Password</label>
        <input id="password" type="password" placeholder="Min. 6 characters" bind:value={newUserPassword} required />
  
        <label for="role">Role</label>
        <select id="role" bind:value={selectedRoleId} required>
          {#each roles as role}
            <option value={role.id}>{role.name}</option>
          {/each}
        </select>
      </div>
      <button type="submit">Create User</button>
    </form>
    {#if feedbackMessage}
      <p>{feedbackMessage}</p>
    {/if}
  </div>
  
  
  <!-- Existing Users List -->
  <div class="card">
    <h2>Existing Users</h2>
    <table>
      <thead>
        <tr>
          <th>Full Name</th>
          <th>Email</th>
          <th>Role(s)</th>
        </tr>
      </thead>
      <tbody>
        {#each users as user}
          <tr>
            <td>{user.full_name}</td>
            <td>{user.email}</td>
            <td>{user.user_roles.map(r => r.roles.name).join(', ')}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  
  <style>
    .card { border: 1px solid #eee; border-radius: 8px; padding: 1.5rem; margin-top: 1.5rem; }
    .form-grid { display: grid; grid-template-columns: auto 1fr; gap: 1rem; align-items: center; margin-bottom: 1rem; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.75rem; border-bottom: 1px solid #eee; text-align: left; }
  </style>