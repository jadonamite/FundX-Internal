import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { StacksProvider } from "@/components/fundx/StacksProvider";
import { Toaster } from "@/components/ui/sonner";

const getFontConfig = () => Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const getMetadata = () => ({
  title: "FundX | Capital Formation",
  description: "The Decentralized Capital Formation platform on Stacks.\