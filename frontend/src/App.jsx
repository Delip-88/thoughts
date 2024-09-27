import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BlogLandingPageJsx } from "./components/blog-landing-page";
import { LoginPageJsx } from "./components/login-page";
import { RegisterPageJsx } from "./components/register-page";
import Layout from "./Layout/Layout";
import NotFound from "./components/NotFound";
import { UserHomePageJsx } from "./components/user-home-page";
import { RegisterVerificationPageJsx } from "./components/register-verification-page";
import { ResetPassword } from "./components/reset-password";
import { ResetPasswordVerification } from "./components/reset-password-verification";
import ProtectedRoute from "./middleware/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserLayout from "./Layout/UserLayout";
import { WriteNewPost } from "./components/write-new-post";
import { EditProfilePageJsx } from "./components/edit-profile-page";
import { ViewProfile } from "./components/view-profile";

const App = () => {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route path="/" index element={<BlogLandingPageJsx />} />
          <Route path="/login" element={<LoginPageJsx />} />
          <Route path="/register" element={<RegisterPageJsx />} />
          <Route
            path="/email-verification"
            element={<RegisterVerificationPageJsx />}
          />
          <Route path="/forgot-password" element={<ResetPassword />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordVerification />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Protected User Routes - Can also use "/" as a base */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          {/* Nested routes for authenticated users */}
          <Route index element={<UserHomePageJsx />} /> {/* This is / */}
          <Route path="/Home" element={<UserHomePageJsx />} />
          <Route path="/profile" element={<ViewProfile />} />
          
          <Route path="/create-post" element={<WriteNewPost />} />
          <Route path="/edit-profile" element={<EditProfilePageJsx />} />

        </Route>
      </Routes>
    </Router>
  );
};

export default App;
