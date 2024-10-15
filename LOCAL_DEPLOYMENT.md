# Local Deployment and Testing Instructions

This guide provides instructions for setting up and running the Incident Management SaaS application locally for development and testing purposes.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (v14 or later)
- npm (v6 or later)
- Git
- MongoDB (v4.4 or later)

## Automated Setup

We provide an automated setup script that handles most of the setup process for you. To use it:

1. Open a terminal or command prompt.
2. Navigate to the project root directory.
3. Run the following command:
   ```
   npm run setup
   ```
4. Follow the prompts and instructions provided by the script.

The script will:
- Clone the repository (if not already done)
- Install dependencies
- Set up environment variables
- Start MongoDB
- Set up the database
- Create a super admin account
- Build the application
- Start the development server

## Manual Setup

If you prefer to set up the project manually or if you encounter issues with the automated setup, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/your-repo/incident-management-saas.git
   cd incident-management-saas
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your local configuration

4. Start MongoDB:
   ```
   mongod
   ```

5. Set up the database:
   ```
   node scripts/setupDatabase.js
   ```

6. Create a super admin account:
   ```
   node scripts/createSuperAdmin.js
   ```

7. Build the application:
   ```
   npm run build
   ```

8. Start the development server:
   ```
   npm run dev
   ```

## Accessing the Application

Once the setup is complete and the server is running:

1. Open a web browser and navigate to `http://localhost:3000`.
2. Log in using the super admin credentials created during the setup process.

## Testing

### Running Unit Tests

Execute the test suite:
```
npm test
```

### Manual Testing

Test various features of the application, including:
- Creating and managing cases
- User management
- File and video uploads
- Generating reports
- Floor plan integration
- Multi-franchise functionality (if applicable)

## Troubleshooting

- If you encounter any issues with dependencies, try deleting the `node_modules` folder and running `npm install` again.
- Ensure all required environment variables are correctly set in your `.env` file.
- Check the console output for any error messages that may indicate configuration issues.

If you continue to experience problems, please refer to the project documentation or reach out to the development team for assistance.