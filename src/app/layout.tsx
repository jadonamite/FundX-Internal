import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { StacksProvider } from "@/components/fundx/StacksProvider";
import { Toaster } from "@/components/ui/sonner"; 

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "FundX | Capital Formation",
  description: "Decentralized Capital Formation platform on Stacks.",
  icons: {
    icon: "/LogoFrame.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={jakarta.variable}>
        <StacksProvider>
          {children}
        </StacksProvider>
        <Toaster position="bottom-right" richColors /> 
      </body>
    </html>
  );
}