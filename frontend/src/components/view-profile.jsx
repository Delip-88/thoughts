'use client'

import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ArrowLeft, Mail, MapPin, Calendar, Edit } from 'lucide-react'
import { useQuery } from '@apollo/client'
import ABOUT_ME from '@/graphql/query/aboutMeGql'
import { AuthContext } from '@/middleware/AuthContext'

// Button component remains unchanged
const Button = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background'
  const variantStyles = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    link: 'underline-offset-4 hover:underline text-primary',
  }
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className} px-4 py-2`}
      {...props}>
      {children}
    </button>
  )
}

export function ViewProfile() {
  const [posts, setPosts] = useState([])
  const { user } = useContext(AuthContext)

  const { data, error, loading } = useQuery(ABOUT_ME, {
    variables: {
      id: user._id
    },
  })

  useEffect(() => {
    if (data?.user?.posts) {
      setPosts(data.user.posts)
    }
  }, [data])

  // Improved loading and error states
  if (loading) return <div className="text-center mt-10">Loading profile...</div>
  if (error) return <div className="text-center mt-10 text-red-500">Error: {error.message}</div>

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <NavLink className="flex items-center justify-center" to="/Home">
          <ArrowLeft className="h-6 w-6 mr-2" />
          <span className="text-lg font-semibold">Back to Home</span>
        </NavLink>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              {/* User Profile Section */}
              <div className="md:w-1/3">
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex flex-col items-center">
                    <img
                      src={user.avatar || 'default-avatar-url'}
                      alt={user.username || 'User Avatar'}
                      className="w-32 h-32 bg-gray-300 rounded-full mb-4"
                    />
                    <h1 className="text-2xl font-bold">{user.username}</h1>
                    <p className="text-gray-600">@{user.username}</p>
                    <div className="mt-6 flex flex-wrap gap-4 justify-center">
                      <Button variant="outline">
                        <Mail className="mr-2 h-4 w-4" />
                        Message
                      </Button>
                      <Button>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Mail className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-600">{user.email}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <MapPin className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-600">{user.location || 'Unknown location'}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-600">Joined {new Date(parseInt(user.createdAt)).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Posts Section */}
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
                <div className="space-y-6">
                  {posts.length > 0 ? posts.map((post) => (
                    <div key={post._id} className="bg-white shadow rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                      <p className="text-gray-600 mb-4">{post.content}</p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{new Date(parseInt(post.createdAt)).toLocaleDateString()}</span>
                        <div>
                          <span className="mr-4">{post.likes?.length} {console.log(post.likes)}Likes</span>
                          {/* <span>{post.comments.length} Comments</span> */}
                        </div>
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-600">No posts available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
