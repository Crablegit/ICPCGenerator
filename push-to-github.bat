@echo off
chcp 65001 >nul
echo ========================================================
echo   CRAB'S ICPC GENERATOR - GITHUB & VERCEL PUSH HELPER
echo ========================================================
echo.
set /p REPO_URL="Nhập link GitHub Repository của bạn (vd: https://github.com/Crablegit/crabs-icpc-generator.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] Bạn chưa nhập link repo!
    pause
    exit /b
)

echo.
echo [1/3] Đang cấu hình remote origin...
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main

echo [2/3] Đang đẩy toàn bộ code lên GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo [THÀNH CÔNG] Code đã được đẩy lên GitHub!
    echo.
    echo BÂY GIỜ ĐỂ ĐƯA LÊN VERCEL:
    echo 1. Vào https://vercel.com/new
    echo 2. Chọn Import repo vừa đẩy lên
    echo 3. Bấm Deploy (chỉ mất 30 giây là có link web online!)
    echo ========================================================
) else (
    echo.
    echo [LỖI] Không thể push lên GitHub. Vui lòng kiểm tra quyền truy cập hoặc Personal Access Token.
)

pause
