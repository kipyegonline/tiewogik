// API utility for managing songs via PHP/MySQL backend

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/server.php";

export interface Verse {
  id: number;
  song_id: number;
  verse_order: number;
  content: string;
}

export interface Song {
  id: number;
  song_number: number;
  title: string;
  english_title: string | null;
  chorus: string | null;
  verses: Verse[];
}

export interface VersePayload {
  song_id?: number;
  verse_order: number;
  content: string;
}

export interface SongPayload {
  song_number: number;
  title: string;
  english_title: string;
  chorus: string;
  verses: string[];
}

/**
 * Adds a new song and its verses to the database
 */
export async function addSong(payload: SongPayload) {
  return await sendRequest({ action: "ADD_SONG", ...payload });
}

/**
 * Updates an existing song and its verses
 */
export async function updateSong(id: number, payload: SongPayload) {
  return await sendRequest({ action: "UPDATE_SONG", id, ...payload });
}

/**
 * Deletes a song by ID
 */
export async function deleteSong(id: number) {
  return await sendRequest({ action: "DELETE_SONG", id });
}

/**
 * Fetches all songs (metadata only)
 */
export async function getSongs() {
  return await sendRequest({ action: "GET_SONGS" });
}

/**
 * Fetches full details for a specific song including its verses
 */
export async function getSongDetails(id: number) {
  return await sendRequest({ action: "GET_SONG_DETAILS", id });
}

/**
 * Searches for songs by song number or keywords in title/lyrics
 */
export async function searchSongs(query: string) {
  return await sendRequest({ action: "SEARCH_SONGS", query });
}

/**
 * Fetches a single random song
 */
export async function getRandomSong() {
  return await sendRequest({ action: "GET_RANDOM_SONG" });
}

/**
 * Generic helper for sending requests to the PHP backend
 */
async function sendRequest(body: object) {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Request Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to connect to the server",
    };
  }
}
