# MeetMate - AI-Powered Event Planning Platform

MeetMate is a modern social event platform that combines Firebase authentication, real-time event management, and AI-powered recommendations using Sensay AI. Built with React, TypeScript, Node.js, and Firebase.

## 🚀 Features

- **🔐 Firebase Authentication** - Google and Email/Password login
- **📅 Event Management** - Create, view, and RSVP to events
- **🤖 AI Integration** - Sensay AI for chat and personalized recommendations
- **📱 Modern UI** - Beautiful, responsive design with TailwindCSS
- **⚡ Real-time Data** - Live updates using Firebase Firestore
- **🔄 Hybrid Architecture** - Backend API + Firebase real-time sync
- **📊 Connection Status** - Real-time monitoring of backend and Firebase
- **🛡️ Security** - JWT token verification and secure API endpoints

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **React Query** for state management
- **Framer Motion** for animations
- **Firebase Auth SDK** for authentication

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Firebase Admin SDK** for server-side operations
- **Sensay AI** integration for intelligent features
- **Firestore** for database
- **JWT Authentication** with Firebase tokens

### Real-time Architecture
- **Firebase Firestore** for real-time data synchronization
- **Hybrid Sync Service** that coordinates between backend API and Firebase
- **Real-time Hooks** for React components with automatic cleanup
- **Connection Monitoring** with health checks for both backend and Firebase

## 📦 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase project with Authentication and Firestore enabled
- Sensay AI API key

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd meetmate
```

### 2. Environment Configuration

#### Backend Setup
```bash
cd backend
cp env.example .env
```

Fill in your `.env` file:
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

#### Frontend Setup
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3001
```

### 3. Install Dependencies

#### Option A: Use the startup script (Windows)
```powershell
.\start-dev.ps1
```

#### Option B: Manual installation
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ..
npm install
```

### 4. Start Development Servers

#### Backend
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:3001`

#### Frontend
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

## 🔧 API Endpoints

### Authentication
All protected endpoints require Firebase ID token in Authorization header:
```
Authorization: Bearer <firebase-id-token>
```

### Events
- `POST /api/events` - Create new event
- `GET /api/events` - List all events
- `GET /api/events/:id` - Get specific event

### RSVPs
- `POST /api/rsvp` - RSVP to event
- `GET /api/rsvp/event/:eventId` - Get RSVPs for event
- `GET /api/rsvp/user/:userId` - Get user's RSVPs

### AI Integration
- `POST /api/ai/chat` - Chat with Sensay AI
- `POST /api/ai/recommend` - Get AI recommendations

### Users
- `POST /api/users` - Create/update user profile
- `GET /api/users/:id` - Get user profile

## 🤖 AI Features

### Sensay AI Chat
- Interactive chat interface for event planning assistance
- Context-aware responses about networking and events
- Real-time message history and typing indicators

### AI Recommendations
- Personalized event suggestions based on user interests
- Location and date range filtering
- Smart event matching using AI algorithms

## 📁 Project Structure

```
meetmate/
├── backend/                 # Node.js Express server
│   ├── src/
│   │   ├── config/         # Firebase configuration
│   │   ├── middleware/     # Authentication middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Sensay AI service
│   │   ├── types/          # TypeScript types
│   │   └── index.ts        # Main server file
│   ├── package.json
│   └── README.md
├── src/                    # React frontend
│   ├── components/         # React components
│   │   ├── AIChat.tsx     # AI chat interface
│   │   ├── AIRecommendations.tsx
│   │   └── Events.tsx     # Events management
│   ├── hooks/             # Custom React hooks
│   │   └── useApi.ts      # API integration hooks
│   ├── services/          # API services
│   │   └── api.ts         # Backend API client
│   ├── pages/             # Page components
│   └── App.tsx            # Main app component
├── package.json
└── README.md
```

## 🔐 Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Google and Email/Password providers)
3. Create a Firestore database
4. Generate a service account key:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download the JSON file
   - Use the values in your backend `.env` file

## 🤖 Sensay AI Setup

1. Sign up for Sensay AI at [Sensay AI](https://sensay.ai/)
2. Get your API key from the dashboard
3. Add the API key to your backend `.env` file

## 🚀 Deployment

### Backend (Render/Heroku)
1. Set environment variables in your deployment platform
2. Build: `npm run build`
3. Start: `npm start`

### Frontend (Firebase Hosting)
```bash
npm run build
firebase deploy
```

## 🧪 Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
npm test
```

## 📝 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `FIREBASE_PROJECT_ID` - Firebase project ID
- `FIREBASE_PRIVATE_KEY` - Firebase service account private key
- `FIREBASE_CLIENT_EMAIL` - Firebase service account email
- `SENSAY_API_KEY` - Sensay AI API key
- `SENSAY_API_URL` - Sensay AI API URL
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend (.env)
- `VITE_API_URL` - Backend API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

## 🔄 Updates

Stay updated with the latest features and improvements by following the project repository.
