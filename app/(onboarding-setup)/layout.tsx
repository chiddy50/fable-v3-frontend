"use client"

import LoaderComponent from "@/components/shared/LoaderComponent";
import { usePrivy } from "@privy-io/react-auth";

export default function BlogLayout({
	children,
}: {
	children: React.ReactNode
}) {

	const { ready } = usePrivy();

	if (!ready) {
		return (
			<LoaderComponent />
		);
	}


	return <>{children}</>
}