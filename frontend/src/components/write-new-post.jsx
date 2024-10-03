"use client";

import React, { useContext, useState } from "react";
import { ArrowLeft, Send, Image as ImageIcon, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import CREATE_POST from "@/graphql/mutations/newPostGql";
import { toast } from "react-toastify";
import { AuthContext } from "@/middleware/AuthContext";
import FETCH_POSTS from "@/graphql/postsGql";
import Loader from "./loader/Loader";

const Input = React.forwardRef(({ className, type, label, ...props }, ref) => {
  return (
    <div className="w-full">
      <label
        className="text-sm font-medium text-gray-700 mb-1 block"
        htmlFor={props.id}
      >
        {label}
      </label>
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    </div>
  );
});
Input.displayName = "Input";

const Textarea = React.forwardRef(({ className, label, ...props }, ref) => {
  return (
    <div className="w-full">
      <label
        className="text-sm font-medium text-gray-700 mb-1 block"
        htmlFor={props.id}
      >
        {label}
      </label>
      <textarea
        className={`flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
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
  const [createPost, { data, error, loading }] = useMutation(CREATE_POST, {
    refetchQueries: [{ query: FETCH_POSTS }],
    awaitRefetchQueries: true,
  });
  const [posting, setPosting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
    tags: [],
    authorId: user._id,
  });
  const [errors, setErrors] = useState({
    title: "",
    content: "",
    image: "",
    tags: "",
  });
  const [currentTag, setCurrentTag] = useState("");

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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "",
      }));
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
    // if (!formData.image) {
    //   newErrors.image = 'Featured image is required'
    //   isValid = false
    // }
    if (formData.tags.length === 0) {
      newErrors.tags = "At least one tag is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", import.meta.env.VITE_UNSIGNED_UPLOAD_PRESET);
    data.append("folder", import.meta.env.VITE_UNSIGNED_UPLOAD_POST_IMAGE);
    data.append("tags", formData.tags.join(","));

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();
      return result;
    } catch (err) {
      console.error(`Error uploading image: ${err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setPosting(true);

    if (validateForm()) {
      // console.log(formData);
      const requiredImageProps = null;
      if (formData.image) {
        const imageProps = await uploadImage(formData.image);

        requiredImageProps = {
          public_id: imageProps.public_id,
          secure_url: imageProps.secure_url,
          asset_id: imageProps.asset_id,
          version: parseInt(imageProps.version, 10), // Ensure this is an integer
          format: imageProps.format,
          width: parseInt(imageProps.width, 10), // Convert to integer
          height: parseInt(imageProps.height, 10), // Convert to integer
          created_at: imageProps.created_at, // Date as a string
        };
      }
      try {
        const response = await createPost({
          variables: {
            post: {
              title: formData.title,
              content: formData.content,
              tags: formData.tags,
              authorId: formData.authorId,
              image: requiredImageProps,
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
        }
        setPosting(false);
        navigate("/Home");
      } catch (err) {
        await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
          {
            method: "POST",
            body: JSON.stringify({ public_id: requiredImageProps.public_id }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (err.graphQLErrors?.[0]) {
          toast.error(err.graphQLErrors[0].message || "An error occurred.");
        } else if (err.networkError) {
          toast.error("Network error: Please check your internet connection.");
        } else {
          toast.error(err.message || "An unexpected error occurred.");
        }
      } finally {
        setPosting(false);
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      {posting && <Loader />}
      <div className="flex flex-col min-h-screen">
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
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
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
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="image"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="image"
                                  name="image"
                                  type="file"
                                  className="sr-only"
                                  onChange={handleImageChange}
                                  accept="image/*"
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                        </div>
                        {formData.image && (
                          <p className="mt-2 text-sm text-gray-500">
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
                    <Button type="submit" className="w-full" disabled={loading}>
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
