import { Loader2Icon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

interface LoadingPromptProps {
  text: string;
  goBackUrl?: string;
}

export default function LoadingPrompt(props: LoadingPromptProps) {
  return (
    <div className="p-8 w-full h-1/2 flex flex-col justify-center place-items-center text-neutral-400">
      <p className="animate-bounce text-2xl">🏀</p>
      <div className="flex space-x-2">
        <Loader2Icon className="animate-spin" />
        <p className="font-medium text-base">{props.text}</p>
      </div>
      {props.goBackUrl && (
        <Button variant="input" className="w-fit mt-3">
          <Link href={props.goBackUrl}>Go back</Link>
        </Button>
      )}
    </div>
  );
}
