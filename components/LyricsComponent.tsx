"use client";
import React from "react";
import {
  Paper,
  Title,
  Text,
  Box,
  Group,
  Transition,
  Notification,
  Flex,
  Tooltip,
  Checkbox,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { Copy, Share2 as Share, Check } from "lucide-react";
import { track } from "@vercel/analytics";
import ChorusComponent from "./ChorusComponent";
import { Song } from "./HomePage";

type Props = { song: Song };

const addChorus = (i: number, chorus: string) =>
  chorus ? `\n\n[Chorus]\n${chorus}` : "";

export default function LyricsComponent({ song }: Props) {
  const [showNotification, setShowNotification] = React.useState(false);
  const [showChorus, setShowChorus] = React.useState(false);
  const [showVerseNumbers, setverseNumbers] = React.useState(true);
  const [copied, setCopied] = React.useState("Copy song lyrics");
  const clipboard = useClipboard({ timeout: 3000 });

  const verses = song.verses || [];

  const getLyricsText = () => {
    if (!song) return "";
    const chorus = song.chorus;

    const clipboardtext = `${song.title}\n${verses
      .map(
        (v, i: number) =>
          `[${i + 1}]\n${v.content.replace("\n\n", "") + addChorus(i, chorus)} `
      )
      .join("\n\n")}`;

    return clipboardtext;
  };

  const handleShare = (s: Song) => {
    return async function () {
      const url = `/${s.title.toLowerCase().split(" ").join("-")}-${s.song_number}`;
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${s.title} Lyrics`,
            text: getLyricsText(),
            url,
          });
          track("share_lyrics", { song: s.title });
        } catch (error) {
          console.error("Error sharing:", error);
        }
      } else {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
      }
    };
  };

  const handleCopy = () => {
    clipboard.copy(getLyricsText());
    track("copy_lyrics", { song: song.title });
    setCopied("Copied!");
    setTimeout(() => setCopied("Copy song lyrics"), 3000);
  };

  const chorus = song.chorus;

  const EnglishTitle = (
    <Text color="dimmed" pb="md" className="mb-3 !text-purple-600 text-center">
      {song.english_title}
    </Text>
  );

  const shareIcons = (
    <Flex justify={"space-around"} mt="sm" p="sm" gap="md">
      <Group>
        <Tooltip
          label={copied}
          className="text-white bg-primary"
          position="bottom"
        >
          <button
            className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={handleCopy}
          >
            {clipboard.copied ? <Check size={20} /> : <Copy size={20} />}{" "}
            <span>{copied.includes("Copied") ? "Copied" : "Copy"}</span>
          </button>
        </Tooltip>
        <Tooltip label="Share song lyrics" position="bottom">
          <button
            className="flex items-center space-x-2 text-blue-600"
            onClick={handleShare(song)}
          >
            <Share size={20} />
            <span>Share</span>
          </button>
        </Tooltip>
      </Group>
    </Flex>
  );

  return (
    <Paper
      shadow="xl"
      px="md"
      radius="lg"
      className="mb-8 mt-8 flex-grow overflow-auto max-w-2xl mx-auto py-6 bg-white text-gray-900 border border-[#E86F36]/20 shadow-[#E86F36]/10"
    >
      <Title
        order={3}
        className="mb-2 text-left md:text-center text-[#E86F36]"
        pb="sm"
      >
        {song.song_number}
        {"  "}
        {song.title}
      </Title>

      {song.english_title && EnglishTitle}
      {shareIcons}
      <div className="lyrics-container rounded-lg p-2 md:p-4 space-y-4 min-w-full md:min-w-[400px] border-2 border-gray-100">
        {verses.map((v, i: number) => (
          <Box key={i} className=" px-2 md:px-4 ">
            <small className="text-gray-400  ">[{i + 1}]</small>
            <div>
              <Text
                component="pre"
                className="whitespace-pre-line font-sans text-xl leading-relaxed text-gray-800"
              >
                {v.content.replace("\n\n", "")}
              </Text>
            </div>

            {chorus ? (
              showChorus ? (
                <ChorusComponent chorus={chorus} />
              ) : i == 0 ? (
                <ChorusComponent chorus={chorus} />
              ) : null
            ) : null}
          </Box>
        ))}
      </div>

      {shareIcons}

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
            Your browser doesn't support the Web Share API.
          </Notification>
        )}
      </Transition>
    </Paper>
  );
}
