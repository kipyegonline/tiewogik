import { PageProps } from "@/.next/types/app/layout";

import { getAllSongs, SongDataDynamo, getSongById } from "@/lib/aws";
import { Breadcrumbs, Container } from "@mantine/core";
import PageComponent from "./page.component";
import Link from "next/link";
import { Home } from "lucide-react";
const makeSEOExpression = (song: SongDataDynamo) => {
  const lyrics = eval(song.lyrics.S).join(" ");
  return {
    title: `${song.id.N} ${song.title.S} | Tienwogik che kilosune Jehovah | Tienwogik ab Kalosunet|  Kalenjin Hymn song `,
    description: `Kalenjin hymn song ${song.id.N} ${song.title.S} | Tienwogik che kilosune Jehovah | Tienwogik ab Kalosunet | ${lyrics} ${song?.chorus?.S}`,
    openGraph: {
      images: [],
    },
  };
};
const extractSongId = (url: string) => {
  const idString: string[] = url.split("-");
  return idString[idString.length - 1];
};
// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const response = await getAllSongs();
  if (response.success && response.data !== undefined) {
    return response.data.map((post: SongDataDynamo) => ({
      id: post.title.S.toLowerCase().split(" ").join("-") + "-" + post.id.N,
    }));
  }
  return [];
}
/*Promise<{ title: string; description: string; openGraph: { images: { url: string }[] } }>*/

// Return the dynamic route params to render this page
export async function generateMetadata({ params }: PageProps) {
  const ps = await params;
  let id!: string;
  if ("title" in ps) id = extractSongId(ps.title);
  else id = "0";

  const song = await getSongById(id);

  if (song.success && song.data !== undefined) {
    return makeSEOExpression(song.data);
  } else {
    return {
      title: ` Kalenjin Hymn song ${ps?.title?.slice(
        1,
        -1
      )} } |   Tienwogik che kilosune Jehovah | Tienwogik ab Kalosunet `,
      description: `Lyrics for Kalenjin hymn song,   | Tienwogik che kilosune Jehovah | Tienwogik ab Kalosunet   ${ps?.title?.slice(
        1,
        -1
      )}`,
    };
  }
}

// Multiple versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
export default async function Page({
  params,
}: {
  params: Promise<{ title: string }>;
}) {
  // ...
  let song: null | SongDataDynamo = null;
  const { title } = await params;
  const id = extractSongId(title);
  if (Number.isNaN(Number(id)))
    return (
      <Container p="lg" size={"lg"}>
        <Breadcrumbs>
          <Link href="/" className="text-blue-500 flex items-center">
            <Home className="inline-block mr-2" />
            <span>Home</span>
          </Link>
          <Link href="/" inert>
            Song not found
          </Link>
        </Breadcrumbs>
      </Container>
    );
  const response = await getSongById(id);
  if (response.success && response.data !== undefined) {
    song = response.data;
  }
  if (song)
    return (
      <Container p="lg" size={"lg"}>
        <Breadcrumbs>
          <Link href="/" className="text-blue-500 flex items-center">
            <Home className="inline-block mr-2" />
            <span>Home</span>
          </Link>
          <Link href="/" inert>
            {song?.title?.S}
          </Link>
        </Breadcrumbs>
        <PageComponent song={song} />
      </Container>
    );
  return null;
}
