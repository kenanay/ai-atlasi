@echo off
setlocal enabledelayedexpansion

REM AI Atlası Otomatik Başlatma Script'i (Windows)
REM Port yönetimi ve otomatik açılma özellikli

title AI Atlasi - Yapay Zeka Ogrenme Laboratuvari

echo.
echo =========================================
echo    AI ATLASI
echo    Yapay Zeka Ogrenme ve Deney Lab
echo =========================================
echo.

REM Varsayılan port
set DEFAULT_PORT=3000
set PORT=%1
if "%PORT%"=="" set PORT=%DEFAULT_PORT%

echo [*] AI Atlasi baslatiliyor...
echo.

REM Node.js kontrolü
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Node.js bulunamadi!
    echo     Node.js kurulumu icin: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [+] Node.js %NODE_VERSION% bulundu

REM npm kontrolü
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] npm bulunamadi!
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [+] npm %NPM_VERSION% bulundu
echo.

REM Bağımlılık kontrolü
if not exist "node_modules\" (
    echo [*] Bagimlilaklar yukleniyor...
    call npm install
    if %errorlevel% neq 0 (
        echo [X] Bagimlilaklar yuklenemedi!
        pause
        exit /b 1
    )
    echo [+] Bagimlilaklar yuklendi
    echo.
)

REM Port kontrolü (basit)
netstat -ano | findstr ":%PORT%" >nul 2>&1
if %errorlevel% equ 0 (
    echo [!] Port %PORT% kulanimda!
    echo.
    echo Ne yapmak istersiniz?
    echo   1^) Alternatif port kullan ^(%DEFAULT_PORT%+1^)
    echo   2^) Devam et ^(mevcut surec durabilir^)
    echo   3^) Iptal
    echo.
    
    set /p choice="Seciminiz (1-3): "
    
    if "!choice!"=="1" (
        set /a PORT=%PORT%+1
        echo [+] Port !PORT! kullanilacak
    ) else if "!choice!"=="3" (
        echo Iptal edildi.
        pause
        exit /b 0
    )
    echo.
)

REM .next temizlik seçeneği
if exist ".next\" (
    echo [*] .next dizini mevcut
    set /p clean_build="Temiz build yapmak ister misiniz? (y/N): "
    if /i "!clean_build!"=="y" (
        echo [*] .next dizini temizleniyor...
        rmdir /s /q .next
        echo [+] Temizlendi
    )
    echo.
)

REM Sunucu başlat
echo =========================================
echo [*] Gelistirme sunucusu baslatiliyor...
echo =========================================
echo.
echo Sunucu Adresi:
echo   ^> http://localhost:%PORT%
echo.
echo Ipuclari:
echo   * Tarayici otomatik acilacak
echo   * Durdurmak icin: Ctrl+C
echo   * Hot reload aktif
echo.
echo =========================================
echo.

REM Tarayıcıyı otomatik aç (arka planda)
start "" "http://localhost:%PORT%"

REM Next.js dev sunucusunu başlat
set PORT=%PORT%
call npm run dev

pause
