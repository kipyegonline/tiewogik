import { getSongs, getSongDetails, Song } from "@/lib/api/songs";
import { Breadcrumbs, Container, Title, Text, Box } from "@mantine/core";
import PageComponent from "./page.component";
import Link from "next/link";
import { Home } from "lucide-react";

interface PageProps {
  params: Promise<{ title: string }>;
}

const extractSongId = (url: string) => {
  const parts = url.split("-");
  return parts[parts.length - 1];
};

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

/**
 * SEO METADATA GENERATION
 */
export async function generateMetadata({ params }: PageProps) {
  const { title: slug } = await params;
  const id = extractSongId(slug);
  
  if (!id || isNaN(Number(id))) return { title: "Song Not Found" };

  const result = await getSongDetails(Number(id));
  if (result.success && result.song) {
    const song = result.song;
    
    // Concatenate all song components for a rich SEO description
    const versesText = song.verses?.map((v: any) => v.content).join(" ") || "";
    const englishTitle = song.english_title ? `(${song.english_title})` : "";
    const chorusText = song.chorus ? `Chorus: ${song.chorus}` : "";
    
    const fullDescription = `${song.song_number}. ${song.title} ${englishTitle} ${chorusText} ${versesText}`
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 250);
    
    return {
      title: `${song.song_number}. ${song.title} | Tienwogik ab Kalosunet`,
      description: fullDescription + (fullDescription.length >= 250 ? "..." : ""),
      openGraph: {
        title: `${song.song_number}. ${song.title} - Kalenjin Hymn`,
        description: fullDescription,
      },
    };
  }

  return { title: "Tienwogik Song" };
}

/**
 * STATIC ROUTE GENERATION (SSG)
 */
export async function generateStaticParams() {
  try {
    const response = await getSongs();
    if (response.success && Array.isArray(response.data)) {
      return response.data.map((song: Song) => ({
        title: `${slugify(song.title)}-${song.id}`,
      }));
    }
  } catch (error) {
    console.error("Error generating static params:", error);
  }
  return [];
}

/**
 * SERVER PAGE COMPONENT
 */
export default async function Page({ params }: PageProps) {
  const { title: slug } = await params;
  const id = extractSongId(slug);

  if (!id || isNaN(Number(id))) {
    return <NotFoundView />;
  }

  const result = await getSongDetails(Number(id));
  
  if (!result.success || !result.song) {
    return <NotFoundView />;
  }

  const song = result.song;

  return (
    <Container p="lg" size="lg" className="min-h-screen">
      <Box mb="xl">
        <Breadcrumbs>
          <Link href="/" className="text-[#E86F36] flex items-center hover:underline">
            <Home size={18} className="mr-2" />
            <Text fw={500}>Home</Text>
          </Link>
          <Text c="dimmed" fw={500}>
            {song.title}
          </Text>
        </Breadcrumbs>
      </Box>

      <PageComponent song={song} />
    </Container>
  );
}

function NotFoundView() {
  return (
    <Container p="xl" size="sm" className="text-center py-20">
      <Title order={2} mb="md" c="white">Song Not Found</Title>
      <Text c="dimmed" mb="xl">We couldn't find the hymn you were looking for.</Text>
      <Link href="/" className="px-6 py-2 bg-[#E86F36] text-white rounded-full font-bold">
        Back to Home
      </Link>
    </Container>
  );
}
