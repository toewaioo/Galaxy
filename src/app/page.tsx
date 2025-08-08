"use client";

import Galaxy from "@/components/galaxy";
import { useState, useRef, ChangeEvent } from "react";

export default function Home() {
  const [cometImages, setCometImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const imageUrls = files.map((file) => URL.createObjectURL(file));
      setCometImages(imageUrls);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <main className="relative w-screen h-screen">
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

      <div
        id="upload-container"
        className="absolute top-4 left-4 z-20 bg-[rgba(25,25,35,0.7)] rounded-xl p-3 shadow-[0_0_20px_rgba(255,182,193,0.4)] backdrop-blur-sm border border-[rgba(255,182,193,0.3)]"
      >
        <button
          id="imageUploadLabel"
          onClick={handleUploadClick}
          className="px-5 py-3 bg-gradient-to-r from-[#ff6ec4] to-[#7873f5] text-white border-none rounded-lg cursor-pointer transition-all duration-300 ease-in-out font-medium text-base tracking-wider shadow-[0_4px_15px_rgba(255,110,196,0.4)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,110,196,0.6)]"
        >
          Add Memories
        </button>
        <input
          type="file"
          id="imageUpload"
          ref={fileInputRef}
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>
      
      <div id="message" className="absolute bottom-8 left-8 text-[#a2d5f2] text-lg max-w-xs bg-[rgba(25,25,35,0.6)] p-4 rounded-lg border-l-2 border-[#ff6ec4]" style={{ fontFamily: "'Playfair Display', serif", backdropFilter: "blur(5px)" }}>
        Every star in this galaxy reminds me of a precious moment with you.
      </div>
      
      <div id="heart" className="absolute bottom-8 right-8 text-[#ff6ec4] text-3xl z-10" style={{ animation: "heartbeat 1.2s infinite" }}>
        ❤
      </div>

      <Galaxy cometImages={cometImages} />
    </main>
  );
}
