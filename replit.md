# Mini LinkedIn - Professional Social Media Platform

## Overview

A modern professional social media platform inspired by LinkedIn, built with a full-stack TypeScript architecture. The application provides user authentication, post management, user profiles, search functionality, and real-time social interactions. It features a responsive design optimized for both desktop and mobile experiences, with a focus on professional networking capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend uses Next.js 15 with App Router for modern React development. State management is handled through Redux Toolkit for global state and React Query (TanStack Query) for server state management. The UI is built with shadcn/ui components on top of Tailwind CSS, providing a consistent design system with Radix UI primitives for accessibility. Form handling uses React Hook Form with Zod validation for type-safe form management.

### Backend Architecture
The backend follows a RESTful API design using Express.js with TypeScript. The architecture implements a layered approach with separate routes, models, and middleware. Authentication is handled via JWT tokens with bcrypt for password hashing. The API includes rate limiting, CORS configuration, and security middleware using Helmet. Request validation is implemented using Zod schemas for type safety.

### Database Design
MongoDB Atlas serves as the primary database with Mongoose ODM for data modeling. The schema includes User and Post models with proper indexing for performance. Users contain profile information (name, email, bio) while Posts reference authors and include engagement metrics. The database connection uses connection pooling and caching for efficient resource management.

### Authentication and Authorization
JWT-based authentication system with secure token management. Passwords are hashed using bcrypt with salt rounds. The frontend stores tokens in localStorage with automatic logout on token expiration. Protected routes use middleware authentication on the backend and Redux state management on the frontend.

### Development and Deployment Architecture
The application supports multiple deployment scenarios:
- Local development with separate backend/frontend servers
- Unified development server through a proxy setup
- Netlify deployment using serverless functions
- Environment-specific configuration handling

### API Structure
RESTful API endpoints organized by resource:
- `/api/auth` - Authentication (login, register, profile)
- `/api/posts` - Post management (CRUD operations, likes)
- `/api/users` - User management (profiles, search)

The API includes proper error handling, validation, and response formatting.

### State Management
Frontend state is managed through multiple layers:
- Redux Toolkit for global application state (auth, posts, users)
- React Query for server state and caching
- Local component state for UI interactions
- Form state managed by React Hook Form

## External Dependencies

### Core Technologies
- **MongoDB Atlas** - Cloud database service for data persistence
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing and security

### UI and Styling
- **Radix UI** - Accessible component primitives (@radix-ui/react-*)
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **date-fns** - Date formatting and manipulation

### Development Tools
- **TypeScript** - Type safety and development experience
- **Zod** - Runtime type validation and schema definition
- **ESLint** - Code linting and quality enforcement

### Deployment Services
- **Netlify** - Static site hosting and serverless functions
- **Netlify Functions** - Backend API deployment in serverless environment

### Development Dependencies
- **tsx** - TypeScript execution for development
- **Vite** - Build tool and development server
- **esbuild** - Fast JavaScript bundler for production builds