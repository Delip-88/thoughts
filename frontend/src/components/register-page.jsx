'use client'

import React, { useState } from 'react'
import { Eye, EyeOff, UserPlus, Mail, User, ArrowLeft } from 'lucide-react'
import { useMutation } from '@apollo/client'
import REGISTER_USER from '@/graphql/mutations/registerGql'
import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Input = React.forwardRef(({ className, type, icon: Icon, ...props }, ref) => {
  return (
    (<div className="relative">
      {Icon && <Icon
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={18} />}
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${Icon ? 'pl-10' : 'pl-3'} ${className}`}
        ref={ref}
        {...props} />
    </div>)
  );
})
Input.displayName = 'Input'

const Button = ({ children, variant = 'default', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background'
  const variantStyles = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    link: 'underline-offset-4 hover:underline text-primary',
  }
  return (
    (<button
      className={`${baseStyles} ${variantStyles[variant]} ${className} px-4 py-2`}
      {...props}>
      {children}
    </button>)
  );
}

export function RegisterPageJsx() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  })
  const navigate = useNavigate()
  const [registerUser , {data,error, loading}] = useMutation(REGISTER_USER)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

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

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.username) {
      newErrors.username = 'Username is required'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      console.log("Form submitted:", formData);
      try {
        const response = await registerUser({
          variables: {
            user: {
              email: formData.email,
              username: formData.username,
              password: formData.password,
            },
          },
        });
  
        const { message, success } = response.data?.register;
  
        if (success) {
          // Optionally store email in localStorage for future use
          localStorage.setItem("register-email", formData.email);
  
          // Navigate to the email verification page with state
          navigate("/email-verification", { state: { email: formData.email } });
          toast.info("Verification code sent to your email!");
        } else {
          console.error("Registration failed");
        }
      } catch (err) {
        console.error("Registration error:", err.message);
  
        // Handle different types of errors
        if (err.graphQLErrors?.[0]) {
          toast.error(err.graphQLErrors[0].message);
          err.graphQLErrors.forEach(({ message }) =>
            console.log(`GraphQL error: ${message}`)
          );
        } else if (err.networkError) {
          toast.error("Network error: Please check your internet connection.");
        } else {
          toast.error(err.message || "An unexpected error occurred.");
        }
      }
    }
  };
  
  

  return (
    (<div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <NavLink className="flex items-center justify-center" to='/'>
          <ArrowLeft className="h-6 w-6 mr-2" />
          <span className="text-lg font-semibold">Back to Blog</span>
        </NavLink>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Create your account
                </h1>
                <p
                  className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Join our community and start sharing your ideas
                </p>
              </div>
              <div className="w-full max-w-sm space-y-4">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="email" className="sr-only">
                      Email address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleChange}
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      icon={Mail} />
                    {errors.email && (
                      <p id="email-error" className="mt-2 text-sm text-red-600" role="alert">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="username" className="sr-only">
                      Username
                    </label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleChange}
                      aria-invalid={errors.username ? "true" : "false"}
                      aria-describedby={errors.username ? "username-error" : undefined}
                      icon={User} />
                    {errors.username && (
                      <p id="username-error" className="mt-2 text-sm text-red-600" role="alert">
                        {errors.username}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      aria-invalid={errors.password ? "true" : "false"}
                      aria-describedby={errors.password ? "password-error" : undefined}
                      icon={showPassword ? EyeOff : Eye} />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                    </button>
                    {errors.password && (
                      <p id="password-error" className="mt-2 text-sm text-red-600" role="alert">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  <Button type="submit" className="w-full">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register
                  </Button>
                </form>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Already have an account?{' '}
                  <NavLink to='/login' className="font-medium text-primary hover:underline">
                    Log in
                  </NavLink>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer
        className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2023 My Blog. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </a>
        </nav>
      </footer>
    </div>)
  );
}