import dotenv from 'dotenv';
import { sendMessage } from './lib/telegram';
import { composeDailyMessage, logMessageForChannel, getTodayReading } from './lib/supabase-message-composer';

dotenv.config();

// Function to get current PHT time
function getPHTTime(): Date {
  const now = new Date();
  // Convert to PHT (UTC+8)
  const phtTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
  return phtTime;
}

// Function to format PHT time for logging
function formatPHTTime(date: Date): string {
  return date.toLocaleString('en-US', {
    timeZone: 'Asia/Manila',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// Main scheduled send function
async function scheduledSend(): Promise<void> {
  const startTime = getPHTTime();
  console.log(`🤖 Daily Bible Reminder Starting at ${formatPHTTime(startTime)}`);
  console.log(`⏰ Scheduled execution for 9:00 AM Philippine Time`);
  
  try {
    // Compose the daily message
    console.log('📝 Composing daily Bible message...');
    const message = await composeDailyMessage();
    
    if (!message) {
      throw new Error('Failed to compose daily message');
    }
    
    console.log('📖 Message composed successfully');
    console.log('📤 Sending to all active channels...');
    
    // Send to all channels
    const results = await sendMessage(message);
    
    // Get today's reading for logging
    const reading = await getTodayReading();
    
    // Log successful sends
    console.log(`✅ Successfully sent to ${results.successful.length} channels`);
    for (const channelId of results.successful) {
      await logMessageForChannel(
        reading?.id || null,
        null,
        message,
        channelId,
        'sent'
      );
      console.log(`  ✓ Channel: ${channelId}`);
    }
    
    // Log failed sends
    if (results.failed.length > 0) {
      console.log(`❌ Failed to send to ${results.failed.length} channels`);
      for (const failed of results.failed) {
        await logMessageForChannel(
          reading?.id || null,
          null,
          message,
          failed.channelId,
          'failed',
          failed.error?.message || 'Unknown error'
        );
        console.log(`  ✗ Channel: ${failed.channelId} - Error: ${failed.error?.message || 'Unknown error'}`);
      }
    }
    
    const endTime = getPHTTime();
    const duration = endTime.getTime() - startTime.getTime();
    
    console.log(`\n📊 Execution Summary:`);
    console.log(`  • Started: ${formatPHTTime(startTime)}`);
    console.log(`  • Completed: ${formatPHTTime(endTime)}`);
    console.log(`  • Duration: ${duration}ms`);
    console.log(`  • Channels: ${results.successful.length} successful, ${results.failed.length} failed`);
    console.log(`  • Total Channels: ${results.successful.length + results.failed.length}`);
    
    if (results.failed.length > 0) {
      console.log(`\n⚠️ Warning: Some channels failed. Check the logs above for details.`);
      // Exit with warning code but don't fail the entire workflow
      process.exitCode = 1;
    } else {
      console.log(`\n🎉 All channels received the daily Bible reminder successfully!`);
    }
    
  } catch (error) {
    const endTime = getPHTTime();
    console.error(`\n❌ Fatal Error at ${formatPHTTime(endTime)}:`);
    console.error(error);
    
    // Try to log the failure
    try {
      console.log('📝 Attempting to log failure to database...');
      // This would need a special error logging function if you want to track system failures
      // For now, we'll just log to console since the main error is already captured above
    } catch (logError) {
      console.error('Failed to log error to database:', logError);
    }
    
    process.exit(1);
  }
}

// Execute the scheduled send
if (require.main === module) {
  scheduledSend().catch((error) => {
    console.error('Unhandled error in scheduled send:', error);
    process.exit(1);
  });
}

export { scheduledSend };