/**
 * App Content Component
 * Contains the main application homepage
 */

"use client";

import { useState } from "react";
import { Layout, FloatButton } from "antd";
import { RobotOutlined } from "@ant-design/icons";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AIChatbot from "./AIChatbot";
import HomePage from "./pages/HomePage";

const { Content } = Layout;

export default function AppContent() {
  const [chatbotVisible, setChatbotVisible] = useState(false);

  return (
    <Layout className="min-h-screen flex flex-col">
      <Navbar />

      <Content className="bg-gray-50 flex-1 w-full">
        <HomePage />
      </Content>

      <Footer />

      <FloatButton
        icon={<RobotOutlined />}
        type="primary"
        style={{
          right: 24,
          bottom: 24,
          width: 60,
          height: 60,
        }}
        onClick={() => setChatbotVisible(true)}
        tooltip={<div>AI Assistant</div>}
      />

      <AIChatbot
        visible={chatbotVisible}
        onClose={() => setChatbotVisible(false)}
      />
    </Layout>
  );
}
