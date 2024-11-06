"use client";

import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import { Heart } from "lucide-react";
import { useMutation, useQuery } from "@apollo/client";
import { FETCH_POSTS } from "@/graphql/query/postsGql";
import { AuthContext } from "@/middleware/AuthContext";
import PostTime from "@/utils/PostTime";
import { ADD_LIKE } from "@/graphql/mutations/likesGql";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { useNavigate } from "react-router-dom";
import { HomePageSkeleton } from "./home-page-skeleton";

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
  const { user, cid } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();

  const limit = 5;

  const { loading: postLoading, error: postError, data, fetchMore } = useQuery(FETCH_POSTS, {
    variables: {
      offset: 0,
      limit
    },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const [likePost] = useMutation(ADD_LIKE);

  const loadMore = useCallback(() => {
    if (!hasMore || postLoading) return;
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
  }, [fetchMore, hasMore, postLoading, posts.length]);

  const lastPostElementRef = useCallback((node) => {
    if (postLoading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [postLoading, hasMore, loadMore]);

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

  const handleLike = async (postId, isLiked) => {
    if (isLiked) return;

    try {
      const response = await likePost({
        variables: { id: postId },
      });

      const { success } = response.data?.likeOnPost;
      if (success) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, likes: [...post.likes, user._id] }
              : post
          )
        );
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const toggleExpand = (index) => {
    setExpanded((prev) => {
      const newExpanded = [...prev];
      newExpanded[index] = !newExpanded[index];
      return newExpanded;
    });
  };

  const userProfile = (id) => {
    navigate(`/user-profile/${id}`);
  };
  
  if (postLoading && posts.length === 0) return <HomePageSkeleton />;

  if (postError) return <div>Error fetching posts: {postError.message}</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-15 lg:py-25 transition-all ease-linear">
          <div className="container px-4 md:px-6 mx-auto max-w-3xl">
            <div className="space-y-10">
              {posts.length === 0 ? (
                <div className="text-center text-gray-600 dark:text-gray-400">
                  No posts available.
                </div>
              ) : (
                posts
                  .sort((a, b) => b.createdAt - a.createdAt)
                  .map((post, i) => {
                    const isLiked = post.likes.includes(user._id);
                    const authorImage = post.author.image?.public_id
                      ? cid
                          .image(post.author.image.public_id)
                          .resize(fill().width(40).height(40))
                          .format("auto")
                      : null;
                    const blogImage = post.image?.public_id
                      ? cid
                          .image(post.image.public_id)
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
                                className="w-10 h-10 rounded-full object-cover cursor-pointer"
                                onClick={() => userProfile(post.author._id)}
                              />
                            ) : (
                              <p className="p-2 w-10 h-10 text-[25px] rounded-full text-center bg-gray-300 aspect-square flex items-center justify-center cursor-pointer" onClick={() => userProfile(post.author._id)}>
                                {post.author.username[0].toUpperCase()}
                              </p>
                            )}
                            <div className="ml-3">
                              <p className="font-semibold text-gray-800 dark:text-white cursor-pointer" onClick={() => userProfile(post.author._id)}>
                                {post.author?.username.charAt(0).toUpperCase() +
                                  post.author?.username.slice(1) || "Anonymous"}
                              </p>
                              <PostTime createdAt={post.createdAt} />
                            </div>
                          </div>
                          <p className="text-xl mt-1 font-bold mb-4 text-gray-900 dark:text-white cursor-pointer" onClick={() => navigate(`/post/${post._id}`)}>
                            {post.title}
                          </p>
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
                            {expanded[i] || post.content.length <= 200
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
                              className={`flex items-center space-x-2 ${
                                isLiked
                                  ? "text-red-500"
                                  : "text-gray-600 hover:text-red-500"
                              } transition-colors duration-200`}
                              aria-label={`Like this post. Current likes: ${
                                post.likes?.length || 0
                              }`}
                              onClick={() => handleLike(post._id, isLiked)}
                              disabled={isLiked}
                            >
                              <Heart
                                className={`h-5 w-5 cursor-cell ${
                                  isLiked ? "fill-red-700" : ""
                                }`}
                              />
                              <span>{post.likes?.length || 0}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
              {postLoading && (
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
              {!postLoading && !hasMore && posts.length > 0 && (
                <div className="text-center text-gray-600 dark:text-gray-400 py-8">
                  No more posts available.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}