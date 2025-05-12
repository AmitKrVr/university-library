import { ReactNode } from "react";
import type { Metadata } from "next";
import localFont from 'next/font/local'
import { SessionProvider } from "next-auth/react"
import "./globals.css";
import { Toaster } from "sonner";
import { auth } from "@/auth";
import { ReactQueryProvider } from "@/lib/react-query/ReactQueryProvider";

const ibmPlexSans = localFont({
  src: [
    { path: "/fonts/IBMPlexSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "/fonts/IBMPlexSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "/fonts/IBMPlexSans-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "/fonts/IBMPlexSans-Bold.ttf", weight: "700", style: "normal" },
  ],
});

const bebasNeue = localFont({
  src: [
    { path: "/fonts/BebasNeue-Regular.ttf", weight: "400", style: "normal" },
  ],
  variable: "--bebas-neue",
});

export const metadata: Metadata = {
  title: "BookWise",
  description:
    "BookWise is a book borrowing university library management solution.",
};

const RootLayout = async ({ children, }: { children: ReactNode }) => {

  const session = await auth()

  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body
          className={`${ibmPlexSans.className} ${bebasNeue.variable} antialiased`}
        >
          <ReactQueryProvider>
            {children}
            <Toaster richColors closeButton />
          </ReactQueryProvider>
        </body>
      </SessionProvider>
    </html>
  );
}

export default RootLayout
