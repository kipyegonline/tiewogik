"use client";
import LyricsComponent from "@/components/LyricsComponent";
import React from "react";
import { SongDataDynamo } from "@/lib/aws";

export default function PageComponent({ song }: { song: SongDataDynamo }) {
  return (
    <div>
      <LyricsComponent lyrics={song} ChorusComponent={() => null} />
    </div>
  );
}
