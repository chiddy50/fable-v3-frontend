"use client";

import FooterComponent from "@/components/FooterComponent";
import LoaderComponent from "@/components/shared/LoaderComponent";
import { usePrivy } from "@privy-io/react-auth";

export default function Layout1({
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

  return (
    <>
    {children}
      {/* <FooterComponent /> */}
    </>
  );
}