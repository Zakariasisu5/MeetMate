# Render.com Build & Start Instructions for MeetMate Backend

# Build command
npm install && npm run build

# Start command
npm start

# Environment Variables (set these in Render dashboard)
# PORT (Render sets this automatically)
# SENSAY_API_KEY=your-sensay-api-key
# GITHUB_TOKEN=your-github-token
# FIREBASE_PROJECT_ID=your-project-id
# FIREBASE_PRIVATE_KEY=your-private-key
# FIREBASE_CLIENT_EMAIL=your-firebase-client-email
# SENSAY_API_URL=https://api.sensay.ai/v1
# FRONTEND_URL=https://your-frontend-url

# Notes:
# - Do NOT use localhost in any API URLs for production.
# - Make sure your frontend uses the Render backend URL in its .env.
# - If using websockets, Render supports them by default.
# - If you use a custom domain, update CORS and .env accordingly.
