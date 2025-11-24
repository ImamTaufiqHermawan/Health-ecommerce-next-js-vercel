"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Avatar,
  Divider,
  Tag,
  Upload,
  Spin,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  SaveOutlined,
  ShoppingOutlined,
  CameraOutlined,
  PhoneOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  const { user, updateUser, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [form] = Form.useForm();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
      });
      setPhotoUrl(user.profilePhoto || null);
    }
  }, [user, isLoggedIn, form, router]);

  const handleImageChange = (info) => {
    const file = info.file.originFileObj || info.file;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      message.error("Ukuran gambar maksimal 5MB");
      return false;
    }

    // Validate file type
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("File harus berupa gambar");
      return false;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoUrl(e.target.result);
      message.success("Gambar berhasil dipilih");
    };
    reader.readAsDataURL(file);
    setImageFile(file);

    return false; // Prevent auto upload
  };

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const formData = new FormData();

      if (values.name) formData.append("name", values.name);
      if (values.phone) formData.append("phone", values.phone);
      if (values.address) formData.append("address", values.address);
      if (values.password) formData.append("password", values.password);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal update profile");
      }

      const data = await res.json();
      updateUser(data.data);
      setPhotoUrl(data.data.profilePhoto || null);
      setImageFile(null);

      message.success("Profile berhasil diupdate!");
      form.resetFields(["password"]);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Profile Saya</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Summary Card */}
          <Card className="lg:col-span-1">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <Avatar
                  size={100}
                  src={photoUrl}
                  icon={!photoUrl && <UserOutlined />}
                  className="bg-blue-500"
                />
                <Upload
                  showUploadList={false}
                  beforeUpload={handleImageChange}
                  accept="image/*"
                >
                  <Button
                    icon={<CameraOutlined />}
                    shape="circle"
                    size="small"
                    className="absolute bottom-0 right-0"
                    title="Change photo"
                  />
                </Upload>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {user?.name || "User"}
              </h2>
              <p className="text-gray-500 mb-4">{user?.email || "-"}</p>

              <Tag color={user?.role === "admin" ? "red" : "blue"}>
                {user?.role === "admin" ? "Admin" : "Customer"}
              </Tag>

              <Divider />

              <div className="space-y-2 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-semibold">
                    {user?.phone || "Belum diisi"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <Tag color="green">Active</Tag>
                </div>
              </div>

              <Button
                type="dashed"
                block
                className="mt-4"
                icon={<ShoppingOutlined />}
                onClick={() => router.push("/products")}
              >
                Mulai Belanja
              </Button>
            </div>
          </Card>

          {/* Edit Profile Card */}
          <Card title="Edit Profile" className="lg:col-span-2">
            <Form
              form={form}
              name="profile"
              onFinish={onFinish}
              layout="vertical"
              size="large"
            >
              <Form.Item
                label="Nama Lengkap"
                name="name"
                rules={[
                  { required: true, message: "Nama wajib diisi!" },
                  { min: 3, message: "Nama minimal 3 karakter!" },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Nama Lengkap" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                tooltip="Email tidak dapat diubah"
              >
                <Input prefix={<MailOutlined />} placeholder="Email" disabled />
              </Form.Item>

              <Form.Item label="Nomor Telepon" name="phone">
                <Input prefix={<PhoneOutlined />} placeholder="081234567890" />
              </Form.Item>

              <Form.Item label="Alamat" name="address">
                <Input.TextArea
                  placeholder="Jl. Merdeka No. 123, Jakarta"
                  rows={3}
                />
              </Form.Item>

              <Form.Item label="Foto Profile">
                <div className="flex items-center gap-4">
                  {photoUrl && (
                    <Avatar
                      size={64}
                      src={photoUrl}
                      icon={<UserOutlined />}
                      className="border-2 border-gray-200"
                    />
                  )}
                  <Upload
                    showUploadList={false}
                    beforeUpload={handleImageChange}
                    accept="image/*"
                    maxCount={1}
                  >
                    <Button icon={<CameraOutlined />}>
                      {imageFile ? "Ganti Foto" : "Upload Foto"}
                    </Button>
                  </Upload>
                </div>
                {imageFile && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ Foto baru dipilih. Klik "Simpan Perubahan" untuk
                    menyimpan.
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Format: JPG, PNG. Maksimal 5MB
                </p>
              </Form.Item>

              <Divider>Ganti Password (Opsional)</Divider>

              <Form.Item
                label="Password Baru"
                name="password"
                tooltip="Kosongkan jika tidak ingin mengubah password"
                rules={[{ min: 6, message: "Password minimal 6 karakter!" }]}
              >
                <Input.Password placeholder="Password Baru (opsional)" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                  block
                >
                  Simpan Perubahan
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
