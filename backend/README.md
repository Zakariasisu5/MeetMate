# MeetMate Backend

A Node.js Express server with Firebase Admin SDK and Sensay AI integration for the MeetMate social event platform.

## Features

- 🔐 Firebase Authentication with JWT token verification
- 📊 Firestore database integration
- 🤖 Sensay AI integration for chat and recommendations
- 🎯 Event management (create, list, RSVP)
- 👥 User profile management
- 🛡️ Security middleware (helmet, rate limiting, CORS)

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Copy the environment example file and configure your variables:

```bash
cp env.example .env
```

Fill in the required environment variables:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com

# Sensay AI
SENSAY_API_KEY=your-sensay-api-key
SENSAY_API_URL=https://api.sensay.ai/v1

# CORS
FRONTEND_URL=http://localhost:5173
```

### 3. Run Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication
All protected endpoints require a Firebase ID token in the Authorization header:
```
Authorization: Bearer <firebase-id-token>
```

### Events

#### `POST /api/events`
Create a new event
```json
{
  "title": "Team Meetup",
  "description": "Monthly team gathering",
  "date": "2024-01-15T18:00:00Z",
  "location": "Office Conference Room"
}
```

#### `GET /api/events`
List all events

#### `GET /api/events/:id`
Get specific event

### RSVP

#### `POST /api/rsvp`
RSVP to an event
```json
{
  "eventId": "event-id",
  "status": "going" // "going", "maybe", "not_going"
}
```

#### `GET /api/rsvp/event/:eventId`
Get RSVPs for an event

#### `GET /api/rsvp/user/:userId`
Get user's RSVPs

### AI Integration

#### `POST /api/ai/chat`
Chat with Sensay AI
```json
{
  "prompt": "Help me plan a team building event",
  "context": "Team of 10 people, budget $500"
}
```

#### `POST /api/ai/recommend`
Get AI-powered event recommendations
```json
{
  "preferences": {
    "interests": ["technology", "networking", "food"],
    "location": "San Francisco",
    "dateRange": {
      "start": "2024-01-01T00:00:00Z",
      "end": "2024-01-31T23:59:59Z"
    }
  }
}
```

### Users

#### `POST /api/users`
Create or update user profile
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### `GET /api/users/:id`
Get user profile

## Database Schema

### Users Collection
```typescript
{
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Events Collection
```typescript
{
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### RSVPs Collection
```typescript
{
  id: string;
  userId: string;
  eventId: string;
  status: 'going' | 'maybe' | 'not_going';
  createdAt: Date;
  updatedAt: Date;
}
```

## Development

### Scripts
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build for production
- `npm start` - Start production server

### Project Structure
```
backend/
├── src/
│   ├── config/
│   │   └── firebase.ts      # Firebase Admin SDK setup
│   ├── middleware/
│   │   └── auth.ts          # JWT authentication middleware
│   ├── routes/
│   │   ├── events.ts        # Event management routes
│   │   ├── rsvp.ts          # RSVP management routes
│   │   ├── ai.ts            # AI integration routes
│   │   └── users.ts         # User management routes
│   ├── services/
│   │   └── sensay.ts        # Sensay AI service
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   └── index.ts             # Main server file
├── package.json
├── tsconfig.json
└── README.md
```

## Deployment

### Render/Heroku
1. Set environment variables in your deployment platform
2. Build the project: `npm run build`
3. Start the server: `npm start`

### Environment Variables
Make sure to set all required environment variables in your deployment platform:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`
- `SENSAY_API_KEY`
- `FRONTEND_URL` (production frontend URL)

## Security Features

- **Helmet**: Security headers
- **Rate Limiting**: Prevents abuse
- **CORS**: Configured for frontend origin
- **JWT Verification**: Firebase ID token validation
- **Input Validation**: Request body validation
- **Error Handling**: Comprehensive error responses
