import React from 'react'

export default function WhatsAppButton({ className = '', text = 'Message us on WhatsApp', prefill }: { className?: string; text?: string; prefill?: string }) {
  // Convert 07415526331 (UK) to international format 447415526331
  const number = '447415526331'
  const msg = prefill ? encodeURIComponent(prefill) : ''
  const href = `https://wa.me/${number}${msg ? `?text=${msg}` : ''}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className={`inline-flex items-center gap-2 rounded-md bg-[#25D366] px-4 py-2 font-medium text-white transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width="18"
        height="18"
        aria-hidden="true"
        focusable="false"
      >
        <path fill="#fff" d="M19.11 17.66c-.25-.12-1.46-.72-1.69-.8-.23-.09-.4-.12-.57.12-.17.23-.66.8-.81.97-.15.17-.3.18-.56.06-.25-.12-1.06-.39-2.02-1.23-.75-.66-1.25-1.47-1.39-1.72-.15-.26-.02-.4.1-.52.1-.1.23-.27.35-.41.12-.14.15-.23.23-.39.08-.17.04-.3-.02-.42-.06-.12-.57-1.38-.78-1.88-.2-.48-.4-.42-.57-.42h-.49c-.17 0-.42.06-.64.3-.22.23-.85.83-.85 2.03 0 1.2.87 2.36.99 2.52.12.15 1.72 2.63 4.16 3.69.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.46-.6 1.67-1.19.21-.58.21-1.08.15-1.19-.06-.1-.22-.17-.47-.29z"/>
        <path fill="#fff" d="M16.04 6.08c-4.98 0-9.02 4.04-9.02 9.02 0 1.59.42 3.14 1.22 4.5l-1.3 4.74 4.86-1.27c1.33.73 2.83 1.12 4.36 1.12 4.98 0 9.02-4.04 9.02-9.02s-4.04-9.09-9.14-9.09zm5.32 14.34c-.23.65-1.32 1.24-1.84 1.33-.47.09-1.08.12-1.75-.11-.4-.13-1.28-.41-2.19-.84-2.23-.99-3.67-3.3-3.78-3.45-.1-.15-.9-1.19-.9-2.28 0-1.09.57-1.62.78-1.84.21-.23.49-.28.66-.28h.47c.15 0 .36-.06.56.42.21.48.71 1.77.78 1.9.06.12.1.26.02.42-.08.17-.12.27-.25.42-.12.15-.26.32-.38.44-.12.12-.25.26-.1.52.15.26.68 1.11 1.5 1.8 1.04.86 1.92 1.13 2.2 1.25.28.12.44.1.6-.08.17-.18.69-.8.87-1.08.17-.28.36-.23.6-.14.23.08 1.45.68 1.7.8.25.12.41.18.47.29.06.11.06.64-.17 1.28z"/>
      </svg>
      <span>{text}</span>
    </a>
  )
}
