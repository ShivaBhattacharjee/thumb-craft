"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useApp } from "./app-shell";
import Image from "next/image";
import Link from "next/link";
import {
  ImagePlus,
  Layers,
  LogOut,
  Clock,
  Trash2,
  Moon,
  Sun,
  Settings,
  PenBoxIcon,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SettingsModal } from "./settings-modal";

interface SidebarProps {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  className?: string;
}

interface HistoryItem {
  _id: string;
  type: "prompt" | "upload" | "reference";
  prompt?: string;
  title?: string;
  createdAt: string;
}

const navItems = [
  {
    id: "prompt" as const,
    label: "Text to Thumbnail",
    description: "Generate from description",
    icon: PenBoxIcon,
  },
  {
    id: "upload" as const,
    label: "Image Composer",
    description: "Create from your images",
    icon: ImagePlus,
  },
  {
    id: "reference" as const,
    label: "Style Transfer",
    description: "Match a reference style",
    icon: Layers,
  },
];

export function Sidebar({ user, className = "" }: SidebarProps) {
  const { mode, setMode } = useApp();
  const { theme, setTheme } = useTheme();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
        setIsLoadingHistory(false);
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
    if (item.prompt) return item.prompt.slice(0, 40) + (item.prompt.length > 40 ? "..." : "");
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
    <aside className={`w-64 h-full bg-sidebar border-r border-sidebar-border flex flex-col ${className}`}>
      {/* Header */}
      <div className="h-14 px-4 flex items-center border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="0" ry="0" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-tight">ThumbCraft</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-0.5">
          <div className="px-2 py-2">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Create
            </span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = mode === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setMode(item.id)}
                className={`
                  w-full flex items-start gap-2.5 px-2 py-2 text-left transition-colors
                  ${isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-sidebar-accent text-sidebar-foreground"
                  }
                `}
              >
                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isActive ? "" : "text-muted-foreground"}`} />
                <div className="min-w-0">
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className={`text-[11px] ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* History */}
        <div className="p-3 border-t border-sidebar-border">
          <div className="px-2 py-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              History
            </span>
          </div>

          <div className="space-y-0.5">
            {isLoadingHistory ? (
              <div className="px-2 py-3">
                <div className="h-3 w-3/4 bg-muted animate-pulse" />
              </div>
            ) : history.length === 0 ? (
              <div className="px-2 py-3 text-xs text-muted-foreground">
                No history yet
              </div>
            ) : (
              <>
                {history.slice(0, 10).map((item) => (
                  <Link
                    key={item._id}
                    href={`/history/${item._id}`}
                    className="group flex items-center gap-2 px-2 py-1.5 hover:bg-sidebar-accent transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-xs truncate">{getHistoryLabel(item)}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteHistoryItem(item._id);
                      }}
                      className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </Link>
                ))}
                
                {/* View More Button */}
                {history.length > 0 && (
                  <Link
                    href="/history"
                    className="flex items-center gap-2 px-2 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors mt-1"
                  >
                    <span>View more</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Settings Section */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="w-full flex items-center gap-2.5 px-2 py-2 text-left hover:bg-sidebar-accent transition-colors rounded-md"
        >
          <Settings className="w-4 h-4 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium">Settings</div>
            <div className="text-[11px] text-muted-foreground">Manage API keys</div>
          </div>
        </button>
      </div>

      {/* User */}
      {user && (
        <div className="p-3 border-t border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger >
              <button className="flex items-center gap-2.5 px-2 w-full hover:bg-sidebar-accent transition-colors rounded-md py-1.5 outline-none">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={28}
                    height={28}
                    className="flex-shrink-0 rounded-full"
                  />
                ) : (
                  <Badge variant="secondary" className="h-7 w-7 rounded-full p-0 text-xs flex-shrink-0">
                    {user.name?.charAt(0) || "U"}
                  </Badge>
                )}
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-sm font-medium truncate">{user.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{user.email}</div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="cursor-pointer">
                {theme === "dark" ? (
                  <>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark Mode</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </aside>
  );
}
