"use client";
import { ColorSchemeScript } from "@mantine/core";
import { createTheme, MantineProvider } from "@mantine/core";
import {
  Geist,
  Geist_Mono,
  Noto_Serif_Georgian as Georgia,
  Montserrat,
  Poppins,
} from "next/font/google";
import "typeface-roboto-mono";
import "./globals.css";

import "@mantine/core/styles.css";

const montserrat = Montserrat({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const theme = createTheme({
  fontFamily: montserrat.variable,
  // headings: { fontFamily: "Roboto Mono" },
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
      <body className={` ${montserrat.variable} antialiased`}>
        <MantineProvider theme={theme}> {children}</MantineProvider>
      </body>
    </html>
  );
}
