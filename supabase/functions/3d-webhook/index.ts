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
    const body = await req.json();
    console.log('Webhook received:', JSON.stringify(body));

    const { id, output, status, error } = body;

    if (!id) {
      console.error('No task ID in webhook payload');
      return new Response('OK', { status: 200 });
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Map status
    let dbStatus = 'IN_PROGRESS';
    if (status === 'completed' || status === 'succeeded') {
      dbStatus = 'SUCCEEDED';
    } else if (status === 'failed' || status === 'error') {
      dbStatus = 'FAILED';
    }

    // Get model URL from output
    let modelUrl = null;
    if (output) {
      // Output can be string URL or object with url/glb field
      if (typeof output === 'string') {
        modelUrl = output;
      } else if (output.url) {
        modelUrl = output.url;
      } else if (output.glb) {
        modelUrl = output.glb;
      } else if (output.model) {
        modelUrl = output.model;
      }
    }

    console.log('Updating task:', { id, dbStatus, modelUrl, error });

    // Update task in database
    const { error: updateError } = await supabase
      .from('generation_tasks')
      .update({
        status: dbStatus,
        model_url: modelUrl,
        error_message: error || null,
        updated_at: new Date().toISOString(),
      })
      .eq('task_id', id);

    if (updateError) {
      console.error('Failed to update task:', updateError);
    }

    return new Response('Webhook received', { 
      status: 200,
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('OK', { status: 200 });
  }
});
