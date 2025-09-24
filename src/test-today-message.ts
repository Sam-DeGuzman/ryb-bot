import dotenv from 'dotenv';
import { sendMessage } from './lib/telegram';
import { composeDailyMessage, logMessageForChannel } from './lib/supabase-message-composer';

dotenv.config();

async function testTodayMessage() {
  console.log('📤 Testing today\'s reading message to all active channels...');
  
  try {
    const message = await composeDailyMessage();
    
    if (message) {
      console.log('📝 Message composed successfully:');
      console.log('---');
      console.log(message);
      console.log('---');
      
      const results = await sendMessage(message);
      
      // Log results for each channel
      const { getTodayReading } = await import('./lib/supabase-message-composer');
      const reading = await getTodayReading();
      
      // Log successful sends
      for (const channelId of results.successful) {
        await logMessageForChannel(
          reading?.id || null,
          null,
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
      
      console.log('\n✅ Test completed!');
      console.log(`✅ Successfully sent to ${results.successful.length} channels`);
      console.log(`❌ Failed to send to ${results.failed.length} channels`);
      
      if (results.failed.length > 0) {
        console.log('\n❌ Failed channels:');
        results.failed.forEach(fail => {
          console.log(`  • ${fail.channelId}: ${fail.error?.message || 'Unknown error'}`);
        });
      }
    } else {
      console.error('❌ Failed to compose today\'s message');
    }
  } catch (error) {
    console.error('❌ Error sending today\'s message:', error);
  }
}

testTodayMessage();