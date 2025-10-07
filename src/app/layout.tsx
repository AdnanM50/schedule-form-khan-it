import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Schedule Form K.IT"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark light" />

      </head>
      <body
        suppressHydrationWarning
        className={`antialiased`}
      >

        {children}
        <Toaster />

      </body>
    </html>
  );
}
