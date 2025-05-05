"use client";

import FooterComponent from "@/components/FooterComponent";

export default function Layout1({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
    {children}
      {/* <FooterComponent /> */}
    </>
  );
}