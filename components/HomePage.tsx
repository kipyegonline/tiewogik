"use client";
import {
  Box,
  List,
  Loader,
  ListItem,
  Center,
  Alert,
  Flex,
  Text,
} from "@mantine/core";
import React from "react";
import SearchComponent from "./SearchComponent";
import LyricsComponent from "./LyricsComponent";
import ChorusComponent from "./ChorusComponent";
import { SongDataDynamo } from "@/lib/aws";
import { getSongById, searchSongsByTitleAndLyrics } from "@/lib/aws";
import { useRouter } from "next/navigation";
import { AudioLines } from "lucide-react";

export default function HomePage() {
  const [loading, setloading] = React.useState(false);

  const [song, setSong] = React.useState<null | SongDataDynamo>(null);
  const [songs, setSongs] = React.useState<SongDataDynamo[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleSearch = async (value: string) => {
    //reset everything
    setSong(null);
    setSongs([]);
    setloading(true);
    setError(null);
    // if they duidn't enter song number
    if (Number.isNaN(Number(value))) {
      const result = await searchSongsByTitleAndLyrics(value);
      if (result?.success) {
        if (result.data !== undefined) {
          if (result?.data?.length > 1) setSongs(result?.data);
          else setSong(result?.data[0]);
        }
      } else setError(result.error !== undefined ? result.error : null);
    } else {
      const result = await getSongById(value);
      if (result.success && result.data !== undefined) setSong(result?.data);
      else setError(result.error !== undefined ? result.error : null);
    }
    setloading(false);
  };
  const router = useRouter();
  const ListSongs = (
    <Box>
      <Text className="!text-lg py-2 font-semibold">
        {songs.length} songs found
      </Text>
      <List className="border-red " p="md" size="lg" withPadding spacing={"lg"}>
        {songs.map((song) => (
          <ListItem
            onClick={() =>
              router.push(
                `/${song.title.S.toLowerCase().split(" ").join("-")}-${
                  song.id.N
                }`
              )
            }
            key={song.id.N}
            icon={
              <AudioLines
                size={24}
                className="inline-block mr-1 text-amber-800"
              />
            }
            className="cursor-pointer"
          >
            {song.id.N}
            {"  "}
            {song.title.S}
          </ListItem>
        ))}
      </List>
    </Box>
  );
  return (
    <Box className="border-red w-full">
      <Box className="mx-auto max-w-xl">
        {" "}
        <SearchComponent sendValue={handleSearch} />
      </Box>
      <Flex
        justify={"center"}
        direction={{ base: "column", md: "row" }}
        gap={"lg"}
        // wrap="wrap"
      >
        {/*Show a listof songs jhere*/}
        {songs.length > 1 && <Box py="md">{ListSongs}</Box>}
        <Box>
          {loading && (
            <Center>
              <Loader />
            </Center>
          )}
          {error && (
            <Box py="md">
              <Alert variant="light" color="red">
                {error}
              </Alert>
            </Box>
          )}

          {song ? (
            <LyricsComponent
              lyrics={song}
              ChorusComponent={() => <ChorusComponent />}
            />
          ) : null}
        </Box>
      </Flex>
    </Box>
  );
}
