@echo off
REM Riyansh E-Commerce Installation Script for Windows
REM This script installs all dependencies for the monorepo

echo Installing Riyansh E-Commerce...
echo.

REM Install root dependencies
echo Installing root dependencies...
call npm install
echo Root dependencies installed
echo.

REM Install web app dependencies
echo Installing web app dependencies...
cd apps\web
call npm install
cd ..\..
echo Web app dependencies installed
echo.

REM Install admin panel dependencies
echo Installing admin panel dependencies...
cd apps\admin
call npm install
cd ..\..
echo Admin panel dependencies installed
echo.

REM Install API dependencies
echo Installing API dependencies...
cd apps\api
call npm install
cd ..\..
echo API dependencies installed
echo.

REM Install shared package dependencies
echo Installing shared package dependencies...

cd packages\db
call npm install
cd ..

cd config
call npm install
cd ..

cd ui
call npm install
cd ..

cd utils
call npm install
cd ..\..

echo Shared packages dependencies installed
echo.

echo Installation complete!
echo.
echo Next steps:
echo 1. Set up your Supabase project
echo 2. Copy .env.example to .env and add your credentials
echo 3. Run 'npm run dev' to start all applications
echo.
echo See QUICKSTART.md for detailed instructions.
pause

