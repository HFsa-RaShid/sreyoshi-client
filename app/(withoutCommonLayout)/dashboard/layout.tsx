import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import { SessionProvider } from "next-auth/react";

import React from "react";


export const metadata = {
  title: "User Dashboard | Khati Bazar",
  description: "Manage your consumer dashboard operations natively",
};

export default function MainDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      {/* Top Header */}
      <DashboardHeader />

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row gap-6 flex-1">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Dynamic Content */}
        <main className="flex-1 w-full h-full">
           <SessionProvider> 
          {children}
             </SessionProvider> 
        </main>
      </div>
    </div>
  );
}