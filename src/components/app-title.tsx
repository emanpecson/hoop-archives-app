import Link from "next/link";

interface AppTitleProps {
  redirectUrl?: string;
}

export default function AppTitle(props: AppTitleProps) {
  return (
    <div className="flex place-items-center space-x-2">
      <p className="font-bold sm:text-xl text-base text-nowrap">
        {props.redirectUrl ? (
          <Link href={props.redirectUrl}>Hoop Archives</Link>
        ) : (
          <span>Hoop Archives</span>
        )}
      </p>
      <p className="rounded-md bg-neutral-600/50 text-neutral-300/70 sm:text-sm text-xs font-semibold px-2 py-0.5">
        Beta
      </p>
    </div>
  );
}
