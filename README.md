# 🤖 Zvjazok

> A modern platform for hosting AI-powered video meetings with intelligent agents that can interact, transcribe, and summarize conversations in real-time.

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![tRPC](https://img.shields.io/badge/tRPC-11.6-2596be?logo=trpc)](https://trpc.io/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-0.44-C5F74F?logo=drizzle)](https://orm.drizzle.team/)

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [API Routes](#api-routes)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

Zvjazok is a next-generation video conferencing platform that integrates AI agents into virtual meetings. The platform enables users to create custom AI agents with specific instructions, schedule meetings, and have AI participants that can listen, transcribe, respond, and provide insights during video calls.

### What Makes This Special?

- **AI Agent Integration**: Create and configure AI agents with custom instructions and personalities
- **Real-time Video & Audio**: Powered by Stream Video SDK for high-quality video conferencing
- **Live Transcription**: Automatic transcription of meetings using OpenAI Realtime API
- **Intelligent Summaries**: Post-meeting AI-generated summaries and insights
- **Background Processing**: Asynchronous meeting processing with Inngest
- **Type-Safe APIs**: End-to-end type safety with tRPC

## ✨ Key Features

### 🤖 AI Agent Management

- Create custom AI agents with personalized instructions
- Configure agent behavior and communication style
- Reusable agents across multiple meetings
- Agent performance tracking

### 📹 Video Meetings

- High-quality video conferencing powered by Stream
- Real-time audio and video streaming
- Multiple participants support
- Meeting recording capabilities

### 📝 Meeting Management

- Schedule and organize meetings
- Assign AI agents to meetings
- Track meeting status (upcoming, active, completed, processing, cancelled)
- View meeting history and recordings

### 🎙️ Transcription & Analysis

- Real-time speech-to-text transcription
- AI-powered meeting summaries
- Conversation analysis and insights
- Searchable meeting transcripts

### 🔐 Authentication & Authorization

- Secure authentication with Better Auth
- Email/password and social login support
- Session management
- Protected routes and API endpoints

### 💳 Subscription Management

- Tiered pricing plans
- Usage tracking
- Upgrade flow
- Stripe integration (webhook support)

## 🛠️ Technology Stack

### Core Framework

- **[Next.js 15.5](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development

### Backend & API

- **[tRPC 11.6](https://trpc.io/)** - End-to-end typesafe APIs
- **[Drizzle ORM 0.44](https://orm.drizzle.team/)** - TypeScript ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Database (via Neon)
- **[Better Auth](https://www.better-auth.com/)** - Authentication

### AI & Real-time

- **[OpenAI API](https://openai.com/)** - AI language models
- **[@stream-io/openai-realtime-api](https://getstream.io/)** - Real-time audio transcription
- **[@stream-io/video-react-sdk](https://getstream.io/)** - Video conferencing
- **[Inngest](https://www.inngest.com/)** - Background job processing
- **[@inngest/agent-kit](https://www.inngest.com/)** - AI agent framework

### UI & Styling

- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable components
- **[Lucide Icons](https://lucide.dev/)** - Icon library
- **[React Hook Form](https://react-hook-form.com/)** - Form management
- **[Zod](https://zod.dev/)** - Schema validation

### State & Data Management

- **[TanStack Query](https://tanstack.com/query)** - Data fetching & caching
- **[TanStack Table](https://tanstack.com/table)** - Table component
- **[nuqs](https://nuqs.47ng.com/)** - URL state management

### Developer Experience

- **[ESLint](https://eslint.org/)** - Code linting
- **[Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)** - Database migrations
- **[tsx](https://github.com/privatenumber/tsx)** - TypeScript execution
- **[ngrok](https://ngrok.com/)** - Local webhook testing

## 🏗️ Architecture

### System Architecture

```mermaid
flowchart TD
  subgraph Client["Client Layer"]
    NextJS["Next.js<br/>App Router"]
    React["React 19<br/>Components"]
    Tailwind["Tailwind CSS"]
  end

  subgraph API["API Layer (tRPC)"]
    TRPC["tRPC<br/>Agents / Meetings / Auth"]
  end

  subgraph Business["Business Logic"]
    Server["Server Actions"]
    Inngest["Inngest Functions"]
    Stream["Stream Video SDK"]
  end

  subgraph Data["Data Layer"]
    Drizzle["Drizzle ORM"]
    Postgres["PostgreSQL (Neon)"]
    BetterAuth["Better Auth Sessions"]
  end

  subgraph External["External Services"]
    OpenAI["OpenAI API"]
    StreamIO["Stream.io Video"]
    Stripe["Stripe<br/>Payments"]
  end

  NextJS --> TRPC
  React --> TRPC
  Tailwind --> NextJS
  TRPC --> Server
  Server --> Inngest
  Server --> Stream
  Server --> Drizzle
  Inngest --> Drizzle
  Stream --> OpenAI
  Stream --> StreamIO
  Server --> Stripe
```

### Application Flow

#### 1. **User Authentication Flow**

```
User → Sign In/Up Page → Better Auth → Database → Session Created → Dashboard
```

#### 2. **Agent Creation Flow**

```
User → Agent Form → tRPC Mutation → Validation (Zod) → Database → Agent Created
```

#### 3. **Meeting Creation Flow**

```
User → Meeting Form → Select Agent → tRPC Mutation → Database → Stream Call Created
```

#### 4. **Live Meeting Flow**

```
User Joins → Stream Video Call → OpenAI Realtime API → Live Transcription
                                                      → AI Agent Response
                                                      → Recording Started
```

#### 5. **Post-Meeting Processing Flow**

```
Meeting Ends → Inngest Event Triggered → Background Job
                                       → Fetch Recording
                                       → Generate Transcript
                                       → AI Summary Generation
                                       → Database Update
                                       → User Notification
```

### Key Design Patterns

- **Module-based Architecture**: Features organized by domain (agents, meetings, auth)
- **Server Components**: Leveraging React Server Components for optimal performance
- **API Route Handlers**: RESTful endpoints for webhooks and external integrations
- **Background Jobs**: Asynchronous processing with Inngest for heavy operations
- **Type Safety**: End-to-end type safety from database to UI
- **Component Library**: Reusable UI components with consistent design system

## 🗄️ Database Schema

### Core Tables

#### Users & Authentication

```typescript
user
  ├── id (PK)
  ├── name
  ├── email (unique)
  ├── emailVerified
  ├── image
  ├── createdAt
  └── updatedAt

session
  ├── id (PK)
  ├── userId (FK → user.id)
  ├── token (unique)
  ├── expiresAt
  ├── ipAddress
  ├── userAgent
  ├── createdAt
  └── updatedAt

account
  ├── id (PK)
  ├── userId (FK → user.id)
  ├── providerId
  ├── accountId
  ├── accessToken
  ├── refreshToken
  ├── idToken
  └── ... (OAuth fields)
```

#### Agents

```typescript
agents
  ├── id (PK, nanoid)
  ├── userId (FK → user.id)
  ├── name
  ├── instructions
  ├── createdAt
  └── updatedAt
```

#### Meetings

```typescript
meetings
  ├── id (PK, nanoid)
  ├── userId (FK → user.id)
  ├── agentId (FK → agents.id)
  ├── name
  ├── status (enum: upcoming, active, completed, processing, cancelled)
  ├── startedAt
  ├── endedAt
  ├── transcriptUrl
  ├── recordingUrl
  ├── summary
  ├── transcript
  ├── createdAt
  └── updatedAt
```

### Relationships

- **One-to-Many**: User → Agents, User → Meetings
- **One-to-Many**: Agent → Meetings
- **Cascade Delete**: Deleting a user removes all their agents and meetings
- **Cascade Delete**: Deleting an agent removes all associated meetings

## 📁 Project Structure

```
ai-agents-meetings/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Authentication routes
│   │   │   ├── sign-in/         # Sign in page
│   │   │   └── sign-up/         # Sign up page
│   │   ├── (dashboard)/         # Protected dashboard routes
│   │   │   ├── page.tsx         # Dashboard home
│   │   │   ├── agents/          # Agent management
│   │   │   ├── meetings/        # Meeting management
│   │   │   └── upgrade/         # Subscription upgrade
│   │   ├── call/[meetingId]/    # Live meeting interface
│   │   ├── api/                 # API routes
│   │   │   ├── auth/            # Auth endpoints
│   │   │   ├── chat/            # Chat API
│   │   │   ├── inngest/         # Inngest webhook
│   │   │   ├── trpc/            # tRPC handler
│   │   │   └── webhook/         # External webhooks (Stripe)
│   │   ├── globals.css          # Global styles
│   │   └── layout.tsx           # Root layout
│   │
│   ├── modules/                 # Feature modules
│   │   ├── agents/              # Agent feature
│   │   │   ├── hooks/           # Agent-specific hooks
│   │   │   ├── server/          # Server actions
│   │   │   ├── ui/              # UI components
│   │   │   ├── schemas.ts       # Zod schemas
│   │   │   ├── types.ts         # TypeScript types
│   │   │   └── params.ts        # URL params
│   │   ├── meetings/            # Meeting feature
│   │   ├── auth/                # Authentication
│   │   ├── call/                # Video call
│   │   ├── dashboard/           # Dashboard
│   │   ├── home/                # Home page
│   │   └── upgrade/             # Upgrade flow
│   │
│   ├── components/              # Shared components
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── data-table.tsx       # Reusable data table
│   │   ├── data-pagination.tsx  # Pagination component
│   │   ├── command-select.tsx   # Command palette select
│   │   ├── responsive-dialog.tsx # Responsive modal
│   │   ├── empty-state.tsx      # Empty state UI
│   │   ├── error-state.tsx      # Error state UI
│   │   ├── loading-state.tsx    # Loading state UI
│   │   └── generated-avatar.tsx # Avatar generator
│   │
│   ├── db/                      # Database
│   │   ├── index.ts             # DB client
│   │   └── schema.ts            # Drizzle schema
│   │
│   ├── lib/                     # Utilities
│   │   ├── auth.ts              # Better Auth config
│   │   ├── auth-client.ts       # Auth client
│   │   ├── stream-video.ts      # Stream SDK setup
│   │   ├── utils.ts             # Helper functions
│   │   └── avatar.tsx           # Avatar utilities
│   │
│   ├── trpc/                    # tRPC setup
│   │   ├── init.ts              # tRPC initialization
│   │   ├── client.tsx           # Client provider
│   │   ├── server.tsx           # Server client
│   │   ├── query-client.ts      # TanStack Query client
│   │   └── routers/             # API routers
│   │       └── _app.ts          # Root router
│   │
│   ├── inngest/                 # Background jobs
│   │   └── client.ts            # Inngest client
│   │
│   ├── hooks/                   # Global hooks
│   │   └── use-mobile.ts        # Responsive hook
│   │
│   └── constants.ts             # Global constants
│
├── public/                      # Static assets
├── drizzle/                     # Migration files
├── drizzle.config.ts            # Drizzle configuration
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # Tailwind configuration
├── postcss.config.mjs           # PostCSS configuration
├── eslint.config.mjs            # ESLint configuration
├── components.json              # shadcn/ui configuration
└── package.json                 # Dependencies
```

### Module Structure Pattern

Each feature module follows a consistent structure:

```
modules/[feature]/
├── hooks/           # React hooks for this feature
├── server/          # Server actions and utilities
├── ui/              # UI components
│   ├── components/  # Feature-specific components
│   ├── forms/       # Form components
│   └── views/       # Page views
├── schemas.ts       # Zod validation schemas
├── types.ts         # TypeScript types
└── params.ts        # URL search params definitions
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 20.x or higher
- **npm/pnpm/yarn**: Package manager
- **PostgreSQL**: Database (or use Neon/Supabase)
- **OpenAI API Key**: For AI features
- **Stream.io Account**: For video functionality
- **Inngest Account**: For background jobs

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/kotlovyim/zvjazok.git
cd zvjazok
```

2. **Install dependencies**

```bash
npm install
# or
pnpm install
# or
yarn install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

4. **Configure your `.env.local`** (see [Environment Variables](#environment-variables))

5. **Set up the database**

```bash
npm run db:push
```

6. **Run the development server**

```bash
npm run dev
```

7. **Open your browser**

```
http://localhost:3000
```

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# OpenAI
OPENAI_API_KEY="sk-..."

# Stream Video
NEXT_PUBLIC_STREAM_VIDEO_API_KEY="your-stream-api-key"
STREAM_VIDEO_SECRET_KEY="your-stream-secret-key"

# Inngest
INNGEST_EVENT_KEY="your-inngest-event-key"
INNGEST_SIGNING_KEY="your-inngest-signing-key"

# Stripe (Optional)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Ngrok (for local webhook testing)
NGROK_URL="https://your-subdomain.ngrok-free.dev"
```

### Getting API Keys

#### OpenAI

1. Visit [platform.openai.com](https://platform.openai.com/)
2. Create an account and navigate to API keys
3. Generate a new secret key

#### Stream.io

1. Visit [getstream.io](https://getstream.io/)
2. Create an account and select Video & Audio
3. Create an app and copy the API key and secret

#### Inngest

1. Visit [inngest.com](https://www.inngest.com/)
2. Create an account and workspace
3. Copy the event key and signing key from settings

#### Stripe (Optional)

1. Visit [stripe.com](https://stripe.com/)
2. Create an account
3. Get API keys from Developers → API keys

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Database
npm run db:push         # Push schema changes to database
npm run db:studio       # Open Drizzle Studio (database GUI)

# Webhooks
npm run dev:webhook     # Start ngrok tunnel for webhook testing
```

### Development Workflow

1. **Start the development server**

```bash
npm run dev
```

2. **For webhook testing (parallel terminal)**

```bash
npm run dev:webhook
```

3. **Access Drizzle Studio for database management**

```bash
npm run db:studio
```

### Database Migrations

```bash
# Push schema changes to database
npm run db:push

# Generate migration files (if needed)
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit migrate
```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended rules
- **Formatting**: Consistent code style
- **Components**: PascalCase for components, camelCase for functions
- **Files**: kebab-case for files, PascalCase for component files

## 🛣️ API Routes

### tRPC Endpoints

All tRPC endpoints are available at `/api/trpc/[trpc]`

#### Agents Router

- `agents.getMany` - List all user's agents with pagination
- `agents.getOne` - Get single agent by ID
- `agents.create` - Create new agent
- `agents.update` - Update agent
- `agents.delete` - Delete agent

#### Meetings Router

- `meetings.getMany` - List all user's meetings with pagination
- `meetings.getOne` - Get single meeting by ID
- `meetings.create` - Create new meeting
- `meetings.update` - Update meeting
- `meetings.delete` - Delete meeting
- `meetings.getStats` - Get meeting statistics

### REST Endpoints

#### Authentication

- `POST /api/auth/sign-in` - Sign in user
- `POST /api/auth/sign-up` - Register new user
- `POST /api/auth/sign-out` - Sign out user
- `GET /api/auth/session` - Get current session

#### Chat

- `POST /api/chat` - Chat with AI agent

#### Webhooks

- `POST /api/webhook` - Stripe webhook handler
- `POST /api/inngest` - Inngest webhook handler

## 🎨 UI Components

### Component Library (shadcn/ui)

The project uses [shadcn/ui](https://ui.shadcn.com/) components:

- **Layout**: Card, Separator, Sidebar, Tabs
- **Forms**: Input, Textarea, Select, Checkbox, Switch, Radio
- **Data Display**: Table, Badge, Avatar, Progress
- **Feedback**: Alert, Toast (Sonner), Dialog, Sheet
- **Navigation**: Breadcrumb, Command, Navigation Menu, Pagination
- **Overlay**: Dialog, Drawer, Popover, Tooltip, Hover Card
- **Charts**: Recharts integration

### Custom Components

- **DataTable**: Reusable table with sorting, filtering, and pagination
- **DataPagination**: Pagination controls for tables
- **CommandSelect**: Searchable select with command palette
- **ResponsiveDialog**: Mobile-responsive modal (Dialog/Drawer)
- **GeneratedAvatar**: Dynamic avatar generation with DiceBear
- **EmptyState**: Consistent empty state UI
- **ErrorState**: Error display component
- **LoadingState**: Loading skeleton component

## 🌐 Deployment

### Vercel (Recommended)

1. **Push code to GitHub**

2. **Import to Vercel**
    - Visit [vercel.com](https://vercel.com/)
    - Import your GitHub repository
    - Configure environment variables
    - Deploy

3. **Configure environment variables** in Vercel dashboard

4. **Set up webhooks**
    - Update `BETTER_AUTH_URL` to your production URL
    - Configure Stripe webhook with production URL
    - Update Inngest environment

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Environment Considerations

- ✅ Set all production environment variables
- ✅ Use production database
- ✅ Configure CORS if needed
- ✅ Set up monitoring and error tracking
- ✅ Enable HTTPS
- ✅ Configure webhook URLs

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**

2. **Create a feature branch**

```bash
git checkout -b feature/amazing-feature
```

3. **Make your changes**
    - Follow the existing code style
    - Add tests if applicable
    - Update documentation

4. **Commit your changes**

```bash
git commit -m 'Add some amazing feature'
```

5. **Push to the branch**

```bash
git push origin feature/amazing-feature
```

6. **Open a Pull Request**

### Development Guidelines

- Write clean, readable code
- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure type safety throughout
- Test your changes locally
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [tRPC](https://trpc.io/) - Type-safe APIs
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Stream.io](https://getstream.io/) - Video infrastructure
- [OpenAI](https://openai.com/) - AI capabilities
- [Inngest](https://www.inngest.com/) - Background jobs
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Better Auth](https://www.better-auth.com/) - Authentication

---

**Built with ❤️ using Next.js, TypeScript, and AI**
