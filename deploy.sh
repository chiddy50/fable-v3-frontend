#!/bin/bash

set -e

APP_DIR="/root/fable"
BACKEND_DIR="$APP_DIR/fable-v3-api/"
FRONTEND_DIR="$APP_DIR/fable-v3-frontend/"
BRANCH="devops"

echo "update API code base"

pwd

cd $FRONTEND_DIR || exit

echo "Pulling the latest code from branch $BRANCH..."
git fetch --all
git reset --hard origin/$BRANCH

echo "refreshing deploymemnt..."
cd $APP_DIR || exit


# Rebuild and start the Docker Compose services
echo "Rebuilding and starting Docker Compose services..."
docker compose build next-frontend && docker compose up -d next-frontend

echo "waiting for health status"
sleep 30

echo "Checking Docker services status..."
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

echo "Deployment completed successfully."
