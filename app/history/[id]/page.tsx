"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Download } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface HistoryItem {
  _id: string;
  type: "prompt" | "upload" | "reference";
  prompt?: string;
  title?: string;
  createdAt: string;
  thumbnails: string[];
}

export default function HistoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [historyItem, setHistoryItem] = useState<HistoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHistoryItem() {
      try {
        const res = await fetch("/api/history");
        if (res.ok) {
          const data = await res.json();
          const item = data.find((h: HistoryItem) => h._id === resolvedParams.id);
          setHistoryItem(item || null);
        }
      } catch (error) {
        console.error("Failed to fetch history item:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistoryItem();
  }, [resolvedParams.id]);

  const handleDownload = (url: string, index: number) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `thumbnail-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!historyItem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium mb-2">Item not found</h2>
          <Button onClick={() => router.push("/history")}>Back to History</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-14 px-4 md:px-6 flex items-center border-b border-border bg-background sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-medium truncate">
              {historyItem.title || historyItem.prompt || "Thumbnail Generation"}
            </h1>
            <p className="text-xs text-muted-foreground capitalize">
              {historyItem.type === "prompt" ? "Text to Thumbnail" : historyItem.type === "upload" ? "Image Composer" : "Style Transfer"}
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 md:p-6 max-w-6xl mx-auto pb-24 md:pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {historyItem.thumbnails.map((thumbnail, index) => (
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
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <button
                  onClick={() => handleDownload(thumbnail, index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10 bg-white text-black rounded-full flex items-center justify-center"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
