@echo off
chcp 65001 >nul
title LKL10caugiaotiepTAthang11 - Truong Tieu Hoc Le Kim Lang
echo ==============================================================================
echo    LKL10caugiaotiepTAthang11 - 10 CAU GIAO TIEP TIENG ANH THANG 11
echo    Truong Tieu hoc Le Kim Lang - He thong Theo Doi Chuyen Can Giao Vien
echo ==============================================================================
echo.
echo Dang khoi dong may chu ung dung...
echo Vui long cho trong giay lat...
echo.

set "PATH=C:\Program Files\nodejs;%PATH%"

start "" http://localhost:3000
npm run dev

pause
