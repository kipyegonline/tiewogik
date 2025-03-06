import React from "react";
import { WhatsappIcon, WhatsappShareButton } from "react-share";

export default function ShareComponent() {
  return (
    <>
      <WhatsappShareButton url={location.origin}>
        <WhatsappIcon />
      </WhatsappShareButton>
    </>
  );
}
