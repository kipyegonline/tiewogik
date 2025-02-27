// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const posts = await fetch("https://.../posts").then((res) => res.json());

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
export async function generateMetadata({ params }) {
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
  const { slug } = await params;
  // ...
}
