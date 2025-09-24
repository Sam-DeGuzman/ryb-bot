// src/get-channel-id.ts
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true });

console.log('================================');
console.log('Bot is now listening...');
console.log('');
console.log('STEPS:');
console.log('1. Make sure bot is admin in your channel/group');
console.log('2. Send a message in your channel/group');
console.log('3. The Channel ID will appear below');
console.log('================================\n');

// Listen for regular group messages
bot.on('message', (msg) => {
    console.log('✅ Found your Group!');
    console.log('Group ID:', msg.chat.id);
    console.log('Group Name:', msg.chat.title);
    console.log('\nAdd this to your .env file:');
    console.log(`TELEGRAM_CHANNEL_ID=${msg.chat.id}`);
    console.log('\nPress Ctrl+C to exit');
});

// Listen for channel posts
bot.on('channel_post', (msg) => {
    console.log('✅ Found your Channel!');
    console.log('Channel ID:', msg.chat.id);
    console.log('Channel Name:', msg.chat.title);
    console.log('\nAdd this to your .env file:');
    console.log(`TELEGRAM_CHANNEL_ID=${msg.chat.id}`);
    console.log('\nPress Ctrl+C to exit');
});

bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});
