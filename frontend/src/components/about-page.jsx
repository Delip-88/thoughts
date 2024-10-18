'use client'

import React from 'react'
import { useContext } from 'react'
import { ThemeContext } from '@/middleware/ThemeContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, Twitter, Linkedin } from 'lucide-react'

export function AboutPageJsx() {
  const { isDarkMode } = useContext(ThemeContext)

  return (
    (<div
      className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <Card
          className={`max-w-4xl mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">About Our Project</CardTitle>
            <CardDescription className="text-center mt-2">
              Connecting people through shared stories and experiences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
              <p>
                Our project aims to create a vibrant community where users can share their thoughts, 
                experiences, and stories. We believe in the power of connection and the impact of 
                shared narratives in bringing people together.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Key Features</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>User-friendly post creation and sharing</li>
                <li>Personalized user profiles</li>
                <li>Interactive commenting and liking system</li>
                <li>Direct messaging between users</li>
                <li>Customizable themes and accessibility options</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Our Team</h2>
              <p>
                We are a diverse group of passionate developers, designers, and content creators 
                committed to building a platform that fosters meaningful connections and 
                encourages the sharing of unique perspectives.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Get Involved</h2>
              <p className="mb-4">
                We're always looking for ways to improve and expand our community. Whether you're 
                a user with feedback, a developer interested in contributing, or a potential 
                partner, we'd love to hear from you!
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button>
                  <Github className="mr-2 h-4 w-4" />
                  Contribute on GitHub
                </Button>
                <Button variant="outline">
                  <Twitter className="mr-2 h-4 w-4" />
                  Follow us on Twitter
                </Button>
                <Button variant="outline">
                  <Linkedin className="mr-2 h-4 w-4" />
                  Connect on LinkedIn
                </Button>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>)
  );
}