#!/bin/bash

# Main setup script for Incident Management SaaS

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "MongoDB is not installed. Please install MongoDB and try again."
    exit 1
fi

# Clone the repository
git clone https://github.com/your-repo/incident-management-saas.git
cd incident-management-saas

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
echo "Please update the .env file with your local configuration."
echo "Press any key to continue when you're done..."
read -n 1 -s

# Start MongoDB
mongod --fork --logpath /var/log/mongodb.log

# Run database setup script
node scripts/setupDatabase.js

# Create super admin account
node scripts/createSuperAdmin.js

# Build the application
npm run build

# Start the application
npm run dev

echo "Setup complete! The application is now running at http://localhost:3000"
echo "Use the super admin credentials you just created to log in."