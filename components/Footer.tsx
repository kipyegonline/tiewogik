import React from "react";
import { Text, Button, Box, Textarea, Title, Flex, Image } from "@mantine/core";
import { Heart, Coffee, AlertCircle } from "lucide-react";
import { colors } from "@/lib/Color";
import AppModal from "./AppModal";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const tea = ["Chebango", "Kapkatet", "Kericho Gold", "Litein", ""];
  const randTea = () => tea[Math.floor(Math.random() * tea.length)];
  const chosentea = React.useCallback(() => randTea(), [])();
  let url = `https://formsubmit.co/ajax/vinnykipx@gmail.com`;
  const [open, setOpen] = React.useState<null | 1 | 2 | 3>(null);

  async function submitFormToFormSubmit(
    formData: Record<string, string>,
    formSubmitEndpoint: string
  ) {
    try {
      const response = await fetch(formSubmitEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();

        return result;
      } else {
        throw Error("something went Wrong");
      }
    } catch (error: unknown) {
      console.error(error);
      return null;
    }
  }

  return (
    <footer
      className="w-full p-6 !text-white"
      style={{
        background: colors.brown.dark,
      }}
    >
      <AppModal
        opened={!!open}
        close={() => {
          setOpen(null);
        }}
      >
        <Box>
          {" "}
          {open === 1 && (
            <LyricsIssue
              sendvalues={(values) => console.log(values)}
              loading={false}
            />
          )}
          {open === 2 && (
            <FeatureRequest
              sendvalues={(values) => console.log(values)}
              loading={false}
            />
          )}
          {open === 3 && <BuyMeTea tea={chosentea} />}
        </Box>
      </AppModal>
      <div className="max-w-6xl mx-auto">
        {/* Top section with three features */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          {/* Report Issues */}
          <div className="flex items-center space-x-2">
            <AlertCircle size={20} className="text-white" />
            <Text className="text-white font-medium">
              Found an issue with lyrics?{" "}
              <Button
                variant="subtle"
                onClick={() => setOpen(1)}
                className="text-white underline px-1 py-0"
              >
                Report here
              </Button>
            </Text>
          </div>
          {/* Report Issues */}
          <div className="flex items-center space-x-2">
            <AlertCircle size={20} className="text-white" />
            <Text className="text-white font-medium">
              New feature request?{" "}
              <Button
                variant="subtle"
                onClick={() => setOpen(2)}
                className="text-white underline px-1 py-0"
              >
                Request Feature
              </Button>
            </Text>
          </div>

          {/* Made with love */}
          <div className="flex items-center w-[360px]">
            <Text className="text-white font-medium flex items-center">
              Made with{" "}
              <Heart
                className="mx-1 text-red-500 fill-red-500 inline-block"
                size={18}
              />{" "}
              by{"     "}
              <a
                href="https://vince-resume.vercel.app/"
                target="_blank"
                className="pl-2"
              >
                Vince Kipyegon
              </a>
            </Text>
          </div>

          {/* Buy me a coffee */}
          <div>
            <Button
              variant="filled"
              className="!bg-white !text-orange-500 hover:bg-gray-100 flex items-center gap-2"
              size="sm"
              onClick={() => setOpen(3)}
            >
              <Coffee size={18} className="mr-2" />
              Buy me{" "}
              <span className="text-green-600 mx-2">
                {chosentea} {"  "}Tea{" "}
              </span>
            </Button>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="pt-4 border-t border-white/30">
          <Text className="text-white text-center text-sm">
            &copy; {currentYear} Tienwogik Ab Kalosunet.
          </Text>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

type Props = {
  sendvalues: (values: { message: string; subject: string }) => void;
  loading: boolean;
};

const LyricsIssue = ({ sendvalues, loading }: Props) => {
  const [text, setText] = React.useState("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim()) {
      sendvalues({ subject: "Issue", message: text });
    }
  };
  return (
    <Box p="lg">
      <h1 className="text-gray-700 my-2 text-2xl font-semibold text-center">
        Report Lyrics Issue
      </h1>
      <form onSubmit={handleSubmit}>
        <Text className="py-2 mb-2" mb="md">
          Please type issue,indicate song number
        </Text>
        <Textarea
          rows={4}
          cols={50}
          onChange={(e) => setText(e.target.value)}
          label=""
          value={text}
        />
        <Button
          type="submit"
          loading={loading}
          className="mt-4 !bg-orange-800 text-white"
          fullWidth
        >
          Submit Issue
        </Button>
      </form>
    </Box>
  );
};

const FeatureRequest = ({ sendvalues, loading }: Props) => {
  const [text, setText] = React.useState("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim()) {
      sendvalues({ subject: "Feature request", message: text });
    }
  };
  return (
    <Box p="lg">
      <h1 className="text-gray-700 my-2 text-2xl font-semibold text-center">
        Feature Request
      </h1>
      <form onSubmit={handleSubmit}>
        <Text className="py-2 mb-2" mb="md">
          Please describe the feature you would like to request.
        </Text>
        <Textarea
          rows={4}
          cols={50}
          onChange={(e) => setText(e.target.value)}
          label=""
          value={text}
        />
        <Button
          type="submit"
          loading={loading}
          className="mt-4 !bg-orange-800 text-white"
          fullWidth
        >
          Submit
        </Button>
      </form>
    </Box>
  );
};

type tea = { tea: string };

const BuyMeTea = ({ tea }: tea) => {
  // const [text, setText] = React.useState("");

  return (
    <Box p="lg">
      <h1 className="text-gray-700 my-2 text-2xl font-semibold text-center">
        Buy Me {tea} Tea
      </h1>
      <Box>
        <Flex gap="md" align={"center"}>
          <Box>
            <Image src="/paypal.webp" alt="paypal" />
          </Box>
          <Box>
            <Image src="/mpesavvv.png" alt="mpesa" />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};
