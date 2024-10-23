"use client";

import React, { useContext, useState, useRef } from "react";
import { ArrowLeft, Send, Image as ImageIcon, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import CREATE_POST from "@/graphql/mutations/newPostGql";
import { toast } from "react-toastify";
import { AuthContext } from "@/middleware/AuthContext";
import { ThemeContext } from "@/middleware/ThemeContext";
import {FETCH_POSTS} from "@/graphql/query/postsGql";
import Loader from "./loader/Loader";

import ME_QUERY from "@/graphql/query/meGql";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUploadImage } from "./Functions/uploadImage";
import { useDeleteImage } from "./Functions/deleteImage";

const Input = React.forwardRef(({ className, type, label, ...props }, ref) => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <div className="w-full">
      <label
        className={`text-sm font-medium mb-1 block ${
          isDarkMode ? "text-gray-200" : "text-gray-700"
        }`}
        htmlFor={props.id}
      >
        {label}
      </label>
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          isDarkMode ? "text-gray-200" : "text-gray-900"
        } ${className}`}
        ref={ref}
        {...props}
      />
    </div>
  );
});
Input.displayName = "Input";

const Textarea = React.forwardRef(({ className, label, ...props }, ref) => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <div className="w-full">
      <label
        className={`text-sm font-medium mb-1 block ${
          isDarkMode ? "text-gray-200" : "text-gray-700"
        }`}
        htmlFor={props.id}
      >
        {label}
      </label>
      <textarea
        className={`flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          isDarkMode ? "text-gray-200" : "text-gray-900"
        } ${className}`}
        ref={ref}
        {...props}
      />
    </div>
  );
});
Textarea.displayName = "Textarea";

const Button = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    link: "underline-offset-4 hover:underline text-primary",
  };
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className} px-4 py-2`}
      {...props}
    >
      {children}
    </button>
  );
};

export function WriteNewPost() {
  const navigate = useNavigate();
  const { user, cloudName } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  const [createPost, { loading: cLoading }] = useMutation(CREATE_POST, {
    refetchQueries: [{ query: FETCH_POSTS }, { query: ME_QUERY }],
    awaitRefetchQueries: true,
  });

  const { uploadImage, loading: uLoading } = useUploadImage();
  const { deleteImage, loading: dLoading } = useDeleteImage();

  const [posting, setPosting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    image: null,
    tags: [],
    authorId: user._id,
  });
  const [errors, setErrors] = useState({
    title: "",
    content: "",
    category: "",
    image: "",
    tags: "",
  });
  const [currentTag, setCurrentTag] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const categories = [
    "Technology",
    "Travel",
    "Food",
    "Lifestyle",
    "Health",
    "Business",
    "Entertainment",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };
  const handleCategoryChange = (value) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Check file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPEG, PNG, WEBP and GIF images are allowed");
        return;
      }

      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "",
      }));

      // Use FileReader for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.onerror = () => {
        toast.error("Error reading file");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prevData) => ({
        ...prevData,
        tags: [...prevData.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      tags: prevData.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const validateForm = () => {
    const newErrors = {
      title: "",
      content: "",
      image: "",
      category: "",
      tags: "",
    };
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }
    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
      isValid = false;
    }
    if (formData.tags.length === 0) {
      newErrors.tags = "At least one tag is required";
      isValid = false;
    }
    if (formData.category.trim() === 0) {
      newErrors.tags = "Category is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setPosting(true);

    if (validateForm()) {
      let requiredImageProps = null;
      if (formData.image) {
        try {
          const imageData = await uploadImage(
            cloudName,
            formData.image,
            import.meta.env.VITE_SIGNED_UPLOAD_PRESET,
            import.meta.env.VITE_UPLOAD_POST_IMAGE_FOLDER
          );
          if (!imageData) {
            setPosting(false);
            return; // Exit if image upload failed
          }

          requiredImageProps = {
            public_id: imageData.public_id,
            secure_url: imageData.secure_url,
            asset_id: imageData.asset_id,
            version: parseInt(imageData.version, 10),
            format: imageData.format,
            width: parseInt(imageData.width, 10),
            height: parseInt(imageData.height, 10),
            created_at: imageData.created_at,
          };
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.error("Failed to upload image. Please try again.");
          setPosting(false);
          return;
        }
      }

      try {
        const imageWithoutTypename = requiredImageProps
          ? (({ __typename, ...rest }) => rest)(requiredImageProps)
          : null;

        const response = await createPost({
          variables: {
            post: {
              title: formData.title,
              content: formData.content,
              tags: formData.tags,
              category: formData.category,
              authorId: formData.authorId,
              image: imageWithoutTypename,
            },
          },
        });

        const { message, success } = response.data?.addPost;

        if (success) {
          toast.success(message);
          setFormData({
            title: "",
            content: "",
            image: null,
            tags: [],
            authorId: user._id,
          });
          setPreviewImage(null);
          navigate("/Home");
        }
      } catch (err) {
        console.log("Error:", err);
        if (err.graphQLErrors?.[0]) {
          toast.error(err.graphQLErrors[0].message || "An error occurred.");
        } else if (err.networkError) {
          toast.error("Network error: Please check your internet connection.");
        } else {
          toast.error(err.message || "An unexpected error occurred.");
        }

        // If post creation fails, attempt to delete the uploaded image
        if (requiredImageProps) {
          try {
            await deleteImage(cloudName, requiredImageProps.public_id);
          } catch (deleteError) {
            console.error("Failed to delete uploaded image:", deleteError);
          }
        }
      } finally {
        setPosting(false);
      }
    } else {
      setPosting(false);
    }
  };

  if (cLoading || uLoading || dLoading) return <Loader />;

  return (
    <>
      {posting && <Loader />}
      <div
        className={`flex flex-col min-h-screen ${
          isDarkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-900"
        }`}
      >
        <header className="px-4 lg:px-6 h-14 flex items-center">
          <NavLink className="flex items-center justify-center" to="/Home">
            <ArrowLeft className="h-6 w-6 mr-2" />
            <span className="text-lg font-semibold">Back to My Posts</span>
          </NavLink>
        </header>
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Write a New Post
                  </h1>
                  <p
                    className={`mx-auto max-w-[700px] ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    } md:text-xl`}
                  >
                    Share your thoughts and ideas with the world
                  </p>
                </div>
                <div className="w-full max-w-2xl space-y-8">
                  <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Post Details</h2>
                      <Input
                        id="title"
                        name="title"
                        type="text"
                        label="Title"
                        placeholder="Enter your post title"
                        value={formData.title}
                        onChange={handleChange}
                        aria-invalid={errors.title ? "true" : "false"}
                        aria-describedby={
                          errors.title ? "title-error" : undefined
                        }
                      />
                      {errors.title && (
                        <p
                          id="title-error"
                          className="mt-2 text-sm text-red-600"
                          role="alert"
                        >
                          {errors.title}
                        </p>
                      )}
                      <Textarea
                        id="content"
                        name="content"
                        label="Content"
                        placeholder="Write your post content here..."
                        value={formData.content}
                        onChange={handleChange}
                        aria-invalid={errors.content ? "true" : "false"}
                        aria-describedby={
                          errors.content ? "content-error" : undefined
                        }
                      />
                      {errors.content && (
                        <p
                          id="content-error"
                          className="mt-2 text-sm text-red-600"
                          role="alert"
                        >
                          {errors.content}
                        </p>
                      )}
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Featured Image</h2>
                      <div className="w-full">
                        <div
                          className={`mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                            isDarkMode ? "border-gray-600" : "border-gray-300"
                          } ${previewImage ? "h-64" : ""}`}
                        >
                          {previewImage ? (
                            <div className="relative w-full h-full">
                              <img
                                src={previewImage}
                                alt="Selected preview"
                                className="max-h-full max-w-full object-contain"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setPreviewImage(null);
                                  setFormData((prevData) => ({
                                    ...prevData,
                                    image: null,
                                  }));
                                  if (fileInputRef.current) {
                                    fileInputRef.current.value = "";
                                  }
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                aria-label="Remove image"
                              >
                                <X size={20} />
                              </button>
                            </div>
                          ) : (
                            <div
                              className="space-y-1 text-center cursor-pointer"
                              onClick={() =>
                                fileInputRef.current &&
                                fileInputRef.current.click()
                              }
                            >
                              <ImageIcon
                                className={`mx-auto h-12 w-12 ${
                                  isDarkMode ? "text-gray-400" : "text-gray-400"
                                }`}
                              />
                              <div
                                className={`flex text-sm ${
                                  isDarkMode ? "text-gray-300" : "text-gray-600"
                                }`}
                              >
                                <label
                                  htmlFor="image"
                                  className={`relative cursor-pointer bg-transparent rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary`}
                                >
                                  <span>Upload a file</span>
                                  <input
                                    id="image"
                                    name="image"
                                    type="file"
                                    className="sr-only"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    ref={fileInputRef}
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p
                                className={`text-xs ${
                                  isDarkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                PNG, JPG, GIF up to 10MB
                              </p>
                            </div>
                          )}
                        </div>
                        {formData.image && (
                          <p
                            className={`mt-2 text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Selected file: {formData.image.name}
                          </p>
                        )}
                      </div>
                      {errors.image && (
                        <p
                          id="image-error"
                          className="mt-2 text-sm text-red-600"
                          role="alert"
                        >
                          {errors.image}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 w-full sm:w-1/2 lg:w-1/3">
                      <Label
                        htmlFor="category"
                        className={`block text-sm font-medium ${
                          isDarkMode ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        Category
                      </Label>
                      <Select
                        onValueChange={handleCategoryChange}
                        value={formData.category}
                      >
                        <SelectTrigger
                          className={`w-full ${
                            isDarkMode
                              ? "bg-gray-800 text-gray-200 border-gray-700"
                              : "bg-white text-gray-900 border-gray-300"
                          }`}
                        >
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent
                          className={`${
                            isDarkMode
                              ? "bg-gray-800 text-gray-200"
                              : "bg-white text-gray-900"
                          }`}
                        >
                          {categories.map((category) => (
                            <SelectItem
                              key={category}
                              value={category.toLowerCase()}
                              className={`${
                                isDarkMode
                                  ? "hover:bg-gray-700"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p
                          id="category-error"
                          className="mt-2 text-sm text-red-600"
                          role="alert"
                        >
                          {errors.category}
                        </p>
                      )}
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Tags</h2>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="tag"
                          name="tag"
                          type="text"
                          label="Add Tags"
                          placeholder="Enter a tag"
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                        />
                        <Button type="button" onClick={handleAddTag}>
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm flex items-center"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 focus:outline-none"
                              aria-label={`Remove tag ${tag}`}
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                      {errors.tags && (
                        <p
                          id="tags-error"
                          className="mt-2 text-sm text-red-600"
                          role="alert"
                        >
                          {errors.tags}
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={cLoading || uLoading || dLoading}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Publish Post
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
