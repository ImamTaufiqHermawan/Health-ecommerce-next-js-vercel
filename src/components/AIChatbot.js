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
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/external/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.data.answer },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, I encountered an error." },
        ]);
      }
    } catch (error) {
      console.error("AI error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="AI Health Assistant"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div style={{ height: "400px", overflowY: "auto", marginBottom: "16px" }}>
        <List
          dataSource={messages}
          renderItem={(item) => (
            <List.Item>
              <Text strong={item.role === "user"}>
                {item.role === "user" ? "You: " : "AI: "}
              </Text>
              <Text>{item.content}</Text>
            </List.Item>
          )}
        />
        {loading && <Spin />}
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about health products..."
          autoSize={{ minRows: 2, maxRows: 4 }}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          loading={loading}
        >
          Send
        </Button>
      </div>
    </Modal>
  );
}
