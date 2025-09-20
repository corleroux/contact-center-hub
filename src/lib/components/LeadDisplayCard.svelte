<!-- src/lib/components/LeadDisplayCard.svelte -->
<script lang="ts">
  // Define the shape of a lead for type safety
  type Lead = {
    id: string;
    phone_number: string;
    first_name: string;
    last_name: string;
    status: string; // We'll keep this for potential future use, e.g., styling the card border
  };

  // Props to receive data from the parent
  export let lead: Lead | null = null;
</script>

<!-- The styling of this card is updated to match the wireframe -->
<div class="bg-white rounded-lg border border-gray-200 p-6">
  {#if lead}
    <div class="flex justify-between items-start">
      <div>
        <h3 class="text-sm font-medium text-gray-500">Customer Name</h3>
        <p class="text-xl font-semibold text-gray-900 mt-1">
          {lead.first_name} {lead.last_name}
        </p>

        <h3 class="text-sm font-medium text-gray-500 mt-4">Policy Details</h3>
        <p class="text-lg font-medium text-gray-700 mt-1">
          <!-- You can display other lead details here in the future -->
          Phone: {lead.phone_number}
        </p>
      </div>
      <div>
        <span class="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
          Medium Priority
        </span>
      </div>
    </div>
  {:else}
    <div class="rounded-md border-2 border-dashed border-gray-300 p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <h3 class="mt-2 text-sm font-semibold text-gray-900">No active lead</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by getting your next lead.</p>
    </div>
  {/if}
</div>