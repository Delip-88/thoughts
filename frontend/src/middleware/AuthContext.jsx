import React, { createContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import LOGOUT_USER from "@/graphql/mutations/logoutGql";
import ME_QUERY from "@/graphql/query/meGql";
import { Cloudinary } from "@cloudinary/url-gen";
import client from "./ApolloClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const cloudName = import.meta.env.VITE_CLOUD_NAME;

  const cid = new Cloudinary({
    cloud: {
      cloudName: cloudName,
    },
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logoutUser] = useMutation(LOGOUT_USER);
  const [user, setUser] = useState(null)
  const { data, loading, error, refetch } = useQuery(ME_QUERY, {
    fetchPolicy: "network-only", // Always fetch fresh data from server
  });

  // Function to handle user logout
  const logout = async () => {

    try {
      const response = await logoutUser();
      const { message, success } = response.data?.logout || {};

      if (success) {
        window.location.href="/"
        // Update client-side auth state
        setIsAuthenticated(false);
        setUser(null)
        // Reset Apollo cache on logout to prevent showing old data
        await client.resetStore();
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  useEffect(() => {
    if (data?.me) {
      setIsAuthenticated(true); // User is authenticated
      setUser(data.me)
    } else {
      setIsAuthenticated(false); // No user is authenticated
      setUser(null)
    }
  }, [data]);



  return (
    <AuthContext.Provider
      value={{
        cid,
        cloudName,
        user,
        setUser,
        refetch,
        isAuthenticated,
        setIsAuthenticated,
        loading,
        error,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
