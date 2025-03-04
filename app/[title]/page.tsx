import { getAllSongs, SongDataDynamo } from "@/lib/aws";
import { Box } from "@mantine/core";
// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const response = await getAllSongs();
  if (response.success && response.data !== undefined) {
    return response.data.map((post: SongDataDynamo) => ({
      id: post.title.S,
    }));
  }
  return [];
}
export async function generateMetadata({ params }) {
  console.log(params);
  /* const song = await fetchSong(params.id)
    
    return {
      title: `${song.title} - Lyrics`,
      description: `Lyrics for ${song.title} by ${song.artist}`,
      openGraph: {
        images: [{ url: song.albumCover }]
      }
    }*/
}

// Multiple versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { title } = await params;
  // ...
  return <Box>Something, {JSON.stringify(params)}</Box>;
}
