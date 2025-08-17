
"use client";

import Galaxy from "@/components/galaxy";
import { useState, useEffect } from "react";
import Music from "@/components/music";
import { Loader2 } from "lucide-react";
import { getGalaxyById } from "@/services/galaxyService";

export default function GalaxyPage({ params }: { params: { id: string } }) {
  const [cometImages, setCometImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGalaxyData = async () => {
      if (!params.id) {
        setError("No galaxy ID provided.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const images = await getGalaxyById(params.id);
        if (images && images.length > 0) {
          setCometImages(images);
        } else {
          setError("Could not find a galaxy with this link. It may have been removed or the link is incorrect.");
        }
      } catch (e) {
        console.error(e);
        setError("An error occurred while loading your galaxy. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchGalaxyData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center text-white bg-black">
        <Loader2 className="w-12 h-12 animate-spin text-[#ffb6c1] mb-4" />
        <p className="text-xl" style={{ fontFamily: "'Dancing Script', cursive" }}>
          Entering your universe...
        </p>
      </div>
    );
  }

  if (error) {
     return (
      <div className="w-screen h-screen flex flex-col items-center justify-center text-white bg-black text-center p-4">
        <p className="text-2xl text-[#ff6ec4] mb-4" style={{ fontFamily: "'Dancing Script', cursive" }}>Oops!</p>
        <p className="text-lg text-gray-300">{error}</p>
      </div>
    );
  }

  return (
    <main className="relative w-screen h-screen">
      <Music />
      <div
        id="title"
        className="absolute top-5 w-full text-center text-[#ffb6c1] z-10 text-4xl pointer-events-none"
        style={{
          fontFamily: "'Dancing Script', cursive",
          textShadow: "0 0 15px rgba(255, 105, 180, 0.9)",
          animation: "pulse 3s infinite",
        }}
      >
        My Love in the Stars
      </div>

      <div id="heart" className="absolute bottom-8 right-8 text-[#ff6ec4] text-3xl z-10" style={{ animation: "heartbeat 1.2s infinite" }}>
        ❤
      </div>

      <Galaxy cometImages={cometImages} />
    </main>
  );
}
