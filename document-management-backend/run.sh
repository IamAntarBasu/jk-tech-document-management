#!/bin/bash
set -e

echo "Waiting for database to be ready"
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 0.1
done

# Wait for migration to finish
echo "Migration finished"

# Start the server
echo "Starting server"
npm run migrations:up && npm run start