"use client";

import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Calendar,
  Edit,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { useMutation } from "@apollo/client";
import { AuthContext } from "@/middleware/AuthContext";
import { ThemeContext } from "@/middleware/ThemeContext";
import DELETE_POST_BY_ID from "@/graphql/mutations/deletePostGql";
import { toast } from "react-toastify";
import Loader from "./loader/Loader";
import FETCH_POSTS from "@/graphql/query/postsGql";
import ME_QUERY from "@/graphql/query/meGql";

import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import PostTime from "@/utils/PostTime";

const Button = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  const baseStyles =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  const variantStyles = {
    default: `bg-primary text-primary-foreground hover:bg-primary/90 ${
      isDarkMode
        ? "dark:bg-primary-dark dark:text-primary-dark-foreground dark:hover:bg-primary-dark/90"
        : ""
    }`,
    outline: `border border-input hover:bg-accent hover:text-accent-foreground ${
      isDarkMode
        ? "dark:border-input-dark dark:hover:bg-accent-dark dark:hover:text-accent-dark-foreground"
        : ""
    }`,
    link: `underline-offset-4 hover:underline text-primary ${
      isDarkMode ? "dark:text-primary-dark" : ""
    }`,
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

const MoreOptions = ({ onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1 rounded-full ${
          isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
        } transition-colors duration-200`}
        aria-label="More options"
      >
        <MoreVertical
          className={`h-5 w-5 ${
            isDarkMode ? "text-gray-300" : "text-gray-500"
          }`}
        />
      </button>
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } ring-1 ring-black ring-opacity-5`}
        >
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <button
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm ${
                isDarkMode
                  ? "text-gray-300 hover:bg-gray-700 hover:text-gray-100"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
              role="menuitem"
            >
              <Trash2 className="inline-block h-4 w-4 mr-2" />
              Delete Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export function ViewProfile() {
  const [posts, setPosts] = useState([]);
  const { user, cid } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);

  const [
    deletePost,
    { error: deleteError, loading: deleteLoading },
  ] = useMutation(DELETE_POST_BY_ID, {
    refetchQueries: [{ query: FETCH_POSTS }, { query: ME_QUERY }],
    awaitRefetchQueries: true,
  });

  useEffect(() => {
    if (user) {
      setPosts(user.posts);
    }
  }, [user]);

  const handleDeletePost = async (postId) => {
    if (!confirm("Are you sure to delete this post?")) {
      return;
    }
    try {
      const response = await deletePost({
        variables: {
          id: postId,
        },
      });

      const { message, success } = await response.data?.deletePost;

      if (success) {
        toast.info(message);
      }
    } catch (err) {
      console.error(err.message);
    }

    // After successful deletion, update the posts state
    setPosts(posts.filter((post) => post._id !== postId));
  };

  if (deleteError)
    return (
      <div
        className={`text-center mt-10 ${
          isDarkMode ? "text-red-400" : "text-red-500"
        }`}
      >
        Error: {deleteError.message}
      </div>
    );

  const publicId =
    user.image.public_id ||
    "4213460-account-avatar-head-person-profile-user_115386_lm2sl1";

  const userImage = cid
    .image(publicId)
    .resize(fill().width(128).height(128)) // Resize to 128x128 for avatar
    .format("auto"); // Automatically choose the best format

  return (
    <>
      {deleteLoading && <Loader />}
      <div
        className={`flex flex-col min-h-screen ${
          isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
        }`}
      >
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
                  <div
                    className={`${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    } shadow rounded-lg p-6`}
                  >
                    <div className="flex flex-col items-center">
                      <AdvancedImage
                        cldImg={userImage}
                        alt={user.username || "User Avatar"} // Use user username for accessibility
                        className="w-32 h-32 bg-gray-300 rounded-full mb-4"
                        style={{ objectFit: "cover" }} // Maintain object fit styling
                      />

                      <h1 className="text-2xl font-bold">{user.username}</h1>
                      <p
                        className={`${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        @{user.username}
                      </p>
                      <p
                        className={`${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {user.bio}
                      </p>
                      <div className="mt-6 flex flex-wrap gap-4 justify-center">
                        <Button variant="outline">
                          <Mail className="mr-2 h-4 w-4" />
                          Message
                        </Button>
                        <NavLink to={"/edit-profile"}>
                          <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Profile
                          </Button>
                        </NavLink>
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <Mail
                          className={`h-4 w-4 ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        />
                        <span
                          className={`${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {user.email}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <MapPin
                          className={`h-4 w-4 ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        />
                        <span
                          className={`${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {user.address || "Home"}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <Calendar
                          className={`h-4 w-4 ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        />
                        <span
                          className={`${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Joined{" "}
                          {new Date(
                            parseInt(user.createdAt)
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Posts Section */}
                <div className="md:w-2/3">
                  <h2 className="text-2xl font-bold mb-4">My Posts</h2>
                  <div className="space-y-6">
                    {posts.length > 0 ? (
                      [...posts].sort((a,b)=>b.createdAt - a.createdAt).map((post) => {

                    const blogImage = post.image.public_id
                      ? cid
                          .image(post.image.public_id)
                          .resize(fill().width(800).height(384))
                          .format("auto")
                      : null;
                        return (
                        <div
                          key={post._id}
                          className={`${
                            isDarkMode ? "bg-gray-800" : "bg-white"
                          } shadow rounded-lg p-6 relative`}
                        >
                          
                            <PostTime createdAt={post.createdAt} />
                          <div className="absolute top-2 right-2">
                            <MoreOptions
                              onDelete={() => handleDeletePost(post._id)}
                            />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">
                            {post.title}
                          </h3>
                          {post.image && blogImage && (
                            <AdvancedImage
                              cldImg={blogImage}
                              alt={post.title} // Use movie title for accessibility
                              className="w-full h-auto rounded-lg shadow-lg mb-4"
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
                          <p
                            className={`${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            } mb-4`}
                          >
                            {post.content}
                          </p>
                          <div
                            className={`flex justify-between items-center text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            <span>
                              {new Date(
                                parseInt(post.createdAt)
                              ).toLocaleDateString()}
                            </span>
                            <div>
                              <span className="mr-4">
                                {post.likes?.length} Likes
                              </span>
                            </div>
                          </div>
                        </div>
                      )})
                    ) : (
                      <p
                        className={`${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        No posts available.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
