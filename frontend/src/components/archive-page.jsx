'use client'

import React, { useState, useEffect, useContext } from 'react'
import { useQuery } from '@apollo/client'
import { format } from 'date-fns'
import { ThemeContext } from '@/middleware/ThemeContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import { GET_ARCHIVED_POSTS } from '@/graphql/queries/archivedPostsQuery'

export function ArchivePageJsx() {
  const { isDarkMode } = useContext(ThemeContext)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { loading, error, data } = useQuery(GET_ARCHIVED_POSTS)
  const [organizedPosts, setOrganizedPosts] = useState({})

  useEffect(() => {
    if (data && data.archivedPosts) {
      const posts = data.archivedPosts.filter(post => 
        selectedCategory === 'all' || post.category === selectedCategory)
      const organized = posts.reduce((acc, post) => {
        const date = new Date(post.createdAt)
        const year = date.getFullYear()
        const month = date.getMonth()
        if (!acc[year]) acc[year] = {}
        if (!acc[year][month]) acc[year][month] = []
        acc[year][month].push(post)
        return acc
      }, {})
      setOrganizedPosts(organized)
    }
  }, [data, selectedCategory])

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error) return <div className="text-center text-red-500">Error loading archived posts: {error.message}</div>;

  const categories = ['all', ...new Set(data.archivedPosts.map(post => post.category))]

  return (
    (<div
      className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <Card
          className={`max-w-4xl mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Post Archive</CardTitle>
            <CardDescription className="text-center mt-2">
              Browse through our collection of past posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Select onValueChange={setSelectedCategory} defaultValue={selectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {Object.keys(organizedPosts).sort((a, b) => b - a).map(year => (
              <Accordion type="single" collapsible className="mb-4" key={year}>
                <AccordionItem value={year}>
                  <AccordionTrigger className="text-xl font-semibold">{year}</AccordionTrigger>
                  <AccordionContent>
                    {Object.keys(organizedPosts[year]).sort((a, b) => b - a).map(month => (
                      <div key={`${year}-${month}`} className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">
                          {format(new Date(year, month), 'MMMM')}
                        </h3>
                        <ul className="space-y-2">
                          {organizedPosts[year][month].map(post => (
                            <li key={post.id} className="flex justify-between items-center">
                              <span>{post.title}</span>
                              <Button variant="outline" size="sm" asChild>
                                <a href={`/post/${post.id}`}>Read</a>
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>)
  );
}