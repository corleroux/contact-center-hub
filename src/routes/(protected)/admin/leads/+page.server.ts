// src/routes/(protected)/admin/leads/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false }) // Show newest leads first
    .limit(100); // Limit to the most recent 100 leads for performance

  if (error) {
    console.error('Error fetching leads:', error);
    return { leads: [] };
  }

  return { leads };
};