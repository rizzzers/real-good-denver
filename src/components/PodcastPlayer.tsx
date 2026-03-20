"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

interface Episode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: string;
  pubDate: string;
  imageUrl?: string;
}

interface PodcastPlayerProps {
  episode: Episode;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ episode, isPlaying, onPlayPause }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [episode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(console.error);
    else audio.pause();
  }, [isPlaying]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const val = Number(e.target.value);
    if (audio) { audio.currentTime = val; setCurrentTime(val); }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const val = Number(e.target.value);
    setVolume(val);
    if (audio) audio.volume = val;
  };

  const handleSkip = (seconds: number) => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
      <audio ref={audioRef} src={episode.audioUrl} preload="metadata" />

      <div className="flex items-center gap-4 mb-4">
        {episode.imageUrl && (
          <img src={episode.imageUrl} alt={episode.title} className="w-16 h-16 rounded-md object-cover" />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-card-foreground truncate">{episode.title}</h3>
          <p className="text-sm text-muted-foreground">{new Date(episode.pubDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="range"
          value={currentTime}
          max={duration || 100}
          step={1}
          onChange={handleSeek}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mb-4">
        <button onClick={() => handleSkip(-30)} className="w-9 h-9 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <SkipBack className="h-4 w-4" />
        </button>
        <button onClick={onPlayPause} className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors">
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </button>
        <button onClick={() => handleSkip(30)} className="w-9 h-9 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <SkipForward className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Volume2 className="h-4 w-4 text-muted-foreground" />
        <input
          type="range"
          value={volume}
          max={1}
          step={0.1}
          onChange={handleVolumeChange}
          className="flex-1 accent-primary"
        />
      </div>
    </div>
  );
};
