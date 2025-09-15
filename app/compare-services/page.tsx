'use client'

import { useState } from 'react'
import Section from '@/components/Section'
import Button from '@/components/Button'
import { servicesData } from '@/content/services-data'

export default function CompareServicesPage() {
  const [selectedServices, setSelectedServices] = useState<string[]>(['Window Cleaning'])
  const [frequency, setFrequency] = useState<'monthly' | 'bi-monthly' | 'quarterly' | 'annual'>('bi-monthly')
  
  const toggleService = (serviceName: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceName) 
        ? prev.filter(s => s !== serviceName)
        : [...prev, serviceName]
    )
  }
  
  // Calculate pricing based on selections
  const calculatePrice = (service: string): number => {
    const basePrice = {
      'Window Cleaning': 25,
      'Gutter Clearing': 80,
      'Conservatory Roof Cleaning': 120,
      'Solar Panel Cleaning': 100,
      'Fascias & Soffits Cleaning': 80,
      'External Commercial Cleaning': 200
    }
    
    const frequencyMultiplier = {
      'monthly': 0.85,
      'bi-monthly': 1,
      'quarterly': 1.1,
      'annual': 1.2
    }
    
    return (basePrice[service as keyof typeof basePrice] || 100) * frequencyMultiplier[frequency]
  }
  
  const totalPrice = selectedServices.reduce((sum, service) => sum + calculatePrice(service), 0)
  const bundleDiscount = selectedServices.length >= 2 ? 0.1 : 0
  const discountedPrice = totalPrice * (1 - bundleDiscount)
  const savings = totalPrice - discountedPrice
  
  return (
    <div className="py-16 md:py-20">
      <Section 
        title="Service Comparison & Bundle Builder" 
        subtitle="Compare our services and create your perfect maintenance package"
      >
        {/* Service Selection Grid */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-white mb-6">Select Services to Compare</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {servicesData.map((service) => (
              <div
                key={service.title}
                onClick={() => toggleService(service.title)}
                className={`cursor-pointer rounded-xl border-2 p-6 transition-all duration-300 ${
                  selectedServices.includes(service.title)
                    ? 'border-brand-red bg-brand-red/10'
                    : 'border-white/20 bg-white/5 hover:border-white/30'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-white">{service.title}</h4>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedServices.includes(service.title)
                      ? 'border-brand-red bg-brand-red'
                      : 'border-white/40'
                  }`}>
                    {selectedServices.includes(service.title) && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L4 12.586l6.293-6.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <p className="text-sm text-white/70 mb-3">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">{service.price}</span>
                  {service.specialty && (
                    <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/80">
                      {service.specialty}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Frequency Selection */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-white mb-6">Choose Service Frequency</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
            {[
              { value: 'monthly', label: 'Monthly', discount: '15% off' },
              { value: 'bi-monthly', label: 'Every 8 Weeks', discount: 'Standard' },
              { value: 'quarterly', label: 'Quarterly', discount: '+10%' },
              { value: 'annual', label: 'Annual', discount: '+20%' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFrequency(option.value as any)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  frequency === option.value
                    ? 'border-brand-red bg-brand-red/10'
                    : 'border-white/20 bg-white/5 hover:border-white/30'
                }`}
              >
                <div className="font-semibold text-white">{option.label}</div>
                <div className="text-xs text-white/60 mt-1">{option.discount}</div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Comparison Table */}
        {selectedServices.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-white mb-6">Service Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left p-4 text-white/60 font-medium">Feature</th>
                    {selectedServices.map(service => (
                      <th key={service} className="text-center p-4 text-white font-semibold">
                        {service}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="p-4 text-white/80">Typical Duration</td>
                    {selectedServices.map(service => {
                      const durations = {
                        'Window Cleaning': '30-60 mins',
                        'Gutter Clearing': '45-90 mins',
                        'Conservatory Roof Cleaning': '2-4 hours',
                        'Solar Panel Cleaning': '1-2 hours',
                        'Fascias & Soffits Cleaning': '1-2 hours',
                        'External Commercial Cleaning': '2-6 hours'
                      }
                      return (
                        <td key={service} className="text-center p-4 text-white/70">
                          {durations[service as keyof typeof durations] || 'Varies'}
                        </td>
                      )
                    })}
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-4 text-white/80">Equipment Used</td>
                    {selectedServices.map(service => {
                      const equipment = {
                        'Window Cleaning': 'Pure water system',
                        'Gutter Clearing': 'Vacuum system',
                        'Conservatory Roof Cleaning': 'Soft brushes',
                        'Solar Panel Cleaning': 'Deionised water',
                        'Fascias & Soffits Cleaning': 'Low pressure',
                        'External Commercial Cleaning': 'Various'
                      }
                      return (
                        <td key={service} className="text-center p-4 text-white/70">
                          {equipment[service as keyof typeof equipment] || 'Specialized'}
                        </td>
                      )
                    })}
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-4 text-white/80">Recommended Frequency</td>
                    {selectedServices.map(service => {
                      const serviceData = servicesData.find(s => s.title === service)
                      return (
                        <td key={service} className="text-center p-4 text-white/70">
                          {serviceData?.frequency || 'As needed'}
                        </td>
                      )
                    })}
                  </tr>
                  <tr>
                    <td className="p-4 text-white/80 font-semibold">Price per visit</td>
                    {selectedServices.map(service => (
                      <td key={service} className="text-center p-4 text-brand-red font-bold">
                        £{calculatePrice(service).toFixed(0)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Pricing Summary */}
        {selectedServices.length > 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-6 text-center">Your Custom Package Summary</h3>
              
              <div className="space-y-3 mb-6">
                {selectedServices.map(service => (
                  <div key={service} className="flex justify-between text-white/80">
                    <span>{service}</span>
                    <span>£{calculatePrice(service).toFixed(0)}</span>
                  </div>
                ))}
              </div>
              
              {bundleDiscount > 0 && (
                <>
                  <div className="border-t border-white/20 pt-3 mb-3">
                    <div className="flex justify-between text-white/80">
                      <span>Subtotal</span>
                      <span>£{totalPrice.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-green-400">
                      <span>Bundle Discount (10%)</span>
                      <span>-£{savings.toFixed(0)}</span>
                    </div>
                  </div>
                </>
              )}
              
              <div className="border-t border-white/20 pt-3">
                <div className="flex justify-between text-xl font-bold text-white mb-6">
                  <span>Total per visit</span>
                  <span className="text-brand-red">£{discountedPrice.toFixed(0)}</span>
                </div>
                
                <Button href={`/get-in-touch?services=${selectedServices.join(',')}&frequency=${frequency}`} variant="primary" className="w-full text-lg py-4">
                  Get This Package
                </Button>
              </div>
              
              {selectedServices.length === 1 && (
                <p className="text-sm text-yellow-200 text-center mt-4">
                  💡 Add another service to unlock 10% bundle discount!
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Benefits of Bundling */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Why Bundle Services?</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-red/20 flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Save Money</h4>
              <p className="text-sm text-white/70">10-20% off when combining services</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-red/20 flex items-center justify-center">
                <span className="text-2xl">⏰</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Save Time</h4>
              <p className="text-sm text-white/70">One visit for multiple services</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-red/20 flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Convenience</h4>
              <p className="text-sm text-white/70">Synchronized maintenance schedule</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-red/20 flex items-center justify-center">
                <span className="text-2xl">🏠</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Complete Care</h4>
              <p className="text-sm text-white/70">Keep your entire property pristine</p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}