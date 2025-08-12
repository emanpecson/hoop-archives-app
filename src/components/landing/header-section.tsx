import { Session } from "next-auth";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import Link from "next/link";
import { signIn } from "next-auth/react";
import {
	AppWindowMacIcon,
	HelpCircleIcon,
	LandmarkIcon,
	LucideIcon,
	ScissorsIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderSectionProps {
	session: Session | null;
	demoLeaguePath: string;
}

type CodeSource = {
	url: string;
	description: string;
	icon: LucideIcon;
};

export default function HeaderSection(props: HeaderSectionProps) {
	const codeSource: { [key: string]: CodeSource } = {
		"App source code": {
			url: "https://github.com/emanpecson/hoop-archives-app",
			description: "Code that houses all frontend UI",
			icon: AppWindowMacIcon,
		},
		"Lambda source code": {
			url: "https://github.com/emanpecson/hoop-archives-lambda",
			description:
				"AWS Lambda code that deals with executing all of the edits on a video",
			icon: ScissorsIcon,
		},
		"CDK source code": {
			url: "https://github.com/emanpecson/hoop-archives-cdk",
			description:
				"AWS CDK code that provisions all of my AWS resources in one place",
			icon: LandmarkIcon,
		},
		Documentation: {
			url: "https://emanpecson.com/projects/hoop-archives",
			description: "Learn more about Hoop Archives!",
			icon: HelpCircleIcon,
		},
	};

	return (
		<div className="w-full flex justify-between place-items-center pt-8">
			<div className="flex place-items-center space-x-2">
				<p className="font-bold text-xl">Hoop Archives</p>
				<p className="rounded-md bg-neutral-600/50 text-neutral-300/50 text-sm font-semibold px-2 py-0.5">
					Beta
				</p>
			</div>

			<div className="flex place-items-center space-x-4">
				<Dialog>
					<DialogTrigger asChild>
						<button className="rounded-full w-6 h-6 text-white hover:text-highlight cursor-pointer duration-150">
							<svg
								role="img"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
							>
								<title>Source code</title>
								<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
							</svg>
						</button>
					</DialogTrigger>

					<DialogContent className="sm:max-w-2xl">
						<DialogHeader>
							<DialogTitle>Source code</DialogTitle>
							<DialogDescription />
						</DialogHeader>

						<div className="grid grid-cols-2 gap-4">
							{Object.keys(codeSource).map((srcKey, i) => {
								const src = codeSource[srcKey as keyof typeof codeSource];
								return (
									<Link
										href={src.url}
										rel="noopener noreferrer"
										target="_blank"
										key={i}
									>
										<div
											className={cn(
												"border rounded-lg w-full h-full border-input-border",
												"text-neutral-500 hover:text-highlight duration-150"
											)}
										>
											{/* placeholder for an image in the future */}
											<div className="flex justify-center place-items-center h-24 bg-neutral-800/40">
												<src.icon size={20} />
											</div>
											<div className="px-4 py-2 inset-shadow-sm inset-shadow-neutral-800/60 space-y-1">
												<p className="font-semibold text-sm">{srcKey}</p>
												<p className="text-neutral-500 text-sm">
													{src.description}
												</p>
											</div>
										</div>
									</Link>
								);
							})}
						</div>
					</DialogContent>
				</Dialog>

				{props.session ? (
					<Link
						href={props.demoLeaguePath}
						className="hover:text-highlight font-medium duration-150"
					>
						Home
					</Link>
				) : (
					<button
						className="hover:text-highlight font-medium duration-150 cursor-pointer"
						onClick={() =>
							signIn("cognito", { redirectTo: props.demoLeaguePath })
						}
					>
						Sign in
					</button>
				)}
			</div>
		</div>
	);
}
