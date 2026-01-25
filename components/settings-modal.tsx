"use client";

import { useState, useEffect } from "react";
import { X, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [geminiKey, setGeminiKey] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const savedKey = localStorage.getItem("gemini_api_key");
      if (savedKey) {
        setGeminiKey(savedKey);
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    if (geminiKey.trim()) {
      localStorage.setItem("gemini_api_key", geminiKey.trim());
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 1500);
    }
  };

  const handleClear = () => {
    localStorage.removeItem("gemini_api_key");
    setGeminiKey("");
    setIsSaved(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-lg w-full max-w-md shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-1">Bring Your Own Key (BYOK)</h3>
            <p className="text-xs text-muted-foreground">
              Enter your own Gemini API key. If not provided, the default key will be used.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="gemini-key" className="text-sm font-medium">
              Gemini API Key
            </label>
            <Input
              id="gemini-key"
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Get your API key from{" "}
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>

          {isSaved && (
            <div className="text-sm text-green-600 dark:text-green-400">
              ✓ API key saved successfully!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-border">
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={!geminiKey}
            className="h-9"
          >
            Clear
          </Button>
          <Button onClick={handleSave} disabled={!geminiKey.trim()} className="h-9">
            Save Key
          </Button>
        </div>
      </div>
    </div>
  );
}
