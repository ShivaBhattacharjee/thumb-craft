"use client";

import { useApp } from "./app-shell";
import { PromptPanel } from "./panels/prompt-panel";
import { UploadPanel } from "./panels/upload-panel";
import { ReferencePanel } from "./panels/reference-panel";
import { PreviewPanel } from "./panels/preview-panel";
import { useState } from "react";

export function Workspace() {
  const { mode } = useApp();
  const [generatedThumbnails, setGeneratedThumbnails] = useState<string[]>([]);

  const handleGenerate = (thumbnails: string[]) => {
    setGeneratedThumbnails(thumbnails);
  };

  return (
    <div className="h-full flex flex-col md:flex-row pb-24 md:pb-0">
      {/* Input Panel */}
      <div className="md:w-[440px] xl:w-[480px] md:border-r border-border flex-shrink-0 overflow-y-auto">
        <div className="p-5 md:p-6">
          {mode === "prompt" && <PromptPanel onGenerate={handleGenerate} />}
          {mode === "upload" && <UploadPanel onGenerate={handleGenerate} />}
          {mode === "reference" && <ReferencePanel onGenerate={handleGenerate} />}
        </div>
      </div>

      {/* Preview Panel */}
      <div className="flex-1 overflow-y-auto bg-muted/30">
        <PreviewPanel thumbnails={generatedThumbnails} />
      </div>
    </div>
  );
}
