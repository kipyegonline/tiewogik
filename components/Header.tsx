import React, { useState } from "react";
import { Text } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { Music } from "lucide-react";
import Link from "next/link";
import { colors } from "@/lib/Color";

const Header = () => {
  const [scroll] = useWindowScroll();
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Check scroll direction and update visibility
  React.useEffect(() => {
    const currentScrollPosition = scroll.y;

    // Determine if scrolling up or down
    if (currentScrollPosition > lastScrollPosition) {
      // Scrolling down - hide header
      setIsVisible(false);
    } else {
      // Scrolling up - show header
      setIsVisible(true);
    }

    // Update last scroll position
    setLastScrollPosition(currentScrollPosition);
  }, [scroll.y]);

  return (
    <header
      className={`w-full py-4 px-6 fixed top-0 left-0 right-0 z-10  transition-transform duration-300 ease-in-out border-2 border-b-orange-500 mb-4 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{
        background: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      }}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo & Website Name - Desktop */}
        <Link href="/">
          <div className="flex items-center gap-2">
            <Music
              size={32}
              className="text-orange-500 inline-block mr-2 animate-pulse"
            />
            <Text
              style={{ color: colors.brown.primary }}
              className=" !text-2xl !font-bold hidden sm:block"
            >
              Kalosunet
            </Text>
          </div>
        </Link>

        {/* Website Name - Desktop */}
        <Text
          style={{ color: colors.darkbrown.primary }}
          className=" text-base md:!text-xl !font-bold "
        >
          Tienwogik che kilosune Jehovah
        </Text>
      </div>
    </header>
  );
};

export default Header;
