import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Music, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Track {
  id: string;
  name: string;
  url: string;
  duration: number;
}

interface PlaylistProps {
  tracks: Track[];
  currentTrackIndex: number;
  onTrackSelect: (index: number) => void;
  onTrackRemove: (index: number) => void;
}

export function Playlist({
  tracks,
  currentTrackIndex,
  onTrackSelect,
  onTrackRemove,
}: PlaylistProps) {
  const formatDuration = (duration: number): string => {
    if (isNaN(duration) || !isFinite(duration)) return "0:00";
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (tracks.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto p-8">
        <div className="text-center text-muted-foreground">
          <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Your playlist is empty</p>
          <p className="text-sm mt-2">Upload audio files to get started</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto p-4">
      <h3 className="text-lg font-semibold mb-4 px-2">Playlist</h3>
      <ScrollArea className="h-[400px]">
        <div className="space-y-1">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer hover:bg-accent",
                currentTrackIndex === index && "bg-accent"
              )}
              onClick={() => onTrackSelect(index)}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/10 text-primary text-sm font-medium shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{track.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDuration(track.duration)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onTrackRemove(index);
                }}
                className="shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
