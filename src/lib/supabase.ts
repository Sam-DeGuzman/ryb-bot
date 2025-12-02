import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase environment variables');
}

// Use service role key for server-side operations
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Database types
export interface DBReading {
  id: number;
  date: string;
  book: string;
  chapter: string;
  passages: string[];
  esv_link: string | null;
  created_at: string;
  updated_at: string;
}

export interface DBEncouragement {
  id: number;
  message: string;
  category: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DBTelegramChannel {
  id: number;
  channel_id: string;
  channel_name: string | null;
  message_thread_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DBMessageLog {
  id: number;
  sent_at: string;
  reading_plan_id: number | null;
  encouragement_id: number | null;
  telegram_channel_id: number | null;
  message_content: string | null;
  status: string;
  error_message: string | null;
}