@echo off
setlocal EnableExtensions
cd /d "%~dp0.."
if not exist "package.json" (
  echo ERROR: Run this from the repo scripts folder ^(package.json not found one level up^).
  pause
  exit /b 1
)

echo.
echo ========================================================================
echo  EMPTY GITHUB REPO - LOCAL FRESH GIT
echo ========================================================================
echo  On GitHub you must have a repository with ZERO commits:
echo    - Delete the old repo: Repo - Settings - Danger zone - Delete
echo      ^(or rename it / archive^)
echo    - Create a NEW repository: NO README, NO .gitignore, NO license
echo      ^(all unchecked so the repo is completely empty^)
echo.
echo  This script will DELETE your local .git folder, then git init and push.
echo  .env.local is never committed ^(see .gitignore^).
echo ========================================================================
echo.
pause

choice /C YN /M "Remove local .git and continue"
if errorlevel 2 exit /b 1

if exist ".git" (
  echo Removing .git ...
  rd /s /q ".git"
)

git init
if errorlevel 1 (
  echo git init failed.
  pause
  exit /b 1
)

git add -A
git status

git commit -m "Initial commit"
if errorlevel 1 (
  echo Commit failed ^(nothing to commit?^).
  pause
  exit /b 1
)

git branch -M main

echo.
echo Paste your EMPTY repo URL ^(HTTPS or SSH^), then Enter.
echo Example HTTPS: https://github.com/aadby12/Chef-s-Choice.git
echo.
set "REMOTE_URL="
set /p REMOTE_URL="Remote URL: "
if "%REMOTE_URL%"=="" (
  echo No URL entered.
  pause
  exit /b 1
)

git remote add origin "%REMOTE_URL%"
if errorlevel 1 (
  echo git remote add failed ^(maybe origin already exists?^) Try: git remote remove origin
  pause
  exit /b 1
)

echo.
echo Pushing to origin main ^(empty remote = clean first push^)...
git push -u origin main
if errorlevel 1 (
  echo.
  echo Push failed. Common fixes:
  echo   - Repo is NOT empty ^(README on GitHub^): delete files on GitHub or use:
  echo       git push -u origin main --force
  echo   - Wrong URL or no access: check token / SSH key
  echo.
  pause
  exit /b 1
)

echo.
echo Done. Local folder is now the only history; GitHub matches it.
pause
