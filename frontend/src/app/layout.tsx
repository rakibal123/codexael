import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Codexael | Premium Web Solutions & Portfolio",
  description: "Explore the professional portfolio and premium web services of Codexael. Specializing in high-performance Web Applications, Backend Architectures, and bespoke UI/UX Designs.",
  keywords: ["Web Development", "Portfolio", "Next.js", "React", "Node.js", "Codexael", "Software Engineering"],
  openGraph: {
    title: "Codexael | Premium Web Solutions & Portfolio",
    description: "Explore the professional portfolio and premium web services of Codexael.",
    url: "https://codexael.com", // Assuming domain
    siteName: "Codexael",
    images: [
      {
        url: "/og-image.jpg", // Placeholder for actual OG image
        width: 1200,
        height: 630,
        alt: "Codexael Portfolio",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Codexael | Premium Web Solutions",
    description: "Explore the professional portfolio and premium web services of Codexael.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} antialiased min-h-screen bg-background text-foreground flex flex-col`}>
        <Toaster position="top-right" />
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
