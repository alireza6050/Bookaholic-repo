import { fetchAuthSession } from 'aws-amplify/auth';

// API Gateway base URL
export const apiBaseURL = 'https://apk7pl5cu9.execute-api.us-east-2.amazonaws.com/stage';

// Fetching Cognito auth token
export const getAuthToken = async () => {
  try {
    const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    return authToken;
  } catch (error) {
    console.error("Error fetching auth token:", error);
    throw error;
  }
};
