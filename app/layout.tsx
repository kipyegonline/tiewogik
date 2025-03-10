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
      <body className={` antialiased min-h-full`}>
        <MantineProvider theme={theme}>
          {" "}
          <main className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow pt-20 md:pt-20 "> {children}</div>

            <Footer />
          </main>
          <Analytics />
        </MantineProvider>
      </body>
    </html>
  );
}

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFF9F2]">
      {" "}
      {/* Warm background for body */}
      <Header />
      <main className="flex-grow pt-16 px-4 md:px-6">{children}</main>
      <Footer />
    </div>
  );
};

// And in your lyrics display component:
const LyricsDisplay = ({ lyrics }) => {
  return (
    <div className="max-w-3xl mx-auto my-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-[#F9EBE0]">
        <h1 className="text-2xl font-bold mb-4 text-[#E86F36]">
          {lyrics.title}
        </h1>
        <div className="lyrics-content whitespace-pre-line">
          {lyrics.content}
        </div>
      </div>
    </div>
  );
};
