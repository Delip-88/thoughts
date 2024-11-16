"use client";

import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { User, MessageSquare, MapPin, Calendar, Heart, X } from "lucide-react";
import { format } from "date-fns";
import { AuthContext } from "@/middleware/AuthContext";
import { ThemeContext } from "@/middleware/ThemeContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";
import { GET_USER_PROFILE } from "@/graphql/query/userProfileGql";

export function UserProfilePageComponent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const { loading, error, data } = useQuery(GET_USER_PROFILE, {
    variables: { id },
    fetchPolicy: "network-only",
  });

  const handleSendMessage = async () => {
    navigate(`/${user.username}/${user._id}?username=${user.username}&userId=${user._id}&pfp=${user.image.secure_url}`)
  };

  if (loading) return <ProfileSkeleton />;
  if (error) return <div>Error loading profile: {error.message}</div>;
  if (!data || !data.user) return <div>User not found</div>;

  const { user } = data;

  return (
    <div
      className={`min-h-screen w-full ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        <Card
          className={`w-full ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar 
              className="w-24 h-24 cursor-pointer transition-transform hover:scale-105"
              onClick={() => setIsImageExpanded(true)}
            >
              <AvatarImage src={user.image?.secure_url} alt={user.username} />
              <AvatarFallback>
                {user.username ? user.username[0].toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left flex-grow">
              <CardTitle className="text-2xl font-bold">
                {user.username}
              </CardTitle>
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
                {user.createdAt
                  ? (() => {
                      const createdAtTimestamp = parseInt(user.createdAt, 10);
                      const createdAtDate = new Date(createdAtTimestamp);
                      return isNaN(createdAtDate.getTime())
                        ? "Join date unavailable"
                        : `Joined ${format(createdAtDate, "MMMM yyyy")}`;
                    })()
                  : "Join date unavailable"}
              </CardDescription>
            </div>
            {currentUser && currentUser._id !== user._id && (
              <Button
                className="mt-4 sm:mt-0 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                onClick={handleSendMessage}
              >
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
                  <Card
                    key={post._id}
                    className={`${isDarkMode ? "bg-gray-700" : "bg-gray-50"} relative`}
                  >
                    <CardHeader>
                      <CardTitle>{post.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Calendar className="mr-2 h-4 w-4" />
                        {post.createdAt
                          ? format(new Date(parseInt(post.createdAt, 10)), "PPP")
                          : "Date unavailable"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-3">{post.content}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        className="transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md"
                        onClick={() => navigate(`/post/${post._id}`)}
                      >
                        Read More
                      </Button>
                      <div className="flex items-center">
                        <Heart className="h-5 w-5 text-red-500 mr-1 hover:fill-red-500 cursor-pointer" />
                        <span>{post.likes?.length || 0}</span>
                      </div>
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

      {isImageExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsImageExpanded(false)}
        >
          <div 
            className={`relative max-w-3xl max-h-3xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg`}
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              className="absolute top-2 right-2 rounded-full p-2"
              onClick={() => setIsImageExpanded(false)}
              variant="ghost"
            >
              <X className="h-6 w-6" />
            </Button>
            <img 
              src={user.image?.secure_url} 
              alt={user.username} 
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="space-y-2 flex-grow">
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
                <CardFooter className="flex justify-between">
                  <Skeleton className="h-10 w-28" />
                  <Skeleton className="h-5 w-10" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}