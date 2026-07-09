import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
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
      <DashboardHeader />

      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row gap-6 flex-1">
        <DashboardSidebar />

        <main className="flex-1 w-full h-full">
          {children} {/* 👈 এখানে কোন SessionProvider থাকবে না, একদম ক্লিন */}
        </main>
      </div>
    </div>
  );
}