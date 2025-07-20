import { JWT } from "next-auth";

export const tokenIsExpired = (token: JWT): boolean => {
	// check id-token expiration (grants access to aws creds)
	if (token.exp) {
		const currentTimeInSeconds = Math.floor(Date.now() / 1000); // ms to sec
		// console.log("id token exp:", new Date(token.exp * 1000).toLocaleString());
		if (currentTimeInSeconds > token.exp) return true;
	}

	// check aws-cred expiration
	if (token.awsCredentials && token.awsCredentials.Expiration) {
		// console.log(
		// 	"aws cred exp:",
		// 	new Date(token.awsCredentials.Expiration).toLocaleString()
		// );
		// console.log("aws cred now:", new Date().toLocaleString());
		if (new Date() > new Date(token.awsCredentials.Expiration)) return true;
	}

	return false;
};
