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
  ActionIcon,
  Stack,
  Text,
} from "@mantine/core";
import Link from "next/link";

import { Check as IconCheck, X as IconX, Home, Plus, Trash2 } from "lucide-react";
import { addSong } from "@/lib/api/songs";

// Define form values interface
interface FormValues {
  songNumber: string;
  title: string;
  englishTitle: string;
  verses: { content: string }[];
  chorus: string;
}

// Define notification state interface
interface NotificationState {
  type: "success" | "error";
  message: string;
}

const SongLyricsForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );
  const [loggedin, setloggedin] = useState<boolean>(false);

  // Define the form with validation
  const form = useForm<FormValues>({
    initialValues: {
      songNumber: "",
      title: "",
      englishTitle: "",
      verses: [{ content: "" }], // Initialize with one empty verse object
      chorus: "",
    },
    validate: {
      songNumber: (value) => (value.trim().length > 0 ? null : "Song Number is required"),
      title: (value) => (value.trim().length > 0 ? null : "Title is required"),
      verses: {
        content: (value: string) => {
          console.log(value, 'value')
          return value.length > 1 ? null : "Verse content is required"
        },
      },
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

    const payload = {
      song_number: parseInt(values.songNumber),
      title: values.title,
      english_title: values.englishTitle,
      chorus: values.chorus,
      verses: values.verses
        .map(v => v.content)
        .filter(v => v.trim() !== ""), // Map objects back to strings for the API
    };

    try {
      const result = await addSong(payload);

      if (result.success) {
        setNotification({
          type: "success",
          message: "Song saved successfully!",
        });
        form.reset();
      } else {
        setNotification({
          type: "error",
          message: result.error || "Failed to save song. Please try again.",
        });
      }
    } catch (error: any) {
      setNotification({
        type: "error",
        message: error.message || "An unexpected error occurred.",
      });
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
        <Link href="/add-song" className="text-gray-500">
          Add song
        </Link>
      </Breadcrumbs>

      <Paper shadow="md" p="xl" className="w-full max-w-3xl bg-white rounded-xl">
        <Title order={2} className="text-center mb-8 text-gray-800 font-bold">
          Submit New Song
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Group grow>
              <TextInput
                required
                label="Song Number"
                placeholder="e.g. 101"
                {...form.getInputProps("songNumber")}
              />
              <TextInput
                required
                label="Kalenjin Title"
                placeholder="Enter title"
                {...form.getInputProps("title")}
              />
            </Group>

            <TextInput
              label="English Title"
              placeholder="Enter translation (Optional)"
              {...form.getInputProps("englishTitle")}
            />



            <div className="mt-4">
              <Text fw={500} size="sm" mb={4}>Verses</Text>
              <Stack gap="sm">
                {form.values.verses.map((_, index) => (
                  <Group key={index} align="flex-start">
                    <Textarea
                      required
                      placeholder={`Verse ${index + 1}`}
                      className="flex-1"
                      minRows={2}
                      {...form.getInputProps(`verses.${index}.content`)}
                    />
                    <ActionIcon
                      color="red"
                      variant="light"
                      mt={4}
                      onClick={() => form.removeListItem("verses", index)}
                      disabled={form.values.verses.length === 1}
                    >
                      <Trash2 size="1.1rem" />
                    </ActionIcon>
                  </Group>
                ))}
              </Stack>

              <Button
                leftSection={<Plus size={16} />}
                variant="light"
                color="blue"
                mt="md"
                onClick={() => form.insertListItem("verses", { content: "" })}
              >
                Add Verse
              </Button>
            </div>
            <Textarea
              label="Chorus"
              placeholder="Enter the chorus"
              minRows={3}
              {...form.getInputProps("chorus")}
            />
          </Stack>

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
              mt="xl"
              onClose={() => setNotification(null)}
            >
              {notification.message}
            </Notification>
          )}

          <Group justify="flex-end" mt="xl">
            <Button
              type="button"
              variant="subtle"
              color="gray"
              onClick={() => form.reset()}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button type="submit" color="orange" size="md" loading={isSubmitting}>
              Save to Database
            </Button>
          </Group>
        </form>
      </Paper>
    </div>
  );
};

export default SongLyricsForm;

