"use client";

import { useEffect, useState } from "react";
import { X, Download, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryItem {
  _id: string;
  type: "prompt" | "upload" | "reference";
  prompt?: string;
  title?: string;
  thumbnails: string[];
  createdAt: string;
}

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GalleryModal({ isOpen, onClose }: GalleryModalProps) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [selectedThumbIndex, setSelectedThumbIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      fetchGallery();
    }
  }, [isOpen]);

  const fetchGallery = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/history");
      if (res.ok) {
        const data = await res.json();
        setItems(data.filter((item: GalleryItem) => item.thumbnails?.length > 0));
      }
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/history/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item._id !== id));
        if (selectedItem?._id === id) {
          setSelectedItem(null);
        }
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getLabel = (item: GalleryItem) => {
    if (item.title) return item.title;
    if (item.prompt) return item.prompt.slice(0, 50) + (item.prompt.length > 50 ? "..." : "");
    return item.type === "upload" ? "Image composition" : "Style transfer";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <header className="h-12 px-4 flex items-center justify-between border-b border-border flex-shrink-0">
        <h2 className="text-sm font-semibold">Gallery</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </header>

      <div className="flex-1 overflow-hidden flex">
        {/* Thumbnail Detail View */}
        {selectedItem ? (
          <div className="flex-1 flex flex-col">
            {/* Back button */}
            <div className="p-3 border-b border-border">
              <button
                onClick={() => setSelectedItem(null)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to gallery
              </button>
            </div>

            {/* Main preview */}
            <div className="flex-1 p-4 flex flex-col">
              <div className="flex-1 relative bg-muted mb-3">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-muted-foreground/30 mb-1">
                      {selectedThumbIndex + 1}
                    </div>
                    <p className="text-xs text-muted-foreground">1280×720</p>
                  </div>
                </div>

                {/* Navigation arrows */}
                {selectedItem.thumbnails.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedThumbIndex((i) => (i > 0 ? i - 1 : selectedItem.thumbnails.length - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedThumbIndex((i) => (i < selectedItem.thumbnails.length - 1 ? i + 1 : 0))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              <div className="flex gap-1.5 overflow-x-auto pb-2">
                {selectedItem.thumbnails.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedThumbIndex(index)}
                    className={`
                      w-16 aspect-video flex-shrink-0 bg-muted flex items-center justify-center
                      ${selectedThumbIndex === index ? "ring-2 ring-primary" : "opacity-60 hover:opacity-100"}
                    `}
                  >
                    <span className="text-xs text-muted-foreground">{index + 1}</span>
                  </button>
                ))}
              </div>

              {/* Info */}
              <div className="mt-3 space-y-2">
                <p className="text-sm font-medium">{getLabel(selectedItem)}</p>
                <p className="text-xs text-muted-foreground">{formatDate(selectedItem.createdAt)}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedItem.thumbnails.length} thumbnail{selectedItem.thumbnails.length > 1 ? "s" : ""}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Button className="flex-1 h-9 text-sm">
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={() => deleteItem(selectedItem._id)}
                  className="h-9 text-sm text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Gallery Grid */
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-video bg-muted animate-pulse" />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-muted flex items-center justify-center mx-auto mb-3">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="0" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">No thumbnails yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Generated thumbnails will appear here
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {items.map((item) => (
                  <button
                    key={item._id}
                    onClick={() => { setSelectedItem(item); setSelectedThumbIndex(0); }}
                    className="group text-left"
                  >
                    <div className="aspect-video bg-muted relative mb-1.5">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-muted-foreground/30">
                          {item.thumbnails.length}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      {item.thumbnails.length > 1 && (
                        <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-black/60 text-white text-[10px]">
                          {item.thumbnails.length}
                        </div>
                      )}
                    </div>
                    <p className="text-xs truncate">{getLabel(item)}</p>
                    <p className="text-[10px] text-muted-foreground">{formatDate(item.createdAt)}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
