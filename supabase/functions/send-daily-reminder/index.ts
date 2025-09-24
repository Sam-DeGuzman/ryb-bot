import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get today's reading
    const today = new Date().toISOString().split('T')[0]
    const { data: reading, error: readingError } = await supabaseClient
      .from('reading_plans')
      .select('*')
      .eq('date', today)
      .single()

    if (readingError || !reading) {
      throw new Error('No reading found for today')
    }

    // Get random encouragement
    const { data: encouragements } = await supabaseClient
      .from('encouragements')
      .select('*')
      .eq('is_active', true)
    
    const encouragement = encouragements?.[
      Math.floor(Math.random() * encouragements.length)
    ]

    // Format message
    const esvLink = reading.esv_link || 
      `https://www.esv.org/${reading.book.replace(/\s+/g, '+')}+${reading.chapter}/`
    
    let passagesFormatted = ''
    if (reading.passages && reading.passages.length > 0) {
      if (reading.passages.length === 1) {
        passagesFormatted = `📝 ${reading.passages[0]}`
      } else {
        passagesFormatted = '📝 Today\'s passages:\n' + 
          reading.passages.map((p: string) => `  • ${p}`).join('\n')
      }
    }

    const message = `
📖 *Today's Bible Reading*
📅 ${new Date().toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}

📚 *${reading.book} ${reading.chapter}*
${passagesFormatted}

🔗 *Read on ESV:* [Click here to read](${esvLink})

💝 *Daily Encouragement*
${encouragement?.message || 'Have a blessed day!'}

_Have a blessed day! 🙏_
    `.trim()

    // Send to Telegram
    const telegramToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
    const channelId = Deno.env.get('TELEGRAM_CHANNEL_ID')
    
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${telegramToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: channelId,
          text: message,
          parse_mode: 'Markdown',
          disable_web_page_preview: true
        })
      }
    )

    if (!telegramResponse.ok) {
      throw new Error('Failed to send Telegram message')
    }

    // Log the message
    await supabaseClient
      .from('message_logs')
      .insert({
        reading_plan_id: reading.id,
        encouragement_id: encouragement?.id,
        message_content: message,
        status: 'sent'
      })

    return new Response(
      JSON.stringify({ success: true, message: 'Daily reminder sent!' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})