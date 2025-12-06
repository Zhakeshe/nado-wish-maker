import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== 3D Webhook received ===');
    console.log('Method:', req.method);
    console.log('Headers:', JSON.stringify(Object.fromEntries(req.headers.entries())));

    // Get raw body
    const rawBody = await req.text();
    console.log('Raw body:', rawBody);

    // Parse JSON body
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      return new Response('Invalid JSON', { status: 400, headers: corsHeaders });
    }

    console.log('Parsed webhook payload:', JSON.stringify(body));

    // According to Artificial Studio docs: id, output, status, model, payload, error
    const { id, output, status, error, model, payload } = body;

    if (!id) {
      console.error('No task ID in webhook payload');
      return new Response('OK - no ID', { status: 200, headers: corsHeaders });
    }

    console.log('Processing task:', id, 'Status:', status);

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase credentials');
      return new Response('Server error', { status: 500, headers: corsHeaders });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Map Artificial Studio status to our status
    let dbStatus = 'IN_PROGRESS';
    if (status === 'completed' || status === 'succeeded' || status === 'success') {
      dbStatus = 'SUCCEEDED';
    } else if (status === 'failed' || status === 'error') {
      dbStatus = 'FAILED';
    }

    // Get model URL from output - handle various response formats
    let modelUrl = null;
    if (output) {
      console.log('Output type:', typeof output);
      console.log('Output value:', JSON.stringify(output));
      
      if (typeof output === 'string') {
        modelUrl = output;
      } else if (typeof output === 'object') {
        // Try different possible field names
        modelUrl = output.url || output.glb || output.model || output.model_url || output.file || output.result;
        
        // If output is an array, get first item
        if (Array.isArray(output) && output.length > 0) {
          const first = output[0];
          if (typeof first === 'string') {
            modelUrl = first;
          } else if (typeof first === 'object') {
            modelUrl = first.url || first.glb || first.model;
          }
        }
      }
    }

    console.log('Extracted model URL:', modelUrl);
    console.log('Updating task with status:', dbStatus);

    // Update task in database
    const { data: updateData, error: updateError } = await supabase
      .from('generation_tasks')
      .update({
        status: dbStatus,
        model_url: modelUrl,
        error_message: error || null,
        updated_at: new Date().toISOString(),
      })
      .eq('task_id', id)
      .select();

    if (updateError) {
      console.error('Failed to update task:', updateError);
    } else {
      console.log('Task updated successfully:', JSON.stringify(updateData));
    }

    return new Response('Webhook processed', { 
      status: 200,
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('OK', { status: 200, headers: corsHeaders });
  }
});
