"use client";

import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import { format } from "date-fns";
import { Send, ArrowLeft, Menu, X } from 'lucide-react';
import { AuthContext } from "@/middleware/AuthContext";
import { ThemeContext } from "@/middleware/ThemeContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { InboxComponentSkeleton } from "./inbox-component-skeleton";
import { useLazyQuery, useQuery, useMutation, useSubscription } from "@apollo/client";
import { ALL_USERS } from "@/graphql/query/usersGql";
import { GET_MESSAGES } from "@/graphql/query/messagesGql";
import { NEW_MESSAGE_SUBSCRIPTION, SEND_MESSAGE } from "@/graphql/mutations/messageGql";

export function InboxComponent() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isUserListVisible, setIsUserListVisible] = useState(false);
  const { user: currentUser } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  const messagesEndRef = useRef(null);

  const navigate = useNavigate();

  const [getUserMessages, { loading: msgLoading, error: msgError }] =
    useLazyQuery(GET_MESSAGES, {
      fetchPolicy: "cache-and-network",
      onCompleted: (data) => {
        setMessages(data.getMessages);
      },
      onError: (err) => {
        console.error("Error fetching conversation:", err);
      },
    });

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    optimisticResponse: ({ content, receiverId }) => ({
      sendMessage: {
        __typename: "Message",
        _id: `temp-id-${Date.now()}`,
        content,
        senderId: currentUser._id,
        receiverId,
        isRead: false,
        createdAt: new Date().toISOString(),
      },
    }),
    update: (cache, { data: { sendMessage } }) => {
      const existingMessages = cache.readQuery({
        query: GET_MESSAGES,
        variables: { senderId: currentUser._id, receiverId: selectedUser._id },
      });

      if (existingMessages) {
        cache.writeQuery({
          query: GET_MESSAGES,
          variables: { senderId: currentUser._id, receiverId: selectedUser._id },
          data: {
            getMessages: [...existingMessages.getMessages, sendMessage],
          },
        });
      }
    },
  });

  const { data: subscriptionData } = useSubscription(NEW_MESSAGE_SUBSCRIPTION, {
    variables: { receiverId: currentUser._id },
  });

  useEffect(() => {
    if (subscriptionData?.newMessage) {
      const newMessage = subscriptionData.newMessage;
  
      if (
        newMessage.senderId === selectedUser?._id ||
        newMessage.receiverId === selectedUser?._id
      ) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    }
  }, [subscriptionData, selectedUser]);
  

  const fetchConversation = useCallback(async (receiverId) => {
    try {
      await getUserMessages({
        variables: {
          senderId: currentUser._id,
          receiverId,
        },
      });
    } catch (error) {
      console.error(`Error fetching Conversation: ${error.message}`);
    }
  }, [currentUser._id, getUserMessages]);

  const [friends, setFriends] = useState([]);

  const {
    data: friendsData,
    loading: friendsLoading,
    error: friendsError,
  } = useQuery(ALL_USERS);

  useEffect(() => {
    
    console.log("Friends Data Users:", friendsData?.users);
    if (friendsData && friendsData.users) {
      setFriends(friendsData.users.filter(user => user._id !== currentUser._id));
    }
  }, [friendsData, currentUser._id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedUser) {
      const optimisticMessage = {
        _id: `temp-id-${Date.now()}`,
        content: newMessage,
        senderId: currentUser._id,
        receiverId: selectedUser._id,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
  
      // Update messages locally
      setMessages((prevMessages) => [...prevMessages, optimisticMessage]);
  
      try {
        await sendMessage({
          variables: {
            content: newMessage,
            receiverId: selectedUser._id,
            senderId: currentUser._id,
          },
        });
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };
  

  const toggleUserList = () => {
    setIsUserListVisible(!isUserListVisible);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (friendsLoading) return <InboxComponentSkeleton />;

  if (friendsError)
    return <div>Error fetching friends: {friendsError.message}</div>;

  return (
    <div
      className={`flex flex-col min-h-screen ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <main className="flex-1">
        <section className="w-full flex justify-center items-center py-6 md:py-7 lg:py-7">
          <div className="container px-4 md:px-6">
            <Card
              className={`mx-auto max-w-4xl ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between p-4">
                <Button variant="ghost" onClick={() => navigate(-1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <CardTitle className="md:hidden">
                  {selectedUser && selectedUser.username}
                </CardTitle>
                <Button
                  variant="ghost"
                  className="md:hidden"
                  onClick={toggleUserList}
                >
                  {isUserListVisible ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Menu className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {isUserListVisible ? "Close" : "Contacts"}
                  </span>
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row h-[calc(100vh-200px)] md:h-[600px] overflow-hidden">
                  {/* User list sidebar */}
                  <div
                    className={`w-full md:w-1/3 border-r ${
                      isDarkMode ? "border-gray-700" : "border-gray-200"
                    } ${isUserListVisible ? "block" : "hidden md:block"}`}
                  >
                    <ScrollArea className="h-full">
                      {friends.map((user) => (
                        <div
                          key={user._id}
                          className={`flex items-center space-x-4 px-4 py-3 cursor-pointer ${
                            selectedUser && selectedUser._id === user._id
                              ? isDarkMode
                                ? "bg-gray-700"
                                : "bg-gray-100"
                              : isDarkMode
                              ? "hover:bg-gray-700"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => {
                            setSelectedUser(user);
                            fetchConversation(user._id);
                            setIsUserListVisible(false);
                          }}
                        >
                          <Avatar>
                            <AvatarImage
                              src={user.image?.secure_url || import.meta.env.VITE_DEFAULT_AVTAR}
                              alt={user.username}
                            />
                            <AvatarFallback>
                              {user.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium truncate ${
                                isDarkMode ? "text-gray-100" : "text-gray-900"
                              }`}
                            >
                              {user.username}
                            </p>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>

                  {/* Message area */}
                  <div
                    className={`flex-1 flex flex-col ${
                      isUserListVisible ? "hidden md:flex" : "flex"
                    }`}
                  >
                    {selectedUser ? (
                      <>
                        {/* Chat header */}
                        <div
                          className={`px-4 py-3 border-b ${
                            isDarkMode ? "border-gray-700" : "border-gray-200"
                          } hidden md:block`}
                        >
                          <h2
                            className={`text-lg font-semibold ${
                              isDarkMode ? "text-gray-100" : "text-gray-900"
                            }`}
                          >
                            {selectedUser.username}
                          </h2>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4">
                          <div className="flex flex-col justify-end min-h-full">
                            {messages.map((message) => (
                              <div
                                key={message._id}
                                className={`flex mb-4 ${
                                  message.senderId === currentUser._id
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                              >
                                <div
                                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                    message.senderId === currentUser._id
                                      ? "bg-primary text-primary-foreground"
                                      : isDarkMode
                                      ? "bg-gray-700 text-gray-100"
                                      : "bg-gray-200 text-gray-900"
                                  }`}
                                >
                                  <p className="text-sm md:text-base">
                                    {message.content}
                                  </p>
                                  <p className="text-xs mt-1 opacity-70">
                                    {format(
                                      new Date(parseInt(message.createdAt)),
                                      "HH:mm"
                                    )}
                                  </p>
                                </div>
                              </div>
                            ))}
                            <div ref={messagesEndRef} />
                          </div>
                        </ScrollArea>

                        {/* Message input */}
                        <CardFooter
                          className={`border-t p-2 ${
                            isDarkMode ? "border-gray-700" : "border-gray-200"
                          }`}
                        >
                          <form
                            onSubmit={handleSendMessage}
                            className="flex w-full space-x-2"
                          >
                            <Input
                              type="text"
                              placeholder="Type a message..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              className="flex-1"
                            />
                            <Button type="submit">
                              <Send className="h-4 w-4" />
                              <span className="sr-only">Send message</span>
                            </Button>
                          </form>
                        </CardFooter>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">
                          Select a user to start chatting
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}