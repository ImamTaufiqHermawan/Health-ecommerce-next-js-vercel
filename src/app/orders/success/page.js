"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button, Result } from "antd";
import {
  CheckCircleOutlined,
  ShoppingOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <Result
          status="success"
          icon={<CheckCircleOutlined className="text-green-500" />}
          title={
            <span className="text-2xl font-bold">Pesanan Berhasil Dibuat!</span>
          }
          subTitle={
            <div className="text-gray-600">
              {orderId ? (
                <>
                  Order ID:{" "}
                  <span className="font-mono font-semibold">{orderId}</span>
                  <br />
                </>
              ) : null}
              <p className="mt-2">
                Terima kasih telah berbelanja. Silakan lakukan pembayaran untuk
                melanjutkan pesanan Anda.
              </p>
            </div>
          }
          extra={[
            <Button
              type="primary"
              key="orders"
              icon={<FileTextOutlined />}
              onClick={() => router.push("/orders")}
              size="large"
            >
              Lihat Pesanan Saya
            </Button>,
            <Button
              key="products"
              icon={<ShoppingOutlined />}
              onClick={() => router.push("/products")}
              size="large"
            >
              Belanja Lagi
            </Button>,
          ]}
        />
      </main>
      <Footer />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
} );
}
