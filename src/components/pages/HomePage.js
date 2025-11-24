/**
 * Simple Home Page Component
 */

"use client";

import { Typography, Button, Card, Row, Col } from "antd";
import {
  ShoppingCartOutlined,
  RobotOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Title level={1}>Welcome to Health E-Commerce</Title>
        <Paragraph className="text-lg text-gray-600">
          Your trusted online health products store with AI assistance
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} className="mb-12">
        <Col xs={24} md={8}>
          <Card className="text-center h-full">
            <ShoppingCartOutlined
              style={{ fontSize: "48px", color: "#0ea5e9" }}
            />
            <Title level={4}>Wide Product Range</Title>
            <Paragraph>Browse thousands of health products</Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="text-center h-full">
            <RobotOutlined style={{ fontSize: "48px", color: "#0ea5e9" }} />
            <Title level={4}>AI Chatbot</Title>
            <Paragraph>Get personalized health recommendations</Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="text-center h-full">
            <CreditCardOutlined
              style={{ fontSize: "48px", color: "#0ea5e9" }}
            />
            <Title level={4}>Secure Payment</Title>
            <Paragraph>Powered by Midtrans payment gateway</Paragraph>
          </Card>
        </Col>
      </Row>

      <div className="text-center">
        <Button type="primary" size="large" href="/products">
          Start Shopping
        </Button>
      </div>
    </div>
  );
}
