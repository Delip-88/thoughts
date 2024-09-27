import React, { createContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import LOGOUT_USER from "@/graphql/mutations/logoutGql";
import ME_QUERY from "@/graphql/query/meGql";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logoutUser] = useMutation(LOGOUT_USER);
  const { data, loading, error } = useQuery(ME_QUERY);

  // Function to handle user logout
  const logout = async () => {
    if (confirm("Are you sure you want to log out?")) {
      try {
        const response = await logoutUser();
        const { message, success } = response.data?.logout || {};

        if (success) {
          // Update client-side auth state
          setIsAuthenticated(false);
          console.log(message); // Log the success message

        } else {
          console.error("Logout failed");
        }
      } catch (err) {
        console.error("Error logging out:", err);
      }
    } else {
      return; // User canceled the logout
    }
  };

  useEffect(() => {
    if (data?.me) {
      setTimeout(() => setIsAuthenticated(true), 0); // Defer state update
    } else {
      setTimeout(() => setIsAuthenticated(false), 0);
    }
  }, [data]);

  const user = data?.me || null;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated,setIsAuthenticated ,loading, error, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
