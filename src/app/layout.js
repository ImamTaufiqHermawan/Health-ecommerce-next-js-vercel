"use client";

import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamic import devtools only in development
const ReactQueryDevtools =
  process.env.NODE_ENV === "development"
    ? dynamic(
        () =>
          import("@tanstack/react-query-devtools").then(
            (mod) => mod.ReactQueryDevtools
          ),
        { ssr: false }
      )
    : () => null;

export default function RootLayout({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <html lang="id">
      <body className="antialiased">
        <QueryClientProvider client={queryClient}>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#0ea5e9",
                borderRadius: 8,
              },
            }}
          >
            <AuthProvider>
              <CartProvider>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
              </CartProvider>
            </AuthProvider>
          </ConfigProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
