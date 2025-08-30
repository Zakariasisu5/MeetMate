# 🚀 MeetMate Setup Guide

This guide will walk you through setting up the complete MeetMate application with both frontend and backend.

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- Git installed

## 🛠️ Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

#### Create PostgreSQL Database
```sql
CREATE DATABASE meetmate_db;
CREATE USER meetmate_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE meetmate_db TO meetmate_user;
```

#### Alternative: Use Docker
```bash
docker run --name meetmate-postgres \
  -e POSTGRES_DB=meetmate_db \
  -e POSTGRES_USER=meetmate_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:14
```

### 3. Environment Configuration

1. Copy the example environment file:
```bash
cp env.example .env
```

2. Edit `.env` with your database credentials:
```env
DATABASE_URL="postgresql://meetmate_user:your_password@localhost:5432/meetmate_db"
JWT_SECRET="your-super-secret-jwt-key-here-make-it-long-and-random"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 4. Database Migration & Seeding

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

### 5. Start the Application

#### Option A: Full Stack Development
```bash
npm run dev:full
```
This starts both frontend (port 3000) and backend (port 5000) simultaneously.

#### Option B: Separate Development
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **Prisma Studio**: http://localhost:5555 (run `npm run db:studio`)

## 🔐 Default Login Credentials

After seeding the database, you can use these accounts:

### Admin Account
- **Email**: `admin@meetmate.com`
- **Password**: `admin123`
- **Role**: Full system access

### Organizer Account  
- **Email**: `organizer@meetmate.com`
- **Password**: `organizer123`
- **Role**: Event management

### Attendee Accounts
- **Email**: `john@example.com` / `sarah@example.com` / `mike@example.com`
- **Password**: `user123`
- **Role**: Basic user functionality

## 🧪 Testing the Setup

### 1. Backend Health Check
```bash
curl http://localhost:5000/health
```
Should return: `{"status":"OK","timestamp":"..."}`

### 2. Frontend Authentication
1. Visit http://localhost:3000
2. You'll be redirected to `/auth` (login page)
3. Use one of the default credentials above
4. After login, you'll see the main application

### 3. API Testing
```bash
# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@meetmate.com","password":"admin123"}'
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Ensure PostgreSQL is running and the connection string in `.env` is correct.

#### 2. Prisma Migration Error
```
Error: P1001: Can't reach database server
```
**Solution**: Check database connection and run `npx prisma generate` first.

#### 3. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change the PORT in `.env` or kill the process using the port.

#### 4. Frontend Build Errors
```
Error: Cannot find module './hooks/useAuth'
```
**Solution**: Ensure all files are properly created and TypeScript compilation is successful.

### Reset Database
If you need to start fresh:
```bash
# Drop and recreate database
npx prisma db push --force-reset

# Re-seed with sample data
npm run db:seed
```

## 📁 Project Structure

```
meetmate/
├── src/                    # Frontend source
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom hooks (useAuth, etc.)
│   ├── services/         # API services
│   └── types/            # TypeScript types
├── backend/               # Backend source
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── config/           # Configuration files
│   └── prisma/           # Database schema and migrations
├── .env                   # Environment variables
├── package.json           # Dependencies and scripts
└── README.md             # Project documentation
```

## 🔄 Development Workflow

1. **Backend Changes**: Edit files in `backend/` folder
2. **Frontend Changes**: Edit files in `src/` folder  
3. **Database Changes**: Edit `backend/prisma/schema.prisma`, then run `npm run db:migrate`
4. **API Testing**: Use the health check endpoint or test with curl/Postman
5. **Frontend Testing**: Changes auto-reload in development mode

## 🚀 Next Steps

After successful setup:

1. **Explore the API**: Check out all endpoints in the backend routes
2. **Customize Profiles**: Modify the profile creation and matching logic
3. **Add Features**: Implement additional functionality like real-time messaging
4. **Deploy**: Prepare for production deployment

## 📞 Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure PostgreSQL is running and accessible
4. Check that all dependencies are installed

---

**Happy coding! 🎉**



