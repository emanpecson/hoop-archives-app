/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dispatch, SetStateAction, useEffect } from "react";

export type useLoadDataProps = {
	onDataLoaded: (data: any) => void;
	endpoint: string;
	onError?: (error: unknown) => void;
	setIsLoading?: Dispatch<SetStateAction<boolean>>;
	delay?: number;
	halt?: boolean;
};

export function useLoadData(props: useLoadDataProps) {
	useEffect(() => {
		const fetchData = async () => {
			try {
				if (props.setIsLoading) props.setIsLoading(true);
				const res = await fetch(props.endpoint, { method: "GET" });
				const data = await res.json();
				props.onDataLoaded(data);
			} catch (err) {
				if (props.onError) props.onError(err);
			} finally {
				setTimeout(() => {
					if (props.setIsLoading) props.setIsLoading(false);
				}, props.delay ?? 0);
			}
		};

		if (props.halt === undefined) fetchData();
		else if (!props.halt) fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.endpoint, props.halt]);
}
