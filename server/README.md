# Server Directory

This directory contains server-side utilities, database scripts, and backend configuration files for the Moise 2.0 project.

## Structure

```
server/
├── database/              # Database scripts and migrations
│   ├── 001_create_database_schema.sql
│   └── 002_create_profile_trigger.sql
└── README.md             # This file
```

## Database Scripts

The database scripts should be run in order to set up your Supabase database:

1. `001_create_database_schema.sql` - Creates the main database schema
2. `002_create_profile_trigger.sql` - Creates user profile triggers

## Usage

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Run the scripts in numerical order
4. Ensure all tables and triggers are created successfully

## Environment Setup

Make sure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
