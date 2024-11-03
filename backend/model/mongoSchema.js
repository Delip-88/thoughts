import mongoose from "mongoose";
import bcrypt from "bcrypt";

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true,"Not Available"],
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true, // Unique constraint for email
  },
  address: {
    type: String
  },
  bio: {
    type: String
  },
  image: {
    public_id: String,
    secure_url: String,
    asset_id: String,
    version: Number,
    format: String,
    width: Number,
    height: Number,
    created_at: Date
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verified: {
    type: Boolean,
    default: false,
    required: true,
  },
  verificationToken: {
    type: String,
  },
  verificationTokenExpiresAt: {
    type: Date,
  },
  resetToken:{
    type: String,
  },
  resetTokenExpiresAt:{
    type: Date,
  }
  ,
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',  // Reference to the 'Post' model
    }
  ],
  expiresAt: {
    type: Date,
    default: Date.now, // Adjust to set the expiration window
    index: { expires: '15m' }, // Automatically remove after 24 hours
  },
}, { timestamps: true });

// Ensure email is unique by creating a unique index
userSchema.index({ email: 1 }, { unique: true });

// Pre-save middleware to hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

// Method to compare the provided password with the hashed password in the database
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Post Schema
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  category: {
    type: String,
    enum: [
      "technology",
      "travel",
      "food",
      "lifestyle",
      "health",
      "business",
      "entertainment",
      "other",
    ],
    required: [true, "Category is required"],
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "Author is required"]
  },
  tags: {
    type: [String],
    required: [true, "Tags are required"]
  },
  image: {
    public_id: String,
    secure_url: String,
    asset_id: String,
    version: Number,
    format: String,
    width: Number,
    height: Number,
    created_at: Date
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
}, { timestamps: true });

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  // replies: [
  //   {
  //     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  //     content: { type: String, required: true },
  //     createdAt: { type: Date, default: Date.now },
  //   }
  // ],
  // likes: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'User',
  //   },
  // ],
},{timestamps: true});



// Export the models using ES module syntax
export const User = mongoose.model("User", userSchema);
export const Post = mongoose.model("Post", postSchema);
export const Comment= mongoose.model("Comment", commentSchema);
