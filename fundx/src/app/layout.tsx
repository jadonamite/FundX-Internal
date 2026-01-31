
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { StacksProvider } from "@/components/fundx/StacksProvider"; 

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FundX | Crowdfunding on Bitcoin",
  description: "Decentralized crowdfunding platform on Stacks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={jakarta.variable}>
        {/* Wrap everything in the Provider */}
        <StacksProvider>
  {children}
</StacksProvider>
      </body>
    </html>
  );
}