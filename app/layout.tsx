import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EraCrux",
  description: "Turn raw data into Dashboards in seconds.",
    openGraph: {
    title: "EraCrux",
    description: "Turn raw data into Dashboards in seconds.",
    url: "https://www.eracrux.com/",
    siteName: "EraCrux",
    images: [
      {
        url: "https://www.eracrux.com/Hero.png",
        width: 1200,
        height: 630,
        alt: "Thumbnail preview EraCrux",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EraCrux",
    description: "Turn raw data into Dashboards in seconds.",
    images: ["https://www.eracrux.com/Hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        {/* <link rel="preconnect" href="https://fonts.gstatic.com"> </link> */}

        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"></link>

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
