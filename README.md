# ManalBeauty

A modern beauty salon management system built with Next.js, Supabase, and Tailwind CSS. This application provides a complete solution for beauty salons to manage bookings, services, clients, and more.

## Features

- 🌐 Multilingual support (Arabic and English)
- 📱 Responsive design for all devices
- 🔒 Secure authentication for clients and administrators
- 📅 Booking management system
- 💼 Service management
- 👤 Client profiles and history
- 📊 Admin dashboard with analytics
- 📝 Treatment plans and reports

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/manaljcenter/ManalBeauty.git
   cd ManalBeauty
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase credentials and other required variables

   ```bash
   cp .env.example .env.local
   ```

4. Set up the database:
   - Create a new Supabase project
   - Run the SQL scripts in the `scripts` directory to set up the database schema

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Database Setup

The application requires several tables in your Supabase database. You can set these up by running the SQL scripts in the `scripts` directory:

1. `client-schema-for-sql-editor.sql` - Creates the basic client tables
2. `setup-client-schema.sql` - Sets up the client schema with relationships

You can run these scripts in the Supabase SQL Editor.

## Environment Variables

The following environment variables are required:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for admin operations)
- `AUTH_SECRET` - A random string for JWT authentication
- `POSTGRES_URL` - Your PostgreSQL connection string

## Deployment

The easiest way to deploy this application is using Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Set up the environment variables
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)
