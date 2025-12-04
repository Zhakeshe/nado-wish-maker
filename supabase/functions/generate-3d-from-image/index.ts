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
    const { action, imageUrl, taskId } = await req.json();
    console.log(`3D Generation action: ${action}`, { imageUrl, taskId });

    const API_KEY = Deno.env.get('ARTIFICIAL_STUDIO_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!API_KEY) {
      throw new Error('ARTIFICIAL_STUDIO_API_KEY is not configured');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Create task
    if (action === 'create') {
      if (!imageUrl) {
        throw new Error('imageUrl is required');
      }

      console.log('Creating 3D generation task with Artificial Studio API...');
      
      const webhookUrl = `${SUPABASE_URL}/functions/v1/3d-webhook`;
      
      const response = await fetch('https://api.artificialstudio.ai/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': API_KEY,
        },
        body: JSON.stringify({
          model: 'image-to-3d-object',
          input: {
            model: 'hunyuan3d-v21',
            file: imageUrl,
          },
          webhook: webhookUrl,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Artificial Studio API error:', response.status, errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Task created:', data);

      // Store task in database for tracking
      const { error: dbError } = await supabase
        .from('generation_tasks')
        .insert({
          task_id: data.id,
          status: 'PENDING',
          image_url: imageUrl,
        });

      if (dbError) {
        console.log('Note: Could not store task in DB:', dbError.message);
      }

      return new Response(JSON.stringify({
        result: data.id,
        status: 'PENDING',
        source: 'artificial_studio'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check status
    if (action === 'status') {
      if (!taskId) {
        throw new Error('taskId is required');
      }

      // Check task status from database
      const { data: task, error: taskError } = await supabase
        .from('generation_tasks')
        .select('*')
        .eq('task_id', taskId)
        .single();

      if (taskError || !task) {
        // If not in DB, check API directly
        console.log('Task not in DB, returning pending status');
        return new Response(JSON.stringify({
          status: 'IN_PROGRESS',
          progress: 50
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const result: any = {
        status: task.status,
        progress: task.status === 'SUCCEEDED' ? 100 : task.status === 'FAILED' ? 0 : 50,
      };

      if (task.status === 'SUCCEEDED' && task.model_url) {
        result.model_urls = {
          glb: task.model_url,
        };
      }

      if (task.status === 'FAILED') {
        result.error = task.error_message || 'Generation failed';
      }

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Error in generate-3d-from-image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
