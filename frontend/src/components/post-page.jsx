"use client";

import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { format } from 'date-fns';
import { Heart, MessageCircle, Share2, ArrowLeft } from 'lucide-react';
import { AuthContext } from '@/middleware/AuthContext';
import { ThemeContext } from '@/middleware/ThemeContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'react-toastify';
import { GET_POST } from '@/graphql/queries/getPostQuery';
import { LIKE_POST, ADD_COMMENT } from '@/graphql/mutations/postMutations';

export function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  const [comment, setComment] = useState('');

  const { loading, error, data } = useQuery(GET_POST, {
    variables: { id },
    fetchPolicy: "network-only",
  });

  const [likePost] = useMutation(LIKE_POST);
  const [addComment] = useMutation(ADD_COMMENT);

  if (loading) return <PostSkeleton />;
  if (error) return <div>Error loading post: {error.message}</div>;
  if (!data || !data.post) return <div>Post not found</div>;

  const { post } = data;

  const handleLike = async () => {
    try {
      await likePost({ variables: { postId: post._id } });
      toast.success('Post liked!');
    } catch (err) {
      toast.error('Failed to like post. Please try again.');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await addComment({ variables: { postId: post._id, content: comment } });
      setComment('');
      toast.success('Comment added successfully!');
    } catch (err) {
      toast.error('Failed to add comment. Please try again.');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  return (
    (<div
      className={`min-h-screen w-full ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className={`w-full ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={post.author.image?.secure_url} alt={post.author.username} />
                <AvatarFallback>{post.author.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{post.title}</CardTitle>
                <p className="text-sm text-gray-500">
                  By {post.author.username} • {format(new Date(parseInt(post.createdAt)), 'PPP')}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {post.image && (
              <img
                src={post.image.secure_url}
                alt={post.title}
                className="w-full h-64 object-cover rounded-lg mb-4" />
            )}
            <p className="whitespace-pre-wrap">{post.content}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                  {tag}
                </span>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="flex space-x-4">
              <Button variant="ghost" onClick={handleLike}>
                <Heart
                  className={`mr-2 h-4 w-4 ${post.likes.includes(currentUser?._id) ? 'fill-red-500 text-red-500' : ''}`} />
                {post.likes.length}
              </Button>
              <Button variant="ghost">
                <MessageCircle className="mr-2 h-4 w-4" />
                {post.comments.length}
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
            <form onSubmit={handleComment} className="mb-4">
              <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mb-2" />
              <Button type="submit" disabled={!comment.trim()}>
                Post Comment
              </Button>
            </form>
            {post.comments.map((comment) => (
              <div
                key={comment._id}
                className="mb-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                <div className="flex items-center space-x-2 mb-2">
                  <Avatar>
                    <AvatarImage src={comment.author.image?.secure_url} alt={comment.author.username} />
                    <AvatarFallback>{comment.author.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{comment.author.username}</p>
                    <p className="text-xs text-gray-500">{format(new Date(parseInt(comment.createdAt)), 'PPP')}</p>
                  </div>
                </div>
                <p>{comment.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>)
  );
}

function PostSkeleton() {
  return (
    (<div className="container mx-auto px-4 py-8">
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
    </div>)
  );
}