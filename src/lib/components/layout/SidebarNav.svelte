<!-- src/lib/components/layout/SidebarNav.svelte -->
<script lang="ts">
    import { page } from '$app/stores';
  
    // For a more dynamic component, you could pass in the navigation items as a prop.
    // For the dedicated agent dashboard, this is clear and effective.
    const navItems = [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/my-stats', label: 'My Stats' },
      // Add more agent-specific links here in the future
    ];
  </script>
  
  <nav>
    <h2 class="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
      Navigation
    </h2>
    <ul class="space-y-1">
      {#each navItems as item}
        {@const isActive = $page.url.pathname === item.href}
        <li>
          <a
            href={item.href}
            class="flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
            class:bg-indigo-100={isActive}
            class:text-indigo-700={isActive}
            class:text-gray-600={!isActive}
            class:hover:bg-gray-100={!isActive}
            aria-current={isActive ? 'page' : undefined}
          >
            <!-- We can add icons here later -->
            {item.label}
          </a>
        </li>
      {/each}
    </ul>
  </nav>