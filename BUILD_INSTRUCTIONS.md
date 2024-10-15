# Build and Deployment Instructions for Vercel

Follow these steps to build and deploy the Incident Management SaaS application on Vercel:

## 1. Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Git
- Vercel CLI (install with `npm i -g vercel`)
- MongoDB Atlas account (for database)
- Stripe account (for payment processing)
- OpenAI API key (for chatbot functionality)

## 2. Local Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the project root and add your environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Set up your MongoDB Atlas database and obtain the connection string.

5. Set up your Stripe account and obtain the secret key.

6. Obtain an API key from OpenAI for the chatbot functionality.

## 3. Vercel Setup

1. Sign up for a Vercel account at https://vercel.com if you haven't already.

2. Install the Vercel CLI:
   ```
   npm i -g vercel
   ```

3. Login to Vercel:
   ```
   vercel login
   ```

## 4. Deploy to Vercel

1. Run the following command in your project directory:
   ```
   vercel
   ```

2. Follow the prompts to link your project to Vercel and deploy it.

3. When asked about build settings, use the following:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Development Command: `npm run dev`

## 5. Environment Variables

1. After deployment, go to your project settings in the Vercel dashboard.
2. Navigate to the "Environment Variables" section.
3. Add all the environment variables from your `.env` file.

## 6. Database Setup

1. Ensure your MongoDB Atlas cluster is set up and running.
2. Add your Vercel deployment's IP address to the MongoDB Atlas IP whitelist.

## 7. Stripe Integration

1. Set up your Stripe webhook in the Stripe dashboard.
2. Point the webhook to your Vercel deployment's `/api/stripe-webhook` endpoint.

## 8. Verify Deployment

1. Once the deployment is complete, Vercel will provide you with a URL to your deployed application.
2. Open the URL in your browser to verify that the application is working correctly.

## 9. Continuous Deployment

Vercel automatically sets up continuous deployment from your connected Git repository. Any push to the main branch will trigger a new deployment.

## 10. Super Admin Setup

1. After deployment, use the provided script to create the initial super admin account:
   ```
   npm run create-super-admin
   ```
2. Follow the prompts to set up the super admin email and password.

## 11. Troubleshooting

If you encounter any issues during the build process:

1. Check the build logs in the Vercel dashboard for specific error messages.
2. Ensure all dependencies are correctly listed in `package.json`.
3. Verify that all environment variables are correctly set in Vercel.
4. If using API routes, make sure they are in the correct directory (`api/` in the project root).

Remember to keep your API keys and sensitive information secure and never commit them to your repository. Always use environment variables for sensitive data.