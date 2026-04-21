"use client";
import LyricsComponent from "@/components/LyricsComponent";
import React from "react";
import { Song } from "@/lib/api/songs";

export default function PageComponent({ song }: { song: Song }) {
  return (
    <div className="py-4 md:py-8">
      <LyricsComponent song={song} />
    </div>
  );
}
