"use client";

import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { AdvancedImage } from '@cloudinary/react';
import { Heart, LogIn, UserPlus } from 'lucide-react';
import { AuthContext } from '@/middleware/AuthContext';
import { Button } from '@/components/ui/button';
import { FETCH_POSTS } from '@/graphql/query/postsGql';
import PostTime from '@/utils/PostTime';

export function BlogLandingPageJsx() {
  const { cid } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const observerRef = useRef();

  const limit = 3;

  const { data, error, loading, fetchMore } = useQuery(FETCH_POSTS, {
    variables: {
      offset: 0,
      limit
    },
    notifyOnNetworkStatusChange: true
  });

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    fetchMore({
      variables: {
        offset: posts.length,
        limit,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult || fetchMoreResult.posts.length === 0) {
          setHasMore(false);
          return prev;
        }
        const newPosts = fetchMoreResult.posts.filter(
          newPost => !prev.posts.some(prevPost => prevPost._id === newPost._id)
        );
        if (newPosts.length === 0) {
          setHasMore(false);
          return prev;
        }
        return {
          posts: [...prev.posts, ...newPosts],
        };
      },
    });
    setPage(prevPage => prevPage + 1);
  }, [fetchMore, hasMore, loading, posts.length]);

  const lastPostElementRef = useCallback((node) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, loadMore]);

  useEffect(() => {
    if (data?.posts) {
      setPosts(prevPosts => {
        const newPosts = data.posts.filter(
          newPost => !prevPosts.some(prevPost => prevPost._id === newPost._id)
        );
        return [...prevPosts, ...newPosts];
      });
      setExpanded(prevExpanded => [...prevExpanded, ...new Array(data.posts.length).fill(false)]);
    }
  }, [data]);

  const toggleExpand = (index) => {
    setExpanded(prev => {
      const newExpanded = [...prev];
      newExpanded[index] = !newExpanded[index];
      return newExpanded;
    });
  };

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
                <Button
                  className="w-full sm:w-auto"
                  onClick={() => {
                    window.scrollBy({
                      top: window.innerHeight * 0.8,
                      behavior: "smooth",
                    });
                  }}
                >
                  Latest Posts
                </Button>
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
        <section className="w-full py-12 md:py-15 lg:py-25 transition-all ease-linear">
          <div className="container px-4 md:px-6 mx-auto max-w-3xl">
            <div className="space-y-10">
              {posts.length === 0 && !loading ? (
                <div className="text-center text-gray-600 dark:text-gray-400">
                  No posts available.
                </div>
              ) : (
                posts.map((post, i) => {
                  const authorImage = post.author.image?.public_id
                    ? cid.image(post.author.image.public_id).format("auto")
                    : null;
                  const blogImage = post.image?.public_id
                    ? cid.image(post.image.public_id).format("auto")
                    : null;
                  return (
                    <div
                      key={post._id}
                      ref={i === posts.length - 1 ? lastPostElementRef : null}
                      className="flex flex-col items-start gap-4 animate-fadeInUp bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out transform hover:scale-102"
                      style={{ animationDelay: `${i * 200}ms` }}
                    >
                      <div className="w-full">
                        <div className="flex items-center">
                          {post.author.image && authorImage ? (
                            <AdvancedImage
                              cldImg={authorImage}
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
                        <h4
                          className="text-xl mt-1 font-bold mb-4 text-gray-900 dark:text-white cursor-pointer"
                          onClick={() => navigate(`/post/${post._id}`)}
                        >
                          {post.title}
                        </h4>
                        {post.image && blogImage && (
                          <AdvancedImage
                            cldImg={blogImage}
                            alt={post.title}
                            className="w-full max-h-[300px] rounded-xl overflow-hidden shadow-lg mb-4 object-contain"
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
                          {expanded[i]
                            ? post.content
                            : post.content.slice(0, 200) + "..."}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="relative">
                            {post.content.length > 200 && (
                              <Button
                                variant="link"
                                className="p-0 transition-transform duration-200 ease-in-out hover:translate-x-1 text-primary"
                                onClick={() => toggleExpand(i)}
                              >
                                {expanded[i] ? "Read Less" : "Read More"}
                              </Button>
                            )}
                          </div>
                          <button
                            className={`flex items-center space-x-2 text-red-500 transition-colors duration-200`}
                            aria-label={`Like this post. Current likes: ${
                              post.likes?.length || 0
                            }`}
                          >
                            <Heart
                              className={`h-5 w-5 cursor-cell fill-red-700`}
                            />
                            <span>{post.likes?.length || 0}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              {loading && (
                <div className="space-y-10">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/5"></div>
                        </div>
                      </div>
                      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                      <div className="h-64 bg-gray-200 dark:bg-gray-600 rounded mb-4"></div>
                      <div className="space-y-2 mb-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/6"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!loading && !hasMore && posts.length > 0 && (
                <div className="text-center text-gray-600 dark:text-gray-400 py-8">
                  No more posts available.
                </div>
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