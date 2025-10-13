import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
import { DashboardNavbar } from "@/modules/dashboard/ui/components/dashboard-navbar";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <SidebarProvider>
            <DashboardSidebar />
            <main className="flex h-screen w-screen flex-col bg-muted">
                <DashboardNavbar />
                {children}
            </main>
        </SidebarProvider>
    );
};

export default Layout;
