"use client";

import React from "react";

export default function HomePage() {
	// const [file, setFile] = useState<File | null>(null);
	const handleFileChange = async (ev: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const vid = ev.target.files?.[0];

			if (vid) {
				// setFile(vid);

				const res = await fetch(`/api/upload?filename=${vid.name}`, {
					method: "GET",
				});

				const { presignedUrl } = await res.json();

				console.log("data:", presignedUrl);

				console.log("uploading to s3");

				// with this presigned url we could upload as follows:
				const uploadRes = await fetch(presignedUrl, {
					method: "PUT",
					headers: {
						"Content-Type": vid.type,
					},
					body: vid,
				});

				console.log("upload response:", await uploadRes.json());
			} else {
				console.log("Invalid file");
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="flex justify-center place-items-center h-screen">
			{/* <button onClick={handleFileChange}>click me</button> */}

			<input type="file" accept="video/*" onChange={handleFileChange} />
		</div>
	);
}
