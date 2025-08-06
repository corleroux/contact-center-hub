<!-- src/routes/login/+page.svelte -->
<script lang="ts">
  // --- THIS SCRIPT SECTION IS UNCHANGED ---
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  let email = '';
  let password = '';
  let error: string | null = null;

  // Get the Supabase client from the page data
  // Use a reactive statement to ensure supabase is available
  $: ({ supabase } = $page.data);

  const handleLogin = async () => {
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (authError) {
      error = authError.message;
    } else {
      // On successful login, redirect to the dashboard
      goto('/dashboard');
    }
  };

  // If a user is already logged in, redirect them away from the login page
  onMount(() => {
    const { session } = $page.data;
    if (session) {
      goto('/dashboard');
    }
  });
</script>

<!-- THIS TEMPLATE SECTION IS COMPLETELY REWRITTEN WITH TAILWIND CSS -->
<div class="flex min-h-screen items-center justify-center bg-slate-50">
  <div class="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-md">
    <div>
      <h1 class="text-center text-3xl font-bold tracking-tight text-gray-900">
        Contact Center Login
      </h1>
    </div>
    <form class="mt-8 space-y-6" on:submit|preventDefault={handleLogin}>
      <div class="space-y-4 rounded-md">
        <div>
          <label for="email" class="sr-only">Email address</label>
          <input
            id="email"
            type="email"
            autocomplete="email"
            required
            bind:value={email}
            class="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="Email address"
          />
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <input
            id="password"
            type="password"
            autocomplete="current-password"
            required
            bind:value={password}
            class="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="Password"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Log In
        </button>
      </div>

      {#if error}
        <p class="mt-2 text-center text-sm text-red-600">{error}</p>
      {/if}
    </form>
  </div>
</div>

<!-- 
Notice there is no <style> block anymore. 
All styling is handled by the Tailwind utility classes in the HTML.
-->