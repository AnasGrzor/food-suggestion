import type { Metadata } from "next";
import { Recursive } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const recursive = Recursive({
  weight: ["400"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MealSnap",
  description: "MealSnap - A Food Recommendation App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${recursive.className} bg-zinc-900 text-white`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
