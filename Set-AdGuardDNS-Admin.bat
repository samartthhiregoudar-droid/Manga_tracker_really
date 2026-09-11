@echo off
title Configure System AdGuard DNS
echo ===================================================
echo     AdGuard DNS System Configurator (Safe Manga)
echo ===================================================

:: Check for administrative privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Administrative privileges required to configure network adapter DNS.
    echo Prompting for elevation...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo.
echo [1/2] Configuring active network adapters with AdGuard DNS...
echo Primary DNS:   94.140.14.14
echo Secondary DNS: 94.140.15.15
echo.

powershell -NoProfile -Command ^
    "Get-NetAdapter | Where-Object Status -eq 'Up' | ForEach-Object { " ^
    "   Write-Host 'Configuring adapter:' $_.Name -ForegroundColor Cyan; " ^
    "   Set-DnsClientServerAddress -InterfaceAlias $_.Name -ServerAddresses ('94.140.14.14','94.140.15.15'); " ^
    "}"

echo.
echo [2/2] Flushing DNS Cache...
ipconfig /flushdns

echo.
echo ===================================================
echo   System DNS Successfully Configured to AdGuard!
echo ===================================================
powershell -NoProfile -Command "Get-DnsClientServerAddress -AddressFamily IPv4 | Where-Object ServerAddresses -ne $null | Format-Table InterfaceAlias, ServerAddresses"

echo You can close this window now.
timeout /t 10
