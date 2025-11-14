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
    const meshyApiKey = Deno.env.get('MESHY_API_KEY');
    if (!meshyApiKey) {
      throw new Error('MESHY_API_KEY is not configured');
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    // Check task status
    if (action === 'status') {
      const { taskId } = await req.json();
      console.log('Checking status for task:', taskId);

      const statusResponse = await fetch(`https://api.meshy.ai/openapi/v2/image-to-3d/${taskId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${meshyApiKey}`,
        },
      });

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text();
        console.error('Meshy API status error:', statusResponse.status, errorText);
        throw new Error(`Meshy API error: ${statusResponse.status}`);
      }

      const statusData = await statusResponse.json();
      console.log('Task status:', statusData);

      return new Response(JSON.stringify(statusData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create new 3D generation task
    const formData = await req.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      throw new Error('No image file provided');
    }

    console.log('Creating 3D generation task for image:', imageFile.name);

    // Create FormData for Meshy API
    const meshyFormData = new FormData();
    meshyFormData.append('image_file', imageFile);
    meshyFormData.append('enable_pbr', 'true');
    meshyFormData.append('topology', 'quad');

    const createResponse = await fetch('https://api.meshy.ai/openapi/v2/image-to-3d', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${meshyApiKey}`,
      },
      body: meshyFormData,
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('Meshy API create error:', createResponse.status, errorText);
      throw new Error(`Meshy API error: ${createResponse.status}`);
    }

    const createData = await createResponse.json();
    console.log('Task created:', createData);

    return new Response(JSON.stringify(createData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in image-to-3d function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
