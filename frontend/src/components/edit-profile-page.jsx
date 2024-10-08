'use client'

import React, { useState } from 'react'
import { ArrowLeft, User, MapPin, FileText, Camera } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const Input = React.forwardRef(({ className, type, icon: Icon, label, ...props }, ref) => {
  return (
    <div className="relative">
      <label
        className="text-sm font-medium text-gray-700 mb-1 block"
        htmlFor={props.id}>
        {label}
      </label>
      {Icon && <Icon
        className="absolute left-3 top-[34px] transform -translate-y-1/2 text-gray-400"
        size={18} />}
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${Icon ? 'pl-10' : 'pl-3'} ${className}`}
        ref={ref}
        {...props} />
    </div>
  )
})
Input.displayName = 'Input'

const Textarea = React.forwardRef(({ className, icon: Icon, label, ...props }, ref) => {
  return (
    <div className="relative">
      <label
        className="text-sm font-medium text-gray-700 mb-1 block"
        htmlFor={props.id}>
        {label}
      </label>
      {Icon && <Icon
        className="absolute left-3 top-[34px] transform -translate-y-1/2 text-gray-400"
        size={18} />}
      <textarea
        className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${Icon ? 'pl-10' : 'pl-3'} ${className}`}
        ref={ref}
        {...props} />
    </div>
  )
})
Textarea.displayName = 'Textarea'

const Button = ({ children, variant = 'default', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background'
  const variantStyles = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    link: 'underline-offset-4 hover:underline text-primary',
  }
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className} px-4 py-2`}
      {...props}>
      {children}
    </button>
  )
}

export function EditProfilePageJsx() {
  const [formData, setFormData] = useState({
    username: 'johndoe',
    address: '',
    bio: '',
  })
  const [profilePic, setProfilePic] = useState('/placeholder.svg?height=128&width=128')
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePic(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.username.trim()) newErrors.username = 'Username is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      console.log('Form submitted:', formData)
      console.log('Profile picture:', profilePic)
      // Here you would typically send the form data and profile picture to your backend
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <NavLink className="flex items-center justify-center" to="/Home">
          <ArrowLeft className="h-6 w-6 mr-2" />
          <span className="text-lg font-semibold">Back to Dashboard</span>
        </NavLink>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Edit Your Profile
                </h1>
                <p
                  className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Update your account information and profile picture
                </p>
              </div>
              <div className="w-full max-w-md space-y-4">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 mb-4">
                      <img
                        src={profilePic}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover" />
                      <label
                        htmlFor="profile-pic"
                        className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer">
                        <Camera className="h-5 w-5" />
                        <span className="sr-only">Change profile picture</span>
                      </label>
                      <input
                        id="profile-pic"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange} />
                    </div>
                  </div>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    label="Username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    aria-invalid={errors.username ? "true" : "false"}
                    aria-describedby={errors.username ? "username-error" : undefined}
                    icon={User} />
                  {errors.username && (
                    <p id="username-error" className="mt-2 text-sm text-red-600" role="alert">{errors.username}</p>
                  )}
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    label="Address"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleChange}
                    aria-invalid={errors.address ? "true" : "false"}
                    aria-describedby={errors.address ? "address-error" : undefined}
                    icon={MapPin} />
                  {errors.address && (
                    <p id="address-error" className="mt-2 text-sm text-red-600" role="alert">{errors.address}</p>
                  )}
                  <Textarea
                    id="bio"
                    name="bio"
                    label="Bio"
                    placeholder="Tell us about yourself"
                    value={formData.bio}
                    onChange={handleChange}
                    aria-invalid={errors.bio ? "true" : "false"}
                    aria-describedby={errors.bio ? "bio-error" : undefined}
                    icon={FileText}
                    rows={4} />
                  {errors.bio && (
                    <p id="bio-error" className="mt-2 text-sm text-red-600" role="alert">{errors.bio}</p>
                  )}
                  <Button type="submit" className="w-full">
                    Save Changes
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}