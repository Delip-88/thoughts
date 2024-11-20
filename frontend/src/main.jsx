import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import client from "./middleware/ApolloClient.jsx";
import { AuthProvider } from "./middleware/AuthContext.jsx";
import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "./middleware/ThemeContext.jsx";
import { PostProvider } from "./middleware/PostContext.jsx";

createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <ThemeProvider>
      <PostProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </PostProvider>
    </ThemeProvider>
  </ApolloProvider>
);
