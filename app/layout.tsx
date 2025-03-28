"use client";
import { ColorSchemeScript } from "@mantine/core";
import { createTheme, MantineProvider } from "@mantine/core";
import { Analytics } from "@vercel/analytics/react";
import "typeface-roboto-mono";
import "./globals.css";

import "@mantine/core/styles.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const theme = createTheme({
  fontFamily: "Roboto Mono",
  headings: { fontFamily: "Roboto Mono" },
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <ColorSchemeScript />
      </head>
      <body className={` antialiased min-h-screen`}>
        <MantineProvider theme={theme}>
          {" "}
          <main className="flex flex-col !min-h-screen">
            <Header />
            <div className="flex-grow pt-20 md:pt-20  min-h-screen">
              {" "}
              {children}
            </div>
            <Footer />
          </main>
          <Analytics />
        </MantineProvider>
      </body>
    </html>
  );
}
