"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Input,
  Select,
  Card,
  Row,
  Col,
  Spin,
  Empty,
  Button,
  message,
} from "antd";
import { SearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const { Option } = Select;

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", search, category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category !== "all") params.append("category", category);

      const res = await fetch(`/api/products?${params}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch products");
      }
      const result = await res.json();

      // Handle response format
      if (result.data?.products) {
        return result.data.products;
      }
      return result.data || [];
    },
  });

  const products = Array.isArray(data) ? data : [];

  const handleAddToCart = async (product) => {
    if (!user) {
      message.warning("Silakan login terlebih dahulu");
      router.push("/login");
      return;
    }

    try {
      await addToCart(product._id, 1);
      message.success(`${product.name} ditambahkan ke keranjang`);
    } catch (error) {
      message.error("Gagal menambahkan ke keranjang");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Produk Kami</h1>

        {/* Filter Section */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Cari produk..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:w-1/2"
            size="large"
          />
          <Select
            value={category}
            onChange={setCategory}
            className="md:w-1/4"
            size="large"
          >
            <Option value="all">Semua Kategori</Option>
            <Option value="Vitamin">Vitamin</Option>
            <Option value="Suplemen">Suplemen</Option>
            <Option value="Obat">Obat</Option>
            <Option value="Alat Kesehatan">Alat Kesehatan</Option>
          </Select>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Spin size="large" />
          </div>
        ) : products.length === 0 ? (
          <Empty description="Tidak ada produk ditemukan" />
        ) : (
          <Row gutter={[16, 16]}>
            {products.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
                <Card
                  hoverable
                  cover={
                    <div className="relative h-48 bg-gray-100">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                  }
                  onClick={() => router.push(`/products/${product._id}`)}
                >
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-sm">{product.category}</p>
                    <p className="text-blue-600 font-bold text-xl">
                      Rp {product.price.toLocaleString("id-ID")}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      block
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0
                        ? "Stok Habis"
                        : "Tambah ke Keranjang"}
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </main>

      <Footer />
    </div>
  );
}
