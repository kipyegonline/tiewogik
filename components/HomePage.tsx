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

import ChorusComponent from "./ChorusComponent";
import { SongDataDynamo } from "@/lib/aws";
import { getSongById, searchSongsByTitleAndLyrics } from "@/lib/aws";
import { AudioLines, ExternalLink } from "lucide-react";
import Link from "next/link";
import LyricsPagination from "./Lyricspagination";
import LyricsComponent from "./LyricsComponent";

type Checked = { clicked?: boolean };

const addClickedAttr = (songs: SongDataDynamo[]) =>
  songs.map((song: SongDataDynamo & Checked) => {
    song.clicked = false;
    return song;
  });

export default function HomePage() {
  const [loading, setloading] = React.useState(false);

  const [song, setSong] = React.useState<null | SongDataDynamo>(null);
  const [songs, setSongs] = React.useState<SongDataDynamo[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [notFound, setNofound] = React.useState<null | string>(null);
  const [current, setCurrent] = React.useState(1);
  const perPage = 20;
  const resetValues = () => {
    setSong(null);
    setSongs([]);
    setloading(true);
    setError(null);
    setNofound(null);
  };

  /*const initApp = async () => {
    const randomSongId = Math.floor(Math.random() * 245);
    const result = await getSongById(randomSongId + "");

    if (result.success) {
      if (result.data !== undefined) setSong(result?.data);
    }
  };*/
  React.useEffect(() => {}, []);
  const handleSearch = async (value: string) => {
    //reset everything
    resetValues();
    // if they duidn't enter song number
    if (Number.isNaN(Number(value))) {
      const result = await searchSongsByTitleAndLyrics(value);

      if (result?.success) {
        if (result.data !== undefined) {
          if (result?.data?.length > 1) {
            const songs = addClickedAttr(result.data);
            setSongs(songs);
          } else setSong(result?.data[0]);
        } else {
          setNofound("No songs found");
        }
      } else setError(result.error !== undefined ? result.error : null);
    } else {
      const result = await getSongById(value);

      if (result.success) {
        if (result.data !== undefined) setSong(result?.data);
        else setNofound("Song lyrics not found,Check  keyword and try again.");
      } else {
        setError(result.error !== undefined ? result.error : null);
      }
      /*  && result.data !== undefined) setSong(result?.data);
      else setError(result.error !== undefined ? result.error : null);*/
    }
    setloading(false);
  };
  const handleClick = (song: SongDataDynamo) => {
    setSong(song);

    setSongs(
      songs.map((s: SongDataDynamo & Checked) => {
        if (s.id.N === song.id.N) {
          s.clicked = true;
        } else {
          s.clicked = false;
        }
        return s;
      })
    );
  };
  const ListSongs = (
    <Box>
      <Text className="!text-lg py-2 font-semibold text-[#E86F36]">
        {songs.length} songs found
      </Text>
      <List className="border-red " p="md" size="lg" withPadding spacing={"lg"}>
        {songs
          .slice(current - 1, (current - 1) * perPage)
          .map((song: SongDataDynamo & Checked, i: number) => (
            <ListItem
              onClick={() => handleClick(song)}
              key={song.id.N}
              icon={
                <AudioLines
                  size={24}
                  className="inline-block mr-1 text-amber-800"
                />
              }
              className={`cursor-pointer ${
                song.clicked ? "text-[#E86F36]" : ""
              }`}
            >
              {song.id.N}
              {"  "}
              {song.title.S}==={current}
              <Link
                href={`/${song.title.S.toLowerCase().split(" ").join("-")}-${
                  song.id.N
                }`}
                target="_blank"
              >
                <ExternalLink
                  size={18}
                  color="blue"
                  className="ml-2 inline-block"
                />
              </Link>
            </ListItem>
          ))}
      </List>
    </Box>
  );
  return (
    <Box className=" w-full ">
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
        {songs.length > 1 && (
          <Box py="md">
            {ListSongs}
            <LyricsPagination
              total={Math.ceil(songs.length / perPage)}
              current={current}
              setCurrent={setCurrent}
            />
          </Box>
        )}
        <Box>
          {loading && (
            <Center className="py-8 md:py-16">
              <Box>
                <Loader
                  type="dots"
                  size="xl"
                  className="!text-orange-500"
                  color="orange"
                />
                <p>Muiten kidogo </p>
              </Box>
            </Center>
          )}
          {error && (
            <Box py="md">
              <Alert variant="light" color="red">
                {error}
              </Alert>
            </Box>
          )}
          {notFound && (
            <Box py="md">
              <Alert variant="light" color="red">
                {notFound}
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
