/**
 * AI Chatbot Component
 */

"use client";

import { Modal, Input, Button, List, Typography, Spin } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useState } from "react";

const { TextArea } = Input;
const { Text } = Typography;

export default function AIChatbot({ visible, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Halo! Saya adalah asisten AI Health E-Commerce. Ceritakan keluhan atau kebutuhan kesehatan Anda, dan saya akan merekomendasikan produk yang tepat! 💊",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    const userQuestion = input;
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/external/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userQuestion }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const aiMessage = {
          role: "assistant",
          content: data.data.answer || "Berikut rekomendasi untuk Anda.",
          products: data.data.recommendedProducts || [],
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        // Handle empty database gracefully
        const fallbackMessage =
          data.message === "No products available in database"
            ? "Maaf, saat ini belum ada produk yang tersedia di database. Silakan hubungi administrator untuk menambahkan produk atau coba lagi nanti. 🙏"
            : "Maaf, saya mengalami kendala teknis. Silakan coba lagi atau hubungi customer service. 💬";

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: fallbackMessage },
        ]);
      }
    } catch (error) {
      console.error("AI error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Maaf, terjadi kesalahan koneksi. Pastikan server berjalan dengan baik atau coba lagi nanti. 🔧",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <span>AI Assistant - Rekomendasi Produk</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      className="ai-chatbot-modal"
    >
      <div
        style={{
          height: "400px",
          overflowY: "auto",
          marginBottom: "16px",
          padding: "12px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <List
          dataSource={messages}
          renderItem={(item) => (
            <List.Item
              style={{
                border: "none",
                padding: "8px 0",
                justifyContent:
                  item.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "12px",
                  borderRadius: "12px",
                  backgroundColor: item.role === "user" ? "#1890ff" : "#fff",
                  color: item.role === "user" ? "#fff" : "#000",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <Text
                  strong
                  style={{
                    color: item.role === "user" ? "#fff" : "#1890ff",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  {item.role === "user" ? "Anda" : "AI Assistant"}
                </Text>
                <Text
                  style={{
                    color: item.role === "user" ? "#fff" : "#000",
                    whiteSpace: "pre-line",
                  }}
                >
                  {item.content}
                </Text>

                {/* Display recommended products if available */}
                {item.products && item.products.length > 0 && (
                  <div style={{ marginTop: "12px" }}>
                    <Text
                      strong
                      style={{ display: "block", marginBottom: "8px" }}
                    >
                      💊 Produk yang Direkomendasikan:
                    </Text>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {item.products.map((product, i) => (
                        <div
                          key={i}
                          style={{
                            padding: "8px",
                            backgroundColor: "#f0f7ff",
                            borderRadius: "8px",
                            border: "1px solid #91d5ff",
                          }}
                        >
                          <Text strong style={{ display: "block" }}>
                            {product.name}
                          </Text>
                          <Text
                            style={{
                              display: "block",
                              color: "#1890ff",
                              fontSize: "14px",
                            }}
                          >
                            Rp {product.price?.toLocaleString("id-ID")}
                          </Text>
                          {product.category && (
                            <Text
                              style={{
                                display: "inline-block",
                                padding: "2px 8px",
                                backgroundColor: "#e6f7ff",
                                borderRadius: "4px",
                                fontSize: "12px",
                                marginTop: "4px",
                              }}
                            >
                              {product.category}
                            </Text>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </List.Item>
          )}
        />
        {loading && (
          <div style={{ textAlign: "center", padding: "12px" }}>
            <Spin /> <Text style={{ marginLeft: "8px" }}>Sedang berpikir...</Text>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Contoh: Saya butuh vitamin untuk daya tahan tubuh..."
          autoSize={{ minRows: 2, maxRows: 4 }}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={loading}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          loading={loading}
          disabled={!input.trim()}
        >
          Kirim
        </Button>
      </div>
    </Modal>
  );
}
