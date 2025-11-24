/**
 * Footer Component
 */

"use client";

import { Layout, Typography } from "antd";

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

export default function Footer() {
  return (
    <AntFooter className="text-center bg-gray-800 text-white">
      <Text className="text-white">
        © 2024 Health E-Commerce. Built with Next.js & Vercel.
      </Text>
    </AntFooter>
  );
}
