"use client";

import React, { useEffect, useState } from "react";
import { LogIn, UserPlus, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import FETCH_POSTS from "@/graphql/query/postsGql";
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
      className={`${baseStyles} ${variantStyles[variant]} ${className} px-4 py-2 transition-all duration-200 ease-in-out transform hover:scale-105`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ease-in-out ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export function BlogLandingPageJsx() {
  const [posts, setPosts] = useState([]);
  const {
    data: { posts: fetchedPosts } = {},
    error,
    loading,
  } = useQuery(FETCH_POSTS);

  useEffect(() => {
    let fPosts = fetchedPosts;
    if (fPosts) {
      setPosts(fPosts);
    } else {
      setPosts([]);
    }
  }, [fetchedPosts]);
  const navigate = useNavigate();

  if (loading) return <Loader />;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-white dark:bg-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none animate-fadeInUp text-gray-800 dark:text-white">
                  Welcome to My Blog
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 animate-fadeInUp animation-delay-200">
                  Exploring ideas, sharing insights, and documenting my journey
                  through the world of technology and beyond.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp animation-delay-400">
                <Button className="w-full sm:w-auto">Latest Posts</Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => navigate("/login")}
                >
                  Join Community
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-15 lg:py-25">
          <div className="container px-4 md:px-6 mx-auto max-w-3xl">
            <div className="space-y-10">
              {posts.length === 0 ? (
                <div className="text-center text-gray-600 dark:text-gray-400">
                  No posts available.
                </div>
              ) : (
                [...posts]
                  .sort((a, b) => b.createdAt - a.createdAt)
                  .map((post, i) => {
                    return (
                      <div
                        key={i}
                        className="flex flex-col items-start gap-4 animate-fadeInUp bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out transform hover:scale-102"
                        style={{ animationDelay: `${i * 200}ms` }}
                      >
                        <div className="w-full">
                          <div className="flex items-center">
                            {post.author.image &&
                            post.author.image.secure_url ? (
                              <img
                                src={post.author.image.secure_url}
                                alt={post.author.username}
                                className="w-10 h-10 rounded-full object-cover"
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
                          <p className="text-gray-800 dark:text-gray-300 mb-4 text-lg leading-relaxed">
                            {post.content}
                          </p>
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
                              className={`flex items-center space-x-2 ${"text-gray-600 hover:text-red-500"} transition-colors duration-200`}
                              aria-label={`Like this post. Current likes: ${
                                post.likes?.length || 0
                              }`}
                              // Disable if already liked
                            >
                              <Heart className={"h-5 w-5 fill-red-700 cursor-cell"} />
                              <span>{post.likes?.length || 0}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl animate-fadeInUp text-gray-900 dark:text-white">
                  Join Our Community
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 animate-fadeInUp animation-delay-200">
                  Log in to your account or register to become a part of our
                  growing community. Share your thoughts, engage with other
                  readers, and get exclusive content.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2 animate-fadeInUp animation-delay-400">
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    className="w-full sm:w-auto"
                    variant="outline"
                    onClick={() => navigate("/login")}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Log In
                  </Button>
                  <Button
                    className="w-full sm:w-auto"
                    onClick={() => navigate("/register")}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2023 My Blog. All rights reserved.
            </p>
            <nav className="flex gap-4">
              <a
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
                href="#"
              >
                Terms of Service
              </a>
              <a
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
                href="#"
              >
                Privacy Policy
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
