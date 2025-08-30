@echo off
echo Renaming firebase.env to .env...
ren firebase.env .env
echo Done! Your Firebase configuration is now in .env
echo.
echo Next steps:
echo 1. Replace the placeholder values in .env with your actual Firebase config
echo 2. Run: npm run dev
echo 3. Test the authentication at /auth
pause
