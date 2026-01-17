import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Playlist } from "@/components/Playlist";
import { toast } from "sonner";

interface Track {
  id: string;
  name: string;
  url: string;
  duration: number;
}

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load tracks from localStorage on mount
  useEffect(() => {
    const savedTracks = localStorage.getItem("musicPlayerTracks");
    if (savedTracks) {
      try {
        const parsedTracks = JSON.parse(savedTracks);
        setTracks(parsedTracks);
      } catch (error) {
        console.error("Error loading saved tracks:", error);
      }
    }
  }, []);

  // Save tracks to localStorage whenever they change
  useEffect(() => {
    if (tracks.length > 0) {
      localStorage.setItem("musicPlayerTracks", JSON.stringify(tracks));
    } else {
      localStorage.removeItem("musicPlayerTracks");
    }
  }, [tracks]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const audioFiles = Array.from(files).filter((file) =>
      file.type.startsWith("audio/")
    );

    if (audioFiles.length === 0) {
      toast.error("Please select valid audio files");
      return;
    }

    const newTracks: Track[] = [];
    let processed = 0;

    audioFiles.forEach((file) => {
      const url = URL.createObjectURL(file);
      const audio = new Audio(url);

      audio.addEventListener("loadedmetadata", () => {
        newTracks.push({
          id: `${Date.now()}-${Math.random()}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
          url: url,
          duration: audio.duration,
        });

        processed++;
        if (processed === audioFiles.length) {
          setTracks((prev) => [...prev, ...newTracks]);
          toast.success(`Added ${newTracks.length} track${newTracks.length > 1 ? "s" : ""}`);
        }
      });

      audio.addEventListener("error", () => {
        processed++;
        toast.error(`Failed to load: ${file.name}`);
      });
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTrackRemove = (index: number) => {
    setTracks((prev) => {
      const newTracks = prev.filter((_, i) => i !== index);
      
      // Adjust current track index if needed
      if (currentTrackIndex >= newTracks.length) {
        setCurrentTrackIndex(Math.max(0, newTracks.length - 1));
      } else if (index < currentTrackIndex) {
        setCurrentTrackIndex(currentTrackIndex - 1);
      }
      
      return newTracks;
    });
    toast.success("Track removed");
  };

  const handleTrackChange = (index: number) => {
    if (index >= 0 && index < tracks.length) {
      setCurrentTrackIndex(index);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-10 bg-background/80">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                MelodyFlow
              </h1>
              <p className="text-sm text-muted-foreground">
                Your Offline Music Player
              </p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Music
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-8">
        <div className="space-y-8">
          {/* Music Player */}
          <MusicPlayer
            tracks={tracks}
            currentTrackIndex={currentTrackIndex}
            onTrackChange={handleTrackChange}
          />

          {/* Playlist */}
          <Playlist
            tracks={tracks}
            currentTrackIndex={currentTrackIndex}
            onTrackSelect={handleTrackChange}
            onTrackRemove={handleTrackRemove}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-4">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Built with React + TypeScript + Vite</p>
        </div>
      </footer>
    </div>
  );
}
