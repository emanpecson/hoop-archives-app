import { betterAuth } from "better-auth";

export const auth = betterAuth({
  socialProviders: {
    cognito: {
      clientId: process.env.AUTH_COGNITO_CLIENT_ID as string,
      clientSecret: process.env.AUTH_COGNITO_CLIENT_SECRET as string,
      domain: process.env.AUTH_COGNITO_DOMAIN as string, // e.g. "your-app.auth.us-east-1.amazoncognito.com"
      region: process.env.AWS_REGION as string, // e.g. "us-east-1"
      userPoolId: process.env.AWS_COGNITO_USER_POOL_ID as string,
    },
  },
});
