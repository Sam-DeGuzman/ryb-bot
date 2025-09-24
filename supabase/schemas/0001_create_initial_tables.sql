-- Create reading_plans table
CREATE TABLE reading_plans (
  id SERIAL PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  book VARCHAR(50) NOT NULL,
  chapter VARCHAR(20) NOT NULL,
  passages TEXT[] NOT NULL DEFAULT '{}',
  esv_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create encouragements table
CREATE TABLE encouragements (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  category VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create message_logs table (to track sent messages)
CREATE TABLE message_logs (
  id SERIAL PRIMARY KEY,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  reading_plan_id INTEGER REFERENCES reading_plans(id),
  encouragement_id INTEGER REFERENCES encouragements(id),
  message_content TEXT,
  status VARCHAR(20) DEFAULT 'sent',
  error_message TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_reading_plans_date ON reading_plans(date);
CREATE INDEX idx_encouragements_active ON encouragements(is_active);
CREATE INDEX idx_message_logs_sent_at ON message_logs(sent_at);
