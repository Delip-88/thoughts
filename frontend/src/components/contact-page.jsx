'use client'

import React, { useState, useContext } from 'react'
import { ThemeContext } from '@/middleware/ThemeContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function ContactPageJsx() {
  const { isDarkMode } = useContext(ThemeContext)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)
      try {
        // Simulating an API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setSubmitStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } catch (error) {
        setSubmitStatus('error')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    (<div
      className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <Card
          className={`max-w-2xl mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Contact Us</CardTitle>
            <CardDescription className="text-center mt-2">
              We'd love to hear from you. Send us a message!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className={errors.name ? 'border-red-500' : ''} />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email"
                  className={errors.email ? 'border-red-500' : ''} />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message"
                  rows={5}
                  className={errors.message ? 'border-red-500' : ''} />
                {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
            {submitStatus === 'success' && (
              <Alert className="mt-4 bg-green-100 text-green-800 border-green-300">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Your message has been sent successfully. We'll get back to you soon!</AlertDescription>
              </Alert>
            )}
            {submitStatus === 'error' && (
              <Alert className="mt-4 bg-red-100 text-red-800 border-red-300">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>There was an error sending your message. Please try again later.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>)
  );
}