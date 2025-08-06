// src/routes/(protected)/admin/reports/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
  // Get date range from URL, or default to the last 7 days
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  const startDate = url.searchParams.get('start') || sevenDaysAgo.toISOString().split('T')[0];
  const endDate = url.searchParams.get('end') || today.toISOString().split('T')[0];

  // Query our reporting view within the date range
  const { data, error } = await supabase
    .from('agent_performance')
    .select('*')
    .gte('sent_at', `${startDate}T00:00:00.000Z`) // Greater than or equal to start of the day
    .lte('sent_at', `${endDate}T23:59:59.999Z`);   // Less than or equal to end of the day

  if (error) {
    console.error("Error fetching report data:", error);
    return { reportData: [], startDate, endDate };
  }

  // Aggregate the data in code
  const aggregatedData = data.reduce((acc, row) => {
    if (!acc[row.agent_id]) {
      acc[row.agent_id] = {
        agent_name: row.agent_name,
        sms_sent_count: 0,
        total_conversions: 0,
      };
    }
    acc[row.agent_id].sms_sent_count += 1;
    acc[row.agent_id].total_conversions += row.conversion_count;
    return acc;
  }, {} as any);

  // Convert the aggregated object back to an array for the frontend
  const reportData = Object.values(aggregatedData);

  return { reportData, startDate, endDate };
};