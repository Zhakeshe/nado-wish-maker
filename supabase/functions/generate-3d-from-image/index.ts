import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const MESHY_API_KEY = Deno.env.get('MESHY_API_KEY');
    if (!MESHY_API_KEY) {
      throw new Error('MESHY_API_KEY is not configured');
    }

    const { action, imageUrl, taskId } = await req.json();
    console.log(`Meshy API action: ${action}`, { imageUrl, taskId });

    // Create image-to-3D task
    if (action === 'create') {
      if (!imageUrl) {
        throw new Error('imageUrl is required');
      }

      const response = await fetch('https://api.meshy.ai/v1/image-to-3d', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MESHY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: imageUrl,
          enable_pbr: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Meshy API error:', response.status, errorText);
        throw new Error(`Meshy API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Meshy task created:', data);

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check task status
    if (action === 'status') {
      if (!taskId) {
        throw new Error('taskId is required');
      }

      const response = await fetch(`https://api.meshy.ai/v1/image-to-3d/${taskId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${MESHY_API_KEY}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Meshy API status error:', response.status, errorText);
        throw new Error(`Meshy API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Meshy task status:', data);

      return new Response(JSON.stringify(data), {
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
