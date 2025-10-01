#!/bin/bash

LOG_FILE="./client.log"

echo "Запуск приложения на порте 6600..." >> "$LOG_FILE" 2>&1
export VITE_PREVIEW_PORT=6600

npm run build >> "$LOG_FILE" 2>&1
npm run preview -- --port $VITE_PREVIEW_PORT >> "$LOG_FILE" 2>&1 &
echo "Приложение запущено. Логи в $LOG_FILE" >> "$LOG_FILE"
