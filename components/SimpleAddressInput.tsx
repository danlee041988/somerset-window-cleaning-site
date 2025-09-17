"use client"

import React from 'react'

interface SimpleAddressInputProps {
  value: string
  onChange: (address: string) => void
  placeholder?: string
  className?: string
  required?: boolean
  disabled?: boolean
}

export default function SimpleAddressInput({
  value,
  onChange,
  placeholder = "Enter your full address...",
  className = "",
  required = false,
  disabled = false
}: SimpleAddressInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/50 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none transition-colors ${className}`}
      />
    </div>
  )
}