import { Modal } from "@mantine/core";
import React from "react";
type Props = { children: React.ReactNode; opened: boolean; close: () => void };

export default function AppModal({ opened, children, close }: Props) {
  return (
    <Modal opened={opened} onClose={close} size={"md"}>
      {children}
    </Modal>
  );
}
