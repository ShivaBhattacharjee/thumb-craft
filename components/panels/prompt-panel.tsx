"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Loader2, ArrowRight } from "lucide-react";

interface PromptPanelProps {
  onGenerate: (thumbnails: string[]) => void;
}

const stylePresets = [
  { id: "vibrant", label: "Vibrant" },
  { id: "minimal", label: "Minimal" },
  { id: "bold", label: "Bold" },
  { id: "cinematic", label: "Cinematic" },
  { id: "neon", label: "Neon" },
  { id: "vintage", label: "Vintage" },
];

const promptExamples = [
  "Gaming reaction with shocked expression",
  "Clean tech review with product",
  "Cooking tutorial with food closeup",
];

export function PromptPanel({ onGenerate }: PromptPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [count, setCount] = useState(4);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    // Save to history
    try {
      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "prompt",
          prompt,
          title,
          style: selectedStyle,
          thumbnails: Array.from({ length: count }, (_, i) => `/generated-${i + 1}.jpg`),
        }),
      });
    } catch (error) {
      console.error("Failed to save history:", error);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    onGenerate(Array.from({ length: count }, (_, i) => `/generated-${i + 1}.jpg`));
    setIsGenerating(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold">Text to Thumbnail</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Describe your thumbnail and let AI create it
        </p>
      </div>

      {/* Title Input */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">
          Video Title
          <span className="text-muted-foreground font-normal ml-1">(optional)</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title for text overlay..."
          className="w-full h-10 px-3 border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
        />
      </div>

      {/* Prompt Input */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Description</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your thumbnail in detail..."
          rows={4}
          className="w-full px-3 py-2.5 border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow resize-none"
        />

        {/* Quick Examples */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {promptExamples.map((example, i) => (
            <button
              key={i}
              onClick={() => setPrompt(example)}
              className="text-xs px-2 py-1 bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Style Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Style</label>
        <div className="grid grid-cols-3 gap-1.5">
          {stylePresets.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(selectedStyle === style.id ? null : style.id)}
              className={`
                h-9 border text-sm font-medium transition-colors
                ${selectedStyle === style.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input hover:border-foreground/30"
                }
              `}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generation Count */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Number of thumbnails</label>
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
        disabled={!prompt.trim() || isGenerating}
        className="w-full h-10 text-sm font-medium"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Generating {count} thumbnails...
          </>
        ) : (
          <>
            Generate {count} Thumbnails
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>

      <p className="text-[11px] text-center text-muted-foreground">
        {count} thumbnail{count > 1 ? "s" : ""} will be generated in 1280×720
      </p>
    </div>
  );
}
