@echo off
REM =============================================================================
REM Snippet Platform - Setup & Run Script (Windows)
REM =============================================================================

echo.
echo ============================================
echo   Snippet Platform - Authentication Setup
echo ============================================
echo.

REM Check if node is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [31mNode.js is not installed. Please install Node.js 18+ first.[0m
    pause
    exit /b 1
)

echo [32mNode.js version:[0m
node -v
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [31mnpm is not installed.[0m
    pause
    exit /b 1
)

echo [32mnpm version:[0m
npm -v
echo.

REM Step 1: Check if node_modules exists
if not exist "node_modules" (
    echo [33mInstalling base dependencies...[0m
    call npm install
    echo.
)

REM Step 2: Install auth packages
echo [36mInstalling authentication packages...[0m
call npm install next-auth@beta bcryptjs
call npm install -D @types/bcryptjs
echo.

REM Step 3: Check .env.local
if not exist ".env.local" (
    echo [31m.env.local not found![0m
    echo.
    echo Please create .env.local file with:
    echo.
    echo NEXTAUTH_URL=http://localhost:3000
    echo NEXTAUTH_SECRET=your-secret-key-here
    echo.
    pause
    exit /b 1
)

echo [32mEnvironment file found[0m
echo.

REM Step 4: Display info
echo.
echo ============================================
echo   Setup Complete!
echo ============================================
echo.
echo [36mAvailable Routes:[0m
echo    Home:      http://localhost:3000
echo    Sign In:   http://localhost:3000/auth/signin
echo    Sign Up:   http://localhost:3000/auth/signup
echo    Dashboard: http://localhost:3000/dashboard (protected)
echo.
echo [33mDemo Credentials:[0m
echo    Email:    test@example.com
echo    Password: password
echo.
echo [36mDocumentation:[0m
echo    Quick Start:  QUICKSTART.md
echo    Auth Guide:   AUTH_README.md
echo    Flow Diagram: AUTH_FLOW.md
echo    Checklist:    PROJECT_CHECKLIST.md
echo.
echo ============================================
echo   Starting development server...
echo ============================================
echo.

REM Step 5: Run dev server
call npm run dev

pause
