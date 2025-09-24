# RYB Bot - Daily Bible Reminder Bot

A multi-channel Telegram bot that sends daily Bible readings with inspirational messages. Built with TypeScript, Supabase, and automated via GitHub Actions.

## 🌟 Features

- **📱 Multi-Channel Broadcasting** - Send to multiple Telegram channels simultaneously
- **📖 Daily Bible Readings** - 60-day reading plan covering Matthew, Luke, John, and Acts
- **💝 Inspirational Messages** - Random encouraging Bible verses with each reading
- **🕘 Automated Scheduling** - Runs daily at 9:00 AM Philippine Time via GitHub Actions
- **📊 Comprehensive Logging** - Track message delivery success/failure per channel
- **🔄 Error Handling** - Graceful handling of partial failures with detailed reporting
- **☁️ Serverless** - No server maintenance required, completely automated

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Configuration](#configuration)
- [Usage](#usage)
- [Data Management](#data-management)
- [Deployment](#deployment)
- [Monitoring](#monitoring)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

## 🛠 Prerequisites

- Node.js 18+ 
- Telegram Bot Token ([Get one from BotFather](https://t.me/BotFather))
- Supabase Account ([Free tier available](https://supabase.com))
- GitHub Repository (for automated scheduling)

## 🚀 Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd ryb-bot
npm install
```

### 2. Environment Configuration

Create `.env` file:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
BOT_TIMEZONE=Asia/Manila
```

### 3. Database Setup

```bash
# Setup Supabase locally (optional)
npx supabase init
npx supabase start

# Apply database schema
npm run supabase:diff -- add_telegram_channels
npm run supabase:push:dev

# Seed initial data
npm run seed:remote
```

## ⚙️ Configuration

### Telegram Channels

Edit `data/channels.json`:

```json
[
  {
    "channel_id": "-1001234567890",
    "channel_name": "My Channel",
    "is_active": true
  },
  {
    "channel_id": "-1009876543210", 
    "channel_name": "Another Channel",
    "is_active": false
  }
]
```

### Reading Plans

Customize `data/reading-plans.json` to modify the Bible reading schedule:

```json
[
  {
    "date": "2025-09-20",
    "book": "Matthew",
    "chapter": "26",
    "passages": [
      "The Plot to Kill Jesus",
      "Jesus Anointed at Bethany"
    ]
  }
]
```

### Encouragements

Add/modify inspirational messages in `data/encouragements.json`:

```json
[
  {
    "message": "For I know the plans I have for you, declares the Lord. (Jeremiah 29:11)",
    "category": "hope"
  }
]
```

## 📱 Usage

### Local Testing

```bash
# Test single message to all channels
npm run test-today

# Test scheduler function locally  
npm run schedule

# Test specific telegram functionality
npm run test-telegram
```

### Manual Channel Management

```bash
# Seed channels from JSON file
npm run seed-channel

# Seed all data (channels, readings, encouragements)
npm run seed-all
```

## 📊 Data Management

### Adding New Channels

1. Get channel ID using the helper script:
   ```bash
   npm run get-channel-id
   ```

2. Add to `data/channels.json`

3. Reseed channels:
   ```bash
   npm run seed-channel
   ```

### Updating Reading Plans

1. Edit `data/reading-plans.json`
2. Reseed data:
   ```bash  
   npm run seed-all
   ```

## 🚀 Deployment

### GitHub Actions Setup (Recommended)

1. **Configure GitHub Secrets** in your repository settings:
   - `TELEGRAM_BOT_TOKEN`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. **Push to GitHub** - The workflow is already configured

3. **Test manually first**:
   - Go to Actions tab in GitHub
   - Click "Daily Bible Reminder" 
   - Click "Run workflow"

4. **Monitor scheduled runs** - Executes daily at 9:00 AM PHT

### Scheduling Details

- **Frequency**: Daily at 9:00 AM Philippine Time (1:00 AM UTC)
- **Timezone**: Asia/Manila
- **Platform**: GitHub Actions (free for public repos)
- **Execution**: Automated, serverless
- **Duration**: ~1-2 seconds per execution

## 📈 Monitoring

### GitHub Actions Dashboard

- View execution logs in GitHub Actions tab
- Monitor success/failure rates
- Check execution duration and channel counts

### Supabase Dashboard  

- View message delivery logs in `message_logs` table
- Monitor channel activity and status
- Track reading plan progress

### Local Monitoring

```bash
# Check recent message logs
# Use Supabase dashboard or write custom queries
```

## 🛠 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the local cron-based bot |
| `npm run schedule` | Run scheduler function once |
| `npm run test-today` | Send today's message to all channels |
| `npm run test-telegram` | Test telegram connectivity |
| `npm run seed-all` | Seed all data from JSON files |
| `npm run seed-channel` | Seed channels only |
| `npm run get-channel-id` | Helper to get Telegram channel IDs |

### Project Structure

```
ryb-bot/
├── .github/workflows/          # GitHub Actions workflows
│   └── daily-bible-reminder.yml
├── data/                       # Configuration files
│   ├── channels.json          # Telegram channels (gitignored)
│   ├── reading-plans.json     # Bible reading schedule
│   └── encouragements.json    # Inspirational messages  
├── scripts/                   # Utility scripts
│   ├── seed-all.ts           # Comprehensive data seeder
│   └── get-channel-id.ts     # Channel ID helper
├── src/                      # Source code
│   ├── lib/                  # Core libraries
│   │   ├── telegram.ts       # Multi-channel Telegram API
│   │   ├── supabase.ts       # Database connection
│   │   └── supabase-message-composer.ts # Message formatting
│   ├── scheduled-send.ts     # GitHub Actions scheduler
│   ├── index.ts             # Local cron-based bot
│   └── test-today-message.ts # Testing utilities
└── supabase/                # Database schema and functions
    ├── migrations/          # Database migrations
    └── schemas/            # Schema definitions
```

## 🐛 Troubleshooting

### Common Issues

**Bot not sending messages:**
- Check GitHub Actions logs for errors
- Verify GitHub Secrets are correctly set
- Ensure bot is admin in all target channels

**Database connection issues:**
- Verify Supabase URL and service key
- Check if database schema is up to date
- Run migrations if needed

**Channel not receiving messages:**
- Verify channel ID in `data/channels.json`
- Check if channel is marked as `is_active: true`
- Ensure bot is admin in the channel

### Debug Commands

```bash
# Test database connectivity
npm run seed-all

# Test Telegram connectivity  
npm run test-telegram

# Check channel configuration
npm run get-channel-id

# Test full workflow locally
npm run schedule
```

### Logs and Monitoring

- **GitHub Actions**: Check workflow logs in GitHub repository
- **Supabase**: Monitor logs in Supabase dashboard
- **Local**: Console outputs show detailed execution information

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm run schedule`
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review GitHub Actions logs
- Create an issue in the repository

---

*Built with ❤️ for daily Bible study and encouragement*