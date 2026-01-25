"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";

interface HistoryItem {
  _id: string;
  type: "prompt" | "upload" | "reference";
  prompt?: string;
  title?: string;
  createdAt: string;
  thumbnails: string[];
}

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/history");
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistory();
  }, []);

  const deleteHistoryItem = async (id: string) => {
    try {
      const res = await fetch(`/api/history/${id}`, { method: "DELETE" });
      if (res.ok) {
        setHistory((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete history item:", error);
    }
  };

  const getHistoryLabel = (item: HistoryItem) => {
    if (item.title) return item.title;
    if (item.prompt) return item.prompt.slice(0, 60) + (item.prompt.length > 60 ? "..." : "");
    return item.type === "upload" ? "Image composition" : "Style transfer";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

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
          <div>
            <h1 className="text-lg font-semibold">History</h1>
            <p className="text-xs text-muted-foreground">Your generated thumbnails</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 md:p-6 max-w-4xl mx-auto pb-24 md:pb-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-1">No history yet</h3>
            <p className="text-sm text-muted-foreground">
              Generate thumbnails to see them here
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <Link
                key={item._id}
                href={`/history/${item._id}`}
                className="group block"
              >
                <div className="flex items-center gap-3 p-3 border border-border hover:bg-muted transition-colors rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                      {getHistoryLabel(item)}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground capitalize">
                        {item.type === "prompt" ? "Text to Thumbnail" : item.type === "upload" ? "Image Composer" : "Style Transfer"}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {item.thumbnails.length} thumbnail{item.thumbnails.length > 1 ? "s" : ""}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      deleteHistoryItem(item._id);
                    }}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
