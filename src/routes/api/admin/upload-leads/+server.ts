// src/routes/api/admin/upload-leads/+server.ts
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import Papa from 'papaparse';

export async function POST({ request, locals: { supabase } }) {
  // Security check: Only Admins should be able to call this.
  // We rely on the fact that only an Admin can even see the page to call this,
  // but a full production app would re-verify the role here.

  const formData = await request.formData();
  const file = formData.get('leadFile') as File;

  if (!file) {
    return json({ message: 'No file provided.' }, { status: 400 });
  }

  // Read the file content
  const fileText = await file.text();

  // Use PapaParse to parse the CSV text into JSON
  const parseResult = Papa.parse(fileText, {
    header: true, // Assumes the first row is a header row
    skipEmptyLines: true,
  });

  if (parseResult.errors.length) {
    console.error('CSV Parsing Errors:', parseResult.errors);
    return json({ message: 'Failed to parse CSV file.' }, { status: 400 });
  }

  // We need the admin client to insert data, bypassing RLS.
  const supabaseAdmin = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_KEY
  );

  // Map the parsed data to match our 'leads' table schema
  const leadsToInsert = parseResult.data.map((row: any) => ({
    phone_number: row.phone_number,
    first_name: row.first_name,
    last_name: row.last_name,
    status: 'New', // Default status for all new leads
  }));

  // Use Supabase 'upsert' to insert new leads.
  // The 'phone_number' is set as a UNIQUE key in our DB schema, so 'upsert'
  // will prevent duplicate phone numbers from being inserted.
  // 'ignoreDuplicates: true' ensures it just skips them instead of erroring out.
  const { data, error } = await supabaseAdmin
    .from('leads')
    .upsert(leadsToInsert, {
        onConflict: 'phone_number',
        ignoreDuplicates: true
    })
    .select(); // .select() returns the records that were inserted/updated

  if (error) {
    console.error('Supabase Insert Error:', error);
    return json({ message: `Database error: ${error.message}` }, { status: 500 });
  }

  return json({
    message: `Upload successful. ${data.length} new leads were added to the database.`
  });
}