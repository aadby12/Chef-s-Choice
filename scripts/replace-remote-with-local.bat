@echo off
setlocal EnableExtensions
REM Replaces origin/main with a single new commit containing the current tree.
REM Run by double-clicking from Explorer (repo path may contain an apostrophe).
cd /d "%~dp0.."
if not exist ".git" (
  echo ERROR: .git not found. This script must live in the repo's scripts folder.
  pause
  exit /b 1
)

echo.
echo ============================================================
echo  WARNING: This rewrites GitHub history for branch "main".
echo  Remote: origin (see: git remote -v)
echo  After this, "main" on GitHub will have ONE new commit only.
echo ============================================================
echo.
choice /C YN /M "Type Y to continue, N to cancel"
if errorlevel 2 exit /b 1

:proceed
echo.
echo Staging all tracked files ( .env.local stays ignored ) ...
git add -A
git status

echo.
echo Creating orphan branch with fresh history ...
git checkout --orphan __deploy_replace__
if errorlevel 1 (
  echo git checkout --orphan failed.
  pause
  exit /b 1
)

git add -A
git commit -m "chore: replace remote with full local snapshot" 
if errorlevel 1 (
  echo Nothing to commit or commit failed. If there are no changes, try: git commit --allow-empty
  git checkout main 2>nul
  git branch -D __deploy_replace__ 2>nul
  pause
  exit /b 1
)

git branch -D main 2>nul
git branch -m main

echo.
echo Force-pushing to origin main ...
git push -f origin main
if errorlevel 1 (
  echo Push failed. On GitHub: Settings - Branches - unprotect main if needed, then retry.
  pause
  exit /b 1
)

echo.
echo Done. Remote main now matches this folder (single new commit).
pause
