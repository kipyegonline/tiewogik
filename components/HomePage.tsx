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

  const initApp = async () => {
    const randomSongId = Math.floor(Math.random() * 245);
    const result = await getSongById(randomSongId + "");

    if (result.success) {
      if (result.data !== undefined) setSong(result?.data);
    }
  };
  React.useEffect(() => {
    initApp();
  }, []);
  const handleSearch = async (value: string) => {
    //reset everything
    resetValues();
    // if they duidn't enter song number
    if (Number.isNaN(Number(value))) {
      // so we have a string

      const result = await searchSongsByTitleAndLyrics(value.toLowerCase());

      if (result?.success) {
        if (result.data !== undefined) {
          if (result?.data?.length > 1) {
            const songs = addClickedAttr(result.data); // we map through data and add property `clicked` to false

            setSongs(songs);
          } else if (result?.data?.length === 0) {
            setNofound("Song lyrics not found,Check  keyword and try again.");
          } else {
            setSong(result?.data[0]);
          }
        } else {
          setNofound("No songs found");
        }
      } else {
        setError(
          result.error !== undefined ? result.error : "Error searching song"
        );
        setTimeout(() => setError(""), 4000);
      }
    } else {
      // we get song by id number
      if (+value > 245) {
        setTimeout(() => setNofound(""), 3000);
        setloading(false);
        return setNofound("Kalenjin hymns are 245 songs only");
      }
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
    if (notFound) setTimeout(() => setNofound(""), 4000);
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
  const first = (current - 1) * perPage;
  const last = first + perPage;

  const ListSongs = (
    <Box className="text-white">
      {songs.length > 50 && (
        <Text className="!text-lg py-2 font-semibold text-[#E86F36]">
          {" "}
          {songs.length} songs found
          <span>Also try using precise keywords to get better results</span>
        </Text>
      )}

      <List className="" p="md" size="lg" withPadding spacing={"lg"}>
        {songs.slice(first, last).map((song: SongDataDynamo & Checked) => (
          <ListItem
            onClick={() => handleClick(song)}
            key={song.id.N}
            icon={
              <AudioLines
                size={24}
                className="inline-block mr-1 text-amber-800"
              />
            }
            className={`cursor-pointer ${song.clicked ? "text-[#E86F36]" : ""}`}
          >
            {song.id.N}
            {"  "}
            {song.title.S}
            <Link
              href={`/${song.title.S.toLowerCase().split(" ").join("-")}-${
                song.id.N
              }`}
              title="Open in new tab"
              target="_blank"
            >
              <ExternalLink
                size={18}
                color="blue"
                className="ml-4 inline-block"
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
        <Box className="-order-1 md:order-1">
          {loading && (
            <Center className="py-8 md:py-16 bg-white p-4 min-w-[320px]">
              <Box>
                <Loader
                  type="dots"
                  size="xl"
                  className="!text-orange-500"
                  color="orange"
                />
                <h3>Muiten kidogo </h3>
              </Box>
            </Center>
          )}
          {error && (
            <Box py="md">
              <Alert variant="light" color="red" className="!text-white">
                {error}
              </Alert>
            </Box>
          )}
          {notFound && (
            <Box py="md" c="white">
              <Alert variant="light" color="red" className="!text-white">
                {notFound}
              </Alert>
            </Box>
          )}

          {song ? <LyricsComponent lyrics={song} /> : null}
        </Box>
      </Flex>
    </Box>
  );
}
