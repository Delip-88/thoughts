"use client";

import React, { useContext, useEffect, useState } from "react";
import { Bell, PenTool, User ,Heart} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import FETCH_POSTS from "@/graphql/postsGql";
import { AuthContext } from "@/middleware/AuthContext";
import Loader from "./loader/Loader";
import PostTime from "@/utils/PostTime";

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

  const {user} = useContext(AuthContext)
  const {
    data: postData,
    loading: postLoading,
    error: postError,
  } = useQuery(FETCH_POSTS,{
    fetchPolicy: 'network-only'
  });

  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (postData) {
      setPosts(postData.posts);
    }
  }, [postData]);
  // console.log(posts);

  if (postLoading || !user)
    return <Loader/>


  if (postError) return <div>Error fetching User: {postError.message}</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto max-w-3xl">
            <div className="space-y-10">
              {posts.length === 0 ? (
                <div className="text-center text-gray-600 dark:text-gray-400">
                  No posts available.
                </div>
              ) : (
                posts.map((post, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-start gap-4 animate-fadeInUp bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out transform hover:scale-102"
                    style={{ animationDelay: `${i * 200}ms` }}
                  >
                    <div className="w-full">
                      <div className="flex items-center">
                        {post.author.image ? (
                          <img
                            src={post.author.image.secure_url}
                            alt={post.author.username}
                          />
                        ) : (
                          <p className="p-2 w-10 h-10 text-[25px] rounded-full text-center bg-gray-300 aspect-square flex items-center justify-center">
                            {post.author.username[0].toUpperCase()}
                          </p>
                        )}
                        <div className="ml-3">
                          <h3 className="font-semibold text-gray-800 dark:text-white">
                            {post.author?.username || "Anonymous"}
                          </h3>
                          <PostTime createdAt={post.createdAt} />
                        </div>
                      </div>
                      <h4 className="text-xl mt-1 font-bold mb-4 text-gray-900 dark:text-white">
                        {post.title}
                      </h4>
                      {post.image && post.image.secure_url && (
                        <img
                          alt="Blog post image"
                          className="w-full h-64 object-cover rounded-lg mb-4"
                          src={post.image.secure_url}
                        />
                      )}
                      <p className="text-gray-800 dark:text-gray-300 mb-4 text-lg leading-relaxed">
                        {post.content}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags?.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="relative">
                          <Button
                            variant="link"
                            className="p-0 transition-transform duration-200 ease-in-out hover:translate-x-1 text-primary"
                          >
                            Read More
                          </Button>
                        </div>

                        <button
                          className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors duration-200"
                          aria-label={`Like this post. Current likes: ${post.likes}`}
                        >
                          <Heart className="h-5 w-5" />
                          <span>{post.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
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
