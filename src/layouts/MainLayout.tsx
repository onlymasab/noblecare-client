"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useAuthStore } from "@/store/authStore";



export default function Page() {
    const { isAuthenticated, user } = useAuthStore();

    
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        {isAuthenticated ? "yes" : "no"}
{user.email}
      </SidebarInset>
    </SidebarProvider>
  )
}
