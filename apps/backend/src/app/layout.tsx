import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import FirebaseProviders from "@/providers/firebaseProviders";
import FirebaseProviderInstance from "@/providers/firebaseProviderInstance";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Pothole Detection",
  description: "Pothole Detection System using AI and Computer Vision Technologies for Road Safety",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ReactQueryProvider>
              <FirebaseProviders>
                <FirebaseProviderInstance>
                  {children}
                </FirebaseProviderInstance>
              </FirebaseProviders>
          </ReactQueryProvider>
      </body>
    </html>
  );
}
