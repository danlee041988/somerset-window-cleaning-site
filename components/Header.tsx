import Link from 'next/link'
import Button from './Button'
import Logo from './Logo'

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3 text-white" aria-label="Somerset Window Cleaning home">
          <Logo className="h-32 md:h-40 lg:h-48" />
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/services" className="text-white/80 hover:text-white">Services</Link>
          <Link href="/gallery" className="text-white/80 hover:text-white">Gallery</Link>
          <Link href="/pricing" className="text-white/80 hover:text-white">Pricing</Link>
          <Link href="/team" className="text-white/80 hover:text-white">Team</Link>
          <Link href="/contact" className="text-white/80 hover:text-white">Contact</Link>
          <Button href="/contact" className="ml-2">Get a free quote</Button>
        </nav>
        <div className="md:hidden">
          <Button href="/contact" className="text-sm px-3 py-2">Free quote</Button>
        </div>
      </div>
    </header>
  )
}
