#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Project X - Setup Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to print step
print_step() {
    echo -e "${GREEN}➜${NC} $1"
}

# Function to print error
print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if .env exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Copying from .env.sample..."
    cp .env.sample .env
    echo -e "${YELLOW}⚠ IMPORTANT: Please edit .env file with your actual values before continuing!${NC}"
    echo -e "${YELLOW}  Press Enter to continue after editing .env, or Ctrl+C to exit...${NC}"
    read -r
fi

# Step 1: Install dependencies
print_step "Step 1/4: Installing dependencies..."
if ! pnpm install; then
    print_error "Failed to install dependencies"
    exit 1
fi
echo ""

# Step 2: Build the project
print_step "Step 2/4: Building the project..."
if ! pnpm run build; then
    print_error "Failed to build project"
    exit 1
fi
echo ""

# Step 3: Run migrations
print_step "Step 3/4: Running database migrations..."
if ! pnpm run migration:run; then
    print_error "Failed to run migrations"
    echo -e "${YELLOW}⚠ Make sure your database is running and .env is configured correctly${NC}"
    exit 1
fi
echo ""

# Step 4: Seed permissions
print_step "Step 4/4: Seeding initial permissions..."
if ! pnpm run seed:permissions; then
    print_error "Failed to seed permissions"
    exit 1
fi
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   ✓ Setup completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Next steps:"
echo -e "  1. Start development server: ${BLUE}pnpm start:dev${NC}"
echo -e "  2. Access Swagger docs: ${BLUE}http://localhost:3000/api${NC}"
echo -e "  3. API base URL: ${BLUE}http://localhost:3000/api/v1${NC}"
echo ""
