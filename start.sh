#!/bin/bash
set -e
docker compose up --build -d
echo "Site is running at http://localhost:3000"
