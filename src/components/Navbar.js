/**
 * Navbar Component
 */

"use client";

import { Layout, Menu, Badge, Button, Dropdown } from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  HomeOutlined,
  ShoppingOutlined,
  LogoutOutlined,
  ProfileOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const { Header } = Layout;

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <ProfileOutlined />,
      label: "Profil Saya",
      onClick: () => router.push("/profile"),
    },
    {
      key: "orders",
      icon: <FileTextOutlined />,
      label: "Pesanan Saya",
      onClick: () => router.push("/orders"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
      danger: true,
    },
  ];

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: <Link href="/">Beranda</Link>,
    },
    {
      key: "/products",
      icon: <ShoppingOutlined />,
      label: <Link href="/products">Produk</Link>,
    },
  ];

  if (isLoggedIn) {
    menuItems.push({
      key: "/cart",
      icon: (
        <Badge count={cartCount} offset={[5, 0]}>
          <ShoppingCartOutlined />
        </Badge>
      ),
      label: <Link href="/cart">Keranjang</Link>,
    });
  }

  return (
    <Header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-full">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Health E-Commerce
        </Link>

        <div className="flex items-center gap-4">
          <Menu
            mode="horizontal"
            selectedKeys={[pathname]}
            items={menuItems}
            className="border-0 flex-1 min-w-0"
          />

          {isLoggedIn ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button type="text" icon={<UserOutlined />}>
                {user?.name}
              </Button>
            </Dropdown>
          ) : (
            <Link href="/login">
              <Button type="primary">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </Header>
  );
}
