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
import { SongDataDynamo } from "@/lib/aws";
import { Copy, Share2 as Share, Check } from "lucide-react";
import { track } from "@vercel/analytics";
import ChorusComponent from "./ChorusComponent";
//import { colors } from "@/lib/Color";

type Props = { lyrics: SongDataDynamo };
const addChorus = (i: number, chorus: string) =>
  chorus ? `\n\n[chorus ${i + 1}]\n${chorus}` : "";

export default function LyricsComponent({ lyrics }: Props) {
  const [showNotification, setShowNotification] = React.useState(false);
  const [showChorus, setShowChorus] = React.useState(false);
  // const [asKverse, setVerse] = React.useState(false);
  const [showVerseNumbers, setverseNumbers] = React.useState(true);
  const [copied, setCopied] = React.useState("Copy song lyrics");
  let verses = [];
  const clipboard = useClipboard({ timeout: 3000 });
  try {
    verses = JSON.parse(lyrics.lyrics.S);
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
  }
  const getLyricsText = () => {
    if (!lyrics) return "";
    const chorus = lyrics.chorus.S;

    const clipboardtext = `${lyrics.title.S}\n${verses
      .map(
        (verse: string, i: number) =>
          `[${i + 1}]\n${verse.replace("\n\n", "") + addChorus(i, chorus)} `
      )
      .join("\n\n")}`;

    return clipboardtext;
  };

  const handleShare = (song: SongDataDynamo) => {
    return async function () {
      const url = `/${song.title.S.toLowerCase().split(" ").join("-")}-${
        song.id.N
      }`;
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${lyrics.title} Lyrics`,
            text: getLyricsText(),
            url,
          });
          track("share_lyrics", { song: lyrics.title.S });
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
    track("copy_lyrics", { song: lyrics.title.S });
    setCopied("Copied!");
    setTimeout(() => setCopied("Copy song lyrics"), 3000);
  };
  const chorus = lyrics.chorus.S;
  const EnglishTitle = (
    <Text color="dimmed" pb="md" className="mb-3 !text-purple-600 text-center">
      {lyrics.englishTitle.S}
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
            color={clipboard.copied ? "green" : "blue"}
            //   size="lg"
            style={{ color: clipboard.copied ? "green" : "emerald" }}
            className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={handleCopy}
          >
            {clipboard.copied ? <Check size={20} /> : <Copy size={20} />}{" "}
            <span>{copied.includes("Copied") ? "Copied" : "Copy"}</span>
          </button>
        </Tooltip>
        <Tooltip label="Share song lyrics" position="bottom">
          <button
            // variant="light"
            color="blue"
            className="flex items-center space-x-2 text-blue-600"
            // size="lg"
            onClick={handleShare(lyrics)}
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
      shadow="sm"
      px="md"
      radius="md"
      className="mb-8 mt-8 flex-grow overflow-auto max-w-md mx-auto py-2"
      //  className="bg-white p-6 rounded-lg shadow-sm border border-[#F9EBE0]"
    >
      <Title
        order={3}
        className="mb-2 text-left md:text-center text-[#E86F36]"
        pb="sm"
      >
        {lyrics.id.N}
        {"  "}
        {lyrics.title.S}
      </Title>

      {lyrics.englishTitle.S && EnglishTitle}
      {shareIcons}
      <div
        className="lyrics-container rounded-lg p-2 md:p-4 space-y-4 min-w-full md:min-w-[400px] border-2 border-gray-100"
        //   style={{ background: colors.bg2 }}
      >
        {verses.map((part: string, i: number) => (
          <Box key={i} className=" px-2 md:px-4 " inert>
            <small className="text-gray-400  ">[{i + 1}]</small>
            <div>
              <Text
                component="pre"
                className="whitespace-pre-line font-sans text-lg"
              >
                {part.replace("\n\n", "")}
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
      {/**To work on this later */}
      {false && (
        <Box className="pt-4">
          {chorus ? (
            <Checkbox
              label="Show chorus after every verse"
              checked={showChorus}
              onChange={() => setShowChorus((prev) => !prev)}
            />
          ) : null}
          <Checkbox
            label="Include verse numbers"
            checked={showVerseNumbers}
            onChange={() => setverseNumbers((prev) => !prev)}
          />
        </Box>
      )}

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
            Your browser doesn\'t support the Web Share API.
          </Notification>
        )}
      </Transition>
    </Paper>
  );
}
