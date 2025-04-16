
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from "./ui/skeleton";
import UserProfileMenu from "./auth/UserProfileMenu";
import AuthModal from "@/components/auth/AuthModal";
import { useThemeMode } from "@/hooks/use-theme-mode";




export const Navbar = () => {
  const isMobile = useIsMobile();
  const { user, logout, isAuthenticated, isLoading, login, signup } = useAuth();
  const { theme, toggleTheme } = useThemeMode();

  const [authOpen, setAuthOpen] = React.useState(false);
  const [authType, setAuthType] = React.useState<"login" | "signup">("login");

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);


  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        {isMobile && <SidebarTrigger className="mr-2" />}
        <div className="flex flex-1 items-center justify-between">
          <div>
            {!isMobile && <h2 className="text-lg font-semibold">Dashboard</h2>}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
   
            <div className="flex items-center">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          ) : isAuthenticated ? (
            <UserProfileMenu user={user} onLogout={logout} />
          ) : (
            <div className="flex gap-2">
              <Button variant="outline"
                onClick={() => {
                  setAuthOpen(true);
                  setAuthType("login");
                }}
              >
                Log In
              </Button>
              <Button
                onClick={() => {
                  setAuthOpen(true);
                  setAuthType("signup");
                }}
              >
                Sign Up
              </Button>
            </div>
          )}
          </div>
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultTab={authType}
        onLogin={login}
        onSignup={signup}
      />
    </header>
  );
};
