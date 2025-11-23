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

    const contentType = req.headers.get('content-type') || '';
    
    // Check task status (JSON request with taskId)
    if (contentType.includes('application/json')) {
      const body = await req.json();
      
      if (body.taskId) {
        const taskId = body.taskId;
        console.log('Checking status for task:', taskId);

        const statusResponse = await fetch(`https://api.meshy.ai/openapi/v1/image-to-3d/${taskId}`, {
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
      
      throw new Error('Invalid JSON request: taskId is required');
    }

    // Create new 3D generation task (FormData request with image)
    const formData = await req.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      throw new Error('No image file provided');
    }

    console.log('Creating 3D generation task for image:', imageFile.name);

    // Convert image to base64 data URI using chunks to avoid stack overflow
    const arrayBuffer = await imageFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Convert to base64 in chunks to avoid Maximum call stack size exceeded
    let binary = '';
    const chunkSize = 0x8000; // 32KB chunks
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
      binary += String.fromCharCode(...chunk);
    }
    const base64 = btoa(binary);
    
    const mimeType = imageFile.type || 'image/jpeg';
    const dataUri = `data:${mimeType};base64,${base64}`;

    // Create request body for Meshy API
    const requestBody = {
      image_url: dataUri,
      enable_pbr: true,
      topology: 'triangle',
      ai_model: 'meshy-4',
    };

    const createResponse = await fetch('https://api.meshy.ai/openapi/v1/image-to-3d', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${meshyApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
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
