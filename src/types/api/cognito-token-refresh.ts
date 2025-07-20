export type CognitoTokenRefreshResponse = {
	idToken: string;
	accessToken: string;
};

export type CognitoTokenRefreshBodyRequest = {
	refreshToken: string;
	username: string;
};
