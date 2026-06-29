"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MapPin, Heart, Bell, LogOut, LayoutDashboard } from "lucide-react";
import { signOut } from "next-auth/react";

export default function DashboardSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Orders", href: "/dashboard/my-orders", icon: MapPin },
    { name: "Invoice", href: "/dashboard/invoice", icon: Bell },
    { name: "Account Settings", href: "/dashboard/settings", icon: User },
  ];

  return (
    <aside className="w-full md:w-64 bg-white rounded-2xl border border-gray-100 p-4 shrink-0 h-fit space-y-1.5">
      <div className="px-3 py-2 mb-4">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">User Dashboard</p>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#4E612B]/10 text-[#4E612B]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={16} className={isActive ? "text-[#4E612B]" : "text-gray-400"} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-gray-50/80 mt-4">
        <button
          onClick={() => signOut({ callbackUrl: "/signin" })} // NextAuth SignOut মেকানিজম
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50/60 transition-all cursor-pointer"
        >
          <LogOut size={16} className="text-rose-500" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}