<!-- src/lib/components/dashboard/agent/TipsSection.svelte -->
<div
  class="bg-white rounded-lg border border-gray-200 p-6 transition-colors hover:bg-gray-50 cursor-pointer"
  role="button"
  tabindex="0"
  on:click
  on:keydown
>
  <div class="flex justify-between items-center">
    <h3 class="text-lg font-semibold text-gray-900">Tips Section</h3>
    <!-- Chevron Right Icon -->
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </div>
   <!-- In a future version, clicking this could reveal a list of tips -->
</div>