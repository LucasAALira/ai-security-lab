@echo off
cd /d "%~dp0"
where py >nul 2>nul
if not errorlevel 1 (
  py -3 iniciar.py %*
  pause
  exit /b
)
where python >nul 2>nul
if not errorlevel 1 (
  python iniciar.py %*
  pause
  exit /b
)
echo Instale Python 3 e marque Add Python to PATH. Depois execute novamente.
pause
