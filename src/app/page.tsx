
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createGalaxyWithPrompt, createGalaxyWithImages } from "@/services/galaxyService";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  const handleCreateWithPrompt = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const galaxyId = await createGalaxyWithPrompt(prompt.trim());
      router.push(`/galaxy/${galaxyId}`);
    } catch (error) {
      console.error("Error creating galaxy with prompt:", error);
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: "Could not create your galaxy. Please try again.",
      });
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      if (files.length > 5) {
        toast({
          variant: "destructive",
          title: "Too many images",
          description: "You can upload a maximum of 5 images.",
        });
        return;
      }
      setSelectedFiles(files);
    }
  };
  
  const handleCreateWithUpload = async () => {
    if (selectedFiles.length === 0) return;
    setLoading(true);

    const fileToDataUri = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    try {
      const dataUris = await Promise.all(selectedFiles.map(fileToDataUri));
      const galaxyId = await createGalaxyWithImages(dataUris);
      router.push(`/galaxy/${galaxyId}`);
    } catch (error) {
      console.error("Error creating galaxy with images:", error);
      toast({
        variant: "destructive",
        title: "Upload Error",
        description: "There was a problem processing your images. Please try again.",
      });
      setLoading(false);
    }
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
      <div className="relative z-10 text-center text-white p-8 bg-[rgba(25,25,35,0.7)] rounded-xl shadow-[0_0_20px_rgba(255,182,193,0.4)] backdrop-blur-sm border border-[rgba(255,182,193,0.3)] max-w-lg w-full">
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
          Create a unique galaxy from a memory or your favorite photos.
        </p>

        <Tabs defaultValue="prompt" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-transparent/20 border border-[rgba(255,182,193,0.3)]">
            <TabsTrigger value="prompt">Use a Prompt</TabsTrigger>
            <TabsTrigger value="upload">Upload Photos</TabsTrigger>
          </TabsList>
          <TabsContent value="prompt">
             <Card className="bg-transparent border-none">
              <CardContent className="space-y-4 pt-6">
                 <p className="text-sm text-gray-400">Describe a memory, a feeling, or a dream.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Our first coffee date under the rain"
                    className="flex-grow bg-transparent border-gray-500 text-white placeholder:text-gray-400 focus:ring-pink-400"
                  />
                  <Button
                    onClick={handleCreateWithPrompt}
                    disabled={loading || !prompt.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-[#ff6ec4] to-[#7873f5] text-white border-none rounded-lg cursor-pointer transition-all duration-300 ease-in-out font-medium text-base tracking-wider shadow-[0_4px_15px_rgba(255,110,196,0.4)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,110,196,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create with AI"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="upload">
            <Card className="bg-transparent border-none">
              <CardContent className="space-y-4 pt-6">
                 <p className="text-sm text-gray-400">Upload up to 5 of your favorite photos.</p>
                <div className="flex flex-col gap-4">
                   <label htmlFor="imageUpload" className="w-full flex items-center justify-center px-6 py-3 bg-transparent border-2 border-dashed border-gray-500 text-gray-400 rounded-lg cursor-pointer hover:border-pink-400 hover:text-pink-400 transition-colors">
                     <Upload className="mr-2 h-5 w-5" />
                     {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : 'Choose files...'}
                   </label>
                   <Input
                      id="imageUpload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                   />
                  <Button
                    onClick={handleCreateWithUpload}
                    disabled={loading || selectedFiles.length === 0}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#ff6ec4] to-[#7873f5] text-white border-none rounded-lg cursor-pointer transition-all duration-300 ease-in-out font-medium text-base tracking-wider shadow-[0_4px_15px_rgba(255,110,196,0.4)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,110,196,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
