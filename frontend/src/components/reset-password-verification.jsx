'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft, Lock, Check, X } from 'lucide-react'
import { useMutation } from '@apollo/client';
import NEW_PASSWORD from '@/graphql/mutations/newPasswordGql';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from './loader/Loader';

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

const PasswordStrengthIndicator = ({
  password
}) => {
  const [strength, setStrength] = useState(0)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const calculateStrength = () => {
      let newStrength = 0
      if (password.length >= 8) newStrength++
      if (password.match(/[a-z]/) && password.match(/[A-Z]/)) newStrength++
      if (password.match(/\d/)) newStrength++
      if (password.match(/[^a-zA-Z\d]/)) newStrength++
      return newStrength
    }

    const newStrength = calculateStrength()
    setStrength(newStrength)

    switch (newStrength) {
      case 0:
        setMessage('Very Weak')
        break
      case 1:
        setMessage('Weak')
        break
      case 2:
        setMessage('Fair')
        break
      case 3:
        setMessage('Good')
        break
      case 4:
        setMessage('Strong')
        break
      default:
        setMessage('')
    }
  }, [password])

  const getColor = () => {
    switch (strength) {
      case 1: return 'bg-red-500'
      case 2: return 'bg-yellow-500'
      case 3: return 'bg-blue-500'
      case 4: return 'bg-green-500'
      default: return 'bg-gray-200'
    }
  }

  return (
    (<div className="mt-2">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">Password Strength</span>
        <span className="text-sm font-medium text-gray-700">{message}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${getColor()}`}
          style={{ width: `${(strength / 4) * 100}%` }}></div>
      </div>
    </div>)
  );
}

export function ResetPasswordVerification() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    newPassword: '',
    retypePassword: '',
  })
  const [errors, setErrors] = useState({
    newPassword: '',
    retypePassword: '',
  })

  const [newKey,{data, error, loading}]= useMutation(NEW_PASSWORD)
  const {token} = useParams()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
    }))
  }

  const validateForm = () => {
    const newErrors = {
      newPassword: '',
      retypePassword: '',
    }
    let isValid = true

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required'
      isValid = false
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long'
      isValid = false
    }

    if (!formData.retypePassword) {
      newErrors.retypePassword = 'Please retype your password'
      isValid = false
    } else if (formData.newPassword !== formData.retypePassword) {
      newErrors.retypePassword = 'Passwords do not match'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        const response = await newKey({
          variables:{
            password: formData.newPassword,
            token : token
          }
        })

        const {message, success} = response.data?.newPassword
        if(success){
          toast.success(message)
          setTimeout(() => {
            navigate('/Home')
          }, 2000);
        }
      } catch (err) {
        
      }
      console.log('Password reset successful:', formData.newPassword)
    }
  }

  return (
    (<div className="flex flex-col min-h-screen">
      {loading && <Loader/>}
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <a className="flex items-center justify-center" href="#">
          <ArrowLeft className="h-6 w-6 mr-2" />
          <span className="text-lg font-semibold">Back</span>
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
                  Please enter your new password below.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-4">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      label="New Password"
                      placeholder="Enter your new password"
                      icon={Lock}
                      value={formData.newPassword}
                      onChange={handleChange}
                      aria-invalid={errors.newPassword ? "true" : "false"}
                      aria-describedby={errors.newPassword ? "newPassword-error" : undefined} />
                    {errors.newPassword && (
                      <p id="newPassword-error" className="mt-2 text-sm text-red-600" role="alert">{errors.newPassword}</p>
                    )}
                    <PasswordStrengthIndicator password={formData.newPassword} />
                  </div>
                  <div>
                    <Input
                      id="retypePassword"
                      name="retypePassword"
                      type="password"
                      label="Retype Password"
                      placeholder="Retype your new password"
                      icon={Lock}
                      value={formData.retypePassword}
                      onChange={handleChange}
                      aria-invalid={errors.retypePassword ? "true" : "false"}
                      aria-describedby={errors.retypePassword ? "retypePassword-error" : undefined} />
                    {errors.retypePassword && (
                      <p
                        id="retypePassword-error"
                        className="mt-2 text-sm text-red-600"
                        role="alert">{errors.retypePassword}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700">Password must contain:</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      <li className={formData.newPassword.length >= 8 ? 'text-green-600' : ''}>
                        {formData.newPassword.length >= 8 ? <Check className="inline h-4 w-4 mr-1" /> : <X className="inline h-4 w-4 mr-1" />}
                        At least 8 characters
                      </li>
                      <li
                        className={/[a-z]/.test(formData.newPassword) && /[A-Z]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                        {/[a-z]/.test(formData.newPassword) && /[A-Z]/.test(formData.newPassword) ? <Check className="inline h-4 w-4 mr-1" /> : <X className="inline h-4 w-4 mr-1" />}
                        Both uppercase and lowercase letters
                      </li>
                      <li className={/\d/.test(formData.newPassword) ? 'text-green-600' : ''}>
                        {/\d/.test(formData.newPassword) ? <Check className="inline h-4 w-4 mr-1" /> : <X className="inline h-4 w-4 mr-1" />}
                        At least one number
                      </li>
                      <li
                        className={/[^a-zA-Z\d]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                        {/[^a-zA-Z\d]/.test(formData.newPassword) ? <Check className="inline h-4 w-4 mr-1" /> : <X className="inline h-4 w-4 mr-1" />}
                        At least one special character
                      </li>
                    </ul>
                  </div>
                  <Button type="submit" className="w-full">
                    Reset Password
                  </Button>
                </form>
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