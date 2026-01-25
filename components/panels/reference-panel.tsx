"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Loader2, ArrowRight, Upload, X } from "lucide-react";
import Image from "next/image";

interface ReferencePanelProps {
  onGenerate: (thumbnails: string[]) => void;
}

const preserveOptions = [
  { id: "colors", label: "Colors" },
  { id: "layout", label: "Layout" },
  { id: "typography", label: "Typography" },
  { id: "mood", label: "Mood" },
];

export function ReferencePanel({ onGenerate }: ReferencePanelProps) {
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [modifications, setModifications] = useState("");
  const [selectedPreserve, setSelectedPreserve] = useState<string[]>(["colors", "layout"]);
  const [count, setCount] = useState(4);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.type.startsWith("image/")) {
      if (referenceImage) URL.revokeObjectURL(referenceImage);
      setReferenceImage(URL.createObjectURL(file));
    }
  }, [referenceImage]);

  const togglePreserve = (id: string) => {
    setSelectedPreserve((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (!referenceImage) return;

    setIsGenerating(true);

    try {
      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "reference",
          prompt: modifications,
          thumbnails: Array.from({ length: count }, (_, i) => `/style-${i + 1}.jpg`),
        }),
      });
    } catch (error) {
      console.error("Failed to save history:", error);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    onGenerate(Array.from({ length: count }, (_, i) => `/style-${i + 1}.jpg`));
    setIsGenerating(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold">Style Transfer</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Upload a reference and generate similar thumbnails
        </p>
      </div>

      {/* Upload Area - Same as Image Composer */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files); }}
        className={`
          relative border-2 border-dashed p-5 text-center transition-colors cursor-pointer
          ${isDragging ? "border-primary bg-primary/5" : "border-input hover:border-foreground/30"}
        `}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 bg-muted flex items-center justify-center">
            <Upload className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">Drop images or click to upload</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              PNG, JPG up to 10MB
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Image Preview */}
      {referenceImage && (
        <div className="relative aspect-video bg-muted group">
          <Image src={referenceImage} alt="Reference" fill className="object-cover" />
          <button
            onClick={() => { URL.revokeObjectURL(referenceImage); setReferenceImage(null); }}
            className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Modifications */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">
          Modifications
          <span className="text-muted-foreground font-normal ml-1">(optional)</span>
        </label>
        <textarea
          value={modifications}
          onChange={(e) => setModifications(e.target.value)}
          placeholder="What would you like to change?"
          rows={3}
          className="w-full px-3 py-2.5 border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow resize-none"
        />
      </div>

      {/* Preserve Options */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Preserve from reference</label>
        <div className="grid grid-cols-2 gap-1.5">
          {preserveOptions.map((option) => {
            const isSelected = selectedPreserve.includes(option.id);
            return (
              <button
                key={option.id}
                onClick={() => togglePreserve(option.id)}
                className={`
                  h-9 border text-sm font-medium transition-colors
                  ${isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input hover:border-foreground/30"
                  }
                `}
              >
                {option.label}
              </button>
            );
          })}
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
        disabled={!referenceImage || isGenerating}
        className="w-full h-10 text-sm font-medium"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Generating {count} variations...
          </>
        ) : (
          <>
            Generate {count} Similar
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
}
