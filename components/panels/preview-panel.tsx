"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Check, RotateCcw, Maximize2, X } from "lucide-react";

interface PreviewPanelProps {
  thumbnails: string[];
}

export function PreviewPanel({ thumbnails }: PreviewPanelProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  // Empty state
  if (thumbnails.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center max-w-xs">
          <div className="w-14 h-14 bg-muted flex items-center justify-center mx-auto mb-3">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="0" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
          <h3 className="text-sm font-medium mb-1">No thumbnails yet</h3>
          <p className="text-xs text-muted-foreground">
            Configure your settings and generate your first thumbnail
          </p>
        </div>
      </div>
    );
  }

  const handleDownload = (index: number) => {
    console.log("Downloading thumbnail", index);
  };

  return (
    <>
      <div className="h-full flex flex-col p-5 lg:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold">Generated Thumbnails</h2>
            <p className="text-xs text-muted-foreground">
              {thumbnails.length} variations • 1280×720
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
            <RotateCcw className="w-3 h-3" />
            Regenerate
          </Button>
        </div>

        {/* Main Preview */}
        <div
          onClick={() => setFullscreen(true)}
          className="relative aspect-video bg-muted cursor-pointer group flex-shrink-0"
        >
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-background">
            <div className="text-center">
              <div className="text-4xl font-bold text-muted-foreground/30 mb-1">
                {selectedIndex + 1}
              </div>
              <p className="text-xs text-muted-foreground">Preview</p>
            </div>
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="w-10 h-10 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Thumbnails Grid */}
        <div className="grid grid-cols-4 gap-2 mt-3">
          {thumbnails.map((_, index) => {
            const isSelected = selectedIndex === index;
            return (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`
                  relative aspect-video bg-muted transition-all
                  ${isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "hover:opacity-80"}
                `}
              >
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-background">
                  <span className="text-sm font-semibold text-muted-foreground/40">
                    {index + 1}
                  </span>
                </div>
                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-primary flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-primary-foreground" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-5">
          <Button onClick={() => handleDownload(selectedIndex)} className="flex-1 h-9 text-sm">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Download
          </Button>
          <Button
            variant="outline"
            onClick={() => thumbnails.forEach((_, i) => handleDownload(i))}
            className="flex-1 h-9 text-sm"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Download All
          </Button>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setFullscreen(false)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={() => setFullscreen(false)}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative w-full max-w-5xl aspect-video">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
              <div className="text-center">
                <div className="text-6xl font-bold text-white/20 mb-2">
                  {selectedIndex + 1}
                </div>
                <p className="text-white/50 text-sm">1280 × 720</p>
              </div>
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {thumbnails.map((_, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); setSelectedIndex(index); }}
                className={`
                  w-16 aspect-video bg-white/10 transition-all
                  ${selectedIndex === index ? "ring-2 ring-white" : "opacity-60 hover:opacity-100"}
                `}
              >
                <div className="w-full h-full flex items-center justify-center text-white/50 text-xs font-medium">
                  {index + 1}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
