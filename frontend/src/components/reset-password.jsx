'use client'

import React, { useState } from 'react'
import { ArrowLeft, Mail, ArrowRight } from 'lucide-react'
import { useMutation } from '@apollo/client';
import FORGOT_PASSWORD from '@/graphql/mutations/forgotPasswordGql';
import { toast } from 'react-toastify';

const Input = React.forwardRef(({ className, type, icon: Icon, label, ...props }, ref) => {
  return (
    (<div className="relative">
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
    </div>)
  );
})
Input.displayName = 'Input'

const Button = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
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

export function ResetPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [passwordReset, {data,error:resetError, loading}] = useMutation(FORGOT_PASSWORD)

  const handleSubmit =async (e) => {
    e.preventDefault()
    if (!email) {
      setError('Email is required')
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid')
      return
    }
    try {
      const response = await passwordReset({
        variables:{
          email: email
        }
      })

      const {message, success} = response.data?.passwordReset
      if(success){
        toast.info(message)
      }
    } catch (err) {
      console.error(err.message)
      throw new Error("Password reset Failed.")
    }
    console.log('Password reset requested for:', email)
    setIsSubmitted(true)
    setError('')
    
    

  }

  return (
    (<div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <a className="flex items-center justify-center" href="#">
          <ArrowLeft className="h-6 w-6 mr-2" />
          <span className="text-lg font-semibold">Back to Login</span>
        </a>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Reset Your Password
                </h1>
                <p
                  className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-4">
                {!isSubmitted ? (
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input
                      id="email"
                      type="email"
                      label="Email"
                      placeholder="Enter your email address"
                      icon={Mail}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={error ? "true" : "false"}
                      aria-describedby={error ? "email-error" : undefined} />
                    {error && (
                      <p id="email-error" className="text-sm text-red-600" role="alert">{error}</p>
                    )}
                    <Button type="submit" className="w-full">
                      Reset Password
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-100 text-green-700 rounded-md">
                      <p>Password reset instructions have been sent to your email.</p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsSubmitted(false)}>
                      Reset Another Password
                    </Button>
                  </div>
                )}
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