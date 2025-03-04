// lib/aws.ts
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";

// Define the Song interface
export interface SongData {
  id: string;
  title: string;
  englishTitle?: string;
  lyrics: string;
  chorus: string;
  language?: string;
  genre?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface SongDataDynamo {
  id: { N: string };
  title: { S: string };
  englishTitle: { S: string };
  chorus: { S: string };
  lyrics: { S: string };
  titleSearch: { S: string };
  lyricsSearch: { S: string };
  createdAt?: { S: string };
  updateAt?: { S: string };
}
// Define response types
export interface AwsResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  response?: Record<string, SongDataDynamo>;
}

// Initialize the DynamoDB client
const client = new DynamoDBClient({
  region: process.env.NEXT_PUBLIC_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_KEY as string,
  },
});

// Table name for songs
const SONGS_TABLE = process.env.NEXT_PUBLIC_DYNAMODB_TABLE;

/**
 * Save a song to DynamoDB
 * @param {SongData} songData - The song data from the form
 * @returns {Promise<AwsResponse<SongData[]>>} - The response from DynamoDB
 */
export const saveSong = async (songData: SongDataDynamo) => {
  try {
    // Prepare the item for DynamoDB
    const item = {
      ...songData,
      createdAt: { S: new Date().toISOString() },
      updatedAt: { S: new Date().toISOString() },
    };
    console.log("AWS item", item);
    // Create the command to put the item in DynamoDB
    const command = new PutItemCommand({
      TableName: SONGS_TABLE,
      Item: item,
      // Optional: Add condition to prevent overwriting existing item with same ID
      ConditionExpression: "attribute_not_exists(id)",
    });

    // Execute the command
    const response = await client.send(command);
    console.log("Song saved successfully:", response);
    return { success: true, data: item, response };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error saving song to DynamoDB:", error.message);
      // Check if error is due to condition failure (item already exists)
      if (error.name === "ConditionalCheckFailedException") {
        return {
          success: false,
          error:
            "A song with this ID already exists. Please use a different ID.",
        };
      }

      return {
        success: false,
        error: error.message || "Failed to save song",
      };
    } else {
      return {
        success: false,
        error: "Something went wrong,try again.",
      };
    }
  }
};

/**
 * Get a song by ID
 * @param {string} id - The song ID
 * @returns {Promise<AwsResponse<SongData>>} - The song data
 */
export const getSongById = async (
  id: string
): Promise<AwsResponse<SongDataDynamo>> => {
  try {
    const command = new GetItemCommand({
      TableName: SONGS_TABLE,
      Key: { id: { N: id } },
    });

    const response = await client.send(command);
    return {
      success: true,
      data: response.Item as unknown as SongDataDynamo,
    };
  } catch (error: unknown) {
    console.error("Error fetching song:", error);
    if (error instanceof Error)
      return {
        success: false,
        error: error.message || "Failed to fetch song",
      };
    else
      return {
        success: false,
        error: "something went wrong. Try again later",
      };
  }
};

/**
 * Search songs by title (using a secondary index)
 * @param {string} title - The title to search for
 * @returns {Promise<AwsResponse<SongData[]>>} - The matching songs
 */
export const searchSongsByTitle = async (
  title: string
): Promise<AwsResponse<SongDataDynamo[]>> => {
  try {
    // This assumes you have a Global Secondary Index on the title attribute
    const command = new QueryCommand({
      TableName: SONGS_TABLE,
      //  IndexName: "TitleIndex", // You'll need to create this GSI in DynamoDB
      KeyConditionExpression: "title =:title",
      ExpressionAttributeValues: {
        ":title": { S: title },
      },
    });

    const response = await client.send(command);
    return {
      success: true,
      data: response.Items as unknown as SongDataDynamo[],
    };
  } catch (error: unknown) {
    console.error("Error searching songs:", error);
    if (error instanceof Error)
      return {
        success: false,
        error: error.message || "Failed to search songs",
      };
    else
      return {
        success: false,
        error: "something went wrong. Try again later",
      };
  }
};

export async function searchSongsByTitleAndLyrics(
  searchValue: string
): Promise<AwsResponse<SongDataDynamo[]>> {
  try {
    const command = new ScanCommand({
      TableName: SONGS_TABLE,
      FilterExpression:
        "contains(#titleSearch,:searchValue) OR contains(#lyricsSearch,:searchValue)",

      ExpressionAttributeNames: {
        "#titleSearch": "titleSearch",
        "#lyricsSearch": "lyricsSearch",
      },
      ExpressionAttributeValues: {
        ":searchValue": { S: searchValue },
      },
    });
    const response = await client.send(command);
    return {
      success: true,
      data: response.Items as unknown as SongDataDynamo[],
    };
  } catch (error: unknown) {
    //console.log(error.message);
    if (error instanceof Error) return { success: false, error: error.message };
    else
      return {
        success: false,
        error: "something went wrong. Try again later",
      };
  }
}
export const getAllSongs = async (): Promise<AwsResponse<SongDataDynamo[]>> => {
  try {
    const command = new ScanCommand({
      TableName: SONGS_TABLE,
    });
    const response = await client.send(command);
    return {
      success: true,
      data: response.Items as unknown as SongDataDynamo[],
    };
  } catch (error: unknown) {
    //console.log(error.message);
    if (error instanceof Error) return { success: false, error: error.message };
    else
      return {
        success: false,
        error: "something went wrong. Try again later",
      };
  }
};
export default {
  saveSong,
  getSongById,
  searchSongsByTitle,
  searchSongsByTitleAndLyrics,
};
