import React, { useState } from "react";
import { Text, Button, Tooltip, Notification } from "@mantine/core";
import { Copy, Share2, Check } from "lucide-react";

const LyricsDisplay = ({ lyrics }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const lyricsText = lyrics.content;
    navigator.clipboard.writeText(lyricsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLyrics = () => {
    if (navigator.share) {
      navigator
        .share({
          title: lyrics.title,
          text: `Check out the lyrics for ${lyrics.title}`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing:", error));
    } else {
      // Fallback for browsers that don't support Web Share API
      copyToClipboard();
    }
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen pt-16 pb-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
          {/* Lyrics header with song number and title */}
          <div className="p-6">
            <div className="text-center mb-4">
              <Text className="text-orange-500 font-bold text-2xl mb-1">
                {lyrics.number} {lyrics.title}
              </Text>
              <Text className="text-purple-500 text-lg">{lyrics.subtitle}</Text>
            </div>

            {/* Copy and Share buttons */}
            <div className="flex justify-center gap-4 mb-6">
              <Tooltip
                label={copied ? "Copied!" : "Copy lyrics"}
                position="bottom"
              >
                <Button
                  onClick={copyToClipboard}
                  variant="subtle"
                  className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-md transition-colors"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  <span>Copy</span>
                </Button>
              </Tooltip>

              <Tooltip label="Share lyrics" position="bottom">
                <Button
                  onClick={shareLyrics}
                  variant="subtle"
                  className="flex items-center gap-2 text-blue-500 hover:bg-blue-50 px-4 py-2 rounded-md transition-colors"
                >
                  <Share2 size={18} />
                  <span>Share</span>
                </Button>
              </Tooltip>
            </div>

            {/* Lyrics content */}
            <div className="lyrics-content whitespace-pre-line text-gray-800">
              {/* Verse number */}
              <div className="text-gray-400 mb-1">[1]</div>
              <div className="mb-6">
                Kirirge Jehovah eng' Olin barak
                <br />
                Kingogeerei bik komitei eng' luset.
                <br />
                Ki'yokwech Yetindet komeny koboto
                <br />
                bik
                <br />
                Si kobiit koboruech Oret ne bo
                <br />
                sorunet.
              </div>

              <div className="text-gray-400 mb-1">[2]</div>
              <div className="mb-6">
                Jesu tiseiyondet ne kigoitogei
                <br />
                Si kobiit koalech eng 'otwoknatet .<br />
                Kinyo si kotiachech eng'
                <br />
                tengekwogikyok ,<br />
                Ak kotoretech tugul eng' ka-
                <br />
                iimutikyok.
              </div>

              <div className="text-gray-400 mb-1">[3]</div>
              <div className="mb-6">Jesu Ruandet ne mie ne kitonone:</div>
            </div>
          </div>
        </div>

        {/* Copy notification */}
        {copied && (
          <div className="fixed bottom-4 right-4">
            <Notification
              title="Copied to clipboard"
              onClose={() => setCopied(false)}
              className="bg-green-50 border border-green-100"
            >
              <Text className="text-green-700">
                Lyrics copied successfully!
              </Text>
            </Notification>
          </div>
        )}
      </div>
    </div>
  );
};

// Sample props
LyricsDisplay.defaultProps = {
  lyrics: {
    number: "111",
    title: "KIRIRGE JEHOVAH",
    subtitle: "God Looked Down From heaven",
    content:
      "[1]\nKirirge Jehovah eng' Olin barak\nKingogeerei bik komitei eng' luset.\nKi'yokwech Yetindet komeny koboto\nbik\nSi kobiit koboruech Oret ne bo\nsorunet.\n\n[2]\nJesu tiseiyondet ne kigoitogei\nSi kobiit koalech eng 'otwoknatet .\nKinyo si kotiachech eng'\ntengekwogikyok ,\nAk kotoretech tugul eng' ka-\niimutikyok.\n\n[3]\nJesu Ruandet ne mie ne kitonone:",
  },
};

export default LyricsDisplay;
