"use client";
import Link from "next/link";
import { Inter } from "next/font/google";
import { useRef } from "react";
import { makeStore } from "@/store/store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import WalletConnect from "@/components/walletConnect";
import WalletContext from "@/context/walletContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const storeRef = useRef();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={storeRef.current}>
          <WalletContext>
            <div className="w-full justify-center items-center py-4 bg-white shadow-md px-2">
              <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="font-bold text-lg">
                  Admin
                </Link>
                <WalletConnect />
              </div>
            </div>

            <div className="py-4 px-2">{children}</div>
            <Toaster position="bottom-right" reverseOrder={false} />
          </WalletContext>
        </Provider>
      </body>
    </html>
  );
}
