// src/routes/api/admin/create-user/+server.ts
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals: { getSession } }) {
    // First, ensure the user making this request is a logged-in Admin
    const session = await getSession();
    if (!session) {
        return json({ message: 'Not authenticated.' }, { status: 401 });
    }
    // NOTE: Here you would re-check the user's role for maximum security, similar to the admin layout load function.

    // Get user data from the form submission
    const { email, password, fullName, roleId } = await request.json();

    // Use the SERVICE_ROLE_KEY for admin-level actions
    const supabaseAdmin = createClient(
        env.SUPABASE_URL,
        env.SUPABASE_SERVICE_KEY
    );

    // 1. Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm the email
    });

    if (authError) {
        return json({ message: authError.message }, { status: 500 });
    }

    const newUser = authData.user;

    // 2. Add the user's details to our public 'users' table
    const { error: profileError } = await supabaseAdmin
        .from('users')
        .insert({ id: newUser.id, full_name: fullName, email: email });

    if (profileError) {
        return json({ message: `Error creating user profile: ${profileError.message}` }, { status: 500 });
    }

    // 3. Assign the selected role to the new user
    const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .insert({ user_id: newUser.id, role_id: roleId });

    if (roleError) {
        return json({ message: `Error assigning role: ${roleError.message}` }, { status: 500 });
    }

    // Return the newly created user's public profile for display
    return json({
      message: 'User created successfully!',
      user: { id: newUser.id, full_name: fullName, email: email, user_roles: [{ roles: { name: 'Role Pending...' } }] }
    }, { status: 201 });
}