<!-- src/lib/components/dashboard/agent/CallScript.svelte -->
<script lang="ts">
    // In a future version, you could pass the lead's name as a prop to personalize the script.
    // export let customerName = 'Customer';
  </script>
  
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Call Script</h3>
    <div class="prose prose-sm max-w-none text-gray-600">
      <h4>Introduction</h4>
      <p>
        "Hi, may I please speak with [Customer Name]? My name is [Agent Name], and I'm calling from [Your Company]. I'm calling today to invite you to an exclusive WhatsApp group for our valued customers, where you'll get early access to special offers."
      </p>
  
      <h4>The Offer</h4>
      <p>
        "It's completely free to join, and it's a great way to stay in the loop. I can send a link directly to your phone right now. Would that be okay?"
      </p>
  
      <h4>Closing</h4>
      <p>
        "Great! I've just sent the SMS. Please click the link to join the group. Thank you for your time, and we look forward to seeing you there. Have a great day!"
      </p>
    </div>
  </div>
  