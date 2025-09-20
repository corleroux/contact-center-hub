// src/routes/api/agent/disposition-lead/+server.ts
import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';

export async function POST({ request, locals: { getSession } }) {
    const session = await getSession();
    if (!session) {
        return json({ message: 'Not authenticated' }, { status: 401 });
    }

    const { leadId, outcome, notes, followUpDate } = await request.json();

    if (!leadId || !outcome) {
        return json({ message: 'Lead ID and outcome are required.' }, { status: 400 });
    }

    // Use the Admin client to perform this critical update
    const supabaseAdmin = createClient(env.PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

    // Prepare the data for the update
    const updateData: {
        status: string;
        notes: string;
        callback_at: string | null;
        locked_by_agent_id: null; // UNLOCK the lead
        locked_at: null;
        last_attempted_at: string;
    } = {
        status: outcome,
        notes: notes,
        callback_at: outcome === 'Callback' ? followUpDate : null,
        locked_by_agent_id: null, // This is the crucial UNLOCK step
        locked_at: null,
        last_attempted_at: new Date().toISOString()
    };

    const { error } = await supabaseAdmin
        .from('leads')
        .update(updateData)
        .eq('id', leadId)
        .eq('locked_by_agent_id', session.user.id); // Security: Agent can only disposition their own locked lead

    if (error) {
        console.error("Disposition Error:", error);
        return json({ message: "Failed to save disposition." }, { status: 500 });
    }

    return json({ message: "Disposition saved successfully." });
}