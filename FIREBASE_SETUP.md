# Firebase Setup Guide for MeetMate

## 🚀 Quick Start

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "meetmate-app")
4. Choose whether to enable Google Analytics (recommended)
5. Click "Create project"

### 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Enable and check "Email link (passwordless sign-in)" if desired
   - **Google**: Enable and configure OAuth consent screen
   - **LinkedIn**: Enable and configure OAuth app (optional)

### 3. Enable Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (you can secure it later)
4. Select a location close to your users
5. Click "Done"

### 4. Get Your Firebase Config

1. Click the gear icon next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web app icon (</>)
5. Register your app with a nickname (e.g., "meetmate-web")
6. Copy the configuration object

### 5. Set Up Environment Variables

1. Create a `.env` file in your project root
2. Copy the values from `firebase-config.example`
3. Replace the placeholder values with your actual Firebase config:

```env
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-actual-app-id
```

### 6. Set Up Firestore Security Rules

In your Firestore Database, go to "Rules" and update with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public profiles can be read by anyone
    match /users/{userId} {
      allow read: if true;
    }
    
    // Events can be read by anyone, written by organizers
    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ORGANIZER';
    }
  }
}
```

### 7. Test Your Setup

1. Start your development server: `npm run dev`
2. Go to `/auth` page
3. Try to sign up with email/password
4. Try to sign in with Google
5. Check your Firestore database for new users

## 🔧 Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/invalid-api-key)"**
   - Check your API key in `.env` file
   - Make sure the file is in the project root

2. **"Firebase: Error (auth/unauthorized-domain)"**
   - Add your domain to Firebase Auth authorized domains
   - Go to Authentication > Settings > Authorized domains

3. **"Firebase: Error (firestore/permission-denied)"**
   - Check your Firestore security rules
   - Make sure you're in test mode for development

4. **"Firebase: Error (auth/popup-closed-by-user)"**
   - User closed the Google sign-in popup
   - This is normal behavior, not an error

### Development vs Production

- **Development**: Use test mode for Firestore
- **Production**: Set up proper security rules
- **Environment**: Use different Firebase projects for dev/prod

## 📱 Next Steps

1. **Customize Authentication**: Add more providers (GitHub, Twitter, etc.)
2. **User Profiles**: Enhance user profile fields
3. **Real-time Updates**: Use Firestore listeners for live data
4. **File Storage**: Add Firebase Storage for profile pictures
5. **Push Notifications**: Implement Firebase Cloud Messaging

## 🔗 Useful Links

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth Guide](https://firebase.google.com/docs/auth)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
