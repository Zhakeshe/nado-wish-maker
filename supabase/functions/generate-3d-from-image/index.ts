import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function tryHuggingFace(imageUrl: string, hfToken: string): Promise<{ success: boolean; data?: any; error?: string }> {
  const spaces = [
    "https://dylanebert-lgm-tiny.hf.space/api/predict",
    "https://stabilityai-triposr.hf.space/api/predict",
  ];

  for (const spaceUrl of spaces) {
    try {
      console.log(`Trying HF space: ${spaceUrl}`);
      
      const body = spaceUrl.includes('triposr') 
        ? { data: [imageUrl, true, 0.5, 256] }
        : { data: [imageUrl] };

      const response = await fetch(spaceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${hfToken}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data[0]) {
          return { success: true, data: data.data[0] };
        }
      }
      console.log(`HF space ${spaceUrl} failed with status: ${response.status}`);
    } catch (e) {
      console.log(`HF space ${spaceUrl} error:`, e);
    }
  }

  return { success: false, error: 'All HF spaces unavailable' };
}

async function tryMeshy(imageUrl: string, meshyKey: string, action: string, taskId?: string): Promise<{ success: boolean; data?: any; error?: string }> {
  const MESHY_API_URL = "https://api.meshy.ai/openapi/v1/image-to-3d";

  try {
    if (action === 'create') {
      console.log('Trying Meshy API...');
      const response = await fetch(MESHY_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${meshyKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: imageUrl,
          ai_model: 'meshy-4',
          topology: 'triangle',
          target_polycount: 30000,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      }
      const errorText = await response.text();
      console.log('Meshy create error:', response.status, errorText);
      return { success: false, error: `Meshy API error: ${response.status}` };
    }

    if (action === 'status' && taskId) {
      const response = await fetch(`${MESHY_API_URL}/${taskId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${meshyKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      }
      return { success: false, error: `Meshy status error: ${response.status}` };
    }
  } catch (e) {
    console.log('Meshy error:', e);
    return { success: false, error: e instanceof Error ? e.message : 'Meshy error' };
  }

  return { success: false, error: 'Invalid action' };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, imageUrl, taskId } = await req.json();
    console.log(`3D Generation action: ${action}`, { imageUrl, taskId });

    const HF_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    const MESHY_KEY = Deno.env.get('MESHY_API_KEY');

    if (!HF_TOKEN && !MESHY_KEY) {
      throw new Error('No API keys configured (HUGGING_FACE_ACCESS_TOKEN or MESHY_API_KEY)');
    }

    // Create task
    if (action === 'create') {
      if (!imageUrl) {
        throw new Error('imageUrl is required');
      }

      // Try HuggingFace first (free, synchronous)
      if (HF_TOKEN) {
        const hfResult = await tryHuggingFace(imageUrl, HF_TOKEN);
        if (hfResult.success) {
          console.log('HF success:', hfResult.data);
          return new Response(JSON.stringify({
            result: `hf_direct_${Date.now()}`,
            status: 'SUCCEEDED',
            model_urls: {
              glb: hfResult.data
            }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }

      // Fallback to Meshy (async, needs polling)
      if (MESHY_KEY) {
        const meshyResult = await tryMeshy(imageUrl, MESHY_KEY, 'create');
        if (meshyResult.success) {
          console.log('Meshy task created:', meshyResult.data);
          return new Response(JSON.stringify({
            result: meshyResult.data.result,
            status: 'PENDING',
            source: 'meshy'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        throw new Error(meshyResult.error || 'Meshy API failed');
      }

      throw new Error('3D generation unavailable - all APIs failed');
    }

    // Check status
    if (action === 'status') {
      if (!taskId) {
        throw new Error('taskId is required');
      }

      // HF direct results are already complete
      if (taskId.startsWith('hf_direct_')) {
        return new Response(JSON.stringify({
          status: 'SUCCEEDED',
          progress: 100
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Meshy task - poll for status
      if (MESHY_KEY) {
        const meshyResult = await tryMeshy('', MESHY_KEY, 'status', taskId);
        if (meshyResult.success) {
          const data = meshyResult.data;
          const result: any = {
            status: data.status,
            progress: data.progress || 0,
          };

          if (data.status === 'SUCCEEDED') {
            result.model_urls = {
              glb: data.model_urls?.glb,
            };
          }

          if (data.status === 'FAILED') {
            result.error = data.task_error?.message || 'Generation failed';
          }

          return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }

      return new Response(JSON.stringify({
        status: 'IN_PROGRESS',
        progress: 50
      }), {
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
