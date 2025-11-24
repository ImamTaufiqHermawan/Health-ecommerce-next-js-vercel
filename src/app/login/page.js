"use client";

import { useState } from "react";
import { Form, Input, Button, Card, message, Tabs } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const onLoginFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login gagal");
      }

      login(data.data.user, data.data.token);
      message.success("Login berhasil!");
      router.push("/products");
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRegisterFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registrasi gagal");
      }

      login(data.data.user, data.data.token);
      message.success("Registrasi berhasil!");
      router.push("/products");
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loginForm = (
    <Form
      name="login"
      onFinish={onLoginFinish}
      autoComplete="off"
      layout="vertical"
      size="large"
    >
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Email harus diisi!" },
          { type: "email", message: "Email tidak valid!" },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: "Password harus diisi!" }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          Login
        </Button>
      </Form.Item>
    </Form>
  );

  const registerForm = (
    <Form
      name="register"
      onFinish={onRegisterFinish}
      autoComplete="off"
      layout="vertical"
      size="large"
    >
      <Form.Item
        name="name"
        rules={[{ required: true, message: "Nama harus diisi!" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Nama Lengkap" />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Email harus diisi!" },
          { type: "email", message: "Email tidak valid!" },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: "Password harus diisi!" },
          { min: 6, message: "Password minimal 6 karakter!" },
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        dependencies={["password"]}
        rules={[
          { required: true, message: "Konfirmasi password harus diisi!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Password tidak sama!"));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Konfirmasi Password"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          Daftar
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-4xl font-bold text-blue-600 mb-2">
              Health E-Commerce
            </h1>
          </Link>
          <p className="text-gray-600">Platform Kesehatan Terpercaya</p>
        </div>

        <Card>
          <Tabs
            defaultActiveKey="login"
            centered
            items={[
              {
                key: "login",
                label: "Login",
                children: loginForm,
              },
              {
                key: "register",
                label: "Daftar",
                children: registerForm,
              },
            ]}
          />
        </Card>

        <div className="text-center mt-4">
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
