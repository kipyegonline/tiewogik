import { Modal } from "@mantine/core";
import React from "react";
type Props = { children: React.ReactNode; opened: boolean; close: () => void };

export default function AppModal({ opened, children, close }: Props) {
  return (
    <Modal
      opened={opened}
      onClose={close}
      size={"md"}
      centered
      closeOnClickOutside={false}
      radius="md"
      shadow="md"
      transitionProps={{ transition: "fade", duration: 200 }}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      {children}
    </Modal>
  );
}
