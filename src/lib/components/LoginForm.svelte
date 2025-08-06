<!-- src/lib/components/LoginForm.svelte -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    // This component takes the current error message as a prop
    export let error: string | null = null;
    export let isLoading = false; // To disable the button during submission
  
    let email = '';
    let password = '';
  
    // We use this to send the form data up to the parent component
    const dispatch = createEventDispatcher();
  
    function handleSubmit() {
      if (!isLoading) {
        dispatch('submit', { email, password });
      }
    }
  </script>
  
  <div class="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-md">
    <div>
      <h1 class="text-center text-3xl font-bold tracking-tight text-gray-900">
        Contact Center Login
      </h1>
    </div>
    <form class="mt-8 space-y-6" on:submit|preventDefault={handleSubmit}>
      <div class="space-y-4 rounded-md">
        <div>
          <label for="email" class="sr-only">Email address</label>
          <input
            id="email" type="email" autocomplete="email" required
            bind:value={email}
            class="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="Email address"
          />
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <input
            id="password" type="password" autocomplete="current-password" required
            bind:value={password}
            class="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="Password"
          />
        </div>
      </div>
  
      <div>
        <button
          type="submit"
          disabled={isLoading}
          class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
      </div>
  
      {#if error}
        <p class="mt-2 text-center text-sm text-red-600">{error}</p>
      {/if}
    </form>
  </div>