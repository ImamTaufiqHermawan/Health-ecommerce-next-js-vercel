"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Table,
  Button,
  InputNumber,
  Empty,
  Spin,
  message,
  Popconfirm,
} from "antd";
import {
  DeleteOutlined,
  ShoppingOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CartPage() {
  const router = useRouter();
  const { cart, updateCartItem, removeFromCart, isLoading } = useCart();
  const { user } = useAuth();

  if (!user) {
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

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      await updateCartItem(productId, newQuantity);
      message.success("Keranjang diupdate");
    } catch (error) {
      message.error("Gagal update keranjang");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      message.success("Produk dihapus dari keranjang");
    } catch (error) {
      message.error("Gagal menghapus produk");
    }
  };

  const handleCheckout = async () => {
    if (!cart || cart.length === 0) {
      message.warning("Keranjang kosong");
      return;
    }

    try {
      // Prepare items payload
      const items = cart.map((item) => ({
        id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      }));

      // Create order and get Midtrans token
      const res = await fetch("/api/external/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          items,
          customerDetails: {
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            address: user.address || "",
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Payment error:", errorData);
        throw new Error(errorData.message || "Failed to create payment");
      }

      const data = await res.json();
      console.log("Payment response:", data);

      // Redirect to Midtrans payment page
      if (data.data?.paymentUrl || data.data?.redirectUrl) {
        const redirectUrl = data.data.paymentUrl || data.data.redirectUrl;
        console.log("Redirecting to:", redirectUrl);
        message.success("Mengarahkan ke halaman pembayaran...");

        // Direct redirect to external payment page
        window.location.href = redirectUrl;
      } else if (data.data?.orderId) {
        // If no redirect URL, go to success page directly
        console.log("No payment URL, going to success page");
        router.push(`/orders/success?orderId=${data.data.orderId}`);
      } else {
        throw new Error("Invalid payment response");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      message.error(error.message || "Gagal membuat pembayaran");
    }
  };

  const columns = [
    {
      title: "Produk",
      key: "product",
      render: (_, record) => (
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 bg-gray-100 rounded">
            {record.product.image ? (
              <Image
                src={record.product.image}
                alt={record.product.name}
                fill
                className="object-cover rounded"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No Img
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold">{record.product.name}</p>
            <p className="text-gray-500 text-sm">{record.product.category}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Harga",
      key: "price",
      render: (_, record) => (
        <span className="font-semibold">
          Rp {record.product.price.toLocaleString("id-ID")}
        </span>
      ),
    },
    {
      title: "Jumlah",
      key: "quantity",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button
            size="small"
            icon={<MinusOutlined />}
            onClick={() =>
              handleUpdateQuantity(record.product._id, record.quantity - 1)
            }
            disabled={record.quantity <= 1}
          />
          <InputNumber
            min={1}
            max={record.product.stock}
            value={record.quantity}
            onChange={(value) =>
              handleUpdateQuantity(record.product._id, value)
            }
            className="w-16"
          />
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() =>
              handleUpdateQuantity(record.product._id, record.quantity + 1)
            }
            disabled={record.quantity >= record.product.stock}
          />
        </div>
      ),
    },
    {
      title: "Subtotal",
      key: "subtotal",
      render: (_, record) => (
        <span className="font-bold text-blue-600">
          Rp {(record.product.price * record.quantity).toLocaleString("id-ID")}
        </span>
      ),
    },
    {
      title: "Aksi",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Hapus produk ini?"
          onConfirm={() => handleRemove(record.product._id)}
          okText="Ya"
          cancelText="Tidak"
        >
          <Button danger icon={<DeleteOutlined />}>
            Hapus
          </Button>
        </Popconfirm>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Spin size="large" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Keranjang Belanja</h1>

        {!cart || cart.length === 0 ? (
          <div className="text-center py-20">
            <Empty description="Keranjang kosong">
              <Button
                type="primary"
                icon={<ShoppingOutlined />}
                onClick={() => router.push("/products")}
              >
                Mulai Belanja
              </Button>
            </Empty>
          </div>
        ) : (
          <div className="space-y-6">
            <Table
              columns={columns}
              dataSource={cart}
              rowKey={(record) => record.product._id}
              pagination={false}
            />

            {/* Summary */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="max-w-md ml-auto space-y-3">
                <div className="flex justify-between text-lg">
                  <span>Total Item:</span>
                  <span className="font-semibold">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} item
                  </span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-blue-600 border-t pt-3">
                  <span>Total:</span>
                  <span>
                    Rp{" "}
                    {cart
                      .reduce(
                        (sum, item) => sum + item.product.price * item.quantity,
                        0
                      )
                      .toLocaleString("id-ID")}
                  </span>
                </div>
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handleCheckout}
                >
                  Lanjut ke Pembayaran
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
