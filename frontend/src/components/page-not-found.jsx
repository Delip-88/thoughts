'use client'

import React from 'react'
import { AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function PageNotFoundComponent() {
  const navigate = useNavigate()

  return (
    (<div
      className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div
        className="max-w-md w-full px-6 py-8 bg-white dark:bg-gray-800 shadow-md rounded-lg text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 dark:text-red-400 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          404 - Page Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate('/Home')}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors duration-200">
          Go Back Home
        </button>
      </div>
    </div>)
  );
}