"use client";
import React, { useState } from "react";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Textarea,
  Button,
  Title,
  Paper,
  Group,
  Select,
  Notification,
  Breadcrumbs,
} from "@mantine/core";
import Link from "next/link";

import { Check as IconCheck, X as IconX, Home } from "lucide-react";
import { saveSong } from "@/lib/aws";

// Define form values interface
interface FormValues {
  id: string;
  title: string;
  englishTitle: string;
  lyrics: string;
  chorus: string;
  language?: string;
  genre?: string;
}

// Define notification state interface
interface NotificationState {
  type: "success" | "error";
  message: string;
}

const SongLyricsForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );
  const [lyrics, setLyrics] = useState<string[]>([]);
  const [loggedin, setloggedin] = useState<boolean>(false);

  // Define the form with validation
  const form = useForm<FormValues>({
    initialValues: {
      id: "",
      title: "",
      englishTitle: "",
      lyrics: "",
      chorus: "",
      // language: "",
      //genre: "",
    },
    validate: {
      id: (value: string) =>
        value.trim().length > 0 ? null : "ID is required",
      title: (value: string) =>
        value.trim().length > 0 ? null : "Title is required",
      lyrics: (value: string) =>
        value.trim().length > 0 ? null : "Lyrics are required",
      /* chorus: (value: string) =>
        value.trim().length > 0 ? null : "Chorus is required",*/
    },
  });
  React.useEffect(() => {
    const password = prompt("Enter OTP");
    if (password === "tiendo") setloggedin(true);
    else setloggedin(false);
  }, []);

  const handleSubmit = async (values: FormValues): Promise<void> => {
    setIsSubmitting(true);
    setNotification(null);
    const valz = values.lyrics.slice().split("br");

    const payload = {
      id: { N: values.id },
      title: { S: values.title },
      englishTitle: { S: values.englishTitle },
      chorus: { S: values.chorus },
      lyrics: { S: JSON.stringify(valz) },
      titleSearch: { S: values.title.toLowerCase() },
      lyricsSearch: { S: values.lyrics.toLowerCase() },
      chorusSearch: { S: values.chorus.toLowerCase() },
    };
    try {
      // Send the form data to DynamoDB using our AWS library

      setLyrics(valz);
      const result = await saveSong(payload);

      if (result.success) {
        // Show success notification
        setNotification({
          type: "success",
          message: "Song saved successfully to the database!",
        });
        setLyrics([]);
        // Reset the form after successful submission
        form.reset();
      } else {
        // Show error notification
        setNotification({
          type: "error",
          message: result.error || "Failed to save song. Please try again.",
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Handle any unexpected errors
        setNotification({
          type: "error",
          message:
            error.message || "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setTimeout(() => setNotification(null), 3000);
      setIsSubmitting(false);
    }
  };
  if (!loggedin) return null;
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Breadcrumbs py="md">
        <Link href="/" className="text-blue-500 flex items-center">
          <Home className="inline-block mr-2" />
          <span>Home</span>
        </Link>
        <Link href="/" inert>
          Add song
        </Link>
      </Breadcrumbs>
      <Paper shadow="md" p="lg" className="w-full max-w-3xl bg-white">
        <Title order={2} className="text-center mb-6 text-gray-800">
          Song Lyrics Submission
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <div className="space-y-4">
            {/* Song ID */}
            <TextInput
              required
              label="Song ID"
              placeholder="Enter a unique identifier"
              className="w-full"
              {...form.getInputProps("id")}
            />
            {/* Title */}
            <TextInput
              required
              label="Title"
              placeholder="Enter the song title"
              className="w-full"
              {...form.getInputProps("title")}
            />
            {/* English Title */}
            <TextInput
              label="English Title"
              placeholder="Enter the English translation of the title (if applicable)"
              className="w-full"
              {...form.getInputProps("englishTitle")}
            />
            {false && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Additional fields */}
                <Select
                  label="Language"
                  placeholder="Select the language"
                  data={[
                    { value: "english", label: "English" },
                    { value: "spanish", label: "Spanish" },
                    { value: "french", label: "French" },
                    { value: "other", label: "Other" },
                  ]}
                  {...form.getInputProps("language")}
                />

                <Select
                  label="Genre"
                  placeholder="Select the genre"
                  data={[
                    { value: "pop", label: "Pop" },
                    { value: "rock", label: "Rock" },
                    { value: "hiphop", label: "Hip Hop" },
                    { value: "rnb", label: "R&B" },
                    { value: "country", label: "Country" },
                    { value: "other", label: "Other" },
                  ]}
                  {...form.getInputProps("genre")}
                />
              </div>
            )}
            {/* Chorus */}
            <Textarea
              label="Chorus"
              placeholder="Enter the chorus of the song"
              minRows={3}
              className="w-full"
              {...form.getInputProps("chorus")}
            />

            <pre>{lyrics}</pre>
            {/* Lyrics */}
            <Textarea
              required
              label="Lyrics"
              placeholder="Enter the complete lyrics of the song"
              minRows={8}
              cols={50}
              rows={10}
              className="w-full"
              {...form.getInputProps("lyrics")}
            />
          </div>
          {notification && (
            <Notification
              icon={
                notification.type === "success" ? (
                  <IconCheck size="1.1rem" />
                ) : (
                  <IconX size="1.1rem" />
                )
              }
              color={notification.type === "success" ? "teal" : "red"}
              title={notification.type === "success" ? "Success" : "Error"}
              className="mb-4"
              onClose={() => setNotification(null)}
            >
              {notification.message}
            </Notification>
          )}

          <Group mt="xl">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button type="submit" color="blue" loading={isSubmitting}>
              Save to Database
            </Button>
          </Group>
        </form>
      </Paper>
    </div>
  );
};

export default SongLyricsForm;
