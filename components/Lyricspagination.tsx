import { Box, Pagination } from "@mantine/core";
import React from "react";

export default function LyricsPagination({
  total,
  current,
  setCurrent,
}: {
  total: number;
  current: number;
  setCurrent: (val: number) => void;
}) {
  return (
    <Box py="md">
      <Pagination
        total={total}
        gap="lg"
        size="lg"
        value={current}
        onChange={setCurrent}
        color="orange"
      />
    </Box>
  );
}
