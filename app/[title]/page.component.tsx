"use client";
import LyricsComponent from "@/components/LyricsComponent";
import React from "react";
import { SongDataDynamo } from "@/lib/aws";

export default function PageComponent({ song }: { song: SongDataDynamo }) {
  return (
    <div className=" p-8 md:p-10">
      <LyricsComponent lyrics={song} />
    </div>
  );
}
