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
    console.log(`=== 3D Generation action: ${action} ===`, { imageUrl, taskId });

    const API_KEY = Deno.env.get('ARTIFICIAL_STUDIO_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!API_KEY) {
      throw new Error('ARTIFICIAL_STUDIO_API_KEY is not configured');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Extract user_id from JWT token
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }
    console.log('User ID from JWT:', userId);

    // Create task
    if (action === 'create') {
      if (!imageUrl) {
        throw new Error('imageUrl is required');
      }

      console.log('Creating 3D generation task with Artificial Studio API...');
      
      // Webhook URL for receiving completion notification
      const webhookUrl = `${SUPABASE_URL}/functions/v1/3d-webhook`;
      console.log('Webhook URL:', webhookUrl);
      
      const requestBody = {
        model: 'image-to-3d-object',
        input: {
          model: 'hunyuan3d-v21',
          file: imageUrl,
        },
        webhook: webhookUrl,
      };
      
      console.log('API Request body:', JSON.stringify(requestBody));

      const response = await fetch('https://api.artificialstudio.ai/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': API_KEY,
        },
        body: JSON.stringify(requestBody),
      });

      const responseText = await response.text();
      console.log('API Response status:', response.status);
      console.log('API Response body:', responseText);

      if (!response.ok) {
        console.error('Artificial Studio API error:', response.status, responseText);
        throw new Error(`API error: ${response.status} - ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
      
      console.log('Task created successfully:', JSON.stringify(data));

      // Store task in database for tracking
      const { error: dbError } = await supabase
        .from('generation_tasks')
        .insert({
          task_id: data.id,
          status: 'PENDING',
          image_url: imageUrl,
          user_id: userId,
        });

      if (dbError) {
        console.error('DB insert error:', dbError);
      } else {
        console.log('Task stored in database');
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

      console.log('Checking status for task:', taskId);

      // First check database for cached result
      const { data: task, error: taskError } = await supabase
        .from('generation_tasks')
        .select('*')
        .eq('task_id', taskId)
        .maybeSingle();

      if (taskError) {
        console.error('DB query error:', taskError);
      }

      console.log('Task from DB:', JSON.stringify(task));

      // If task is completed in DB, return it
      if (task && (task.status === 'SUCCEEDED' || task.status === 'FAILED')) {
        console.log('Returning cached result from DB');
        const result: any = {
          status: task.status,
          progress: task.status === 'SUCCEEDED' ? 100 : 0,
        };

        if (task.status === 'SUCCEEDED' && task.model_url) {
          result.model_urls = { glb: task.model_url };
        }

        if (task.status === 'FAILED') {
          result.error = task.error_message || 'Generation failed';
        }

        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Poll Artificial Studio API directly for real-time status
      console.log('Polling Artificial Studio API for task:', taskId);
      
      const statusResponse = await fetch(`https://api.artificialstudio.ai/api/tasks/${taskId}`, {
        method: 'GET',
        headers: {
          'Authorization': API_KEY,
        },
      });

      const statusText = await statusResponse.text();
      console.log('Status API response:', statusResponse.status, statusText);

      if (!statusResponse.ok) {
        console.error('Status API error:', statusResponse.status);
        return new Response(JSON.stringify({
          status: 'IN_PROGRESS',
          progress: 30
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      let statusData;
      try {
        statusData = JSON.parse(statusText);
      } catch (e) {
        console.error('Failed to parse status response');
        return new Response(JSON.stringify({
          status: 'IN_PROGRESS',
          progress: 40
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('Parsed status data:', JSON.stringify(statusData));

      // Map Artificial Studio status to our status
      let status = 'IN_PROGRESS';
      let progress = 50;
      let modelUrl = null;

      const apiStatus = (statusData.status || '').toLowerCase();
      
      if (apiStatus === 'completed' || apiStatus === 'succeeded' || apiStatus === 'success') {
        status = 'SUCCEEDED';
        progress = 100;
        
        // Extract model URL from various possible locations
        const output = statusData.output;
        if (output) {
          if (typeof output === 'string') {
            modelUrl = output;
          } else if (typeof output === 'object') {
            modelUrl = output.url || output.glb || output.model || output.model_url || output.file;
            if (Array.isArray(output) && output.length > 0) {
              const first = output[0];
              modelUrl = typeof first === 'string' ? first : (first.url || first.glb || first.model);
            }
          }
        }
        // Also check result field
        if (!modelUrl && statusData.result) {
          modelUrl = typeof statusData.result === 'string' ? statusData.result : statusData.result.url;
        }
        
        console.log('Model URL extracted:', modelUrl);
        
        // Update database with completed status
        if (modelUrl) {
          const { error: updateError } = await supabase
            .from('generation_tasks')
            .update({ status: 'SUCCEEDED', model_url: modelUrl, updated_at: new Date().toISOString() })
            .eq('task_id', taskId);
          
          if (updateError) {
            console.error('DB update error:', updateError);
          } else {
            console.log('Task updated in DB with model URL');
          }
        }
      } else if (apiStatus === 'failed' || apiStatus === 'error') {
        status = 'FAILED';
        progress = 0;
        
        await supabase
          .from('generation_tasks')
          .update({ status: 'FAILED', error_message: statusData.error || 'Unknown error', updated_at: new Date().toISOString() })
          .eq('task_id', taskId);
      } else if (apiStatus === 'processing' || apiStatus === 'running') {
        progress = statusData.progress || 50;
      } else if (apiStatus === 'queued' || apiStatus === 'pending') {
        progress = 20;
      }

      const result: any = { status, progress };
      
      if (modelUrl) {
        result.model_urls = { glb: modelUrl };
      }

      console.log('Returning status result:', JSON.stringify(result));

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
