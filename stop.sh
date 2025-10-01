#!/bin/bash

LOG_FILE="./client.log"

echo "Остановка приложения на порте 6600..." >> "$LOG_FILE" 2>&1
PID=$(lsof -t -i:6600)

if [ -n "$PID" ]; then
  kill -9 $PID >> "$LOG_FILE" 2>&1
  echo "Процесс на порте 6600 остановлен." >> "$LOG_FILE"
else
  echo "Нет процесса на порте 6600." >> "$LOG_FILE"
fi
