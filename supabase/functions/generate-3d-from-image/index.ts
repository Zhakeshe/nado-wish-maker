import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';

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

    const HF_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    if (!HF_TOKEN) {
      throw new Error('HUGGING_FACE_ACCESS_TOKEN is not configured');
    }

    // Create image-to-3D task using Hugging Face Space API
    if (action === 'create') {
      if (!imageUrl) {
        throw new Error('imageUrl is required');
      }

      console.log('Starting 3D generation with Hugging Face:', imageUrl);

      // Use the Gradio API for the LGM-tiny space
      const spaceUrl = "https://dylanebert-lgm-tiny.hf.space/api/predict";
      
      const response = await fetch(spaceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HF_TOKEN}`,
        },
        body: JSON.stringify({
          data: [imageUrl]
        }),
      });

      const responseText = await response.text();
      console.log('HF Space response:', response.status, responseText);

      if (!response.ok) {
        // Try alternative TripoSR model
        console.log('LGM-tiny failed, trying TripoSR...');
        
        const tripoResponse = await fetch("https://stabilityai-triposr.hf.space/api/predict", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${HF_TOKEN}`,
          },
          body: JSON.stringify({
            data: [imageUrl, true, 0.5, 256]
          }),
        });

        const tripoText = await tripoResponse.text();
        console.log('TripoSR response:', tripoResponse.status, tripoText);

        if (!tripoResponse.ok) {
          throw new Error(`Hugging Face API error: ${response.status}`);
        }

        const tripoData = JSON.parse(tripoText);
        if (tripoData.data && tripoData.data[0]) {
          return new Response(JSON.stringify({
            result: `direct_${Date.now()}`,
            status: 'SUCCEEDED',
            model_urls: {
              glb: tripoData.data[0]
            }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }

      const data = JSON.parse(responseText);
      console.log('HF parsed response:', data);

      // The API returns the 3D model URL directly
      if (data.data && data.data[0]) {
        return new Response(JSON.stringify({
          result: `direct_${Date.now()}`,
          status: 'SUCCEEDED',
          model_urls: {
            glb: data.data[0]
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // If no direct result, return pending
      return new Response(JSON.stringify({
        result: `hf_${Date.now()}`,
        status: 'PENDING',
        message: 'Generation started'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check task status
    if (action === 'status') {
      if (!taskId) {
        throw new Error('taskId is required');
      }

      // For direct results, return succeeded
      if (taskId.startsWith('direct_')) {
        return new Response(JSON.stringify({
          status: 'SUCCEEDED',
          progress: 100
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // For HF tasks, simulate progress (HF spaces are synchronous)
      return new Response(JSON.stringify({
        status: 'IN_PROGRESS',
        progress: 50
      }), {
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
