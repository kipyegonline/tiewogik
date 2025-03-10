import React from "react";
import { Text, Button } from "@mantine/core";
import { Heart, Coffee, AlertCircle } from "lucide-react";
import { colors } from "@/lib/Color";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const tea = ["Chebango", "Kapkatet", "Kericho Gold", "Litein", ""];
  const randTea = () => tea[Math.floor(Math.random() * tea.length)];
  const chosentea = React.useCallback(() => randTea(), []);
  return (
    <footer
      className="w-full p-6 !text-white"
      style={{
        background: colors.brown.dark,
      }}
    >
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
                className="text-white underline px-1 py-0"
              >
                Report here
              </Button>
            </Text>
          </div>

          {/* Made with love */}
          <div className="flex items-center space-x-2">
            <Text className="text-white font-medium flex items-center">
              Made with{" "}
              <Heart className="mx-1 text-red-500 fill-red-500" size={18} /> by
              Vince
            </Text>
          </div>

          {/* Buy me a coffee */}
          <div>
            <Button
              variant="filled"
              className="!bg-white !text-orange-500 hover:bg-gray-100 flex items-center gap-2"
              size="sm"
            >
              <Coffee size={18} className="mr-2" />
              Buy me{" "}
              <span className="text-green-600 mx-2">
                {chosentea()} {"  "}Tea{" "}
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
