<!-- src/routes/login/+page.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import LoginForm from '$lib/components/LoginForm.svelte'; // Import our new component

  let error: string | null = null;
  let isLoading = false;

  $: ({ supabase } = $page.data);

  async function handleLogin(event: any) {
    isLoading = true;
    error = null;
    const { email, password } = event.detail;

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      error = authError.message;
    } else {
      goto('/dashboard');
    }
    isLoading = false;
  }

  onMount(() => {
    if ($page.data.session) {
      goto('/dashboard');
    }
  });
</script>

<div class="flex min-h-screen items-center justify-center bg-slate-50">
  <LoginForm on:submit={handleLogin} {error} {isLoading} />
</div>