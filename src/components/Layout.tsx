import React, { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, Link2, QrCode, Settings } from "lucide-react";
import { useThemeMode } from "@/hooks/use-theme-mode";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();
  const location = useLocation();
    const { theme } = useThemeMode();

  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="w-64">
          <SidebarContent>
            <div className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 flex items-center justify-center">
                  {theme === 'dark' ? (
                    <img src="/logo-dark.png" alt="Dark Logo" className="h-6" />
                  ) : (
                    <img src="/logo-light.png" alt="Light Logo" className="h-6" />
                  )}
                </div>
              </div>
            </div>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className={isActive('/') ? 'bg-sidebar-accent' : ''}>
                      <Link to="/" className="flex items-center space-x-2">
                        <Link2 className="h-5 w-5" />
                        <span>Links</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className={isActive('/analytics') ? 'bg-sidebar-accent' : ''}>
                      <Link to="/analytics" className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5" />
                        <span>Analytics</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className={isActive('/qr') ? 'bg-sidebar-accent' : ''}>
                      <Link to="/qr" className="flex items-center space-x-2">
                        <QrCode className="h-5 w-5" />
                        <span>QR Codes</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className={isActive('/settings') ? 'bg-sidebar-accent' : ''}>
                      <Link to="/settings" className="flex items-center space-x-2">
                        <Settings className="h-5 w-5" />
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
