@echo off
chcp 65001 >nul
title Day Du An Len GitHub - LKL10caugiaotiepTAthang11
echo ===================================================================
echo     DONG BO TOAN BO DU AN LEN GITHUB DE VERCEL DEPLOY THANH CONG
echo ===================================================================
echo.
echo Dang day code (bao gom index.html, thu muc src, api...) len GitHub...
echo.

"C:\Program Files\Git\bin\git.exe" push -u origin main --force

echo.
if %ERRORLEVEL% equ 0 (
    echo [OK] Da day thanh cong len repo LKL10caugiaotiepTAthang11!
    echo.
    echo Dang day them ban sao sang repo LKLapphoc10caugiaotiepTAthang11...
    "C:\Program Files\Git\bin\git.exe" push origin-hoc main --force >nul 2>&1
    echo.
    echo ===================================================================
    echo  [THANH CONG HOAN TOAN!] Ma nguon da duoc day len GitHub!
    echo.
    echo  Bay gio tren Vercel:
    echo  1. Vercel se tu dong nhan commit moi va Build lai thanh cong.
    echo  2. Hoac ban chi can vao Vercel nhan nut "Redeploy".
    echo ===================================================================
) else (
    echo ===================================================================
    echo  [CHU Y] Neu trinh duyet mo ra hoi dang nhap GitHub:
    echo  - Hay chon "Sign in with your browser" va bam nut xanh "Authorize".
    echo  - Sau khi xong, hay chay lai file nay mot lan nua nhe!
    echo ===================================================================
)
echo.
pause
