"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateGalaxy = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    // Encode the prompt to be used as a URL parameter
    const encodedPrompt = encodeURIComponent(prompt.trim());
    router.push(`/galaxy/${encodedPrompt}`);
  };

  return (
    <main className="relative w-screen h-screen flex flex-col items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://placehold.co/1920x1080.png')",
          filter: "blur(4px) brightness(0.6)",
        }}
        data-ai-hint="starry galaxy"
      />
      <div className="relative z-10 text-center text-white p-8 bg-[rgba(25,25,35,0.7)] rounded-xl shadow-[0_0_20px_rgba(255,182,193,0.4)] backdrop-blur-sm border border-[rgba(255,182,193,0.3)] max-w-lg">
        <h1
          className="text-5xl text-[#ffb6c1] mb-4"
          style={{
            fontFamily: "'Dancing Script', cursive",
            textShadow: "0 0 15px rgba(255, 105, 180, 0.9)",
          }}
        >
          My Love in the Stars
        </h1>
        <p
          className="mb-8 text-lg text-gray-300"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Describe a memory, a feeling, or a dream, and we'll create a unique
          galaxy just for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Our first coffee date under the rain"
            className="flex-grow bg-transparent border-gray-500 text-white placeholder:text-gray-400 focus:ring-pink-400"
          />
          <Button
            onClick={handleCreateGalaxy}
            disabled={loading || !prompt.trim()}
            className="px-6 py-3 bg-gradient-to-r from-[#ff6ec4] to-[#7873f5] text-white border-none rounded-lg cursor-pointer transition-all duration-300 ease-in-out font-medium text-base tracking-wider shadow-[0_4px_15px_rgba(255,110,196,0.4)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,110,196,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create My Galaxy"
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}
