'use client'

import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"

export function HomePageSkeleton() {
  return (
    (<div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-15 lg:py-25 transition-all ease-linear">
          <div className="container px-4 md:px-6 mx-auto max-w-3xl">
            <div className="space-y-10">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-start gap-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <div className="w-full">
                    <div className="flex items-center">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="ml-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16 mt-1" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-3/4 mt-4" />
                    <Skeleton className="w-full h-48 rounded-lg my-4" />
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Skeleton className="h-6 w-16 rounded-md" />
                      <Skeleton className="h-6 w-16 rounded-md" />
                      <Skeleton className="h-6 w-16 rounded-md" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full mt-2" />
                    <Skeleton className="h-4 w-2/3 mt-2" />
                    <div className="flex justify-between items-center mt-4">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>)
  );
}