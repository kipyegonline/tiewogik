import React from "react";
import { Paper, Title, Text, Box } from "@mantine/core";
import { Payload } from "@/data/payload";

type Props = { lyrics: Payload; ChorusComponent: () => React.ReactNode };
export default function LyricsComponent({ lyrics, ChorusComponent }: Props) {
  return (
    <Paper shadow="sm" p="md" className="mb-8 flex-grow overflow-auto" inert>
      <Title order={3} className="mb-2">
        {lyrics.id}
        {"  "}
        {lyrics.title}
      </Title>
      <Text color="dimmed" className="mb-6">
        {lyrics.englishTitle}
      </Text>

      <div
        className="lyrics-container rounded-lg p-4 space-y-4"
        style={{ background: "beige" }}
      >
        {lyrics.verses.map((part, i) => (
          <Box key={i} className="border-red-500 border border-red">
            <small className="text-gray-400 ">[{i + 1}]</small>
            <div>
              <Text
                component="pre"
                className="whitespace-pre-line font-sans text-lg"
              >
                {part}
              </Text>
            </div>
            {ChorusComponent()}
          </Box>
        ))}
      </div>
    </Paper>
  );
}
