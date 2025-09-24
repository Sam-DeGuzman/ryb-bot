import dotenv from 'dotenv';
import { supabase } from '../src/lib/supabase';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

// Load data from external JSON files
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

function loadReadingPlansFromFile(): SeedReading[] {
  try {
    const readingPlansPath = path.join(__dirname, '..', 'data', 'reading-plans.json');
    const readingPlansData = fs.readFileSync(readingPlansPath, 'utf8');
    const readingPlans = JSON.parse(readingPlansData);
    
    return readingPlans;
  } catch (error) {
    console.error('❌ Error loading reading-plans.json:', error);
    console.log('💡 Make sure data/reading-plans.json exists and is valid JSON');
    process.exit(1);
  }
}

function loadEncouragementsFromFile(): SeedEncouragement[] {
  try {
    const encouragementsPath = path.join(__dirname, '..', 'data', 'encouragements.json');
    const encouragementsData = fs.readFileSync(encouragementsPath, 'utf8');
    const encouragements = JSON.parse(encouragementsData);
    
    return encouragements;
  } catch (error) {
    console.error('❌ Error loading encouragements.json:', error);
    console.log('💡 Make sure data/encouragements.json exists and is valid JSON');
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
  
  console.log(`\n🎯 Channel seeding complete:`);
  console.log(`  • ${seededCount} channels seeded`);
  console.log(`  • ${skippedCount} channels skipped (already exist)`);
  
  return { seededCount, skippedCount };
}

interface SeedReading {
  date: string;
  book: string;
  chapter: string;
  passages: string[];
  esv_link?: string;
}

interface SeedEncouragement {
  message: string;
  category?: string;
}

async function seedReadingPlans(readings: SeedReading[]) {
  console.log('📚 Seeding reading plans...');
  let insertedCount = 0;
  let skippedCount = 0;

  for (const reading of readings) {
    // Check if reading plan already exists for this date
    const { data: existing } = await supabase
      .from('reading_plans')
      .select('id')
      .eq('date', reading.date)
      .single();

    if (existing) {
      skippedCount++;
      continue;
    }

    const { error } = await supabase
      .from('reading_plans')
      .insert({
        date: reading.date,
        book: reading.book,
        chapter: reading.chapter,
        passages: reading.passages,
        esv_link: reading.esv_link || null
      });

    if (error) {
      console.error(`Error inserting reading for ${reading.date}:`, error);
    } else {
      insertedCount++;
    }
  }

  console.log(`📚 Reading plans: ${insertedCount} inserted, ${skippedCount} skipped`);
}

async function seedEncouragements(encouragements: SeedEncouragement[]) {
  console.log('💝 Seeding encouragements...');
  let insertedCount = 0;
  let skippedCount = 0;

  for (const encouragement of encouragements) {
    // Check if encouragement already exists
    const { data: existing } = await supabase
      .from('encouragements')
      .select('id')
      .eq('message', encouragement.message)
      .single();

    if (existing) {
      skippedCount++;
      continue;
    }

    const { error } = await supabase
      .from('encouragements')
      .insert({
        message: encouragement.message,
        category: encouragement.category || null,
        is_active: true
      });

    if (error) {
      console.error(`Error inserting encouragement:`, error);
    } else {
      insertedCount++;
    }
  }

  console.log(`💝 Encouragements: ${insertedCount} inserted, ${skippedCount} skipped`);
}

async function seedReadingPlansAndEncouragements() {
  console.log('\n📖 Seeding reading plans and encouragements...');
  
  try {
    // Load data from JSON files
    const readingPlan = loadReadingPlansFromFile();
    const encouragements = loadEncouragementsFromFile();
    
    console.log(`📂 Loaded ${readingPlan.length} reading plans from data/reading-plans.json`);
    console.log(`📂 Loaded ${encouragements.length} encouragements from data/encouragements.json`);

    // Seed the data
    await seedReadingPlans(readingPlan);
    await seedEncouragements(encouragements);
    
    console.log('✅ Reading plans and encouragements seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding reading plans and encouragements:', error);
  }
}

async function showFinalStatus() {
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
  
  // Show reading plans count
  const { count: readingCount } = await supabase
    .from('reading_plans')
    .select('*', { count: 'exact', head: true });
  
  // Show encouragements count
  const { count: encouragementCount } = await supabase
    .from('encouragements')
    .select('*', { count: 'exact', head: true });
  
  console.log('\n📊 Database Summary:');
  console.log(`  • Channels: ${channels?.length || 0} active`);
  console.log(`  • Reading Plans: ${readingCount || 0}`);
  console.log(`  • Encouragements: ${encouragementCount || 0}`);
  console.log('\n📝 You can now manage all data via Supabase dashboard');
}

async function seedAll() {
  console.log('🚀 Starting comprehensive database seeding...\n');
  
  try {
    // Seed channels first
    await seedChannels();
    
    // Seed reading plans and encouragements
    await seedReadingPlansAndEncouragements();
    
    // Show final status
    await showFinalStatus();
    
    console.log('\n🎉 All seeding completed successfully!');
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedAll().catch(console.error);