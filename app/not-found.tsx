// app/not-found.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Button, Title, Text, Container, Group } from "@mantine/core";
import {
  Music as IconMusic,
  Home as IconHome,
  Search as IconSearch,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Container size="md" className="text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <IconMusic size={120} className="text-blue-500 opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Title className="text-8xl font-bold text-blue-600">404</Title>
            </div>
          </div>
        </div>

        <Title className="mb-4 text-3xl font-bold text-gray-800">
          Oops! This lyric seems to be missing
        </Title>

        <Text className="mb-6 text-lg text-gray-600 max-w-md mx-auto">
          We can't find the lyrics you're looking for. Perhaps it's been moved,
          deleted, or never existed.
        </Text>

        <div className="bg-white rounded-lg p-6 shadow-md mb-8 max-w-md mx-auto">
          <Text className="mb-4 italic text-gray-700 border-l-4 border-blue-400 pl-4">
            "The best songs come from broken hearts and missing lyrics."
          </Text>

          <Text className="text-right text-sm text-gray-500">
            — Unknown Songwriter
          </Text>
        </div>

        <Group>
          <Link href="/" passHref>
            <Button
              leftSection={<IconHome size={18} />}
              variant="filled"
              color="blue"
              size="md"
            >
              Back to Home
            </Button>
          </Link>

          <Link href="/" passHref>
            <Button
              leftSection={<IconSearch size={18} />}
              variant="outline"
              color="blue"
              size="md"
            >
              Search Lyrics
            </Button>
          </Link>
        </Group>
      </Container>
    </div>
  );
}
