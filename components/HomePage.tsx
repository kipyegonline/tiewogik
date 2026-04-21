"use client";
import { Box, List, ListItem, Center, Alert, Flex, Text, ActionIcon, Group, UnstyledButton, ScrollArea, Tooltip, rem, Loader } from "@mantine/core";
import React from "react";
import SearchComponent from "./SearchComponent";
import { AudioLines, ExternalLink, Music, ChevronLeft, LayoutGrid, List as ListIcon, X } from "lucide-react";
import Link from "next/link";
import LyricsPagination from "./Lyricspagination";
import LyricsComponent from "./LyricsComponent";
import MusicParticles from "./MusicParticles";
import { searchSongs, getRandomSong, getSongDetails, getSongs } from "@/lib/api/songs";

export interface Song {
  id: number;
  song_number: number;
  title: string;
  english_title: string;
  chorus: string;
  verses?: { content: string, verse_order: number }[];
  clicked?: boolean;
}

type ViewMode = "BROWSE" | "DETAIL";

export default function HomePage() {
  const [loading, setloading] = React.useState(false);
  const [song, setSong] = React.useState<null | Song>(null);
  const [songs, setSongs] = React.useState<Song[]>([]); // Current filtered/searched list
  const [allSongs, setAllSongs] = React.useState<Song[]>([]); // Full library for sidebar/browse
  const [viewMode, setViewMode] = React.useState<ViewMode>("BROWSE");
  const [error, setError] = React.useState<string | null>(null);
  const [notFound, setNofound] = React.useState<null | string>(null);
  const [current, setCurrent] = React.useState(1);
  const [centerSearch, setCenterSearch] = React.useState("");
  const [sidebarSearch, setSidebarSearch] = React.useState("");
  const perPage = 30;

  const resetSearch = () => {
    setSongs(allSongs);
    setNofound(null);
    setError(null);
    setCenterSearch("");
    setSidebarSearch("");
    setViewMode("BROWSE");
  };

  const loadLibrary = async () => {
    setloading(true);
    try {
      const result = await getSongs();
      if (result.success) {
        setAllSongs(result.data);
        setSongs(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setloading(false);
    }
  };

  React.useEffect(() => {
    loadLibrary();
  }, []);

  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      resetSearch();
      return;
    }
    setloading(true);
    setNofound(null);
    setError(null);
    setSong(null); // Clear currently displayed song
    setSongs([]); // Clear currently displayed list
    
    try {
      const result = await searchSongs(value);
      if (result?.success) {
        if (result.data && result.data.length > 0) {
          if (result.data.length === 1) {
            const details = await getSongDetails(result.data[0].id);
            if (details.success && details.song) {
              setSong(details.song);
              setViewMode("DETAIL");
            }
          } else {
            setSongs(result.data);
            setViewMode("BROWSE");
            setCurrent(1);
          }
        } else {
          setNofound("No songs found matching your search.");
          setViewMode("BROWSE"); // Return to browse mode to show the alert
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Search failed. Please try again.");
    } finally {
      setloading(false);
    }
  };

  const handleCenterChange = (val: string) => {
    setCenterSearch(val);
    if (val.trim() !== "") {
      setSidebarSearch("");
    } else {
      resetSearch();
    }
  };

  const handleSidebarChange = (val: string) => {
    setSidebarSearch(val);
    if (val.trim() !== "") {
      setCenterSearch("");
    } else {
      resetSearch();
    }
  };

  const handleClick = async (clickedSong: Song) => {
    setloading(true);
    try {
      const details = await getSongDetails(clickedSong.id);
      if (details.success && details.song) {
        setSong(details.song);
        setViewMode("DETAIL");
        // Update selection in list if needed
        setAllSongs(prev => prev.map(s => ({ ...s, clicked: s.id === clickedSong.id })));
      }
    } catch (err) {
      setError("Failed to load song details");
    } finally {
      setloading(false);
    }
  };

  const first = (current - 1) * perPage;
  const last = first + perPage;

  /* ─── UI COMPONENTS ─── */

  const SongListItem = ({ item, index }: { item: Song, index: number }) => (
    <UnstyledButton
      onClick={() => handleClick(item)}
      key={item.id}
      className={`song-list-item flex items-center p-3 rounded-xl transition-all duration-300 group border-2
        ${song?.id === item.id
          ? "bg-[#E86F36]/40 border-[#E86F36] shadow-xl shadow-[#E86F36]/20 ring-1 ring-white/10"
          : "hover:bg-white/10 border-transparent"} 
        animate-fade-in stagger-${Math.min(index + 1, 10)}`}
    >
      <div className={`flex-shrink-0 w-10 font-bold text-base transition-colors ${song?.id === item.id ? "text-white" : "text-[#E86F36]"}`}>
        {item.song_number}
      </div>
      <div className="flex-grow">
        <Text size="md" fw={song?.id === item.id ? 700 : 500} c="white" className="group-hover:text-white transition-colors">
          {item.title}
        </Text>
      </div>
      <AudioLines size={20} className={`transition-all ${song?.id === item.id ? "text-white opacity-100 scale-125" : "text-gray-500 opacity-0 group-hover:opacity-40"}`} />
    </UnstyledButton>
  );

  return (
    <Box className="min-h-screen relative flex flex-col md:flex-row overflow-hidden">
      <MusicParticles />

      {/* ─── SIDEBAR (Desktop List Navigation) ─── */}
      {viewMode === "DETAIL" && (
        <Box className="hidden lg:flex w-[320px] flex-col border-r border-white/10 bg-black/80 backdrop-blur-md relative z-30 h-screen">
          <div className="p-4 border-b border-white/10">
            <Group justify="space-between" mb="sm">
              <Text fw={700} className="text-[#E86F36]" c="white">Song Library</Text>
              <ActionIcon variant="subtle" color="gray" onClick={() => setViewMode("BROWSE")}>
                <ChevronLeft size={18} />
              </ActionIcon>
            </Group>
            <SearchComponent 
              sendValue={handleSearch} 
              value={sidebarSearch} 
              onChange={handleSidebarChange} 
            />
          </div>
          <ScrollArea className="flex-grow p-2">
            <Stack gap={4}>
              {allSongs.map((item, idx) => (
                <SongListItem key={item.id} item={item} index={idx} />
              ))}
            </Stack>
          </ScrollArea>
        </Box>
      )}

      {/* ─── MAIN CONTENT ─── */}
      <Box className="flex-grow relative z-20 overflow-y-auto h-screen custom-scrollbar bg-black/20">
        <div className="max-w-4xl mx-auto px-4 py-8">

          {/* Header/Controls */}
          <header className={`mb-8 ${viewMode === "DETAIL" ? "flex items-center gap-4" : "text-center"}`}>
            {viewMode === "DETAIL" && (
              <ActionIcon
                variant="filled"
                color="orange"
                size="lg"
                radius="xl"
                onClick={() => setViewMode("BROWSE")}
                className="lg:hidden"
              >
                <ChevronLeft size={20} />
              </ActionIcon>
            )}

            <div className={viewMode === "DETAIL" ? "text-left" : "mx-auto max-w-xl"}>
              {viewMode === "BROWSE" && (
                <Box className="mb-8">
                  <Music size={42} className="text-[#E86F36] mx-auto mb-4 music-icon-float" />
                  <Title className="animated-gradient-text sm:!text-4xl !text-3xl font-black mb-2">
                    Tienwogik ab Kalosunet
                  </Title>
                  <Text className="text-gray-400">Discover and sing along to Kalenjin hymns</Text>
                </Box>
              )}

              {/* Central Search (only in browse mode, or prominent in detail header) */}
              <div className={`${viewMode === "DETAIL" ? "w-64 md:w-80" : "w-full"}`}>
                <SearchComponent 
                  sendValue={handleSearch} 
                  value={centerSearch} 
                  onChange={handleCenterChange} 
                />
              </div>
            </div>
          </header>

          {/* Error/Loading Stats */}
          {loading && (
            <Center className="py-20">
              <Loader color="orange" variant="bars" size="xl" />
            </Center>
          )}

          {error && (
            <Alert color="red" variant="filled" className="mb-4" radius="md">
              <Text c="white" fw={700}>{error}</Text>
            </Alert>
          )}
          
          {notFound && (
            <Alert color="orange" variant="filled" className="mb-4" radius="md">
              <Text c="white" fw={700}>{notFound}</Text>
            </Alert>
          )}

          {/* BROWSE MODE: Full Paginated List */}
          {viewMode === "BROWSE" && (
            <div className="animate-fade-in">
              <Box className="bg-black/40 backdrop-blur-xl rounded-2xl overflow-hidden p-2 border border-white/10 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {songs.slice(first, last).map((item, idx) => (
                    <SongListItem key={item.id} item={item} index={idx} />
                  ))}
                </div>

                <Box className="mt-6 border-t border-white/10 pt-4 px-4 pb-4">
                  <LyricsPagination
                    total={Math.ceil(songs.length / perPage)}
                    current={current}
                    setCurrent={setCurrent}
                  />
                </Box>
              </Box>
            </div>
          )}

          {/* DETAIL MODE: Lyrics Display */}
          {viewMode === "DETAIL" && song && (
            <div className="lyrics-display-area animate-fade-in">
              <LyricsComponent song={song} />
            </div>
          )}
        </div>
      </Box>
    </Box>
  );
}

// Re-using common components with subtle styling
function Stack({ children, gap }: { children: React.ReactNode, gap: number }) {
  return <div className="flex flex-col" style={{ gap }}>{children}</div>;
}

function Title({ children, className }: { children: React.ReactNode, className?: string }) {
  return <h1 className={className}>{children}</h1>;
}
