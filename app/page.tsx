import type { Metadata } from "next";
export const metadata: Metadata = {
  title:
    "Kalenjin Hymn songs  | Tienwogik che kilosune Jehovah | Tienwogik ab Kalosunet",
  description:
    " Kalenjin Hymn songs  Tienwogikab Kalosunet, Tienwogik che kilosune Jehovah,Tienwogik ab Kalosunet",
};
import HomePage from "@/components/HomePage";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-items-center  p-4 pb-20 gap-16 sm:p-10 border-red ">
      <HomePage />

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
