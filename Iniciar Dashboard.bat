@echo off
title Servidor - Analise Simulador Dashboard
cd /d "d:\Analise Simulador"

echo Iniciando o Servidor do Dashboard de Analytics...
echo O navegador principal vai abrir automaticamente em 5 segundos...

:: Dispara o comando para abrir o navegador de forma assincrona após 5s
start cmd /c "timeout /t 5 /nobreak >nul && start http://localhost:5173"

echo.
echo ========================================================
echo MANTENHA ESTA JANELA ABERTA ENQUANTO USA O DASHBOARD
echo Para desligar, basta apertar no "X" para fechar a tela.
echo ========================================================
echo.

:: Roda o script de pacote concorrente
npm run dev
