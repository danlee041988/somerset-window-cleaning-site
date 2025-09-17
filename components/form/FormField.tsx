"use client"

import React from 'react'
import { cn } from '@/lib/utils'

export interface FormFieldProps {
  label: string
  error?: string
  success?: string
  warning?: string
  required?: boolean
  requiredText?: string
  children: React.ReactNode
  className?: string
  id?: string
}

export function FormField({ 
  label, 
  error, 
  success, 
  warning, 
  required, 
  requiredText,
  children, 
  className,
  id 
}: FormFieldProps) {
  const hasError = !!error
  const hasSuccess = !!success && !error
  const hasWarning = !!warning && !error && !success

  return (
    <div className={cn('space-y-2', className)}>
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-white/90"
      >
        {label}
        {required && (
          <span className="text-red-400 ml-1" aria-label="required">*</span>
        )}
        {requiredText && (
          <span className="text-xs text-white/60 ml-2 font-normal">
            ({requiredText})
          </span>
        )}
      </label>
      
      {children}
      
      {/* Error Message */}
      {hasError && (
        <div className="flex items-start gap-2 text-red-400 text-xs" role="alert">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      {/* Success Message */}
      {hasSuccess && (
        <div className="flex items-center gap-2 text-green-400 text-xs">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{success}</span>
        </div>
      )}
      
      {/* Warning Message */}
      {hasWarning && (
        <div className="flex items-center gap-2 text-yellow-400 text-xs">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{warning}</span>
        </div>
      )}
    </div>
  )
}

export interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  error?: boolean
  success?: boolean
  warning?: boolean
  className?: string
}

export function FormInput({ 
  error, 
  success, 
  warning, 
  className, 
  ...props 
}: FormInputProps) {
  return (
    <input
      className={cn(
        // Base styles
        'w-full px-4 py-3 rounded-lg border bg-white/5 text-white placeholder-white/50',
        'focus:ring-2 focus:outline-none transition-all duration-200',
        
        // State-based styles
        {
          // Error state
          'border-red-400 focus:border-red-400 focus:ring-red-400/20': error,
          
          // Success state  
          'border-green-400 focus:border-green-400 focus:ring-green-400/20': success && !error,
          
          // Warning state
          'border-yellow-400 focus:border-yellow-400 focus:ring-yellow-400/20': warning && !error && !success,
          
          // Default state
          'border-white/20 focus:border-brand-red focus:ring-brand-red/20': !error && !success && !warning,
        },
        
        className
      )}
      {...props}
    />
  )
}

export interface FormTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  error?: boolean
  success?: boolean
  warning?: boolean
  className?: string
}

export function FormTextarea({ 
  error, 
  success, 
  warning, 
  className, 
  ...props 
}: FormTextareaProps) {
  return (
    <textarea
      className={cn(
        // Base styles
        'w-full px-4 py-3 rounded-lg border bg-white/5 text-white placeholder-white/50',
        'focus:ring-2 focus:outline-none transition-all duration-200 resize-none',
        
        // State-based styles
        {
          // Error state
          'border-red-400 focus:border-red-400 focus:ring-red-400/20': error,
          
          // Success state  
          'border-green-400 focus:border-green-400 focus:ring-green-400/20': success && !error,
          
          // Warning state
          'border-yellow-400 focus:border-yellow-400 focus:ring-yellow-400/20': warning && !error && !success,
          
          // Default state
          'border-white/20 focus:border-brand-red focus:ring-brand-red/20': !error && !success && !warning,
        },
        
        className
      )}
      {...props}
    />
  )
}