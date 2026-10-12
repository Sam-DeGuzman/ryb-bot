import dotenv from 'dotenv';
import { sendMessageToChannel, sendAudioToChannel } from './lib/telegram';
import { composeDailyMessage, getTodayReading } from './lib/supabase-message-composer';

dotenv.config();

const TEST_CHANNEL_ID = '-1003111949631';
const TEST_THREAD_ID = 418;

async function testReminder(): Promise<void> {
    console.log(`🧪 Sending test reminder to channel ${TEST_CHANNEL_ID}...`);

    const message = await composeDailyMessage();
    if (!message) {
        console.error('❌ Failed to compose daily message');
        process.exit(1);
    }

    const reading = await getTodayReading();

    await sendMessageToChannel(TEST_CHANNEL_ID, message, TEST_THREAD_ID);
    console.log('✅ Text message sent');

    if (reading?.audio_url) {
        await sendAudioToChannel(TEST_CHANNEL_ID, reading.audio_url, TEST_THREAD_ID);
        console.log('✅ Audio sent');
    } else {
        console.log('ℹ️  No audio URL for today\'s reading — skipping audio');
    }
}

testReminder().catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});
