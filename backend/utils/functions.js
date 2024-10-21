import crypto from "crypto";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

// Generic function to get data from a collection (model)
export const getData = async (collection) => {
  try {
    const data = await collection.find(); // Use the actual model to query
    return data;
  } catch (err) {
    console.error(err.message);
    throw new Error("Failed to fetch data");
  }
};

// Function to get data by ID
export const getDataById = async (collection, id) => {
  try {
    const data = await collection.findById(id).select("-password");
    if (!data) {
      return null; // Return null if data not found
    }
    return data;
  } catch (err) {
    console.error(err.message);
    throw new Error("Failed to fetch data by ID");
  }
};

export const generateResetToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  return token;
};

export const setUserCookie = async (token, context) => {
  const { res } = context;
  if (!res) {
    throw new Error("Response object not found in context");
  }

  try {
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Adjust sameSite for production
    });
  } catch (err) {
    console.error("Error setting cookie:", err.message);
    throw new Error("Failed to set authentication cookie");
  }
};

// Function to  Delete data by ID
export const deleteDataById = async (Collection, id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID format");
    }

    const result = await Collection.findByIdAndDelete(id);

    if (!result) {
      throw new Error(`${Collection.modelName} not found`);
    }

    // Ensure that result.image exists before checking for the public_id
    if (result.image && result.image.public_id) {
      await deleteImage(result.image.public_id);
    }

    return { message: "Deletion Success", success: true };
  } catch (err) {
    console.error(
      `Failed to delete ${Collection.modelName} with ID: ${id}`,
      err.message
    );
    throw new Error(`Deletion failed: ${err.message}`);
  }
};

const deleteImage = async (publicId) => {
  try {
    const response = await cloudinary.uploader.destroy(publicId);

    return response;
  } catch (err) {
    console.log("Error deleting image: ", err);
    throw new Error(err.message);
  }
};

export const uploadSignature = async (tags, upload_preset, uploadFolder) => {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const paramsToSign = {
    timestamp: timestamp,
    folder: uploadFolder,
    upload_preset: upload_preset,
    tags: tags || undefined,
  };

  //Generate the signature
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    cloudinary.config().api_secret
  );

  return { timestamp: timestamp, signature: signature };
};

export const deleteSignature = async (publicId) => {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const paramsToSign = {
    timestamp: timestamp,
    public_id: publicId,
  };

  //Generate the signature
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    cloudinary.config().api_secret
  );

  return { timestamp: timestamp, signature: signature };
};
