import React, { useContext } from "react"
import { ArrowLeft, Menu } from 'lucide-react'
import { ThemeContext } from "@/middleware/ThemeContext"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function InboxComponentSkeleton() {
  const { isDarkMode } = useContext(ThemeContext)

  return (
    (<div
      className={`flex flex-col min-h-screen ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
      <main className="flex-1">
        <section className="w-full flex justify-center items-center py-6 md:py-7 lg:py-7">
          <div className="container px-4 md:px-6">
            <Card
              className={`mx-auto max-w-4xl ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
              <CardHeader className="flex flex-row items-center justify-between p-4">
                <Button variant="ghost" disabled>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <CardTitle className="md:hidden"><Skeleton className="h-6 w-24" /></CardTitle>
                <Button variant="ghost" className="md:hidden" disabled>
                  <Menu className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div
                  className="flex flex-col md:flex-row h-[calc(100vh-200px)] md:h-[600px] overflow-hidden">
                  {/* User list sidebar skeleton */}
                  <div
                    className={`w-full md:w-1/3 border-r ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <ScrollArea className="h-full">
                      {[...Array(5)].map((_, index) => (
                        <div key={index} className="flex items-center space-x-4 px-4 py-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      ))}
                    </ScrollArea>
                  </div>

                  {/* Message area skeleton */}
                  <div className="flex-1 flex flex-col">
                    {/* Chat header skeleton */}
                    <div
                      className={`px-4 py-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"} hidden md:block`}>
                      <Skeleton className="h-6 w-1/3" />
                    </div>

                    {/* Messages skeleton */}
                    <ScrollArea className="flex-1 p-4">
                      {[...Array(4)].map((_, index) => (
                        <div
                          key={index}
                          className={`flex mb-4 ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
                          <Skeleton className={`h-16 ${index % 2 === 0 ? "w-2/3" : "w-1/2"} rounded-lg`} />
                        </div>
                      ))}
                    </ScrollArea>

                    {/* Message input skeleton */}
                    <CardFooter
                      className={`border-t p-2 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                      <div className="flex w-full space-x-2">
                        <Skeleton className="h-10 flex-grow" />
                        <Skeleton className="h-10 w-10" />
                      </div>
                    </CardFooter>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>)
  );
}