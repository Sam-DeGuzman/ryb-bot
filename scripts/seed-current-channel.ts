import dotenv from 'dotenv';
import { supabase } from '../src/lib/supabase';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

// Load channels from external JSON file
function loadChannelsFromFile(): any[] {
  try {
    const channelsPath = path.join(__dirname, '..', 'data', 'channels.json');
    const channelsData = fs.readFileSync(channelsPath, 'utf8');
    const channels = JSON.parse(channelsData);
    
    return channels;
  } catch (error) {
    console.error('❌ Error loading channels.json:', error);
    console.log('💡 Make sure data/channels.json exists and is valid JSON');
    process.exit(1);
  }
}

async function seedChannels() {
  console.log('🌱 Seeding channels to telegram_channels table...');
  
  // Load channels from JSON file
  const channelsToSeed = loadChannelsFromFile();
  console.log(`📂 Loaded ${channelsToSeed.length} channels from data/channels.json`);
  
  // Filter out empty channel IDs
  const validChannels = channelsToSeed.filter(channel => channel.channel_id);
  
  if (validChannels.length === 0) {
    console.error('❌ No valid channel IDs found. Please check your configuration.');
    process.exit(1);
  }
  
  let seededCount = 0;
  let skippedCount = 0;
  
  for (const channelData of validChannels) {
    console.log(`\n📤 Processing channel: ${channelData.channel_name} (${channelData.channel_id})`);
    
    // Check if channel already exists
    const { data: existingChannel } = await supabase
      .from('telegram_channels')
      .select('*')
      .eq('channel_id', channelData.channel_id)
      .single();
    
    if (existingChannel) {
      console.log('⏭️  Channel already exists, skipping...');
      skippedCount++;
      continue;
    }
    
    // Insert the channel
    const { data, error } = await supabase
      .from('telegram_channels')
      .insert(channelData)
      .select()
      .single();
    
    if (error) {
      console.error(`❌ Error seeding channel ${channelData.channel_id}:`, error);
      continue;
    }
    
    console.log('✅ Successfully seeded channel:', data);
    seededCount++;
  }
  
  console.log(`\n🎯 Seeding complete:`);
  console.log(`  • ${seededCount} channels seeded`);
  console.log(`  • ${skippedCount} channels skipped (already exist)`);
  console.log('📝 You can now manage channels via Supabase dashboard');
  
  // Show current active channels
  const { data: channels } = await supabase
    .from('telegram_channels')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true });
  
  console.log('\n📋 All active channels:');
  channels?.forEach((channel, index) => {
    console.log(`  ${index + 1}. ${channel.channel_name} (${channel.channel_id})`);
  });
}

seedChannels().catch(console.error);