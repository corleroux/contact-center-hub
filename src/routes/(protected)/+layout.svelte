<!-- src/routes/(protected)/+layout.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

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
    <div class="logo">ContactCenter</div>
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
  .main-nav { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background-color: #333; color: white; }
  .user-info { display: flex; align-items: center; gap: 1rem; }
  main { padding: 1rem; }
</style>