/**
 * Azure Function: Learning Goals CRUD API
 * Endpoints: POST, GET, PUT, DELETE /api/goals
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase client setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async function (context, req) {
    context.log('Learning Goals API called');

    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        context.res = {
            status: 200,
            headers: corsHeaders
        };
        return;
    }

    try {
        const method = req.method;
        const goalId = req.params?.id;

        switch (method) {
            case 'GET':
                await handleGet(context, goalId);
                break;
            case 'POST':
                await handlePost(context, req.body);
                break;
            case 'PUT':
                await handlePut(context, goalId, req.body);
                break;
            case 'DELETE':
                await handleDelete(context, goalId);
                break;
            default:
                context.res = {
                    status: 405,
                    headers: corsHeaders,
                    body: { error: 'Method not allowed' }
                };
        }
    } catch (error) {
        context.log.error('API Error:', error);
        context.res = {
            status: 500,
            headers: corsHeaders,
            body: { error: 'Internal server error' }
        };
    }
};

async function handleGet(context, goalId) {
    if (goalId) {
        // Get single goal
        const { data, error } = await supabase
            .from('learning_goals')
            .select('*')
            .eq('id', goalId)
            .single();

        if (error) {
            context.res = {
                status: 404,
                body: { error: 'Goal not found' }
            };
            return;
        }

        context.res = {
            status: 200,
            body: data
        };
    } else {
        // Get all goals
        const { data, error } = await supabase
            .from('learning_goals')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        context.res = {
            status: 200,
            body: { goals: data }
        };
    }
}

async function handlePost(context, body) {
    const { title, description } = body;

    if (!title) {
        context.res = {
            status: 400,
            body: { error: 'Title is required' }
        };
        return;
    }

    const { data, error } = await supabase
        .from('learning_goals')
        .insert([{ title, description }])
        .select()
        .single();

    if (error) {
        throw error;
    }

    context.res = {
        status: 201,
        body: data
    };
}

async function handlePut(context, goalId, body) {
    if (!goalId) {
        context.res = {
            status: 400,
            body: { error: 'Goal ID is required' }
        };
        return;
    }

    const { title, description } = body;
    const updates = {};
    
    if (title) updates.title = title;
    if (description !== undefined) updates.description = description;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
        .from('learning_goals')
        .update(updates)
        .eq('id', goalId)
        .select()
        .single();

    if (error) {
        context.res = {
            status: 404,
            body: { error: 'Goal not found' }
        };
        return;
    }

    context.res = {
        status: 200,
        body: data
    };
}

async function handleDelete(context, goalId) {
    if (!goalId) {
        context.res = {
            status: 400,
            body: { error: 'Goal ID is required' }
        };
        return;
    }

    const { error } = await supabase
        .from('learning_goals')
        .delete()
        .eq('id', goalId);

    if (error) {
        context.res = {
            status: 404,
            body: { error: 'Goal not found' }
        };
        return;
    }

    context.res = {
        status: 204
    };
}