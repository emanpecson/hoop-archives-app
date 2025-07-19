import { JwtPayload } from "jwt-decode";

export interface IdTokenPayload extends JwtPayload {
	"cognito:username": string;
}
