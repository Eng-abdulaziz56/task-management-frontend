# Task Management Frontend

A React-based task management application built with TypeScript, Vite, and Tailwind CSS.

## 🚀 Quick Start

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open browser**
   - Navigate to `http://localhost:5173`

### Docker Development

1. **Build and run with Docker**
   ```bash
   docker-compose up --build
   ```

2. **Access the application**
   - Navigate to `http://localhost:5173`

## 🐳 Docker Setup

The project includes Docker configuration for local development:

- **Dockerfile**: Development setup with hot reload
- **docker-compose.yml**: Easy container management

### Docker Commands

```bash
# Start development environment
docker-compose up --build

# Stop containers
docker-compose down

# Rebuild from scratch
docker-compose down --volumes --remove-orphans
docker-compose up --build
```

## 📝 Assumptions

- Spring boot Backend API runs on `http://localhost:8080`
- Docker is installed for containerized development

## 🚀 CI/CD Pipeline

✅ **CI/CD Pipeline Ready** - Automated testing and building on pull requests to main branch.

**What's included:**
- Automated tests with (placeholder for pipeline)
- Docker build and testing
- Pull request validation

**Deployment:** Server deployment commented out (no server available)
