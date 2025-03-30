#!/bin/bash
set -e

# wait until the database is ready
echo "Waiting for database to be ready"
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 0.1
done

echo "Migration finished"

# Start the server
echo "Starting server"

npm run start