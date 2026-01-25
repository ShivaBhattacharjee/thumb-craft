"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useApp } from "./app-shell";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImagePlus, Layers, LogOut, Moon, Sun, PenBoxIcon, Settings, Clock } from "lucide-react";
import Image from "next/image";
import { SettingsModal } from "./settings-modal";

interface MobileNavProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const navItems = [
  { id: "prompt" as const, label: "Text", icon: PenBoxIcon },
  { id: "upload" as const, label: "Upload", icon: ImagePlus },
  { id: "reference" as const, label: "Style", icon: Layers },
];

export function MobileNav({ user }: MobileNavProps) {
  const { mode, setMode } = useApp();
  const { theme, setTheme } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden h-12 px-4 flex items-center justify-between border-b border-border bg-background">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 text-primary-foreground"
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
          <span className="text-sm font-semibold">ThumbCraft</span>
        </div>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger >
              <button className="outline-none">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                ) : (
                  <Badge variant="secondary" className="h-7 w-7 rounded-full p-0 text-xs">
                    {user.name?.charAt(0) || "U"}
                  </Badge>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setIsSettingsOpen(true)} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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
        )}
      </header>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 mx-4 mb-4 px-4 py-0 bg-background/80 backdrop-blur-lg border border-border rounded-full flex items-center justify-between z-30 shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = mode === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setMode(item.id)}
              className={`
                flex flex-col items-center gap-1 px-2.5 py-2 transition-colors
                ${isActive ? "text-foreground" : "text-muted-foreground"}
              `}
            >
              <Icon className={`w-6 h-6 ${isActive ? "stroke-[2.5]" : ""}`} />
              <span className={`text-xs ${isActive ? "font-medium" : ""}`}>
                {item.label}
              </span>
            </button>
          );
        })}
        
        {/* History Button */}
        <a
          href="/history"
          className="flex flex-col items-center gap-1 px-2.5 py-2 transition-colors text-muted-foreground"
        >
          <Clock className="w-6 h-6" />
          <span className="text-xs">History</span>
        </a>
        
        {/* Settings Button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex flex-col items-center gap-1 px-2.5 py-2 transition-colors text-muted-foreground"
        >
          <Settings className="w-6 h-6" />
          <span className="text-xs">Settings</span>
        </button>
      </nav>
    </>
  );
}
