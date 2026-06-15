'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export default function QueryProvider({ children }: { children: ReactNode }) {
  // useState ব্যবহার করা হয়েছে যাতে নেক্সটজেএস-এর রেন্ডারিংয়ের সময় প্রতি রিকোয়েস্টে নতুন ক্লায়েন্ট তৈরি না হয়
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // ব্রাউজারের অন্য ট্যাবে গিয়ে আবার এই ট্যাবে ফিরলে বারবার এপিআই কল হওয়া বন্ধ রাখবে
        staleTime: 1000 * 60 * 5,    // ৫ মিনিট পর্যন্ত ডাটাকে ফ্রেশ রাখবে (বারবার রিলোড হবে না)
        retry: 1,                    // এপিআই ফেইল করলে সর্বোচ্চ ১ বার অটো-ট্রাই করবে
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}