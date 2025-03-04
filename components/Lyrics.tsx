"use client";

import { useEffect, useState } from "react";
import {
  ActionIcon,
  Container,
  Paper,
  Text,
  Title,
  Group,
  Transition,
  Notification,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { Copy, Share2 as Share, Check } from "lucide-react";
import { payload, Payload } from "@/data/payload";

export default function LyricsSearchPage() {
  const [lyrics, setLyrics] = useState<Payload | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  const clipboard = useClipboard({ timeout: 2000 });
  useEffect(() => {
    setLyrics(payload[payload.length - 1]);
  }, []);

  const getLyricsText = () => {
    if (!lyrics) return "";
    const verses = `${lyrics.title} -  \n${lyrics.verses
      .map((verse, i) => `[${i + 1}]\n${verse} `)
      .join("\n\n")}`;
    console.log(verses, "ses");
    return verses;
  };

  const handleShare = async () => {
    if (lyrics && navigator.share) {
      try {
        await navigator.share({
          title: `${lyrics.title} Lyrics`,
          text: getLyricsText(),
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }
  };
  const browserSupport = `Your browser doesn\'t support the Web Share API.`;

  return (
    <Container
      size="md"
      className=" flex flex-col py-10 border-red max-w-[600px]"
    >
      {/* Lyrics Display */}
      {lyrics && (
        <Paper
          shadow="sm"
          p="md"
          className="mb-8 flex-grow overflow-auto relative"
          inert
        >
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
              <div key={i}>
                <small className="text-gray-400 ">[{i + 1}]</small>
                <div>
                  <Text
                    component="pre"
                    className="whitespace-pre-line font-sans text-lg"
                  >
                    {part}
                  </Text>
                </div>
                {i === 0 && lyrics.chorus.length > 0 && (
                  <ChorusComponent chorus={lyrics.chorus[0]} />
                )}
              </div>
            ))}
          </div>
        </Paper>
      )}
      {/* Action Buttons */}
      {lyrics && (
        <Group>
          <ActionIcon
            variant="light"
            color={clipboard.copied ? "green" : "blue"}
            size="lg"
            onClick={() => clipboard.copy(getLyricsText())}
          >
            {clipboard.copied ? <Check size={20} /> : <Copy size={20} />}
          </ActionIcon>

          <ActionIcon
            variant="light"
            color="blue"
            size="lg"
            onClick={handleShare}
          >
            <Share size={20} />
          </ActionIcon>
        </Group>
      )}

      {/* Notification when Web Share API is not available */}
      <Transition mounted={showNotification} transition="fade" duration={400}>
        {(styles) => (
          <Notification
            style={styles}
            title="Sharing not available"
            color="red"
            onClose={() => setShowNotification(false)}
            className="fixed bottom-4 right-4"
          >
            {browserSupport}
          </Notification>
        )}
      </Transition>
    </Container>
  );
}

const ChorusComponent = ({ chorus = "" }) => {
  return (
    <div className={"pl-4 border-l-4 border-blue-500"}>
      {" "}
      <Text component="pre" className="whitespace-pre-line font-sans text-lg">
        {chorus}
      </Text>
    </div>
  );
};
