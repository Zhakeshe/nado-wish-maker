import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MESHY_API_URL = "https://api.meshy.ai/openapi/v1/image-to-3d";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, imageUrl, taskId } = await req.json();
    console.log(`3D Generation action: ${action}`, { imageUrl, taskId });

    const MESHY_API_KEY = Deno.env.get('MESHY_API_KEY');
    if (!MESHY_API_KEY) {
      throw new Error('MESHY_API_KEY is not configured');
    }

    // Create image-to-3D task
    if (action === 'create') {
      if (!imageUrl) {
        throw new Error('imageUrl is required');
      }

      console.log('Starting 3D generation with Meshy API:', imageUrl);

      const response = await fetch(MESHY_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MESHY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: imageUrl,
          ai_model: 'meshy-4',
          topology: 'triangle',
          target_polycount: 30000,
        }),
      });

      const responseText = await response.text();
      console.log('Meshy API create response:', response.status, responseText);

      if (!response.ok) {
        // Parse error message if possible
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || `Meshy API error: ${response.status}`);
        } catch (e) {
          throw new Error(`Meshy API error: ${response.status} - ${responseText}`);
        }
      }

      const data = JSON.parse(responseText);
      console.log('Meshy task created:', data);

      return new Response(JSON.stringify({
        result: data.result, // Task ID
        status: 'PENDING',
        message: 'Task created successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check task status
    if (action === 'status') {
      if (!taskId) {
        throw new Error('taskId is required');
      }

      console.log('Checking Meshy task status:', taskId);

      const response = await fetch(`${MESHY_API_URL}/${taskId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${MESHY_API_KEY}`,
        },
      });

      const responseText = await response.text();
      console.log('Meshy API status response:', response.status, responseText);

      if (!response.ok) {
        throw new Error(`Meshy API status error: ${response.status}`);
      }

      const data = JSON.parse(responseText);
      
      // Map Meshy status to our status format
      // Meshy statuses: PENDING, IN_PROGRESS, SUCCEEDED, FAILED, EXPIRED
      let status = data.status;
      let progress = data.progress || 0;

      const result: any = {
        status,
        progress,
      };

      if (status === 'SUCCEEDED') {
        result.model_urls = {
          glb: data.model_urls?.glb,
          fbx: data.model_urls?.fbx,
          obj: data.model_urls?.obj,
          usdz: data.model_urls?.usdz,
        };
        result.thumbnail_url = data.thumbnail_url;
      }

      if (status === 'FAILED') {
        result.error = data.task_error?.message || 'Generation failed';
      }

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action. Use "create" or "status"');

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
