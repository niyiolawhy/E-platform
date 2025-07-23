import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "E-commerce Platform - Your Online Store",
    template: "%s | E-commerce Platform",
  },
  description:
    "Discover amazing products at great prices. Browse our comprehensive collection of electronics, clothing, home goods, and more.",
  keywords: ["ecommerce", "online store", "shopping", "products", "electronics", "clothing", "home goods"],
  authors: [{ name: "E-commerce Platform" }],
  creator: "E-commerce Platform",
  publisher: "E-commerce Platform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://your-domain.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    title: "E-commerce Platform - Your Online Store",
    description: "Discover amazing products at great prices. Browse our comprehensive collection.",
    siteName: "E-commerce Platform",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "E-commerce Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "E-commerce Platform - Your Online Store",
    description: "Discover amazing products at great prices.",
    images: ["/og-image.jpg"],
    creator: "@ecommerce_platform",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <main className="min-h-screen bg-background">{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
