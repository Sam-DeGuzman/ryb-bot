import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { supabase, DBTelegramChannel } from './supabase';

dotenv.config();

export const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {
    polling: false,
});

export async function getActiveChannels(): Promise<DBTelegramChannel[]> {
    const { data, error } = await supabase
        .from('telegram_channels')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });
    
    if (error) {
        console.error('Error fetching active channels:', error);
        return [];
    }
    
    return data || [];
}

export async function sendMessageToChannel(channelId: string, message: string): Promise<void> {
    try {
        await bot.sendMessage(channelId, message, {
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
        });
        console.log(`Message sent successfully to channel ${channelId}`);
    } catch (error) {
        console.error(`Error sending message to channel ${channelId}:`, error);
        throw error;
    }
}

export async function sendMessage(message: string): Promise<{ successful: string[], failed: { channelId: string, error: any }[] }> {
    const channels = await getActiveChannels();
    const results = { successful: [] as string[], failed: [] as { channelId: string, error: any }[] };
    
    if (channels.length === 0) {
        console.log('⚠️ No active channels found');
        return results;
    }
    
    await Promise.allSettled(
        channels.map(async (channel) => {
            try {
                await sendMessageToChannel(channel.channel_id, message);
                results.successful.push(channel.channel_id);
            } catch (error) {
                results.failed.push({ channelId: channel.channel_id, error });
            }
        })
    );
    
    console.log(`Message sent to ${results.successful.length}/${channels.length} channels`);
    if (results.failed.length > 0) {
        console.error(`Failed channels:`, results.failed);
    }
    
    return results;
}

// Test function when running the script directly
if (require.main === module) {
    async function testChannelSend() {
        console.log('🧪 Testing multi-channel message sending...');
        
        const testMessage = `📝 *Test Message*
        
This is a test message to verify multi-channel broadcasting.
        
🕐 Sent at: ${new Date().toLocaleString()}`;
        
        try {
            const results = await sendMessage(testMessage);
            console.log('\n✅ Test completed!');
            console.log(`✅ Success: ${results.successful.length} channels`);
            console.log(`❌ Failed: ${results.failed.length} channels`);
        } catch (error) {
            console.error('❌ Test failed:', error);
        }
    }
    
    testChannelSend();
}
