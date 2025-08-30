# Create .env file with Firebase configuration
$envContent = @"
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyCY_iiCaNB7BRtLLWdnZChkut3ya6sQBj8
VITE_FIREBASE_AUTH_DOMAIN=meetmate-7b6a9.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://meetmate-7b6a9-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=meetmate-7b6a9
VITE_FIREBASE_STORAGE_BUCKET=meetmate-7b6a9.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=748129248915
VITE_FIREBASE_APP_ID=1:748129248915:web:90b28f9fb0f12bd24a0f66
VITE_FIREBASE_MEASUREMENT_ID=G-7PQ28K777F

# App Configuration
VITE_APP_NAME=MeetMate
VITE_APP_VERSION=1.0.0
"@

$envContent | Out-File -FilePath ".env" -Encoding UTF8
Write-Host ".env file created successfully!" -ForegroundColor Green
Write-Host "You can now run: npm run dev" -ForegroundColor Yellow
