import React from "react";
import {
  Paper,
  Title,
  Text,
  Box,
  Group,
  ActionIcon,
  Transition,
  Notification,
  Flex,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { SongDataDynamo } from "@/lib/aws";
import { Copy, Share2 as Share, Check } from "lucide-react";
type Props = { lyrics: SongDataDynamo; ChorusComponent: () => React.ReactNode };
export default function LyricsComponent({ lyrics, ChorusComponent }: Props) {
  const [showNotification, setShowNotification] = React.useState(false);
  let verses = [];
  const clipboard = useClipboard({ timeout: 2000 });
  try {
    verses = JSON.parse(lyrics.lyrics.S);
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
  }
  const getLyricsText = () => {
    if (!lyrics) return "";
    const clipboardtext = `${lyrics.title.S} -\n${verses
      .map(
        (verse: string, i: number) =>
          `[${i + 1}]\n${verse.replace("\n\n", "")} `
      )
      .join("\n\n")}`;

    return clipboardtext;
  };

  const handleShare = async () => {
    if (navigator.share) {
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
  return (
    <Paper
      shadow="sm"
      p="md"
      className="mb-8 flex-grow overflow-auto max-w-md mx-auto"
    >
      <Title order={3} className="mb-2">
        {lyrics.id.N}
        {"  "}
        {lyrics.title.S}
      </Title>
      <Text color="dimmed" className="mb-6">
        {lyrics.englishTitle.S}
      </Text>

      <div
        className="lyrics-container rounded-lg p-4 space-y-4"
        style={{ background: "beige" }}
      >
        {verses.map((part: string, i: number) => (
          <Box key={i} className="border-red-500 border border-red " inert>
            <small className="text-gray-400  ">[{i + 1}]</small>
            <div>
              <Text
                component="pre"
                className="whitespace-pre-line font-sans text-lg"
              >
                {part.replace("\n\n", "")}
              </Text>
            </div>
            {ChorusComponent()}
          </Box>
        ))}
      </div>
      {/* Action Buttons */}
      <Flex justify={"flex-end"} mt="md">
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
      </Flex>

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
            Your browser doesn\'t support the Web Share API.
          </Notification>
        )}
      </Transition>
    </Paper>
  );
}
