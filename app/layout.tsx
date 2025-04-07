import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";

const IBMPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex",
});

export const metadata: Metadata = {
  title: "Image Generation",
  description: "Generate images with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#000",
          colorText: "#000",
          colorTextSecondary: "#000",
          colorBackground: "#fff",
        },
      }}
    >
      <html lang="en">
        <body className={cn("font-IBM-Plex antialiased", IBMPlex.className)}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
