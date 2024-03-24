"use client"
import { Flowbite, ThemeModeScript } from "flowbite-react";
import { Inter } from "next/font/google";
import { twMerge } from "tailwind-merge";
import "./globals.css";
import { flowbiteTheme } from "./theme";
import { ProfileContextProvider } from "./(views)/context/profileContext";

const inter = Inter({ subsets: ["latin"] });

const metadata = {
  title: 'Mieszko RTC Monitoring',
}


const RootLayout  = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <ThemeModeScript />
        <meta name="referrer" content="no-referrer-when-downgrade"/>

      </head>
      <body className={twMerge("bg-gray-50 dark:bg-gray-900", inter.className)}>
        <Flowbite theme={{ theme: flowbiteTheme }}>
          <ProfileContextProvider>
            {children}
          </ProfileContextProvider>
        </Flowbite>
      </body>
    </html>
  );
};

export default RootLayout;
