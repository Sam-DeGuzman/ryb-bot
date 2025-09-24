// test-bot.ts
import TelegramBot from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {
    polling: false,
});
const channelId = process.env.TELEGRAM_CHANNEL_ID!;

async function testMessage() {
    try {
        await bot.sendMessage(
            channelId,
            '✅ Bot successfully connected! Ready to send daily Bible reminders.'
        );
        console.log('Test message sent successfully!');
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

testMessage();
