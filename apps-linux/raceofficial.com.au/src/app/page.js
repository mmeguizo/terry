import Hero from "@/components/sections/Hero";
import EventDocuments from "@/components/sections/EventDocuments";
import LatestNews from "@/components/sections/LatestNews";
import Sponsors from "@/components/sections/Sponsors";

export default function Home() {
  return (
    <>
      <Hero />
      <EventDocuments />
      <LatestNews />
      <Sponsors />
    </>
  );
}