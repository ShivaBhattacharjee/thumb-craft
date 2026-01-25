"use client";

import { useState, createContext, useContext, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";

type GeneratorMode = "prompt" | "upload" | "reference";

interface AppContextType {
  mode: GeneratorMode;
  setMode: (mode: GeneratorMode) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppShell");
  return context;
}

interface AppShellProps {
  children: React.ReactNode;
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function AppShell({ children, user }: AppShellProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setModeState] = useState<GeneratorMode>(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "upload" || modeParam === "reference") return modeParam;
    return "prompt";
  });

  const setMode = (newMode: GeneratorMode) => {
    setModeState(newMode);
    router.push(`/?mode=${newMode}`, { scroll: false });
  };

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam && (modeParam === "prompt" || modeParam === "upload" || modeParam === "reference")) {
      setModeState(modeParam);
    }
  }, [searchParams]);

  return (
    <AppContext.Provider value={{ mode, setMode }}>
      <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-background">
        {/* Desktop & Tablet Sidebar */}
        <Sidebar user={user} className="hidden md:flex" />

        {/* Mobile Header */}
        <MobileNav user={user} />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </AppContext.Provider>
  );
}
