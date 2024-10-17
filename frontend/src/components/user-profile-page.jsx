'use client'

import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { User, MessageSquare, MapPin, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { AuthContext } from '@/middleware/AuthContext'
import { ThemeContext } from '@/middleware/ThemeContext'
import { GET_USER_PROFILE } from '@/graphql/query/userProfileQuery'
import { SEND_MESSAGE } from '@/graphql/mutations/sendMessageMutation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from 'react-toastify'

export function UserProfilePageComponent() {
  const { username } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useContext(AuthContext)
  const { isDarkMode } = useContext(ThemeContext)
  const [sendMessage] = useMutation(SEND_MESSAGE)

  const { loading, error, data } = useQuery(GET_USER_PROFILE, {
    variables: { username },
    fetchPolicy: 'network-only'
  })

  const handleSendMessage = async () => {
    try {
      const { data } = await sendMessage({
        variables: { recipientId: data.user._id, content: "Hi, I'd like to connect!" }
      })
      if (data.sendMessage.success) {
        toast.success("Message sent successfully!")
        navigate('/messages')
      }
    } catch (err) {
      toast.error("Failed to send message. Please try again.")
    }
  }

  if (loading) return <ProfileSkeleton />;
  if (error) return <div>Error loading profile: {error.message}</div>;
  if (!data || !data.user) return <div>User not found</div>;

  const { user } = data

  return (
    (<div
      className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <Card
          className={`max-w-4xl mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.image?.secure_url} alt={user.username} />
              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <CardTitle className="text-2xl font-bold">{user.username}</CardTitle>
              <CardDescription className="flex items-center justify-center sm:justify-start mt-2">
                <User className="mr-2 h-4 w-4" />
                {user.name}
              </CardDescription>
              {user.address && (
                <CardDescription className="flex items-center justify-center sm:justify-start mt-1">
                  <MapPin className="mr-2 h-4 w-4" />
                  {user.address}
                </CardDescription>
              )}
              <CardDescription className="flex items-center justify-center sm:justify-start mt-1">
                <Calendar className="mr-2 h-4 w-4" />
                Joined {format(new Date(user.createdAt), 'MMMM yyyy')}
              </CardDescription>
            </div>
            {currentUser && currentUser._id !== user._id && (
              <Button className="mt-4 sm:mt-0 sm:ml-auto" onClick={handleSendMessage}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Posts</h2>
            {user.posts && user.posts.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {user.posts.map((post) => (
                  <Card key={post._id} className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <CardHeader>
                      <CardTitle>{post.title}</CardTitle>
                      <CardDescription>{format(new Date(post.createdAt), 'PPP')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-3">{post.content}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" onClick={() => navigate(`/post/${post._id}`)}>
                        Read More
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <p>No posts yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>)
  );
}

function ProfileSkeleton() {
  return (
    (<div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-60" />
            <Skeleton className="h-4 w-40" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-28" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>)
  );
}