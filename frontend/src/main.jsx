import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import client from "./middleware/ApolloClient.jsx";
import { AuthProvider } from "./middleware/AuthContext.jsx";
import { ApolloProvider } from "@apollo/client";

createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ApolloProvider>
);
