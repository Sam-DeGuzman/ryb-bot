import * as cron from 'node-cron';
import dotenv from 'dotenv';
import { sendMessageToAllChannels } from './lib/telegram';
import { composeDailyMessage, logMessageForChannel } from './lib/supabase-message-composer';

dotenv.config();

console.log('🤖 Bible Reminder Bot Starting (Supabase Edition)...');

// Test function to send immediate message to all channels
async function testMessage() {
  console.log('📤 Sending test message from Supabase to all channels...');
  const message = await composeDailyMessage();
  
  if (message) {
    await sendToAllChannelsWithLogging(message);
    console.log('✅ Test message sent successfully to all channels!');
  } else {
    console.error('❌ Failed to compose message');
  }
}

// Helper function to send message to all channels and log results
async function sendToAllChannelsWithLogging(message: string) {
  const results = await sendMessageToAllChannels(message);
  const today = new Date();
  const todayReading = await import('./lib/supabase-message-composer').then(m => m.getTodayReading());
  const reading = await todayReading;
  
  // Log successful sends
  for (const channelId of results.successful) {
    await logMessageForChannel(
      reading?.id || null,
      null, // We'd need to track encouragement ID separately if needed
      message,
      channelId,
      'sent'
    );
  }
  
  // Log failed sends
  for (const failed of results.failed) {
    await logMessageForChannel(
      reading?.id || null,
      null,
      message,
      failed.channelId,
      'failed',
      failed.error?.message || 'Unknown error'
    );
  }
}

// Schedule daily message at 9:00 AM
const job = cron.schedule(
  '0 9 * * *', // Cron expression for 9:00 AM daily
  async function() {
    console.log('⏰ Sending scheduled daily reminder to all channels...');
    const message = await composeDailyMessage();
    
    if (message) {
      try {
        await sendToAllChannelsWithLogging(message);
        console.log('✅ Daily message sent successfully to all channels');
      } catch (error) {
        console.error('❌ Error sending daily message:', error);
      }
    }
  },
  {
    scheduled: true,
    timezone: process.env.BOT_TIMEZONE || 'Asia/Manila'
  }
);

console.log('✅ Bot is running with Supabase and scheduled for 9:00 AM daily');
console.log(`⏰ Timezone: ${process.env.BOT_TIMEZONE || 'Asia/Manila'}`);
console.log('📊 Dashboard: Visit your Supabase dashboard to manage readings');

// Uncomment to send a test message immediately
// testMessage();