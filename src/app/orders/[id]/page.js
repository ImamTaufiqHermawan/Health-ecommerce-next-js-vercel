"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Spin,
  Empty,
  Divider,
  List,
  Alert,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  TruckOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(value)) return "0";
  return Number(value).toLocaleString("id-ID");
};

const formatDate = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id;

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orderDetail", orderId],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch order");
      const result = await res.json();
      return result.data;
    },
  });

  const getStatusTag = (status) => {
    const statusConfig = {
      pending: {
        color: "orange",
        icon: <ClockCircleOutlined />,
        text: "Menunggu Pembayaran",
      },
      paid: {
        color: "blue",
        icon: <CheckCircleOutlined />,
        text: "Sudah Dibayar",
      },
      processing: {
        color: "cyan",
        icon: <ClockCircleOutlined />,
        text: "Sedang Diproses",
      },
      shipped: {
        color: "purple",
        icon: <TruckOutlined />,
        text: "Sedang Dikirim",
      },
      delivered: {
        color: "green",
        icon: <CheckCircleOutlined />,
        text: "Sudah Diterima",
      },
      failed: {
        color: "red",
        icon: <CloseCircleOutlined />,
        text: "Gagal",
      },
      cancelled: {
        color: "default",
        icon: <CloseCircleOutlined />,
        text: "Dibatalkan",
      },
    };

    const config = statusConfig[status] || {
      color: "default",
      icon: null,
      text: status,
    };
    return (
      <Tag
        color={config.color}
        icon={config.icon}
        className="text-base px-3 py-1"
      >
        {config.text}
      </Tag>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <Spin size="large" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card>
            <Empty
              description={
                <span className="text-red-500">
                  Pesanan tidak ditemukan atau terjadi kesalahan.
                </span>
              }
            >
              <Button type="primary" onClick={() => router.push("/orders")}>
                Kembali ke Riwayat Pesanan
              </Button>
            </Empty>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push("/orders")}
            className="mb-4"
          >
            Kembali ke Riwayat Pesanan
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingOutlined className="text-blue-500" />
                Detail Pesanan
              </h1>
              <p className="text-gray-600 mt-1">
                Order ID:{" "}
                <span className="font-mono font-semibold">{order.orderId}</span>
              </p>
            </div>
            {getStatusTag(order.status)}
          </div>
        </div>

        {/* Status Alert */}
        {order.status === "pending" && (
          <Alert
            message="Menunggu Pembayaran"
            description="Silakan selesaikan pembayaran Anda. Pesanan akan otomatis terupdate setelah pembayaran berhasil."
            type="warning"
            showIcon
            className="mb-6"
          />
        )}

        {/* Order Information */}
        <Card title="Informasi Pesanan" className="mb-6">
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Order ID">
              <span className="font-mono font-semibold">{order.orderId}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Tanggal Pesanan">
              {formatDate(order.createdAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {getStatusTag(order.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Total Amount">
              <span className="text-lg font-bold text-blue-600">
                Rp {formatCurrency(order.totalAmount)}
              </span>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Order Items */}
        <Card title="Produk yang Dipesan" className="mb-6">
          <List
            itemLayout="horizontal"
            dataSource={order.items || []}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    item.product?.image ? (
                      <div className="relative w-16 h-16">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                        <ShoppingOutlined className="text-gray-400" />
                      </div>
                    )
                  }
                  title={
                    <span className="font-semibold">
                      {item.product?.name || "Product"}
                    </span>
                  }
                  description={
                    <div>
                      <div className="text-sm text-gray-500">
                        Harga: Rp {formatCurrency(item.price)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Jumlah: {item.quantity}x
                      </div>
                    </div>
                  }
                />
                <div className="text-right">
                  <div className="font-semibold text-blue-600">
                    Rp {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              </List.Item>
            )}
          />
          <Divider />
          <div className="flex justify-end">
            <div className="text-right">
              <div className="text-gray-600 mb-2">
                Subtotal: Rp {formatCurrency(order.totalAmount)}
              </div>
              <div className="text-2xl font-bold text-blue-600">
                Total: Rp {formatCurrency(order.totalAmount)}
              </div>
            </div>
          </div>
        </Card>

        {/* Payment Information */}
        {order.midtransData && (
          <Card title="Informasi Pembayaran">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Payment Method">
                {order.midtransData.payment_type || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Transaction ID">
                {order.midtransData.transaction_id || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Bank">
                {order.midtransData.bank || "-"}
              </Descriptions.Item>
              {order.midtransData.va_number && (
                <Descriptions.Item label="VA Number">
                  <span className="font-mono font-semibold">
                    {order.midtransData.va_number}
                  </span>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
