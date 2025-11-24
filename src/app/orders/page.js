"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Card,
  Table,
  Tag,
  Button,
  Empty,
  Spin,
  Pagination,
  Select,
} from "antd";
import {
  ShoppingOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  TruckOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const { Option } = Select;

const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return "0";
  }
  return Number(value).toLocaleString("id-ID");
};

export default function OrderHistoryPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["orderHistory", page, limit, statusFilter],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (statusFilter) {
        params.append("status", statusFilter);
      }

      const res = await fetch(`/api/orders?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
    enabled: isLoggedIn,
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
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (text) => (
        <span className="font-mono text-sm font-semibold">{text}</span>
      ),
    },
    {
      title: "Tanggal",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => {
        const d = new Date(date);
        return (
          <div>
            <div className="text-sm font-medium">
              {d.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
            <div className="text-xs text-gray-500">
              {d.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        );
      },
    },
    {
      title: "Items",
      key: "items",
      render: (_, record) => (
        <div>
          <div className="text-sm font-medium">
            {record.items?.length || 0} item(s)
          </div>
          <div className="text-xs text-gray-500">
            {record.items?.[0]?.product?.name || "N/A"}
            {record.items?.length > 1 && ` +${record.items.length - 1} lainnya`}
          </div>
        </div>
      ),
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => (
        <span className="font-semibold text-blue-600">
          Rp {formatCurrency(amount)}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Aksi",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => router.push(`/orders/${record.orderId}`)}
          className="!p-0"
        >
          Detail
        </Button>
      ),
    },
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-2xl mb-4">Silakan login terlebih dahulu</h2>
          <Button type="primary" onClick={() => router.push("/login")}>
            Login
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

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

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card>
            <Empty
              description={
                <span className="text-red-500">
                  Gagal memuat riwayat pesanan. Silakan coba lagi.
                </span>
              }
            >
              <Button type="primary" onClick={() => refetch()}>
                Coba Lagi
              </Button>
            </Empty>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Handle both data structures: data.data (array) or data.data.orders (array)
  const orders = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.data?.orders)
    ? data.data.orders
    : [];
  const pagination = data?.data?.pagination || {};
  const total = pagination.total || orders.length;
  const totalPages = pagination.pages || 1;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingOutlined className="text-blue-500" />
                Riwayat Pesanan
              </h1>
              <p className="text-gray-600 mt-1">Lihat semua pesanan Anda</p>
            </div>
            <Button icon={<HomeOutlined />} onClick={() => router.push("/")}>
              Kembali ke Home
            </Button>
          </div>

          {/* Filter */}
          <div className="flex gap-2 mb-4">
            <Select
              placeholder="Filter Status"
              allowClear
              value={statusFilter || undefined}
              onChange={(value) => {
                setStatusFilter(value || "");
                setPage(1);
              }}
              className="w-48"
            >
              <Option value="pending">Menunggu Pembayaran</Option>
              <Option value="paid">Sudah Dibayar</Option>
              <Option value="processing">Sedang Diproses</Option>
              <Option value="shipped">Sedang Dikirim</Option>
              <Option value="delivered">Sudah Diterima</Option>
              <Option value="failed">Gagal</Option>
              <Option value="cancelled">Dibatalkan</Option>
            </Select>
          </div>
        </div>

        <Card>
          {orders.length === 0 ? (
            <Empty
              description="Belum ada pesanan"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={() => router.push("/products")}>
                Mulai Belanja
              </Button>
            </Empty>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table
                  columns={columns}
                  dataSource={orders}
                  rowKey="_id"
                  pagination={false}
                  className="mb-4"
                />
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <Pagination
                    current={page}
                    total={total}
                    pageSize={limit}
                    onChange={(newPage) => setPage(newPage)}
                    showSizeChanger={false}
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} dari ${total} pesanan`
                    }
                  />
                </div>
              )}
            </>
          )}
        </Card>
      </main>

      <Footer />
    </div>
  );
}
