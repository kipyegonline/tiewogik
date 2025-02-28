// app/global-error.tsx
"use client";

import React from "react";
import { Button, Title, Text, Container } from "@mantine/core";
import {
  AlertTriangle as IconAlertTriangle,
  RefreshCcw as IconRefresh,
} from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <Container size="sm" className="text-center">
            <div className="mb-6 flex justify-center">
              <IconAlertTriangle size={80} className="text-red-500" />
            </div>

            <Title className="mb-4 text-2xl font-bold text-gray-800">
              Critical Application Error
            </Title>

            <Text className="mb-6 text-gray-600">
              We've encountered a serious problem with the application. Our team
              has been automatically notified and is working on a fix.
            </Text>

            {error.digest && (
              <Text size="sm" color="dimmed" className="mb-6">
                Error reference: {error.digest}
              </Text>
            )}

            <Button
              onClick={reset}
              leftSection={<IconRefresh size={18} />}
              color="red"
              size="md"
            >
              Restart Application
            </Button>
          </Container>
        </div>
      </body>
    </html>
  );
}
