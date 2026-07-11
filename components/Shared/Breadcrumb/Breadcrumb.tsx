"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// 🎯 ১. এখানে link প্রপার্টিটিকে অপশনাল (?) করা হয়েছে
interface BreadcrumbItem {
  name: string;
  link?: string; 
}

interface BreadcrumbProps {
  customItems?: BreadcrumbItem[];
}

export default function Breadcrumb({ customItems }: BreadcrumbProps) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((item) => item);

  // 🎯 ২. টাইপ ডিফাইন করে দেওয়া হলো (BreadcrumbItem[])
  const breadcrumbs: BreadcrumbItem[] = customItems || [
    { name: "Home", link: "/" },
    ...pathSegments.map((segment, index) => {
      const link = "/" + pathSegments.slice(0, index + 1).join("/");
      const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
      return { name, link: index === pathSegments.length - 1 ? undefined : link };
    }),
  ];

  return (
    <nav className="flex items-center gap-2 text-xs md:text-sm font-medium font-sans mb-6 text-[#5A655D]">
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && <span className="text-gray-400 select-none">/</span>}
            {isLast ? (
              <span className="text-[#FF3F6C] font-bold capitalize">{item.name}</span>
            ) : item.link ? (
              <Link
                href={item.link}
                className="hover:text-[#1A2E22] transition-colors hover:underline capitalize"
              >
                {item.name}
              </Link>
            ) : (
              <span className="capitalize">{item.name}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}