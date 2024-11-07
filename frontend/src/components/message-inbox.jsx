"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { format } from 'date-fns';
import { Send, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// GraphQL queries and mutations
const GET_MESSAGES = gql`
  query GetMessages($userId: ID!, $otherUserId: ID!) {
    messages(userId: $userId, otherUserId: $otherUserId) {
      id
      content
      senderId
      receiverId
      createdAt
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($content: String!, $senderId: ID!, $receiverId: ID!) {
    sendMessage(content: $content, senderId: $senderId, receiverId: $receiverId) {
      id
      content
      senderId
      receiverId
      createdAt
    }
  }
`;

export function MessageInbox({ currentUserId, otherUserId, otherUserName, onBack }) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const { loading, error, data, subscribeToMore } = useQuery(GET_MESSAGES, {
    variables: { userId: currentUserId, otherUserId },
    fetchPolicy: 'network-only',
  });

  const [sendMessage] = useMutation(SEND_MESSAGE);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendMessage({
        variables: {
          content: newMessage,
          senderId: currentUserId,
          receiverId: otherUserId,
        },
      });
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (loading) return <MessageInboxSkeleton />;
  if (error) return <p>Error loading messages: {error.message}</p>;

  const messages = data?.messages || [];

  return (
    (<Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${otherUserName}`} />
          <AvatarFallback>{otherUserName[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <CardTitle>{otherUserName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-[400px] overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === currentUserId ? 'justify-end' : 'justify-start'
              }`}>
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.senderId === currentUserId
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}>
                <p>{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {format(new Date(message.createdAt), 'HH:mm')}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow" />
          <Button type="submit">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>)
  );
}

function MessageInboxSkeleton() {
  return (
    (<Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center">
        <Skeleton className="h-8 w-8 rounded-full mr-2" />
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-[400px]">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
              <Skeleton className={`h-16 ${i % 2 === 0 ? 'w-2/3' : 'w-1/2'} rounded-lg`} />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full space-x-2">
          <Skeleton className="h-10 flex-grow" />
          <Skeleton className="h-10 w-10" />
        </div>
      </CardFooter>
    </Card>)
  );
}