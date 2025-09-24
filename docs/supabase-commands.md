# Supabase Commands

## Authentication
```bash
npx supabase login
```

## Project Management
```bash
# Link to existing project
npx supabase link --project-ref your-project-ref

# Start local development
npx supabase start

# Stop local development
npx supabase stop

# Reset local database
npx supabase db reset
```

## Database Management
```bash
# Generate migration from schema changes (local vs local)
npx supabase db diff --file migration_name

# Generate migration from linked project to local (requires local DB running)
npx supabase db diff --linked --file migration_name

# Generate migration from remote schema changes (no local DB needed)
npx supabase db diff --db-url "postgresql://..." --file migration_name

# Apply migrations
npx supabase db push

# Pull remote schema to local
npx supabase db pull

# Reset and seed database
npx supabase db reset --seed
```

## Functions
```bash
# Create new function
npx supabase functions new function-name

# Deploy function
npx supabase functions deploy function-name

# Deploy all functions
npx supabase functions deploy

# View function logs
npx supabase functions logs function-name
```

## Types Generation
```bash
# Generate TypeScript types
npx supabase gen types typescript --project-id your-project-id > src/types/supabase.ts
```

## Local Development
```bash
# Start local Supabase (includes DB, Auth, API, etc.)
npx supabase start

# View local dashboard
# Visit: http://localhost:54333

# Local API URL: http://localhost:54331
# Local DB URL: postgresql://postgres:postgres@localhost:54332/postgres
```

## Database Seeding

### Local Development
```bash
# Seed local database (safe to run repeatedly)
npm run seed
```

### Remote Development (Production-like)
```bash
# ⚠️ CAUTION: Only seed remote when absolutely necessary
# This will clear existing data in your remote database
npm run seed:dev
```

**Important Notes:**
- The seeder has `clearExistingData()` commented out by default for safety
- Always test locally first before seeding remote
- Remote seeding should only be done during initial setup or major resets

## Useful Scripts
```bash
# Test today's message
npm run test-today

# Link to Supabase project (uses remote .env variables)
npm run supabase:link

# Generate migration from linked project (requires local DB running)
npm run supabase:diff migration_name

# Generate migration from remote database only (requires Docker)
npm run supabase:diff-remote migration_name

# Push migrations to development environment
npm run supabase:push:dev

# Alternative: Manual migration creation
# 1. Create migration file manually in supabase/migrations/
# 2. Use SQL schema comparison tools or write DDL directly
```