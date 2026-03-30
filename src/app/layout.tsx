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
    icon: "/LogoFrame.svg",
  },
  other: {
    "talentapp:project_verification": "0abaa0ca8e316c1b114773ac99e1f239642ea2a42ce4d1dd12f62a9306c327599fa0e4fa75d209534e2d88970b06583648c40233e8f5d1e6e63947041a3188f6",
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