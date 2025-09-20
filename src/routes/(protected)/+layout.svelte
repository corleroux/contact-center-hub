<!-- src/routes/(protected)/+layout.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  // The 'userRoles' array is now available from our server load function
  $: userRoles = $page.data.userRoles || [];

  // Helper functions to make the template cleaner
  $: isSupervisor = userRoles.includes('Supervisor');
  $: isAdmin = userRoles.includes('Admin');

  const handleLogout = async () => {
    // Get the Supabase client from the page data we made available everywhere
    const { supabase } = $page.data;
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error logging out:', error);
      alert('Could not log you out. Please try again.');
    } else {
      // On successful logout, redirect to the login page
      goto('/login');
    }
  };
</script>

<div class="app-container">
  <nav class="main-nav">
    <div class="nav-left">
      <a href="/dashboard" class="logo">ContactCenter</a>
      <!-- Role-Based Navigation Menu -->
      <div class="nav-menu">
        {#if isAdmin}
          <a href="/admin/users">Users</a>
          <a href="/admin/leads">Leads</a>
          <a href="/admin/reports">Reports</a>
        {:else if isSupervisor}
          <!-- Supervisors only see the reports link -->
          <a href="/admin/reports">Reports</a>
        {/if}
      </div>
    </div>

    <div class="user-info">
      <span>{$page.data.session?.user.email}</span>
      <button on:click={handleLogout}>Logout</button>
    </div>
  </nav>

  <main>
    <!-- This slot will render the actual page content, like our dashboard -->
    <slot />
  </main>
</div>

<style>
  .main-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem; /* Adjusted padding */
    background-color: #333;
    color: white;
  }
  .nav-left {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  .logo {
    font-weight: bold;
    font-size: 1.2rem;
    color: white;
    text-decoration: none;
  }
  .nav-menu {
    display: flex;
    gap: 1.5rem;
  }
  .nav-menu a {
    color: #ddd;
    text-decoration: none;
    padding: 1rem 0; /* Gives a larger clickable area */
    transition: color 0.2s;
  }
  .nav-menu a:hover {
    color: white;
  }
  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  main {
    padding: 1rem;
  }
</style>