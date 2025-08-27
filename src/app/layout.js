import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import LayoutWrapper from "@/components/LayoutWrapper";
import SplashScreen from "@/components/SplashScreen";
import AuthModal from "@/components/AuthModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Monthly Payment Distribution System",
  description: "A system for managing monthly payments and user details.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SplashScreen>
          <Toaster position="top-right" />
          <AuthModal>
            <LayoutWrapper>{children}</LayoutWrapper>
          </AuthModal>
        </SplashScreen>
      </body>
    </html>
  );
}
