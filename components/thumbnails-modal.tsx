"use client";

import { X, Download } from "lucide-react";
import Image from "next/image";

interface ThumbnailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  thumbnails: string[];
}

export function ThumbnailsModal({ isOpen, onClose, thumbnails }: ThumbnailsModalProps) {
  if (!isOpen) return null;

  const handleDownload = (url: string, index: number) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `thumbnail-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="md:hidden fixed inset-0 bg-black/90 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/20">
        <h2 className="text-lg font-semibold text-white">Generated Thumbnails</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors rounded text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2x2 Grid */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
          {thumbnails.map((thumbnail, index) => (
            <div
              key={index}
              className="group relative aspect-video bg-muted rounded-lg overflow-hidden border border-border"
            >
              <Image
                src={thumbnail}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-active:bg-black/40 transition-colors flex items-center justify-center">
                <button
                  onClick={() => handleDownload(thumbnail, index)}
                  className="opacity-0 group-active:opacity-100 transition-opacity w-12 h-12 bg-white text-black rounded-full flex items-center justify-center"
                >
                  <Download className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
