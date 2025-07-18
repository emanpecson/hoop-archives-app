import { redirect } from "next/navigation";

export default function LoginPage() {
	return redirect("/api/auth/signin");
}
