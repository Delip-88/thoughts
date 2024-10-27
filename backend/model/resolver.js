import { User, Post, Comment } from "./mongoSchema.js"; // Import the actual models
import { generateToken } from "../utils/token.js";
import { sendEmail } from "../config/email_type.js";
import jwt from "jsonwebtoken";
import {
  getData,
  getDataById,
  deleteDataById,
  generateResetToken,
  setUserCookie,
  deleteSignature,
  uploadSignature,
  getCommentsById,
} from "../utils/functions.js";


const protectedRoute = async (context) => {
  const user = await resolvers.Query.checkAuth(null, null, context);
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
};

// Define your resolvers
const resolvers = {
  Query: {
    me: async (_, __, { req }) => {
      // Check if the user is authenticated
      if (!req.user) {
        throw new Error("You are not authenticated!");
      }

      // Fetch the user from the database using the ID from the token
      const user = await User.findById(req.user._id);
      return user;
    },
    async users(parameter, args, context) {
      await protectedRoute(context);
      return getData(User); // Fetch all users
    },
    async user(_, { id }, context) {
      await protectedRoute(context);
      return getDataById(User, id); // Fetch a user by ID
    },
    posts() {
      return getData(Post); // Fetch all posts
    },
    post(_, { id }) {
      return getDataById(Post, id); // Fetch a post by ID
    },
    comments(){
      return getData(Comment)
    },
    comment(_,{postId}){
      return getCommentsById(Comment,postId)
    },
    async checkAuth(parameter, args, { req }) {
      const token = req.cookies.authToken;
      if (!token) {
        throw new Error("No token provided, unauthorized access");
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded._id).select("-password");
        if (!user) {
          throw new Error("User does not exist");
        }
        return user;
      } catch (err) {
        console.error("Authentication error:", err.message);
        throw new Error("Authentication failed");
      }
    },
  },

  // Resolve `posts` for a User
  User: {
    async posts(parent) {
      // Fetch posts where the author's ID matches the user's _id
      return await Post.find({ author: parent._id });
    },
    async comments(parent){
      return await Comment.find({userId: parent._id})
    },
  },

  // Resolve `author` for a Post
  Post: {
    async author(parent) {
      // Fetch the user (author) based on the authorId field in the post
      return await User.findById(parent.author);
    },
    async comments(parent){
      return await Comment.find({postId: parent._id})
    }
  },
  
  Comment: {
    async commentedBy(parent){
      return await User.findById(parent.userId)
    },
  }
  ,

  Mutation: {
    async addComment(_, { postId, userId, content }, context) {
      const user = await protectedRoute(context);
    
      try {
        // Create and save the new comment
        const newComment = new Comment({ postId, userId, content });
        const savedComment = await newComment.save();
    
        // Update User with the new comment
        await User.findByIdAndUpdate(
          user._id,
          { $push: { comments: savedComment._id } },
          { new: true }
        );
    
        // Update Post with the new comment
        await Post.findByIdAndUpdate(
          postId,
          { $push: { comments: savedComment._id } },
          { new: true }
        );
    
        return { message: "Commented successfully", success: true , comment: savedComment};
      } catch (err) {
        throw new Error(`Failed to post comment: ${err.message}`);
      }
    },

    async getUploadSignature(
      _,
      { tags, upload_preset, uploadFolder },
      context
    ) {
      const user = await protectedRoute(context);

      return uploadSignature(tags, upload_preset, uploadFolder);
    },
    async getDeleteSignature(_, { publicId }, context) {
      const user = await protectedRoute(context);

      return deleteSignature(publicId);
    },
    async addPost(_, { post }, context) {
      const user = await protectedRoute(context);

      const { title, content, tags, image , category} = post;

      try {
        const newPost = new Post({
          title,
          content,
          tags,
          category,
          image: image || null,
          author: user._id,
        });

        const savedPost = await newPost.save();
        await savedPost.populate({
          path: "author",
          select: "username",
        });

        await User.findByIdAndUpdate(
          user._id,
          { $push: { posts: savedPost._id } },
          { new: true }
        );

        return { message: "Post successfully created!", success: true };
      } catch (err) {
        console.error("Failed to create post:", err.message);
        throw new Error("Error creating post");
      }
    },
    async updateUser(_, { user }, context) {
      const loggedUser = await protectedRoute(context);
      const { _id, username, address, bio, image } = user;

      // Create an object to hold the fields to update
      const updates = { username }; // start with the username

      // Only add fields that are defined
      if (address !== undefined) {
        updates.address = address;
      }
      if (bio !== undefined) {
        updates.bio = bio;
      }
      if (image !== undefined) {
        updates.image = image;
      }

      try {
        const updateUser = await User.findByIdAndUpdate(_id, updates, {
          new: true,
        });

        if (!updateUser) {
          throw new Error("User not found");
        }
        return { message: "Update Success", success: true };
      } catch (err) {
        console.error("Updation failed", err.message);
        throw new Error("Error updating user");
      }
    },

    async updatePost(_, { post }, context) {
      const loggedUser = await protectedRoute(context);
      const { _id, title, content } = post;
      try {
        const updatePost = await Post.findByIdAndUpdate(
          _id,
          { title, content },
          { new: true }
        );

        if (!updatePost) {
          throw new Error("Post not found");
        }
        return updatePost;
      } catch (err) {
        console.error("Updation failed", err.message);
        throw new Error("Error updating post");
      }
    },

    async likeOnPost(_, { id }, context) {
      const loggedUser = await protectedRoute(context);
      const post = await Post.findById(id);
    
      if (!post) {
        throw new Error("Post doesn't exist");
      }
    
      if (post.likes.includes(loggedUser._id)) {
        // Unlike the post
        post.likes = post.likes.filter(id => id.toString() !== loggedUser._id.toString());
      } else {
        // Like the post
        post.likes.push(loggedUser._id);
      }
    
      await post.save();
      return { message: "Success", success: true };
    },
    

    async deleteUser(_, { id }, context) {
      const user = await protectedRoute(context);
      return deleteDataById(User, id); // Delete user by ID
    },

    async deletePost(_, { id }, context) {
      const user = await protectedRoute(context);
      return deleteDataById(Post, id); // Delete post by ID
    },
    async register(_, { user }) {
      const { username, email, password } = user;
      try {
        // Check if the username is already in use
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
          throw new Error("Username is already in use.");
        }

        // Check if the email is already in use
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
          throw new Error("Email is already in use.");
        }

        // Generate a random 6-digit verification code
        const randTokenGenerate = Math.floor(
          100000 + Math.random() * 900000
        ).toString();

        const newUser = new User({
          username,
          email,
          password,
          verificationToken: randTokenGenerate.toString(),
          verificationTokenExpiresAt: new Date(
            Date.now() + 15 * 60 * 1000
          ).toISOString(),
        });

        await newUser.save();
        console.log(
          `Sending verification email to: ${newUser.email} with code: ${randTokenGenerate}`
        );

        await sendEmail(
          "email_verification",
          newUser.email,
          "Email Verification",
          randTokenGenerate
        );
        return {
          message: "Email verification sent",
          success: true,
        };
      } catch (err) {
        console.error("Error registering user", err.message);
        throw new Error(err.message);
      }
    },

    async resendCode(_, { email }) {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User doesn't exist");
        }
        // Generate a random 6-digit verification code
        const randTokenGenerate = Math.floor(
          100000 + Math.random() * 900000
        ).toString();

        user.verificationToken = randTokenGenerate;
        await user.save();

        sendEmail(
          "email_verification",
          email,
          "Email Verification",
          randTokenGenerate
        );
        return { message: "Verification code sended", success: true };
      } catch (err) {
        console.error("Failed to send code,", err.message);
        throw new Error(err.message);
      }
    },
    async verifyUser(_, { email, code }, context) {
      try {
        // Find the user by email
        const user = await User.findOne({ email });

        // Check if user exists and the verification token matches the provided code
        if (!user || user.verificationToken !== code) {
          console.error("Invalid Code");
          throw new Error("Invalid Code");
        }

        // Check if the verification token has expired
        const tokenExpirationDate = new Date(user.verificationTokenExpiresAt);
        if (tokenExpirationDate < new Date()) {
          console.error("Verification code has expired");
          throw new Error("Verification code has expired");
        }

        // Clear the verification token and update user verification status
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        user.verified = true;
        user.expiresAt = undefined;

        // Save the updated user
        await user.save();

        // Send welcome email
        await sendEmail(
          "welcome_message",
          user.email,
          "Welcome to the family",
          "",
          user.username
        );

        const token = generateToken(user);
        setUserCookie(token, context);
        // Log the success
        // console.log("User verified and welcome email sent.");

        // Return the user object, excluding the password field
        return {
          token,
          user: { ...user.toObject(), password: undefined },
        };
      } catch (err) {
        // Improved error logging
        console.error("Failed to verify user:", err.message);
        throw new Error(`Verification Failed: ${err.message}`);
      }
    },
    async passwordReset(_, { email }) {
      try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
          console.error("User doesn't exist");
          throw new Error("User doesn't exist");
        }

        // Generate a secure reset token (you should define this function)
        const passwordResetToken = generateResetToken();

        // Set token expiry time (15 minutes from now)
        const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

        // Update the user with the reset token and expiry
        user.resetToken = passwordResetToken;
        user.resetTokenExpiresAt = new Date(expiresAt); // Store as Date

        await user.save();

        // console.log("User after updating:", user);

        // Send password reset email with the token link
        await sendEmail(
          "password_reset",
          user.email,
          "Password Reset Requested",
          "",
          "",
          `${process.env.CLIENT_URL}/reset-password/${passwordResetToken}` // Reset link
        );

        // console.log("Password reset email sent");
        return {
          message: "Password reset link sended to your email.",
          success: true,
        };
      } catch (err) {
        console.error("Failed to reset password:", err.message);
        throw new Error(`Failed to reset password: ${err.message}`);
      }
    },

    async newPassword(_, { password, token }, context) {
      try {
        // Find user by the reset token
        const user = await User.findOne({ resetToken: token });

        if (!user || Date.now() > user.resetTokenExpiresAt) {
          throw new Error("Token is invalid or has expired.");
        }

        // Set the new password
        user.password = password;
        user.resetToken = undefined;
        user.resetTokenExpiresAt = undefined;
        user.expiresAt = undefined;
        await user.save();

        // Generate a new token for the user (if you want to log them in immediately)
        const newAuthToken = generateToken(user);

        setUserCookie(newAuthToken, context);
        // Send success email
        sendEmail(
          "password_reset_success",
          user.email,
          "Password Reset Successfully",
          "",
          user.username
        );

        return {
          message: "Password Reset Successfully",
          success: true,
        };
      } catch (err) {
        console.error("Error resetting password:", err.message);
        throw new Error(err.message);
      }
    },
    async login(_, { usernameoremail, password }, context) {
      try {
        // Find user by either username or email
        const user = await User.findOne({
          $or: [{ username: usernameoremail }, { email: usernameoremail }],
        });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        // Check if the provided password matches the stored one
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          throw new Error("Invalid credentials");
        }

        // Generate a token for the user
        const token = generateToken(user);

        // Set the token in an http-only cookie
        setUserCookie(token, context);

        // Return the user data without the password
        const returnuser = { ...user.toObject(), password: undefined };
        return { token, user: returnuser };
      } catch (err) {
        console.error("Error logging in:", err.message);
        throw new Error(err.message);
      }
    },
    async logout(parameter, args, { res }) {
      res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : undefined, // Only set in production
      });
      return { message: "logged out sucessfully", success: true };
    },
  },
};

export default resolvers;
