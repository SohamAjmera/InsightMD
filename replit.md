# InsightMD Medical Platform

## Overview

InsightMD is a comprehensive medical platform built with a modern full-stack architecture. It's designed as a medical dashboard that provides patient management, appointment scheduling, telehealth capabilities, AI-powered medical insights, and comprehensive analytics for healthcare providers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom medical theme colors
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API endpoints
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Connect-pg-simple for PostgreSQL-backed sessions
- **AI Integration**: Google Gemini AI for medical analysis and insights

### Key Components

#### Database Schema
The application uses a comprehensive medical database schema with the following main entities:
- **Users**: Healthcare providers with roles and specializations
- **Patients**: Complete patient profiles with medical history, allergies, medications
- **Appointments**: Scheduling system supporting in-person and telehealth visits
- **AI Insights**: AI-generated medical analyses with priority levels and confidence scores
- **Messages**: Internal messaging system between providers and patients
- **Medical Records**: Document management for diagnoses, lab results, prescriptions, and notes

#### Core Features
1. **Dashboard**: Real-time metrics, visit trends, AI insights panel, and schedule management
2. **Patient Management**: Comprehensive patient records with search and filtering
3. **Appointment System**: Scheduling with support for telehealth and in-person visits
4. **Telehealth Platform**: Video consultation interface with session controls
5. **AI Medical Insights**: Gemini AI-powered symptom analysis and medical recommendations
6. **Medical Records**: Document management system with categorized record types
7. **Messaging System**: Internal communication platform
8. **Analytics**: Data visualization and reporting dashboard

## Data Flow

### Client-Server Communication
- RESTful API endpoints under `/api/*` prefix
- TanStack Query handles data fetching, caching, and synchronization
- Real-time updates through optimistic updates and query invalidation

### AI Integration Flow
- User inputs symptoms or patient data
- System formats data for Gemini AI API
- AI returns structured medical analysis with risk levels, confidence scores, and recommendations
- Results are stored as AI insights and displayed with appropriate priority indicators

### Data Storage
- In-memory storage implementation for development (MemStorage class)
- Production-ready interface (IStorage) for database operations
- Drizzle ORM manages database schema and migrations
- PostgreSQL for persistent data storage

## External Dependencies

### Primary Dependencies
- **Google Gemini AI**: Medical analysis and symptom evaluation
- **Neon Database**: Serverless PostgreSQL hosting
- **Radix UI**: Accessible component primitives
- **TanStack Query**: Server state management
- **Drizzle ORM**: Type-safe database operations

### Development Tools
- **Vite**: Build tool with HMR and optimization
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling
- **ESBuild**: Fast JavaScript bundling for production

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with HMR
- Express server with TypeScript compilation via TSX
- Hot reload for both client and server code
- Replit-specific optimizations for cloud development

### Production Build
- Frontend: Vite builds optimized static assets to `dist/public`
- Backend: ESBuild bundles server code to `dist/index.js`
- Single deployment artifact with embedded static files
- Environment-based configuration for database and AI API keys

### Database Management
- Drizzle Kit for schema migrations
- Push-based deployment for rapid iteration
- PostgreSQL connection via environment variables

### Key Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `GEMINI_API_KEY`: Google AI API authentication
- `NODE_ENV`: Environment configuration

The application is designed for easy deployment on cloud platforms with support for both development and production environments. The modular architecture allows for easy scaling and maintenance while providing a comprehensive medical platform experience.