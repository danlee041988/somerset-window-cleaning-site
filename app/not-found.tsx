import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-6 bg-brand-black px-4 py-24 text-center text-brand-white" id="content">
      <span className="rounded-full border border-brand-red/40 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-brand-red">
        404
      </span>
      <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white md:text-5xl">We can’t find the page you’re after</h1>
      <p className="max-w-2xl text-base leading-7 text-white/85 md:text-lg">
        The page may have moved or the link might be out of date. Use the links below to head back to the homepage or get in touch with the team and we’ll point you in the right direction.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button href="/" variant="primary">
          Go to homepage
        </Button>
        <Button href="/get-in-touch" variant="secondary">
          Contact support
        </Button>
      </div>
    </main>
  )
}
