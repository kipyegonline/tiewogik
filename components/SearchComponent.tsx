import React, { useState } from "react";
import { TextInput, ActionIcon } from "@mantine/core";
import { Search, Music } from "lucide-react";

type Props = { 
  sendValue: (val: string) => void;
  value?: string;
  onChange?: (val: string) => void;
};

export default function SearchComponent({ sendValue, value, onChange }: Props) {
  const [internalSearch, setInternalSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Use external value or internal state
  const currentSearch = value !== undefined ? value : internalSearch;
  const setCurrentSearch = onChange || setInternalSearch;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSearch.trim().length > 0) {
      sendValue(currentSearch.trim());
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`${value !== undefined ? "" : "mb-8 max-w-2xl relative top-4 w-full"}`}
    >
      <div
        className={`search-glow rounded-lg ${isFocused ? "ring-1 ring-[#E86F36]/30" : ""}`}
      >
        <TextInput
          size="lg"
          radius="md"
          leftSection={
            <Music
              size={20}
              className={`transition-all duration-300 ${
                isFocused ? "text-[#E86F36] scale-110" : "text-gray-400"
              }`}
            />
          }
          rightSection={
            <ActionIcon
              variant="filled"
              color="orange"
              size="lg"
              radius="md"
              type="submit"
              className="transition-transform duration-200 hover:scale-105"
            >
              <Search size={20} />
            </ActionIcon>
          }
          placeholder="Search by song number, title or verse..."
          value={currentSearch}
          onChange={(e) => setCurrentSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full"
          styles={{
            input: {
              border: "2px solid rgba(232, 111, 54, 0.15)",
              transition: "all 0.3s ease",
              fontSize: "15px",
            },
          }}
        />
      </div>
    </form>
  );
}
