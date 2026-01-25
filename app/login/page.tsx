import { signIn } from "@/auth";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Image with Quote */}
      <div className="hidden  max-h-[100vh] lg:flex lg:w-1/2 xl:w-2/5 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1724007889211-812f38bdf786?q=80&w=1272&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Minimalist stairs with plant"  
          className="object-cover "

          height={1000}
          width={1000}
        />
        
        {/* Quote at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black/60 to-transparent">
          <blockquote className="text-white">
            <p className="text-lg md:text-xl font-medium mb-2">
              &quot;Create thumbnails that capture attention and drive clicks.&quot;
            </p>
            <footer className="text-sm text-white/70">
              — ThumbCraft
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right side - Login */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-10">
            <div className="w-8 h-8 bg-primary flex items-center justify-center">
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
            <span className="text-base font-semibold">ThumbCraft</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to continue to ThumbCraft
            </p>
          </div>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full h-11 px-4 border border-input bg-background text-sm font-medium flex items-center justify-center gap-3 hover:bg-muted transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </form>

          <p className="text-[11px] text-center text-muted-foreground mt-6">
            By continuing, you agree to our{" "}
            <a href="#" className="underline hover:text-foreground">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-foreground">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
