# Document Management System

A comprehensive document management system built with NestJS, PostgreSQL, and Redis.

## Project Structure

```
jk-tech-document-management/
├── document-management-backend/  # Main backend service
│   ├── src/                 # Source code
│   ├── test/               # Test files
│   ├── testCases/          # Test cases
│   ├── dist/               # Compiled JavaScript
│   ├── Dockerfile          # Docker configuration
│   └── package.json        # Dependencies and scripts
├── ingestion-service-backend/   # Document ingestion service
│   ├── src/                 # Source code
│   ├── test/               # Test files
│   ├── testCases/          # Test cases
│   ├── dist/               # Compiled JavaScript
│   ├── Dockerfile          # Docker configuration
│   └── package.json        # Dependencies and scripts
├── redis-setup/            # Redis configuration
│   ├── redis.conf         # Redis configuration file
│   └── Dockerfile         # Redis Docker configuration
├── docker-compose.yml      # Docker Compose configuration
├── .env                    # Environment variables
├── .env.example           # Example environment variables
└── README.md              # Project documentation
```

## Services

1. **Document Management Backend**
   - Main service for document management
   - Handles document CRUD operations
   - Port: 8000
   - Dependencies: PostgreSQL, Redis, Ingestion Service

2. **Ingestion Service Backend**
   - Handles document ingestion and processing
   - Dependencies: PostgreSQL, Redis

3. **PostgreSQL Database**
   - Stores application data
   - Persistent storage in `.data/db`

4. **Redis**
   - Used for caching and message queuing
   - Persistent storage in `.data/redis`

## Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- Git

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd jk-tech-document-management
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your configuration

4. Start the services using Docker Compose:
   ```bash
   docker-compose up --build
   ```

## Development

### Local Development

1. Install dependencies for both services:
   ```bash
   # Document Management Backend
   cd document-management-backend
   npm install

   # Ingestion Service Backend
   cd ../ingestion-service-backend
   npm install
   ```

2. Start the services:
   ```bash
   # Document Management Backend
   npm run start:dev

   # Ingestion Service Backend
   npm run start:dev
   ```

### Docker Commands

- Build and start services:
  ```bash
  docker-compose up --build
  ```

- Start in detached mode:
  ```bash
  docker-compose up -d --build
  ```

- Stop services:
  ```bash
  docker-compose down
  ```

- View logs:
  ```bash
  docker-compose logs -f
  ```

## API Documentation

The API documentation is available at:
https://documenter.getpostman.com/view/41185429/2sB2cPjkYH

## Environment Variables

Key environment variables (see `.env.example` for full list):

- `DATABASE_HOST`: PostgreSQL host
- `DATABASE_PORT`: PostgreSQL port
- `DATABASE_USERNAME`: Database username
- `DATABASE_PASSWORD`: Database password
- `DATABASE_NAME`: Database name
- `REDIS_HOST`: Redis host
- `REDIS_PORT`: Redis port
