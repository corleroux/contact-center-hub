 <script lang="ts">
      import { goto } from '$app/navigation';
      import { onMount } from 'svelte';
      import { page } from '$app/stores';

      let email = '';
      let password = '';
      let error: string | null = null;

      // Get the Supabase client from the page data
      const { supabase } = $page.data;

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

    <div class="login-container">
      <h1>Contact Center Login</h1>
      <form on:submit|preventDefault={handleLogin}>
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" type="email" bind:value={email} required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" type="password" bind:value={password} required />
        </div>
        <button type="submit">Log In</button>
        {#if error}
          <p class="error">{error}</p>
        {/if}
      </form>
    </div>

    <style>
      .login-container { max-width: 400px; margin: 5rem auto; padding: 2rem; border: 1px solid #ccc; border-radius: 8px; }
      .form-group { margin-bottom: 1rem; }
      label { display: block; margin-bottom: 0.5rem; }
      input { width: 100%; padding: 0.5rem; }
      button { width: 100%; padding: 0.75rem; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
      .error { color: red; margin-top: 1rem; }
    </style>