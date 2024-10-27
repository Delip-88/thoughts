"use client";

import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { format } from "date-fns";
import { Heart, MessageCircle, Share2, ArrowLeft } from "lucide-react";
import { AuthContext } from "@/middleware/AuthContext";
import { ThemeContext } from "@/middleware/ThemeContext";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";
// import { LIKE_POST, ADD_COMMENT } from '@/graphql/mutations/postMutations';
import { FETCH_POST_BY_ID } from "@/graphql/query/postsGql";

import { AdvancedImage } from "@cloudinary/react";
import { ADD_COMMENT } from "@/graphql/mutations/likesGql";
import { VIEW_POST_COMMENTS } from "@/graphql/query/commentsGql";
import PostTime from "@/utils/PostTime";

 const CommentBox = ({allComments}) =>
  allComments?.length > 0 ? (
    [...allComments].sort((a,b)=> b.createdAt - a.createdAt).map((comment) => (
      <div
        key={comment._id}
        className="mb-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-700"
      >
        <div className="flex items-center space-x-2 mb-2">
          <Avatar>
            <AvatarImage
              src={comment.commentedBy.image?.secure_url}
              alt={comment.commentedBy.username}
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
            />
            <AvatarFallback>
              {comment.commentedBy.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{comment.commentedBy.username}</p>
            <div className="text-xs text-gray-500">
              <PostTime createdAt={comment.createdAt} />
            </div>
          </div>
        </div>
        <p>{comment.content}</p>
      </div>
    ))
  ) : (
    <p>No Comments</p>
  );

export function PostPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { user: currentUser, cid } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  const [comment, setComment] = useState("");

  const [allComments, setAllComments] = useState(null);

  const {
    loading: postLoading,
    error,
    data,
  } = useQuery(FETCH_POST_BY_ID, {
    variables: { id },
    fetchPolicy: "network-only",
  });

  const { loading: loadingComments, data: commentData } = useQuery(
    VIEW_POST_COMMENTS,
    {
      variables: { postId: id },
      fetchPolicy: "network-only",
    }
  );

  useEffect(() => {
    if (commentData) {
      setAllComments(commentData.comment);
    }
  }, [commentData]);

  // const [likePost] = useMutation(LIKE_POST);
  const [addComment] = useMutation(ADD_COMMENT);

  if (postLoading) return <PostSkeleton />;
  if (error) {
    return <div>Error loading post: {error.message}</div>;
  }

  if (!data || !data.post) return <div>Post not found</div>;

  const { post } = data;

  const handleLike = async () => {
    // try {
    //   await likePost({ variables: { postId: post._id } });
    //   toast.success('Post liked!');
    // } catch (err) {
    //   toast.error('Failed to like post. Please try again.');
    // }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const response = await addComment({
        variables: {
          postId: id,
          userId: user._id,
          content: comment,
        },
      });
      const {
        message,
        success,
        comment: newComment,
      } = await response.data?.addComment; // Assuming you return the new comment here
      if (success) {
        toast.success(message);
        setAllComments((prev) => [...prev, newComment]); // Add new comment to the existing list
      } else {
        toast.error("Comment failed!");
      }
      setComment("");
    } catch (err) {
      toast.error("Failed to add comment. Please try again.");
      console.error(err.message);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const authorImage = post.author.image?.public_id
    ? cid.image(post.author.image.public_id).format("auto")
    : null;
  const blogImage = post.image?.public_id
    ? cid.image(post.image.public_id).format("auto")
    : null;



  return (
    <div
      className={`min-h-screen w-full ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className={`w-full ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <CardHeader>
            <div className="flex items-center space-x-4">
              {authorImage ? (
                <AdvancedImage
                  cldImg={authorImage}
                  alt={post.author.username}
                  className="w-10 h-10 rounded-full object-cover cursor-pointer"
                />
              ) : (
                <p className="p-2 w-10 h-10 text-[25px] rounded-full text-center bg-gray-300 aspect-square flex items-center justify-center cursor-pointer">
                  {post.author.username[0].toUpperCase()}
                </p>
              )}
              <div>
                <CardTitle>{post.title}</CardTitle>
                <p className="text-sm text-gray-500">
                  By {post.author.username} •{" "}
                  {format(new Date(parseInt(post.createdAt)), "PPP")}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {blogImage && (
              <AdvancedImage
                cldImg={blogImage}
                alt={post.title} // Use movie title for accessibility
                className="w-full max-h-[350px] rounded-xl overflow-hidden shadow-lg mb-4 object-center object-contain"
              />
            )}
            <p className="whitespace-pre-wrap">{post.content}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="flex space-x-4">
              <Button variant="ghost" onClick={handleLike}>
                <Heart
                  className={`mr-2 h-4 w-4 ${
                    post.likes.includes(currentUser?._id)
                      ? "fill-red-500 text-red-500"
                      : ""
                  }`}
                />
                {post.likes.length}
              </Button>
              <Button variant="ghost">
                <MessageCircle className="mr-2 h-4 w-4" />
                {allComments ? allComments.length : 0}
              </Button>
            </div>
            <Button variant="ghost" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </CardFooter>
        </Card>

        <Card className={`mt-8 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
          </CardHeader>
          <CardContent>
            {!user && (
              <p className="text-sm text-gray-300">Login to comment...</p>
            )}
            {user && (
              <form onSubmit={handleComment} className="mb-4">
                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mb-2"
                />
                <Button type="submit" disabled={!comment.trim()}>
                  Post Comment
                </Button>
              </form>
            )}{" "}
            {loadingComments ? (
              <p className="text-sm text-gray-200">Loading Comments....</p>
            ) : (
              <CommentBox allComments={allComments} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PostSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-20 mb-4" />
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div>
              <Skeleton className="h-6 w-64 mb-2" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
      <Card className="mt-8">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-20 w-full mb-4" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
