import "./globals.css";
import Navbar from "@/components/Navbar";
import { Space_Grotesk } from "next/font/google";
import DisableRightClick from "@/components/DisableRightClick"

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sailsify - Where Music Meets Innovation",
  description: "Sailsify is your ultimate music companion, offering seamless access to your favorite tunes, personalized playlists, and a vibrant music library. Whether you're exploring new tracks, rediscovering old favorites, or curating the perfect playlist, Sailsify brings you a world of music at your fingertips. Dive into an innovative, user-friendly experience designed for true music lovers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} font-sans custom-scrollbar`} >
        <DisableRightClick />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
