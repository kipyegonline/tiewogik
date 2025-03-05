import React, { useState } from "react";
import { TextInput, ActionIcon } from "@mantine/core";
import { Search } from "lucide-react";
type Props = { sendValue: (val: string) => void };
export default function SearchComponent({ sendValue }: Props) {
  const [search, setSearch] = useState("");
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    //
    if (search.trim().length > 0) {
      sendValue(search.trim());
    }
  };

  return (
    <form onSubmit={handleSearch} className="mb-8  max-w-2xl relative top-4">
      <TextInput
        size="lg"
        radius="md"
        rightSection={
          <ActionIcon variant="transparent" color="gray" type="submit">
            <Search size={32} />
          </ActionIcon>
        }
        placeholder="Search for kalenjin song number, title or verse..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full"
        /* rightSection={
               <Button type="submit" variant="filled" color="blue">
                 Search
               </Button>
             }*/
      />
    </form>
  );
}
