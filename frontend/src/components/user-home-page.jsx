"use client";

import React, { useContext, useEffect, useState } from "react";
import { Bell, PenTool, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import ME_QUERY from "@/graphql/query/meGql";
import FETCH_POSTS from "@/graphql/postsGql";
import { HashLoader } from "react-spinners";

const Button = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    link: "underline-offset-4 hover:underline text-primary",
  };
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className} px-4 py-2`}
      {...props}
    >
      {children}
    </button>
  );
};

export function UserHomePageJsx() {
  const {
    data: meData,
    loading: meLoading,
    error: meError,
  } = useQuery(ME_QUERY);
  const {
    data: postData,
    loading: postLoading,
    error: postError,
  } = useQuery(FETCH_POSTS);

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (meData) {
      setUser(meData.me);
    }
    if (postData) {
      setPosts(postData.posts);
    }
  }, [meData, postData]);
  // console.log(posts);

  if (meLoading || postLoading)
    return <HashLoader color="#04e1ff" size={30} cssOverride={
      {
        position: "absolute",
        display: "block",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
      }
    } />;
  if (meError) return <div>Error fetching User: {meError.message}</div>;
  if (postError) return <div>Error fetching User: {postError.message}</div>;
  if (!user) return <div>No user data available.</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome back, {user.username}!
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Here's what's new on your personalized dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl mb-8">
              Recent Blog Posts
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {posts.length === 0 && !postLoading && (
                <div>No posts available.</div>
              )}
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="flex flex-col items-start gap-4 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md"
                >
                  <h2 className="text-2xl ">{post.author.username}</h2>
                  <h3 className="text-xl font-bold">{post.title}</h3>
                  <span>
                    {post.tags?.map((tag, index) => (
                      <p
                        key={index}
                        className="p-1 text-sm inline mr-1 w-fit bg-gray-500 rounded text-white"
                      >
                        {tag}
                      </p>
                    ))}
                  </span>
                  <p className="text-gray-500 dark:text-gray-400">
                    {post.content}
                  </p>
                  <Button variant="link" className="mt-auto">
                    Read More
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
                Quick Actions
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={() => navigate("/create-post")}>
                  <PenTool className="mr-2 h-4 w-4" />
                  Write a New Post
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/edit-profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="outline">
                  <Bell className="mr-2 h-4 w-4" />
                  Manage Notifications
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
