import type { Metadata } from "next";
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";

export default function DashBoardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
         <div>
        
            <TooltipProvider>
                <SidebarProvider
                    style={
                        {
                            "--sidebar-width": "calc(var(--spacing) * 72)",
                            "--header-height": "calc(var(--spacing) * 12)",
                        } as React.CSSProperties
                    }
                >
                    <AppSidebar variant="inset" />
                    <SidebarInset>
                        <SiteHeader />
                        <div className="flex flex-1 flex-col">
                            <div className="@container/main flex flex-1 flex-col ap-4 py-4 md:gap-6 px-4 lg:px-6">
                            <NuqsAdapter>
                                <Toaster richColors position="top-right" />
                                {children}
                            </NuqsAdapter>
                            </div>
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            </TooltipProvider>
        </div>
    );
}
