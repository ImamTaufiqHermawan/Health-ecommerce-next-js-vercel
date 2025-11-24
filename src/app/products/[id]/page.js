"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Button, Spin, InputNumber, message, Descriptions, Tag } from "antd";
import { ShoppingCartOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/products/${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      const data = await res.json();
      return data.data;
    },
  });

  const handleAddToCart = async () => {
    if (!user) {
      message.warning("Silakan login terlebih dahulu");
      router.push("/login");
      return;
    }

    try {
      await addToCart(product._id, quantity);
      message.success(`${quantity}x ${product.name} ditambahkan ke keranjang`);
    } catch (error) {
      message.error("Gagal menambahkan ke keranjang");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl mb-4">Produk tidak ditemukan</h2>
        <Button type="primary" onClick={() => router.push("/products")}>
          Kembali ke Produk
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
          className="mb-6"
        >
          Kembali
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <ShoppingCartOutlined className="text-6xl mb-4" />
                  <p>Tidak ada gambar</p>
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Tag color="blue" className="mb-2">
                {product.category}
              </Tag>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-4xl text-blue-600 font-bold">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
            </div>

            <Descriptions bordered column={1}>
              <Descriptions.Item label="Kategori">
                {product.category}
              </Descriptions.Item>
              <Descriptions.Item label="Stok">
                <Tag color={product.stock > 10 ? "green" : "orange"}>
                  {product.stock} unit
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Deskripsi">
                {product.description}
              </Descriptions.Item>
            </Descriptions>

            {/* Add to Cart Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-semibold">Jumlah:</span>
                <InputNumber
                  min={1}
                  max={product.stock}
                  value={quantity}
                  onChange={setQuantity}
                  size="large"
                  disabled={product.stock === 0}
                />
              </div>

              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                block
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {product.stock === 0
                  ? "Stok Habis"
                  : `Tambah ke Keranjang (Rp ${(
                      product.price * quantity
                    ).toLocaleString("id-ID")})`}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
