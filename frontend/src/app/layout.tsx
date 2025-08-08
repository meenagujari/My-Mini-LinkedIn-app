"use client";

import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { Inter } from "next/font/google";
import "./globals.css";
import { store } from "@/store/store";
import { queryClient } from "@/lib/queryClient";
import { AppWrapper } from "@/components/layout/app-wrapper";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <AppWrapper>{children}</AppWrapper>
          </QueryClientProvider>
        </Provider>
      </body>
    </html>
  );
}