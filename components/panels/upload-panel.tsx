"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Loader2, ArrowRight, Upload, X, Plus } from "lucide-react";
import Image from "next/image";

interface UploadPanelProps {
  onGenerate: (thumbnails: string[]) => void;
}

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

const layoutOptions = [
  { id: "auto", label: "Auto" },
  { id: "collage", label: "Collage" },
  { id: "split", label: "Split" },
  { id: "overlay", label: "Overlay" },
];

export function UploadPanel({ onGenerate }: UploadPanelProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [title, setTitle] = useState("");
  const [selectedLayout, setSelectedLayout] = useState("auto");
  const [count, setCount] = useState(4);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const newImages: UploadedImage[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/") && images.length + newImages.length < 5) {
        newImages.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview: URL.createObjectURL(file),
        });
      }
    });

    setImages((prev) => [...prev, ...newImages]);
  }, [images.length]);

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleGenerate = async () => {
    if (images.length === 0) return;

    setIsGenerating(true);

    try {
      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "upload",
          title,
          thumbnails: Array.from({ length: count }, (_, i) => `/composed-${i + 1}.jpg`),
        }),
      });
    } catch (error) {
      console.error("Failed to save history:", error);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    onGenerate(Array.from({ length: count }, (_, i) => `/composed-${i + 1}.jpg`));
    setIsGenerating(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold">Image Composer</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Upload images to create thumbnails
        </p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
        className={`
          relative border-2 border-dashed p-5 text-center transition-colors cursor-pointer
          ${isDragging ? "border-primary bg-primary/5" : "border-input hover:border-foreground/30"}
        `}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 bg-muted flex items-center justify-center">
            <Upload className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">Drop images or click to upload</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              PNG, JPG up to 10MB • Max 5 images
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-1.5">
          {images.map((img) => (
            <div key={img.id} className="relative aspect-video bg-muted group">
              <Image src={img.preview} alt="" fill className="object-cover" />
              <button
                onClick={() => removeImage(img.id)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {images.length < 5 && (
            <label className="aspect-video border-2 border-dashed border-input hover:border-foreground/30 flex items-center justify-center cursor-pointer transition-colors">
              <input type="file" accept="image/*" multiple onChange={(e) => handleFiles(e.target.files)} className="sr-only" />
              <Plus className="w-4 h-4 text-muted-foreground" />
            </label>
          )}
        </div>
      )}

      {/* Title Input */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">
          Text Overlay
          <span className="text-muted-foreground font-normal ml-1">(optional)</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add text to your thumbnail..."
          className="w-full h-10 px-3 border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
        />
      </div>

      {/* Layout Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Layout</label>
        <div className="grid grid-cols-4 gap-1.5">
          {layoutOptions.map((layout) => (
            <button
              key={layout.id}
              onClick={() => setSelectedLayout(layout.id)}
              className={`
                h-9 border text-sm font-medium transition-colors
                ${selectedLayout === layout.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input hover:border-foreground/30"
                }
              `}
            >
              {layout.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generation Count */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Number of variations</label>
          <span className="text-sm font-semibold tabular-nums">{count}</span>
        </div>
        <Slider value={count} onChange={setCount} min={1} max={10} />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>1</span>
          <span>10</span>
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={images.length === 0 || isGenerating}
        className="w-full h-10 text-sm font-medium"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Creating {count} variations...
          </>
        ) : (
          <>
            Create {count} Thumbnails
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
}
