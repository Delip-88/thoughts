import React, { useState, useEffect, useContext } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { format } from "date-fns";
import { Send, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "@/middleware/AuthContext";
import { GET_MESSAGES, SEND_MESSAGE } from "@/graphql/mutations/messageGql";


// MessageInbox component
export function MessageInbox() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const { user: currentUser } = useContext(AuthContext);
  const receiverId = searchParams.get("userId");
  const receiverName = searchParams.get("username") || "User";
  const receiverAvatarUrl = searchParams.get("pfp") || import.meta.env.VITE_DEFAULT_AVATAR;

  const [newMessage, setNewMessage] = useState("");
  const [sendMessage] = useMutation(SEND_MESSAGE)

  const { loading, error, data } = useQuery(GET_MESSAGES, {
    variables: { senderId: currentUser._id, receiverId },
    fetchPolicy: "network-only",
  });

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendMessage({
        variables: {
          content: newMessage,
          receiverId,
        },
      });
      setNewMessage(""); // Clear the input after sending
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  if (loading) return <MessageInboxSkeleton />;
  if (error) return <p>Error loading messages: {error.message}</p>;

  const messages = data?.getMessages || [];
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={receiverAvatarUrl} />
          <AvatarFallback>{receiverName[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <CardTitle>{receiverName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-[400px] overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${
                message.senderId === currentUser._id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.senderId === currentUser._id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <p>{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.createdAt
                    ? format(new Date(parseInt(message.createdAt)), "HH:mm")
                    : "Invalid Date"}
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
            className="flex-grow"
          />
          <Button type="submit" disabled={!newMessage.trim() || sending}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

function MessageInboxSkeleton() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center">
        <Skeleton className="h-8 w-8 rounded-full mr-2" />
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-[400px]">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`flex ${
                i % 2 === 0 ? "justify-end" : "justify-start"
              }`}
            >
              <Skeleton
                className={`h-16 ${i % 2 === 0 ? "w-2/3" : "w-1/2"} rounded-lg`}
              />
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
    </Card>
  );
}
