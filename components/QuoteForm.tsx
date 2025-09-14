"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import emailjs from '@emailjs/browser'
import { computeQuote, computeWindowPrice, computeGutterPrice, type ServiceKey, type Bedrooms, type PropertyType, type Frequency } from '@/lib/pricing'

type FormValues = {
  // Contact
  first_name: string
  last_name: string
  email: string
  mobile?: string
  contact_method: 'Email' | 'Mobile'
  postcode: string
  address1?: string
  town?: string

  // Services
  services: ServiceKey[]
  window_frequency?: Frequency
  bedrooms?: Bedrooms
  property_type?: PropertyType
  has_conservatory?: 'yes' | 'no'
  has_extension?: 'yes' | 'no'

  preferred_days?: string
  preferred_time?: string
  timeframe?: 'ASAP' | 'This week' | 'This month'
  preferred_first_date?: string
  flexible_route_day?: boolean

  message?: string
  photos?: FileList

  website?: string // honeypot
}

const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || ''
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || ''
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''

export default function QuoteForm() {
  const formRef = React.useRef<HTMLFormElement>(null)
  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1)
  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle')
  const [captchaToken, setCaptchaToken] = React.useState<string>('')
  const start = React.useRef<number>(Date.now())

  const { register, watch, setError, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: { contact_method: 'Email', services: [] }
  })

  const services = (watch('services') as ServiceKey[]) || []
  const bedroomsW = (watch('bedrooms') as FormValues['bedrooms']) || undefined
  const propertyTypeW = (watch('property_type') as FormValues['property_type']) || undefined
  const hasConservatory = watch('has_conservatory') === 'yes'
  const hasExtension = watch('has_extension') === 'yes'
  const freqW = (watch('window_frequency') as FormValues['window_frequency']) || undefined
  const hasWindow = services.includes('Window Cleaning')
  const hasGutter = services.includes('Gutter Clearing')
  const hasFascias = services.includes('Fascias & Soffits Cleaning')

  const extCount = (hasConservatory ? 1 : 0) + (hasExtension ? 1 : 0)

  // reCAPTCHA v2 (checkbox) - optional
  React.useEffect(() => {
    if (step !== 4 || !RECAPTCHA_SITE_KEY) return
    const id = 'recaptcha-script'
    if (document.getElementById(id)) return
    const s = document.createElement('script')
    s.id = id
    s.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
    s.async = true
    s.defer = true
    document.body.appendChild(s)
    s.onload = () => {
      // @ts-ignore
      if (window.grecaptcha) {
        // @ts-ignore
        window.grecaptcha.ready(() => {
          // @ts-ignore
          window.grecaptcha.render('recaptcha-container', {
            sitekey: RECAPTCHA_SITE_KEY,
            callback: (token: string) => setCaptchaToken(token),
          })
        })
      }
    }
  }, [step])

  // Step 1 -> Step 2: validate property inputs only (no pricing on page 1)
  const goStep2 = () => {
    setStatus('idle')
    if (!bedroomsW) { setError('bedrooms', { type: 'manual', message: 'Select bedrooms' }); return }
    if (!propertyTypeW) { setError('property_type', { type: 'manual', message: 'Select property type' }); return }
    setStep(2)
  }

  // Step 2 -> Step 3: validate services & frequency
  const goStep3 = () => {
    setStatus('idle')
    if (!services || services.length === 0) {
      setError('services', { type: 'manual', message: 'Select at least one service' })
      return
    }
    if (services.includes('Window Cleaning') && bedroomsW !== '6+' && !freqW) {
      setError('window_frequency', { type: 'manual', message: 'Choose a window frequency' })
      return
    }
    setStep(3)
  }

  // Step 3 -> Step 4: validate contact inputs
  const goStep4 = () => {
    setStatus('idle')
    const first = (document.querySelector('[name="first_name"]') as HTMLInputElement)?.value
    const last = (document.querySelector('[name="last_name"]') as HTMLInputElement)?.value
    const email = (document.querySelector('[name="email"]') as HTMLInputElement)?.value
    const postcode = (document.querySelector('[name="postcode"]') as HTMLInputElement)?.value
    const contact = (document.querySelector('input[name="contact_method"]:checked') as HTMLInputElement)?.value
    const mobile = (document.querySelector('[name="mobile"]') as HTMLInputElement)?.value
    if (!first) { setError('first_name', { type: 'manual', message: 'First name is required' }); return }
    if (!last) { setError('last_name', { type: 'manual', message: 'Last name is required' }); return }
    if (!email) { setError('email', { type: 'manual', message: 'Email is required' }); return }
    if (!postcode) { setError('postcode', { type: 'manual', message: 'Postcode is required' }); return }
    if (contact === 'Mobile' && !mobile) { setError('mobile', { type: 'manual', message: 'Mobile is required for mobile contact' }); return }
    setStep(4)
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = formRef.current
    if (!form) return
    setStatus('idle')
    const elapsed = Date.now() - start.current
    const honeypot = (form.querySelector('[name="website"]') as HTMLInputElement)?.value
    if (honeypot) return
    if (elapsed < 1200) return
    if (RECAPTCHA_SITE_KEY && !captchaToken) {
      alert('Please complete the captcha')
      return
    }

    const fullName = `${(form.querySelector('[name="first_name"]') as HTMLInputElement)?.value} ${(form.querySelector('[name="last_name"]') as HTMLInputElement)?.value}`.trim()
    const selected = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="services"]:checked')).map(i => i.value)
    const { total } = computeQuote({
      services: services as ServiceKey[],
      bedrooms: (bedroomsW || '2') as Bedrooms,
      propertyType: (propertyTypeW || 'Semi-Detached') as PropertyType,
      extCount,
      windowFrequency: freqW,
    })
    const ensureHidden = (name: string, value: string) => {
      let input = form.querySelector<HTMLInputElement>(`input[name="${name}"]`)
      if (!input) { input = document.createElement('input'); input.type = 'hidden'; input.name = name; form.appendChild(input) }
      input.value = value
    }
    ensureHidden('name', fullName)
    ensureHidden('services_joined', selected.join(', '))
    ensureHidden('total_estimate', `£${total}`)
    ensureHidden('submitted_at', new Date().toISOString())
    if (captchaToken) ensureHidden('recaptcha_token', captchaToken)

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form, PUBLIC_KEY)
      setStatus('success')
      ;(form as HTMLFormElement).reset()
      setStep(1)
      setCaptchaToken('')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  const { rows, total } = computeQuote({
    services: services as ServiceKey[],
    bedrooms: (bedroomsW || '2') as Bedrooms,
    propertyType: (propertyTypeW || 'Semi-Detached') as PropertyType,
    extCount,
    windowFrequency: freqW,
  })

  const priceForDisplay = (b?: Bedrooms, p?: PropertyType, ex = 0, f?: Frequency) => {
    if (!b || !p) return '—'
    const val = computeWindowPrice(b, p, ex, f)
    return typeof val === 'number' ? `from £${val}` : 'POA'
  }
  const gutterFrom = (b?: Bedrooms, p?: PropertyType, ex = 0) => {
    if (!b || !p) return '—'
    const val = computeGutterPrice(b, p, ex)
    return `from £${val}`
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
      {/* Stepper */}
      <div className="flex items-center gap-3 text-sm">
        <div className="h-1.5 flex-1 rounded bg-white/10">
          <div className="h-1.5 rounded bg-[var(--brand-red)]" style={{ width: step===1? '25%': step===2?'50%': step===3? '75%':'100%' }} />
        </div>
        <div className={`h-2 w-2 rounded-full ${step===1?'bg-[var(--brand-red)]':'bg-white/40'}`} />
        <span className={step===1? 'text-white':'text-white/70'}>Step 1: Property</span>
        <span className="text-white/40">·</span>
        <div className={`h-2 w-2 rounded-full ${step===2?'bg-[var(--brand-red)]':'bg-white/40'}`} />
        <span className={step===2? 'text-white':'text-white/70'}>Step 2: Prices & services</span>
        <span className="text-white/40">·</span>
        <div className={`h-2 w-2 rounded-full ${step===3?'bg-[var(--brand-red)]':'bg-white/40'}`} />
        <span className={step===3? 'text-white':'text-white/70'}>Step 3: Contact & schedule</span>
        <span className="text-white/40">·</span>
        <div className={`h-2 w-2 rounded-full ${step===4?'bg-[var(--brand-red)]':'bg-white/40'}`} />
        <span className={step===4? 'text-white':'text-white/70'}>Step 4: T&Cs & book</span>
      </div>

      {step === 1 ? (
        <div className="space-y-6" data-testid="step-1">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <div>
                <label className="mb-1 block text-sm">Choose a bedroom size and type</label>
                <p className="mb-2 text-xs text-white/60">Prices shown are for Window Cleaning (exterior). Conservatory/extension adds £5 each.</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr items-stretch">
                  {([
                    { label: '1–2 Bed', key: '2' as const },
                    { label: '3 Bed', key: '3' as const },
                    { label: '4 Bed', key: '4' as const },
                    { label: '5 Bed', key: '5' as const },
                    { label: '6+ Bed (POA)', key: '6+' as const },
                  ]).map(g => (
                    <div key={g.key} className={`rounded-xl border p-4 h-full min-h-[9.5rem] overflow-hidden flex flex-col justify-between ${bedroomsW===g.key ? 'border-white/40 bg-white/10':'border-white/15 bg-white/5'}`}>
                      <div className="text-base font-semibold mb-3">{g.label}</div>
                      <div className="grid grid-cols-2 gap-3 text-[12px]">
                        {([
                          { label: 'Semi/Terraced', value: 'Semi-Detached' as const },
                          { label: 'Detached', value: 'Detached' as const },
                        ]).map(opt => (
                          <button
                            type="button"
                            key={opt.label}
                            onClick={() => { setValue('bedrooms', g.key, { shouldDirty: true, shouldTouch: true, shouldValidate: true }); setValue('property_type', opt.value, { shouldDirty: true, shouldTouch: true, shouldValidate: true }) }}
                            aria-pressed={bedroomsW===g.key && propertyTypeW===opt.value}
                            data-testid={`prop-${g.key}-${opt.value}`}
                            className={`w-full text-left rounded-md border px-3 py-2.5 transition ${bedroomsW===g.key && propertyTypeW===opt.value ? 'border-[var(--brand-red)] bg-white/10 text-white shadow-glow' : 'border-white/15 bg-white/5 text-white/80'} hover:bg-white/10`}
                          >
                            <div className="font-medium">{opt.label}</div>
                            <div className="text-white/70 mt-1">{g.key === '6+' ? 'POA' : priceForDisplay(g.key, opt.value, extCount, '4-weekly')}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <input type="hidden" {...register('bedrooms', { required: true })} />
                <input type="hidden" {...register('property_type', { required: true })} />
                {(errors.bedrooms || errors.property_type) && <p className="mt-1 text-xs text-red-400">Select bedrooms and property type</p>}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm">Do you have a conservatory?</label>
              <div className="inline-flex gap-2">
                <label className="cursor-pointer"><input type="radio" value="yes" {...register('has_conservatory')} onChange={() => setValue('has_conservatory', 'yes', { shouldDirty: true, shouldTouch: true, shouldValidate: true })} className="peer sr-only" /><span className="inline-flex items-center rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/80 peer-checked:border-[var(--brand-red)] peer-checked:bg-white/20 peer-checked:text-white">Yes (+£5)</span></label>
                <label className="cursor-pointer"><input type="radio" value="no" {...register('has_conservatory')} onChange={() => setValue('has_conservatory', 'no', { shouldDirty: true, shouldTouch: true, shouldValidate: true })} className="peer sr-only" /><span className="inline-flex items-center rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/80 peer-checked:border-[var(--brand-red)] peer-checked:bg-white/20 peer-checked:text-white">No</span></label>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm">Do you have an extension?</label>
              <div className="inline-flex gap-2">
                <label className="cursor-pointer"><input type="radio" value="yes" {...register('has_extension')} onChange={() => setValue('has_extension', 'yes', { shouldDirty: true, shouldTouch: true, shouldValidate: true })} className="peer sr-only" /><span className="inline-flex items-center rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/80 peer-checked:border-[var(--brand-red)] peer-checked:bg-white/20 peer-checked:text-white">Yes (+£5)</span></label>
                <label className="cursor-pointer"><input type="radio" value="no" {...register('has_extension')} onChange={() => setValue('has_extension', 'no', { shouldDirty: true, shouldTouch: true, shouldValidate: true })} className="peer sr-only" /><span className="inline-flex items-center rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/80 peer-checked:border-[var(--brand-red)] peer-checked:bg-white/20 peer-checked:text-white">No</span></label>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <button data-testid="btn-step1-next" type="button" onClick={goStep2} className="rounded-md bg-[var(--brand-red)] px-4 py-2 text-sm font-medium text-white hover:opacity-90">See prices</button>
          </div>
        </div>
      ) : step === 2 ? (
        <div className="space-y-6" data-testid="step-2">
          <div>
            <label className="mb-1 block text-sm">Choose your services</label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(['Window Cleaning','Gutter Clearing','Fascias & Soffits Cleaning','Conservatory Roof Cleaning','Solar Panel Cleaning','External Commercial Cleaning'] as ServiceKey[]).map((s) => {
                const selected = services.includes(s)
                const priceLabel = (() => {
                  if (s === 'Window Cleaning') return priceForDisplay((bedroomsW as Bedrooms), (propertyTypeW as PropertyType), extCount, (freqW || '4-weekly') as Frequency)
                  if (s === 'Gutter Clearing') return gutterFrom((bedroomsW as Bedrooms), (propertyTypeW as PropertyType), extCount)
                  if (s === 'Fascias & Soffits Cleaning') {
                    const base = (bedroomsW && propertyTypeW) ? computeGutterPrice(bedroomsW as Bedrooms, propertyTypeW as PropertyType, extCount) + 15 : undefined
                    return base ? `from £${base}` : '—'
                  }
                  return 'POA'
                })()
                return (
                  <label key={s} className={`relative flex cursor-pointer items-start justify-between rounded-md border p-4 text-sm ${selected ? 'border-[var(--brand-red)] bg-white/10' : 'border-white/15 bg-white/5'}`}>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" value={s} className="accent-[var(--brand-red)]" {...register('services')} />
                      <span>{s}</span>
                    </div>
                    <span className="text-white/70">{priceLabel}</span>
                  </label>
                )
              })}
            </div>
            {errors.services && <p className="mt-1 text-xs text-red-400">{errors.services.message as string}</p>}
            {hasWindow && bedroomsW !== '6+' && (
              <div className="mt-4">
                <label className="mb-2 block text-sm">Window frequency</label>
                <div className="grid grid-cols-1 gap-3 rounded-md border border-white/10 bg-white/5 p-4 sm:grid-cols-3">
                  <label className="flex cursor-pointer items-start gap-3 rounded-md border border-white/10 bg-white/0 p-3">
                    <input type="radio" value="4-weekly" className="accent-[var(--brand-red)]" {...register('window_frequency')} />
                    <div>
                      <div className="font-medium">4‑weekly frequency</div>
                      <div className="text-xs text-white/70">{priceForDisplay(bedroomsW as Bedrooms, propertyTypeW as PropertyType, extCount, '4-weekly')}</div>
                    </div>
                  </label>
                  <label className="flex cursor-pointer items-start gap-3 rounded-md border border-white/10 bg-white/0 p-3">
                    <input type="radio" value="8-weekly" className="accent-[var(--brand-red)]" {...register('window_frequency')} />
                    <div>
                      <div className="font-medium">8‑weekly frequency</div>
                      <div className="text-xs text-white/70">Same price as 4‑weekly</div>
                    </div>
                  </label>
                  <label className="flex cursor-pointer items-start gap-3 rounded-md border border-white/10 bg-white/0 p-3">
                    <input type="radio" value="ad-hoc" className="accent-[var(--brand-red)]" {...register('window_frequency')} />
                    <div>
                      <div className="font-medium">Ad hoc</div>
                      <div className="text-xs text-white/70">+£10 first clean</div>
                    </div>
                  </label>
                </div>
                {errors.window_frequency && <p className="mt-2 text-xs text-red-400">{errors.window_frequency.message as string}</p>}
              </div>
            )}
            {hasWindow && hasGutter && hasFascias && (
              <p className="mt-3 text-xs text-emerald-400">Windows FREE with Gutter Clearing + Fascias & Soffits.</p>
            )}
          </div>

          <div className="rounded-md border border-white/10 bg-white/5 p-5 text-sm" data-testid="summary">
            <h4 className="mb-3 font-semibold">Estimate summary</h4>
            <ul className="space-y-2">
              {rows.map((r) => (
                <li key={r.label} className="flex items-center justify-between py-1"><span>{r.label}</span><span className="text-white/80 font-medium">{r.display}</span></li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="font-semibold">Estimated total</span>
              <span className="text-lg font-bold">£{total}</span>
            </div>
            <p className="mt-3 text-xs text-white/60">Final price confirmed after a quick property review.</p>
          </div>

          <div className="flex items-center justify-between">
            <button data-testid="btn-step2-back" type="button" onClick={() => setStep(1)} className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">Back</button>
            <button data-testid="btn-step2-next" type="button" onClick={goStep3} className="rounded-md bg-[var(--brand-red)] px-4 py-2 text-sm font-medium text-white hover:opacity-90">Continue</button>
          </div>
        </div>
      ) : step === 3 ? (
        <div className="space-y-6" data-testid="step-3">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="first_name" className="mb-1 block text-sm">First name</label>
              <input id="first_name" className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2" {...register('first_name', { required: true })} />
              {errors.first_name && <p className="mt-1 text-xs text-red-400">First name is required</p>}
            </div>
            <div>
              <label htmlFor="last_name" className="mb-1 block text-sm">Last name</label>
              <input id="last_name" className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2" {...register('last_name', { required: true })} />
              {errors.last_name && <p className="mt-1 text-xs text-red-400">Last name is required</p>}
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm">Email</label>
              <input id="email" type="email" className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2" placeholder="you@example.co.uk" {...register('email', { required: true })} />
              {errors.email && <p className="mt-1 text-xs text-red-400">Email is required</p>}
            </div>
            <div>
              <label htmlFor="mobile" className="mb-1 block text-sm">Mobile</label>
              <input id="mobile" className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2" {...register('mobile')} />
            </div>
            <div>
              <label htmlFor="postcode" className="mb-1 block text-sm">Postcode</label>
              <input id="postcode" className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2" {...register('postcode', { required: true })} />
              {errors.postcode && <p className="mt-1 text-xs text-red-400">Postcode is required</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm">Address line 1 (optional)</label>
              <input className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2" {...register('address1')} />
            </div>
            <div>
              <label className="mb-1 block text-sm">Town/City (optional)</label>
              <input className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2" {...register('town')} />
            </div>
            <div>
              <label className="mb-1 block text-sm">Preferred days</label>
              <input className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2" placeholder="e.g., Mon–Wed" {...register('preferred_days')} />
            </div>
            <div>
              <label className="mb-1 block text-sm">Preferred time window</label>
              <input className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2" placeholder="e.g., mornings" {...register('preferred_time')} />
            </div>
            <div>
              <label className="mb-1 block text-sm">Timeframe</label>
              <select className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2" {...register('timeframe')}>
                <option value="ASAP" className="bg-black">ASAP</option>
                <option value="This week" className="bg-black">This week</option>
                <option value="This month" className="bg-black">This month</option>
              </select>
            </div>
            <div>
              <label htmlFor="preferred_first_date" className="mb-1 block text-sm">Preferred first clean date</label>
              <input
                id="preferred_first_date"
                type="date"
                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2"
                {...register('preferred_first_date')}
                min={(() => { const d=new Date(); d.setDate(d.getDate()+1); return d.toISOString().slice(0,10) })()}
                onChange={(e) => {
                  const val = e.currentTarget.value
                  if (!val) return
                  const d = new Date(val + 'T00:00:00')
                  const day = d.getUTCDay()
                  if (day === 0 || day === 6) {
                    alert('Please choose a weekday (Mon–Fri)')
                    e.currentTarget.value = ''
                  }
                }}
              />
              <p className="mt-1 text-xs text-white/60">We work Mon–Fri, 9am–4pm. We’ll confirm the exact slot.</p>
            </div>
            <div className="md:col-span-2">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" className="accent-[var(--brand-red)]" {...register('flexible_route_day')} />
                Happy to be booked on our next route day for my area (based on postcode)
              </label>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm">Photos (optional — up to 8)</label>
            <input type="file" accept="image/*" multiple className="block w-full rounded-md border border-white/10 bg-white/5 file:mr-4 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-white" {...register('photos')}
              onChange={(e) => {
                const files = (e.target as HTMLInputElement).files
                if (!files) return
                if (files.length > 8) {
                  alert('Please select up to 8 photos')
                  ;(e.target as HTMLInputElement).value = ''
                }
                for (const f of Array.from(files)) {
                  if (f.size > 10 * 1024 * 1024) {
                    alert(`${f.name} is larger than 10MB`)
                    ;(e.target as HTMLInputElement).value = ''
                    break
                  }
                }
              }}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Additional notes</label>
            <textarea className="min-h-[120px] w-full rounded-md border border-white/10 bg-white/5 px-3 py-2" placeholder="Tell us anything helpful (access, parking, pets, etc.)" {...register('message')} />
          </div>

          <div className="flex items-center justify-between">
            <button data-testid="btn-step3-back" type="button" onClick={() => setStep(2)} className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">Back</button>
            <button data-testid="btn-step3-next" type="button" onClick={goStep4} className="rounded-md bg-[var(--brand-red)] px-4 py-2 text-sm font-medium text-white hover:opacity-90">Continue</button>
          </div>
        </div>
      ) : (
        <div className="space-y-6" data-testid="step-4">
          <div className="rounded-md border border-white/10 bg-white/5 p-5 text-sm">
            <h4 className="mb-3 font-semibold">Estimate summary</h4>
            <ul className="space-y-2">
              {rows.map((r) => (
                <li key={r.label} className="flex items-center justify-between py-1"><span>{r.label}</span><span className="text-white/80 font-medium">{r.display}</span></li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="font-semibold">Estimated total</span>
              <span className="text-lg font-bold">£{total}</span>
            </div>
            {hasWindow && hasGutter && hasFascias && (
              <p className="mt-3 text-xs text-emerald-400">Windows FREE with Gutter Clearing + Fascias & Soffits.</p>
            )}
            <p className="mt-3 text-xs text-white/60">Final price confirmed after property review. Frequency and access may affect pricing.</p>
          </div>

          <div className="space-y-2 rounded-md border border-white/10 bg-white/5 p-4 text-sm text-white/80">
            <p>By booking, you agree to the following:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>4‑ and 8‑weekly window cleans are the same “from” price; ad‑hoc carries an additional cost.</li>
              <li>Windows are FREE when you book Gutter Clearing and Fascias & Soffits together.</li>
              <li>Solar panels and conservatory roofs are priced on site or from photos.</li>
              <li>Extensions/conservatories add £5 each.</li>
              <li>Final price is confirmed after a quick property review.</li>
            </ul>
            <label className="mt-2 inline-flex items-center gap-2 text-sm"><input type="checkbox" className="accent-[var(--brand-red)]" required /> I agree to the Terms & Conditions.</label>
          </div>

          {RECAPTCHA_SITE_KEY ? (
            <div className="rounded-md border border-white/10 bg-white/5 p-3">
              <div id="recaptcha-container" />
            </div>
          ) : (
            <p className="text-xs text-white/60">Captcha will be added upon launch.</p>
          )}

          <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...register('website')} />
          <input type="hidden" name="name" />
          <input type="hidden" name="services_joined" />
          <input type="hidden" name="total_estimate" />
          <input type="hidden" name="submitted_at" />
          <input type="hidden" name="recaptcha_token" />

          <div className="flex items-center gap-3">
            <button data-testid="btn-step4-back" type="button" onClick={() => setStep(3)} className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">Back</button>
            <button data-testid="btn-submit" type="submit" disabled={isSubmitting} className="rounded-md bg-[var(--brand-red)] px-5 py-3 font-medium text-white disabled:opacity-60">{isSubmitting ? 'Sending…' : 'Book my quote'}</button>
            {status === 'success' && <p className="text-sm text-emerald-400">Thanks — we’ll be in touch shortly.</p>}
            {status === 'error' && <p className="text-sm text-red-400">Sorry, something went wrong. Please try again.</p>}
          </div>
        </div>
      )}
    </form>
  )
}
