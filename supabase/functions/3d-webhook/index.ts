import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Verify webhook signature using HMAC-SHA256
async function verifySignature(payload: string, signature: string | null, secret: string): Promise<boolean> {
  if (!signature) {
    console.log('No signature provided');
    return false;
  }

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signatureBytes = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(payload)
    );

    const expectedSignature = Array.from(new Uint8Array(signatureBytes))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Compare signatures (handle both with and without prefix)
    const receivedSig = signature.replace(/^sha256=/, '').toLowerCase();
    const isValid = receivedSig === expectedSignature.toLowerCase();
    
    console.log('Signature verification:', { isValid, receivedLength: receivedSig.length });
    return isValid;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET');
    
    if (!WEBHOOK_SECRET) {
      console.error('WEBHOOK_SECRET not configured');
      return new Response('Server configuration error', { status: 500 });
    }

    // Get raw body for signature verification
    const rawBody = await req.text();
    
    // Get signature from headers (try common header names)
    const signature = req.headers.get('x-signature') || 
                     req.headers.get('x-webhook-signature') ||
                     req.headers.get('x-hub-signature-256') ||
                     req.headers.get('authorization');

    // Verify signature
    const isValid = await verifySignature(rawBody, signature, WEBHOOK_SECRET);
    
    if (!isValid) {
      console.error('Invalid webhook signature - rejecting request');
      return new Response('Unauthorized - Invalid signature', { 
        status: 401,
        headers: corsHeaders 
      });
    }

    console.log('Webhook signature verified successfully');

    const body = JSON.parse(rawBody);
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
