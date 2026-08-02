@echo off
chcp 65001 > nul
title Atualizar Loja

cd /d "%~dp0"

echo.
echo ============================================
echo      Atualizando os produtos da loja...
echo ============================================
echo.

python ferramentas\gerar_produtos.py

echo.
echo ============================================
echo      Atualização concluída com sucesso!
echo ============================================
echo.
pause