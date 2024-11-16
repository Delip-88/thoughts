"use client";

import React, { useState, useContext, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { format } from "date-fns";
import {
  Heart,
  MessageCircle,
  Share2,
  ArrowLeft,
  MoreVertical,
  ThumbsUp,
  Reply,
  Edit,
  Trash2,
} from "lucide-react";
import { AuthContext } from "@/middleware/AuthContext";
import { ThemeContext } from "@/middleware/ThemeContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toast } from "react-toastify";
import { FETCH_POST_BY_ID } from "@/graphql/query/postsGql";
import { AdvancedImage } from "@cloudinary/react";
import { ADD_COMMENT, DELETE_COMMENT } from "@/graphql/mutations/likesGql";
import { VIEW_POST_COMMENTS } from "@/graphql/query/commentsGql";
import PostTime from "@/utils/PostTime";

const CommentBox = React.memo(
  ({ allComments, currentUser, onDeleteComment }) => {
    return allComments?.length > 0 ? (
      <div className="space-y-3">
        {[...allComments]
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((comment) => (
            <Card key={comment._id} className="bg-gray-50 dark:bg-gray-700">
              <CardHeader className="flex flex-row items-start space-y-0 pb-1">
                <Avatar className="w-10 h-10 mr-3">
                  <AvatarImage
                    src={comment.commentedBy.image?.secure_url}
                    alt={comment.commentedBy.username}
                    className="rounded-full object-cover"
                  />
                  <AvatarFallback>
                    {comment.commentedBy.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">
                      {comment.commentedBy.username}
                    </p>
                    {currentUser &&
                      currentUser._id === comment.commentedBy._id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="cursor-pointer"
                          >
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => onDeleteComment(comment._id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                  </div>
                  <div className="text-xs text-gray-500">
                    <PostTime createdAt={comment.createdAt} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p>{comment.content}</p>
              </CardContent>
              <CardFooter className="flex justify-start space-x-2 pt-2">
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Like
                </Button>
                <Button variant="ghost" size="sm">
                  <Reply className="h-4 w-4 mr-1" />
                  Reply
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>
    ) : (
      <p className="text-center text-gray-500">No comments yet</p>
    );
  }
);

export function PostPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { user: currentUser, cid } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);

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

  const [deleteCommentById] = useMutation(DELETE_COMMENT);
  const [addComment] = useMutation(ADD_COMMENT);

  useEffect(() => {
    if (commentData) {
      setAllComments(commentData.comment);
    }
  }, [commentData]);

  const handleLike = async () => {
    // Implement like functionality
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
      } = await response.data?.addComment;

      if (success) {
        toast.success(message);
        setAllComments((prev) => [...(prev || []), newComment]);
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

  const deleteComment = useCallback(
    async (commentId) => {
      try {
        const response = await deleteCommentById({
          variables: {
            commentId,
            postId: id,
          },
        });
        const { message, success } = response.data?.deleteComment;
        if (success) {
          setAllComments((prevComments) =>
            prevComments.filter((comment) => comment._id !== commentId)
          );
          toast.info("Comment deleted");
        }
      } catch (err) {
        toast.error(`Comment deletion failed: ${err.message}`);
      }
    },
    [deleteCommentById, id]
  );

  if (postLoading || loadingComments) return <PostSkeleton />;
  if (error) {
    return <div>Error loading post: {error.message}</div>;
  }

  if (!data || !data.post) return <div>Post not found</div>;

  const { post } = data;

  const authorImage = post.author.image?.public_id
    ? cid.image(post.author.image.public_id).format("auto")
    : null;
  const blogImage = post.image?.public_id
    ? cid.image(post.image.public_id)
    : null;

  return (
    <div
      className={`flex flex-col min-h-screen ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <main className="flex-1">
        <section className="w-full py-12 md:py-15 lg:py-25 transition-all ease-linear">
          <div className="container px-4 md:px-6 mx-auto max-w-3xl">
            <div className="space-y-10">
              <Button
                variant="ghost"
                className="mb-1"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              <Card
                className={`w-full ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    {authorImage ? (
                      <AdvancedImage
                        cldImg={authorImage}
                        alt={post.author.username}
                        className="w-10 h-10 rounded-full object-cover cursor-pointer"
                      />
                    ) : (
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>
                          {post.author.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
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
                      alt={post.title}
                      className="w-full max-h-[300px] rounded-xl overflow-hidden shadow-lg mb-4 object-contain"
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

              <Card className={`${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  {!user && (
                    <p className="text-sm text-gray-500">Login to comment...</p>
                  )}
                  {user && (
                    <form onSubmit={handleComment} className="mb-6">
                      <Textarea
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="mb-2 resize-none"
                      />
                      <Button type="submit" disabled={!comment.trim()}>
                        Post Comment
                      </Button>
                    </form>
                  )}
                  {loadingComments ? (
                    <p className="text-sm text-gray-500">Loading Comments...</p>
                  ) : (
                    <CommentBox
                      allComments={allComments}
                      currentUser={currentUser}
                      onDeleteComment={deleteComment}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function PostSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-15 lg:py-25 transition-all ease-linear">
          <div className="container px-4 md:px-6 mx-auto max-w-3xl">
            <div className="space-y-10">
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
              <Card>
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
          </div>
        </section>
      </main>
    </div>
  );
}
