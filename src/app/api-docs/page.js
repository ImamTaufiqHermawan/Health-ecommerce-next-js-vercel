/**
 * Swagger UI Page for API Documentation
 * Access at: /api-docs
 */

"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { useEffect, useState } from "react";

export default function ApiDocsPage() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    // Load swagger spec
    fetch("/api/swagger")
      .then((res) => res.json())
      .then((data) => setSpec(data))
      .catch((err) => console.error("Failed to load API spec:", err));
  }, []);

  if (!spec) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Loading API Documentation...</h1>
      </div>
    );
  }

  return (
    <div>
      <SwaggerUI spec={spec} />
    </div>
  );
}
